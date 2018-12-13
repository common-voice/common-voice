// Audio normalization. Based on ReplayGain.
// http://wiki.hydrogenaud.io/index.php?title=ReplayGain_specification

// TODO: human perception based loudness filtering (IIR filters)

require('promise-decode-audio-data');

export interface NormalizedPlayerInterface {
  play(clipUrl: string): Promise<void>;
  stop(): void;
  onended?: (event: Event) => void;
}
export default class NormalizedPlayer implements NormalizedPlayerInterface {
  private audioCtx: AudioContext;
  private gainNode: GainNode;
  private bufSource?: AudioBufferSourceNode;
  onended?: (event: Event) => void;
  constructor() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 1.0;
    this.gainNode.connect(this.audioCtx.destination);
  }
  async play(clipUrl: string) {
    const res = await fetch(clipUrl);
    const encodedBuf = await res.arrayBuffer();
    const decodedData = await this.audioCtx.decodeAudioData(encodedBuf);
    // The decoded audio samples live in decodedBuffer
    const decodedBuffer = decodedData.getChannelData(0);

    // Obtain one Root Mean Square (RMS) value for
    // each slice of 50ms length
    var sliceLen = Math.floor(decodedData.sampleRate * 0.05);
    var averages = [];
    var sum = 0.0;
    for (var i = 0; i < decodedBuffer.length; i++) {
      sum += decodedBuffer[i] ** 2;
      if (i % sliceLen === 0) {
        sum = Math.sqrt(sum / sliceLen);
        averages.push(sum);
        sum = 0;
      }
    }

    // Ascending sort of the averages array
    averages.sort(function(a, b) {
      return a - b;
    });

    // Take the average at the 95th percentile
    var a = averages[Math.floor(averages.length * 0.95)];

    var gain = 1.0 / a;

    // Perform some clamping
    gain = Math.max(gain, 0.02);
    gain = Math.min(gain, 100.0);

    // ReplayGain uses pink noise for this one one but we just take
    // some arbitrary value... we're no standard
    // Important is only that we don't output on levels
    // too different from other websites
    gain = gain / 10.0;

    this.gainNode.gain.value = gain;
    this.playBuf(decodedData);
  }
  private playBuf(buf: AudioBuffer) {
    if (this.bufSource) {
      this.bufSource.stop();
    }
    this.bufSource = this.audioCtx.createBufferSource();
    this.bufSource.buffer = buf;
    this.bufSource.connect(this.gainNode);
    this.bufSource.onended = this.onended;
    this.bufSource.start();
  }
  stop() {
    this.bufSource.stop();
  }
  close() {
    this.audioCtx.close();
  }
}
