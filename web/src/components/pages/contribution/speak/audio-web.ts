import { getAudioFormat } from '../../../../utility'

interface BlobEvent extends Event {
  data: Blob
}

export enum AudioError {
  NOT_ALLOWED = 'NOT_ALLOWED',
  NO_MIC = 'NO_MIC',
  NO_SUPPORT = 'NO_SUPPORT',
}

export interface AudioInfo {
  url: string
  blob: Blob
}

export default class AudioWeb {
  microphone: MediaStream
  analyzerNode: AnalyserNode
  audioContext: AudioContext
  recorder: MediaRecorder
  chunks: Blob[]
  frequencyBins: Uint8Array
  volumeCallback: ((volume: number) => void) | null
  volumeWorklet: AudioWorkletNode | null
  jsNode: ScriptProcessorNode | null
  recorderListeners: {
    start: ((event: Event) => void) | null
    dataavailable: ((event: BlobEvent) => void) | null
    stop: ((event: Event) => void) | null
  }

  constructor() {
    this.recorderListeners = {
      start: null,
      dataavailable: null,
      stop: null,
    }
    this.volumeWorklet = null
    this.jsNode = null
    this.volumeCallback = null
    this.analyze = this.analyze.bind(this)
  }

  private isReady(): boolean {
    return !!this.microphone
  }

  private getMicrophone(): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      function deny(error: DOMException) {
        reject(
          (
            {
              NotAllowedError: AudioError.NOT_ALLOWED,
              NotFoundError: AudioError.NO_MIC,
            } as { [errorName: string]: AudioError }
          )[error.name] || error
        )
      }

      function resolveStream(stream: MediaStream) {
        resolve(stream)
      }

