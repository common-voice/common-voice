import {
  getAudioFormat,
  isIOS,
  isMacOSSafari,
  isProduction,
} from '../../../../utility'

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
  recordingMimeType: string | null
  lastObjectURL: string | null
  recorderListeners: {
    start: ((event: Event) => void) | null
    dataavailable: ((event: BlobEvent) => void) | null
    stop: ((event: Event) => void) | null
    error: ((event: Event) => void) | null
  }

  constructor() {
    this.recorderListeners = {
      start: null,
      dataavailable: null,
      stop: null,
      error: null,
    }
    this.volumeWorklet = null
    this.jsNode = null
    this.volumeCallback = null
    this.recordingMimeType = null
    this.lastObjectURL = null
    this.analyze = this.analyze.bind(this)
  }

  private isReady(): boolean {
    return !!this.microphone && this.recorder?.state !== undefined
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
    return (
      typeof window.MediaRecorder !== 'undefined' &&
      typeof MediaRecorder.isTypeSupported === 'function'
    )
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

    const audioFormat = getAudioFormat()
    const recorderOptions: MediaRecorderOptions = {}

    // IMPORTANT: iOS/Safari work better with browser-chosen defaults.
    // Setting mimeType explicitly can cause buffer/timing issues.
    const isAppleBrowser = isIOS() || isMacOSSafari()
    const shouldSetMimeType = !isAppleBrowser

    if (shouldSetMimeType && audioFormat) {
      if (
        typeof MediaRecorder.isTypeSupported === 'function' &&
        window.MediaRecorder.isTypeSupported(audioFormat)
      ) {
        recorderOptions.mimeType = audioFormat
        recorderOptions.audioBitsPerSecond = 128000
      }
    }

    this.recorder = new window.MediaRecorder(outputNode.stream, recorderOptions)
    this.recordingMimeType = this.recorder.mimeType

    // Debug logging (only in development/staging)
    if (!isProduction()) {
      console.log('[AudioWeb] Options:', recorderOptions)
      console.log('[AudioWeb] Browser:', {
        isIOS: isIOS(),
        isMacOSSafari: isMacOSSafari(),
        shouldSetMimeType,
      })
      console.log('[AudioWeb] Actual mimeType:', this.recordingMimeType)

      if (
        recorderOptions.mimeType &&
        this.recorder.mimeType !== recorderOptions.mimeType
      ) {
        console.warn(
          '[AudioWeb] Mismatch:',
          recorderOptions.mimeType,
          '->',
          this.recorder.mimeType
        )
      }
    }

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
      // Fallback to ScriptProcessorNode for older browsers (deprecated but widely supported)
      // This ensures volume monitoring works on iOS Safari < 14.5 and other older browsers
      this.volumeWorklet = null

      try {
        this.jsNode = audioContext.createScriptProcessor(256, 1, 1)
        this.jsNode.onaudioprocess = this.analyze
        analyzerNode.connect(this.jsNode)
        this.jsNode.connect(audioContext.destination)
      } catch (fallbackError) {
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

      // Remove old listeners if they exist
      if (this.recorderListeners.start) {
        this.recorder.removeEventListener('start', this.recorderListeners.start)
      }
      if (this.recorderListeners.dataavailable) {
        this.recorder.removeEventListener(
          'dataavailable',
          this.recorderListeners.dataavailable
        )
      }

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

      // Safari/iOS buffer handling: use smaller chunks to prevent data loss
      // iOS (1s): Most aggressive - prevents buffer overflow on memory-constrained devices
      // macOS Safari (5s): Balance between reliability and efficiency
      // Chrome/Firefox (20s): Efficient - these browsers handle large buffers well
      const timeslice = isIOS() ? 1000 : isMacOSSafari() ? 5000 : 20000
      this.recorder.start(timeslice)
    })
  }

  stop(): Promise<AudioInfo> {
    if (!this.isReady()) {
      console.error('Cannot stop audio before microphone is ready.')
      return Promise.reject('Cannot stop audio before microphone is ready.')
    }

    return new Promise<AudioInfo>((resolve, reject) => {
      // Remove old listeners if they exist
      if (this.recorderListeners.stop) {
        this.recorder.removeEventListener('stop', this.recorderListeners.stop)
      }
      if (this.recorderListeners.error) {
        this.recorder.removeEventListener('error', this.recorderListeners.error)
      }

      this.recorderListeners.stop = () => {
        const chunks = this.chunks
        const recordingMimeType = this.recordingMimeType

        setTimeout(() => {
          // Use actual mimeType or empty string (let browser infer from data)
          const blobType = recordingMimeType || ''
          const blob = new Blob(chunks, { type: blobType })

          // Revoke previous URL to prevent memory leak
          if (this.lastObjectURL) {
            URL.revokeObjectURL(this.lastObjectURL)
          }

          const url = URL.createObjectURL(blob)
          this.lastObjectURL = url

          resolve({ url, blob })
        }, 50)
      }

      this.recorderListeners.error = (event: Event) => {
        console.error('MediaRecorder error during stop:', event)
        reject(new Error('MediaRecorder error during stop'))
      }

      this.recorder.addEventListener('stop', this.recorderListeners.stop)
      this.recorder.addEventListener('error', this.recorderListeners.error)
      this.recorder.stop()
    })
  }

  release() {
    if (this.lastObjectURL) {
      URL.revokeObjectURL(this.lastObjectURL)
      this.lastObjectURL = null
    }
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
      this.volumeWorklet.port.onmessage = null
      this.volumeWorklet = null
    }
    if (this.analyzerNode) {
      this.analyzerNode.disconnect()
      this.analyzerNode = null
    }
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.recorder = null
    this.microphone = null
  }
}
