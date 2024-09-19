const RATIO = window.devicePixelRatio;
const WIDTH = RATIO * 320;
const HEIGHT = RATIO * 100;
const IDLE_AMPLITUDE = 0.1;
const PLAY_AMPLITUDE = 0.6;

const LOW_FPS = 30;
const DISABLE_ANIMATION_LOW_FPS_THRESHOLD = 3;

class Curve {
  baseAmplitude: number;

  private amplitude: number;
  private color: number[];
  private ctx: CanvasRenderingContext2D;
  private openClass: number;
  private speed: number;
  private seed: number;
  private tick: number;

  constructor(args: {
    color: number[];
    ctx: CanvasRenderingContext2D;
    speed: number;
    baseAmplitude: number;
  }) {
    Object.assign(this, args);
    this.tick = 0;

    this.respawn();
  }

  respawn() {
    this.amplitude = 0.3 + Math.random() * 0.7;
    this.seed = Math.random();
    this.openClass = (5 + Math.random() * 4) | 0;
  }

  private equation(i: number) {
    const y =
      ((-1 *
        Math.abs(Math.sin(this.tick)) *
        this.baseAmplitude *
        this.amplitude *
        HEIGHT) /
        2) *
      (1 / (1 + this.openClass * i ** 2) ** 2);
    if (Math.abs(y) < 0.001) {
      this.respawn();
    }
    return y;
  }

  private _draw(direction: 1 | -1) {
    this.tick += this.speed * (1 - 0.5 * Math.sin(this.seed * Math.PI));

    const ctx = this.ctx;
    ctx.beginPath();

    const xBase = WIDTH / 2 + (-WIDTH / 4 + this.seed * (WIDTH / 2));
    const yBase = HEIGHT / 2;

    let x;
    let y;
    let xInit;

    let i = -3;
    while (i <= 3) {
      x = xBase + (i * WIDTH) / 4;
      y = yBase + direction * this.equation(i);
      xInit = xInit || x;
      ctx.lineTo(x, y);
      i += 0.01;
    }

    const h = Math.abs(this.equation(0));
    const gradient = ctx.createRadialGradient(
      xBase,
      yBase,
      h * 2,
      xBase,
      yBase,
      h * 0.3
    );
    gradient.addColorStop(0, `rgba(${this.color.join(',')},0.1)`);
    gradient.addColorStop(1, `rgba(${this.color.join(',')},0.05)`);

    ctx.fillStyle = gradient;

    ctx.lineTo(xInit, yBase);
    ctx.closePath();

    ctx.fill();
  }

  draw() {
    this._draw(-1);
    this._draw(1);
  }
}

let lastFPSCheckAt = 0;
let lowFPSCount = 0;
let framesInLastSecond: number[] = [];

export default class Wave {
  private amplitude = IDLE_AMPLITUDE;
  private colors = [
    [89, 203, 183],
    [177, 181, 229],
    // [248, 144, 150], 
  ];
  private ctx: CanvasRenderingContext2D;
  private curves: Curve[];
  private shouldDraw = false;
  private speed: number;

  constructor(canvas: HTMLCanvasElement) {
    this.speed = 0.1;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.width = `${WIDTH / RATIO}px`;
    canvas.style.height = `${HEIGHT / RATIO}px`;

    this.ctx = canvas.getContext('2d');

    this.curves = this.colors
      .reduce((arr, color) => [...arr, color, color], [])
      .map(
        color =>
          new Curve({
            color: color as any,
            ctx: this.ctx,
            speed: this.speed,
            baseAmplitude: 2 * IDLE_AMPLITUDE,
          })
      );

    this.draw();
  }

  private clear() {
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    this.ctx.globalCompositeOperation = 'lighter';
  }

  private draw() {
    if (lowFPSCount >= DISABLE_ANIMATION_LOW_FPS_THRESHOLD) {
      return;
    }

    this.clear();

    const baseAmplitude =
      this.curves[0].baseAmplitude * 0.9 + this.amplitude * 0.1;
    for (const curve of this.curves) {
      curve.baseAmplitude = baseAmplitude;
      curve.draw();
    }

    if (this.shouldDraw || Math.abs(baseAmplitude - this.amplitude) > 0.01) {
      requestAnimationFrame(this.draw.bind(this));
    }

    const now = performance.now();
    framesInLastSecond.push(now);
    if (now - lastFPSCheckAt < 1000) return;
    lastFPSCheckAt = now;
    const index = framesInLastSecond
      .slice()
      .reverse()
      .findIndex(t => now - t > 1000);
    if (index === -1) {
      return;
    }

    framesInLastSecond = framesInLastSecond.slice(
      framesInLastSecond.length - index - 1
    );
    if (framesInLastSecond.length < LOW_FPS) {
      lowFPSCount++;
    }
  }

  play() {
    this.amplitude = PLAY_AMPLITUDE;
    this.shouldDraw = true;
    this.draw();
  }

  idle() {
    this.shouldDraw = false;
    this.amplitude = IDLE_AMPLITUDE;
    framesInLastSecond = [];
  }
}