      if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(resolveStream, deny)
      } else if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia({ audio: true }, resolveStream, deny)
      } else if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia({ audio: true }, resolveStream, deny)
      } else {
        // Browser does not support getUserMedia
        reject(AudioError.NO_SUPPORT)
      }
    })
  }

  // Check all the browser prefixes for microhpone support.
  isMicrophoneSupported() {
    return (
      navigator.mediaDevices?.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia
    )
  }

  // Check if audio recording is supported
  // Note: Detailed codec checking is done by getAudioFormat()
  isAudioRecordingSupported(): boolean {
    return typeof window.MediaRecorder !== 'undefined'
  }

  private analyze() {
    // Used by ScriptProcessorNode fallback for older browsers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.analyzerNode.getByteFrequencyData(this.frequencyBins as any)

    if (this.volumeCallback) {
      this.volumeCallback(Math.max(...this.frequencyBins))
    }
  }

  setVolumeCallback(cb: (volume: number) => void) {
    this.volumeCallback = cb
  }

  /**
   * Initialize the recorder, opening the microphone media stream.
   *
   * If microphone access is currently denied, the user is asked to grant
   * access. Since these permission changes take effect only after a reload,
   * the page is reloaded if the user decides to do so.
   *
   */
  async init() {
    if (this.isReady()) {
      return
    }

    const microphone = await this.getMicrophone()

    this.microphone = microphone
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)()
    const sourceNode = audioContext.createMediaStreamSource(microphone)
    const volumeNode = audioContext.createGain()
    const analyzerNode = audioContext.createAnalyser()
    const outputNode = audioContext.createMediaStreamDestination()

    // Make sure we're doing mono everywhere.
    sourceNode.channelCount = 1
    volumeNode.channelCount = 1
    analyzerNode.channelCount = 1
    outputNode.channelCount = 1

    // Connect the nodes together
    sourceNode.connect(volumeNode)
    volumeNode.connect(analyzerNode)
    analyzerNode.connect(outputNode)

    // Set up the recorder with appropriate options for the format
    const audioFormat = getAudioFormat()
    const recorderOptions: MediaRecorderOptions = {}

    // For iOS/Safari, specify the MIME type explicitly to ensure compatibility
    if (audioFormat && window.MediaRecorder.isTypeSupported(audioFormat)) {
      recorderOptions.mimeType = audioFormat
    }

    console.log('[AudioWeb] MediaRecorder options:', recorderOptions)

    // Set up the recorder
    this.recorder = new window.MediaRecorder(outputNode.stream, recorderOptions)

    // Set up the analyzer node, and allocate an array for its data
    // FFT size 64 gives us 32 bins. But those bins hold frequencies up to
    // 22kHz or more, and we only care about lower frequencies which is where
    // most human voice lies, so we use fewer bins.
    analyzerNode.fftSize = 128
    analyzerNode.smoothingTimeConstant = 0.96
    this.frequencyBins = new Uint8Array(analyzerNode.frequencyBinCount)

    // Set up AudioWorklet for volume analysis (modern replacement for ScriptProcessorNode)
    try {
      // Register the worklet module
      await audioContext.audioWorklet.addModule(
        new URL('./volume-meter-processor.js', import.meta.url).href
      )

      // Create the worklet node with sample rate passed as option
      this.volumeWorklet = new AudioWorkletNode(
        audioContext,
        'volume-analyzer-processor',
        {
          processorOptions: {
            sampleRate: audioContext.sampleRate,
          },
        }
      )

      // Handle volume messages from the worklet
      this.volumeWorklet.port.onmessage = event => {
        if (event.data.volume !== undefined && this.volumeCallback) {
          this.volumeCallback(event.data.volume)
        }
      }

      // Connect analyzer to worklet (worklet doesn't need to output audio)
      analyzerNode.connect(this.volumeWorklet)
      // Note: volumeWorklet doesn't connect to destination since we're only analyzing
    } catch (error) {
      // console.warn(
      //   'AudioWorklet not supported, falling back to ScriptProcessorNode'
      // )
      this.volumeWorklet = null

      // Fallback to ScriptProcessorNode for older browsers (deprecated but widely supported)
      // This ensures volume monitoring works on iOS Safari < 14.5 and other older browsers
      try {
        this.jsNode = audioContext.createScriptProcessor(256, 1, 1)
        this.jsNode.onaudioprocess = this.analyze
        this.jsNode.connect(audioContext.destination)
        // console.log('Using ScriptProcessorNode fallback for volume monitoring')
      } catch (fallbackError) {
        // console.error(
        //   'Both AudioWorklet and ScriptProcessorNode failed, volume monitoring disabled:',
        //   fallbackError
        // )
        this.jsNode = null
      }
    }

    this.analyzerNode = analyzerNode
    this.audioContext = audioContext
  }

  start(): Promise<void> {
    if (!this.isReady()) {
      console.error('Cannot record audio before microphone is ready.')
      return Promise.resolve()
    }

    return new Promise<void>(resolve => {
      this.chunks = []
      // Remove the old listeners.
      this.recorder.removeEventListener('start', this.recorderListeners.start)
      this.recorder.removeEventListener(
        'dataavailable',
        this.recorderListeners.dataavailable
      )

      // Update the stored listeners.
      this.recorderListeners.start = () => resolve()
      this.recorderListeners.dataavailable = (e: BlobEvent) => {
        this.chunks.push(e.data)
      }

      // Add the new listeners.
      this.recorder.addEventListener('start', this.recorderListeners.start)
      this.recorder.addEventListener(
        'dataavailable',
        this.recorderListeners.dataavailable
      )

      // Finally, start it up.
      // We want to be able to record up to 60s of audio in a single blob.
      // Without this argument to start(), Chrome will call dataavailable
      // very frequently.
      this.recorder.start(20000)
    })
  }

  stop(): Promise<AudioInfo> {
    if (!this.isReady()) {
      console.error('Cannot stop audio before microphone is ready.')
      return Promise.reject()
    }

    return new Promise<AudioInfo>(resolve => {
      this.recorder.removeEventListener('stop', this.recorderListeners.stop)
      this.recorderListeners.stop = () => {
        const blob = new Blob(this.chunks, { type: getAudioFormat() })

        // Validate blob size - corrupted recordings may produce 0-byte or very small files
        // This is especially common with Chrome on iPad where MP4 encoding can fail
        const MIN_VALID_BLOB_SIZE = 100 // bytes - even 1 second of audio should be larger
        if (blob.size < MIN_VALID_BLOB_SIZE) {
          console.error(
            `[AudioWeb] Blob size too small (${blob.size} bytes) - likely corrupted recording. ` +
              `Chunks: ${this.chunks.length}, Format: ${getAudioFormat()}`
          )
          // Return the blob anyway - server will detect corruption and return proper error
          // This allows user to retry rather than hanging
        }

        resolve({
          url: URL.createObjectURL(blob),
          blob: blob,
        })
      }
      this.recorder.addEventListener('stop', this.recorderListeners.stop)
      this.recorder.stop()
    })
  }

  release() {
    if (this.microphone) {
      for (const track of this.microphone.getTracks()) {
        track.stop()
      }
    }
    if (this.jsNode) {
      this.jsNode.disconnect()
      this.jsNode.onaudioprocess = null
      this.jsNode = null
    }
    if (this.volumeWorklet) {
      this.volumeWorklet.disconnect()
      this.volumeWorklet = null
    }
    this.microphone = null
  }
}
