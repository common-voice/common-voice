declare var chroma;

const MIN_DB_LEVEL = -85;      // The dB level that is 0 in the levels display
const MAX_DB_LEVEL = -30;      // The dB level that is 100% in the levels display
const DB_LEVEL_RANGE = MAX_DB_LEVEL - MIN_DB_LEVEL;

export const HEAT_COLORS = [];
function generateHeatColors() {
  function color(value) {
    var h = (1.0 - value) * 240;
    return "hsl(" + h + ", 100%, 50%)";
  }
  for (let i = 0; i < 256; i++) {
    HEAT_COLORS.push(color(i / 256));
  }
}
generateHeatColors();

export function clamp(v, a, b) {
  if (v < a) v = a;
  if (v > b) v = b;
  return v;
}

interface Theme {
  backgroundColor: string;
  scale: (value) => string;
}

let darkScale = chroma.scale('Spectral').domain([1, 0]);
export let DarkTheme: Theme = {
  backgroundColor: "#212121",
  scale: function (value) {
    return darkScale(value);
  }
};

let lightScale = chroma.scale('Set1');
export let LightTheme: Theme = {
  backgroundColor: "#F5F5F5",
  scale: function (value) {
    return lightScale(value);
  }
};

var hotScale = chroma.scale({
    colors:['#000000', '#ff0000', '#ffff00', '#ffffff'],
    positions:[0, .25, .75, 1],
    mode:'rgb',
    limits:[0, 300]
});

var hotScale = chroma.scale(['#000000', '#ff0000', '#ffff00', '#ffffff']);

