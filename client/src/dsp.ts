export class FrequencyBins {
  private temp: Float32Array;
  bins: Float32Array;
  constructor(private analyzerNode: AnalyserNode, private skip = 2) {
    let binCount = this.analyzerNode.frequencyBinCount;
    this.temp = new Float32Array(binCount);
    this.bins = new Float32Array(binCount - skip);
  }
  update() {
    this.analyzerNode.getFloatFrequencyData(this.temp);
    this.bins.set(this.temp.subarray(this.skip));
  }
}