/**
 * VolumeAnalyzerProcessor - AudioWorkletProcessor for real-time volume analysis
 *
 * This worklet analyzes the volume of an audio stream by calculating the RMS
 * (Root Mean Square) of the audio samples and sends the result to the main thread.
 *
 * Optimized for mobile devices to reduce CPU and battery usage.
 * Runs in the audio worklet context (separate thread from main UI).
 */
class VolumeAnalyzerProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super()
    this._volume = 0
    // Update every 100ms (for better battery life)
    this._updateIntervalInMS = 100
    // Get sampleRate from options or use global sampleRate from AudioWorkletGlobalScope
    // sampleRate is a global variable in the worklet context (part of the spec)
    this._sampleRate =
      options?.processorOptions?.sampleRate || globalThis.sampleRate || 48000
    // Convert to samples
    this._nextUpdateFrame = (this._updateIntervalInMS / 1000) * this._sampleRate
  }

  /**
   * Calculate RMS (Root Mean Square) volume from audio samples
   * Optimized for performance on mobile devices
   * @param {Float32Array} samples - Audio samples to analyze
   * @returns {number} Volume level from 0 to 255
   */
  _calculateVolume(samples) {
    const length = samples.length

    // Early return for very small buffers
    if (length === 0) return 0

    // Calculate RMS with optimized loop
    let sum = 0
    for (let i = 0; i < length; i++) {
      const sample = samples[i]
      sum += sample * sample
    }
    const rms = Math.sqrt(sum / length)

    // Convert to 0-255 range (similar to AnalyserNode frequency data)
    // RMS is typically 0-1, multiply by 255 to match the old behavior
    // Apply a slight boost for better visual feedback (1.5x)
    return Math.min(255, Math.floor(rms * 255 * 1.5))
  }

  /**
   * Process audio samples
   * @param {Float32Array[][]} inputs - Input audio buffers
   * @param {Float32Array[][]} outputs - Output audio buffers (unused, we're just analyzing for now)
   * @param {Object} parameters - Audio parameters (unused for now)
   * @returns {boolean} True to keep processor alive
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  process(inputs, outputs, parameters) {
    const input = inputs[0]

    // Early return if no input - keeps processor alive but saves CPU
    if (!input || input.length === 0) {
      return true
    }

    // Get the first channel (mono audio)
    const samples = input[0]

    // Early return if no samples
    if (!samples || samples.length === 0) {
      return true
    }

    // Decrement the frame counter
    this._nextUpdateFrame -= samples.length

    // Only calculate volume when we need to send an update
    // This reduces CPU usage significantly on mobile devices
    if (this._nextUpdateFrame <= 0) {
      // Calculate current volume
      this._volume = this._calculateVolume(samples)

      // Send volume to main thread
      this.port.postMessage({ volume: this._volume })

      // Reset counter using stored sample rate
      this._nextUpdateFrame +=
        (this._updateIntervalInMS / 1000) * this._sampleRate
    }

    // Return true to keep the processor alive
    return true
  }
}

// Register the processor
registerProcessor('volume-analyzer-processor', VolumeAnalyzerProcessor)