class CanvasView {
  ctx: CanvasRenderingContext2D;
  ratio: number;
  theme = DarkTheme;
  // theme = LightTheme;
  constructor(public canvas: HTMLCanvasElement,
    public width: number,
    public height: number) {
    this.reset();
  }
  reset() {
    this.ratio = window.devicePixelRatio || 1;
    this.canvas.width = this.width * this.ratio;
    this.canvas.height = this.height * this.ratio;
    this.canvas.style.width = this.width + "px";
    this.canvas.style.height = this.height + "px";
    this.ctx = this.canvas.getContext("2d");
  }
  start() {
    let self = this;
    function tick() {
      self.update();
      self.render();
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  update() {

  }
  render() {

  }
}

class FrequencyBins {
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

export class AnalyzerNodeView extends CanvasView {
  frequency: FrequencyBins;
  constructor(analyzerNode: AnalyserNode,
    canvas: HTMLCanvasElement,
    width: number,
    height: number) {
    super(canvas, width, height);
    this.frequency = new FrequencyBins(analyzerNode);
  }
}

export class LinearAnalyzerNodeView extends AnalyzerNodeView {
  binWidth = 5;
  binHPadding = 1;
  binTotalWidth = this.binWidth + this.binHPadding;
  tickHeight = 2;
  tickVPadding = 1;
  tickTotalHeight = this.tickHeight + this.tickVPadding;
  constructor(analyzerNode: AnalyserNode, canvas: HTMLCanvasElement, width: number, height: number) {
    super(analyzerNode, canvas, width, height);
    this.reset();
    this.start();
  }
  update() {
    this.frequency.update();
  }
  render() {
    let ctx = this.ctx;
    ctx.save();
    ctx.scale(this.ratio, this.ratio);
    ctx.fillStyle = this.theme.backgroundColor;
    ctx.fillRect(0, 0, this.width, this.height);
    let maxBinCount = this.width / this.binTotalWidth | 0;
    let binCount = Math.min(maxBinCount, this.frequency.bins.length);
    for (let i = 0; i < binCount; i++) {
      ctx.fillStyle = this.theme.scale(i / binCount);
      let value = clamp((this.frequency.bins[i] - MIN_DB_LEVEL) / DB_LEVEL_RANGE, 0, 1);
      let ticks =  this.height / 2 * value / this.tickTotalHeight | 0;
      // let maxTicks = this.height / this.tickTotalHeight | 0;
      for (let j = 0; j < ticks; j++) {
        // ctx.fillStyle = this.theme.scale(j / ticks);
        // ctx.fillStyle = this.theme.scale(j / maxTicks);
        ctx.globalAlpha = 1;
        ctx.fillRect(i * this.binTotalWidth, this.height / 2 - j * this.tickTotalHeight, this.binWidth, this.tickHeight);
        ctx.globalAlpha = 0.5;
        ctx.fillRect(i * this.binTotalWidth, this.height / 2 + j * this.tickTotalHeight, this.binWidth, this.tickHeight);
      }
      ctx.globalAlpha = 0.3;
      ctx.fillRect(i * this.binTotalWidth, this.height / 2, this.binWidth, this.tickHeight);
    }
    ctx.restore();
  }
}

export class SpectogramAnalyzerNodeView extends AnalyzerNodeView {
  binWidth = 4;
  binHPadding = 0;
  binTotalWidth = this.binWidth + this.binHPadding;
  tickHeight = 4;
  tickVPadding = 1;
  tickTotalHeight = this.tickHeight + this.tickVPadding;
  tmpCanvas: HTMLCanvasElement;
  tmpCtx: CanvasRenderingContext2D;
  constructor(analyzerNode: AnalyserNode, canvas: HTMLCanvasElement, width: number, height: number) {
    super(analyzerNode, canvas, width, height);
    this.reset();
    this.start();
  }
  reset() {
    super.reset();
    this.tmpCanvas = document.createElement("canvas");
    this.tmpCanvas.width = this.canvas.width;
    this.tmpCanvas.height = this.canvas.height;
    this.tmpCtx = this.tmpCanvas.getContext("2d");
  }
  update() {
    this.frequency.update();
  }
  render() {
    let ctx = this.ctx;
    // Save
    this.tmpCtx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.save();
    ctx.scale(this.ratio, this.ratio);
    ctx.fillStyle = this.theme.backgroundColor;
    ctx.fillRect(0, 0, this.width, this.height);
    let maxBinCount = this.width / this.binTotalWidth | 0;
    let binCount = Math.min(maxBinCount, this.frequency.bins.length);
    for (let i = 0; i < binCount; i++) {
      ctx.fillStyle = this.theme.scale(i / binCount);
      let value = clamp((this.frequency.bins[i] - MIN_DB_LEVEL) / DB_LEVEL_RANGE, 0, 1);
      ctx.globalAlpha = value;
      ctx.fillRect(this.width - this.binTotalWidth, i * this.tickTotalHeight, this.binWidth, this.tickHeight);
    }
    ctx.restore();
    ctx.translate(-this.binTotalWidth, 0);
    ctx.drawImage(this.tmpCanvas, 0, 0);
    ctx.restore();
  }
}

export class RadialAnalyzerNodeView extends AnalyzerNodeView {
  binWidth = 5;
  binHPadding = 1;
  binTotalWidth = this.binWidth + this.binHPadding;
  tickHeight = 4;
  tickVPadding = 2;
  tickTotalHeight = this.tickHeight + this.tickVPadding;

  constructor(analyzerNode: AnalyserNode, canvas: HTMLCanvasElement, width: number, height: number) {
    super(analyzerNode, canvas, width, height);
    this.reset();
    this.start();
  }
  update() {
    this.frequency.update();
  }
  render() {
    let ctx = this.ctx;
    ctx.save();
    ctx.scale(this.ratio, this.ratio);
    ctx.fillStyle = this.theme.backgroundColor;
    ctx.fillRect(0, 0, this.width, this.height);
    let binCount = this.frequency.bins.length;
    ctx.translate(this.width / 2, this.height / 2);
    let angle = Math.PI * 2 / binCount;
    let innerRadius = 12 * this.ratio;
    for (let i = 0; i < binCount; i++) {
      ctx.rotate(angle);
      let value = clamp((this.frequency.bins[i] - MIN_DB_LEVEL) / DB_LEVEL_RANGE, 0, 1);
      let ticks = (Math.min(this.width, this.height) / 2 * value / this.tickTotalHeight) | 0;
      ctx.fillStyle = this.theme.scale(i / binCount);
      ctx.globalAlpha = 1;
      for (let j = 0; j < ticks; j++) {
        let r = (innerRadius + j * this.tickTotalHeight);
        let t = Math.max((2 * r * Math.sin(angle / 2) - this.tickVPadding) | 0, 1);
        ctx.fillRect(innerRadius + j * this.tickTotalHeight, -t / 2, this.tickHeight, t);
      }
      ctx.globalAlpha = 0.3;
      let t = Math.max((2 * innerRadius * Math.sin(angle / 2) - this.tickVPadding) | 0, 1);
      ctx.fillRect(innerRadius, -t / 2, this.tickHeight, t);
    }
    ctx.restore();
  }
}
