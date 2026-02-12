import { isProduction } from '../../../../utility'
import {
  isIOS,
  isMacOSSafari,
  getBestAudioMimeType,
} from '../../../../platforms'

interface BlobEvent extends Event {
  data: Blob
}

export enum AudioError {
  NOT_ALLOWED = 'NOT_ALLOWED',
  NO_MIC = 'NO_MIC',
  NO_SUPPORT = 'NO_SUPPORT',
  EMPTY_RECORDING = 'EMPTY_RECORDING',
  UNKNOWN_FORMAT = 'UNKNOWN_FORMAT',
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
  requestedMimeType: string | null // The format we requested from MediaRecorder
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
    this.requestedMimeType = null
    this.lastObjectURL = null
    this.analyze = this.analyze.bind(this)
  }

  private isReady(): boolean {
    // Check microphone exists AND recorder is properly initialized with valid state
    // Using state !== undefined is more robust than !!this.recorder because
    // it verifies the MediaRecorder is fully constructed with its state machine
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

      // Explicit audio constraints improve cross-device compatibility.
      // Using 'ideal' lets the browser fall back gracefully if a constraint
      // is unsupported, while still steering it toward the desired config.
      // Without these, devices choose wildly different defaults:
      //  - Some iPads default to stereo → mono downmix drops volume → TOO_QUIET
      //  - Some Samsung devices disable autoGainControl → very low capture volume
      //  - Sample rate mismatches cause hidden resamplers and dropped frames
      // Ref: https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
      const audioConstraints: MediaTrackConstraints = {
        echoCancellation: { ideal: true },
        noiseSuppression: { ideal: true },
        autoGainControl: { ideal: true },
        channelCount: { ideal: 1 },
        sampleRate: { ideal: 48000 },
      }

      if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: audioConstraints })
          .then(resolveStream, deny)
      } else if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia(
          { audio: audioConstraints },
          resolveStream,
          deny
        )
      } else if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia(
          { audio: audioConstraints },
          resolveStream,
          deny
        )
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

    // Match AudioContext sample rate to the microphone's actual rate to avoid
    // hidden resamplers that cause volume drops and artifacts on some devices.
    // Skip on Apple browsers where specifying sampleRate can break AudioContext.
    const isAppleBrowser = isIOS() || isMacOSSafari()
    const trackSettings = microphone.getAudioTracks()[0]?.getSettings()
    const micSampleRate = trackSettings?.sampleRate
    const contextOptions: AudioContextOptions = {}
    if (!isAppleBrowser && micSampleRate) {
      contextOptions.sampleRate = micSampleRate
    }

    const audioContext = new (window.AudioContext || window.webkitAudioContext)(
      contextOptions
    )

    // Some browsers (especially iOS Safari after backgrounding) create
    // AudioContexts in "suspended" state. Without resuming, no audio
    // flows through the graph — the mic appears to work but everything
    // is silent, causing false TOO_QUIET errors.
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }

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

    const audioFormat = getBestAudioMimeType()
    const recorderOptions: MediaRecorderOptions = {}

    // IMPORTANT: iOS/Safari work better with browser-chosen defaults.
    // Setting mimeType explicitly can cause buffer/timing issues.
    const shouldSetMimeType = !isAppleBrowser

    if (shouldSetMimeType && audioFormat) {
      if (
        typeof MediaRecorder.isTypeSupported === 'function' &&
        window.MediaRecorder.isTypeSupported(audioFormat)
      ) {
        recorderOptions.mimeType = audioFormat
        recorderOptions.audioBitsPerSecond = 128_000
        // Use 128 kbps for non-Apple browsers as a balanced default: it is widely
        // supported by MediaRecorder implementations, provides good quality for speech
        // recordings, and keeps file sizes reasonable.
      }
    }

    this.recorder = new window.MediaRecorder(outputNode.stream, recorderOptions)
    this.recordingMimeType = this.recorder.mimeType
    // Store the format we requested - needed as fallback for iOS when blob.type is empty
    this.requestedMimeType = audioFormat || null

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

      // We want to be able to record up to 30s of audio in a single blob.
      // Without this argument to start(), Chrome will call dataavailable
      // very frequently.
      //
      // Apple browsers: Do NOT pass timeslice. iOS Safari's MediaRecorder
      // with timeslice emits fragmented MP4 (fMP4) segments. For recordings
      // shorter than the timeslice, the first chunk may lack media data or
      // the final fragment may be incomplete — causing empty/corrupt blobs.
      // Without timeslice, Safari produces a single complete MP4 blob on stop.
      //
      // Other browsers: Use 30s timeslice for efficiency.
      if (isIOS() || isMacOSSafari()) {
        this.recorder.start()
      } else {
        this.recorder.start(30_000)
      }
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
        // Small delay to ensure final dataavailable event is processed.
        // iOS/Safari needs a longer delay because without timeslice the
        // entire recording blob is delivered in a single dataavailable
        // event that may still be processing when 'stop' fires.
        const delay = isIOS() || isMacOSSafari() ? 300 : 50
        setTimeout(() => {
          const chunks = this.chunks
          const recordingMimeType = this.recordingMimeType
          const requestedMimeType = this.requestedMimeType

          // Determine blob MIME type with robust fallback chain:
          // 1. Use actual mimeType from MediaRecorder (most accurate)
          // 2. Fallback to requested format (what we asked for)
          // 3. Last resort: infer from browser
          let blobType = recordingMimeType || requestedMimeType

          if (!blobType || blobType.trim() === '') {
            // This should never happen, but if it does, infer from browser
            blobType = getBestAudioMimeType()

            if (!isProduction()) {
              console.warn(
                '[AudioWeb] Both recordingMimeType and requestedMimeType are empty!',
                'Using inferred type:',
                blobType
              )
            }
          }

          const blob = new Blob(chunks, { type: blobType })

          // Validate blob size (empty blobs cause backend errors)
          if (blob.size === 0) {
            console.error('[AudioWeb] Empty blob created, rejecting recording')
            reject(AudioError.EMPTY_RECORDING)
            return
          }

          // Validate blob type (new check)
          if (!blob.type || blob.type.trim() === '') {
            console.error('[AudioWeb] Blob missing MIME type')
            reject(AudioError.UNKNOWN_FORMAT)
            return
          }

          // Revoke previous URL to prevent memory leak
          if (this.lastObjectURL) {
            URL.revokeObjectURL(this.lastObjectURL)
          }

          const url = URL.createObjectURL(blob)
          this.lastObjectURL = url

          resolve({ url, blob })
        }, delay)
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
