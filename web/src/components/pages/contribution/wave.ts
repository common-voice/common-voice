const RATIO = window.devicePixelRatio;
const WIDTH = RATIO * 320;
const HEIGHT = RATIO * 100;
const IDLE_AMPLITUDE = 0.1;
const PLAY_AMPLITUDE = 0.5;

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
    this.openClass = (2 + Math.random() * 3) | 0;
  }

  private equation(i: number) {
    const y =
      -1 *
      Math.abs(Math.sin(this.tick)) *
      this.baseAmplitude *
      this.amplitude *
      HEIGHT /
      2 *
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
      x = xBase + i * WIDTH / 4;
      y = yBase + direction * this.equation(i);
      xInit = xInit || x;
      ctx.lineTo(x, y);
      i += 0.01;
    }

    const h = Math.abs(this.equation(0));
    const gradient = ctx.createRadialGradient(
      xBase,
      yBase,
      h * 1.15,
      xBase,
      yBase,
      h * 0.3
    );
    gradient.addColorStop(0, `rgba(${this.color.join(',')},0.4)`);
    gradient.addColorStop(1, `rgba(${this.color.join(',')},0.2)`);

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

export default class Wave {
  private colors = [[89, 203, 183], [177, 181, 229], [248, 144, 150]];
  private tick: number;
  private speed: number;
  private ctx: CanvasRenderingContext2D;
  private curves: Curve[];

  constructor(canvas: HTMLCanvasElement) {
    this.tick = 0;

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
            baseAmplitude: IDLE_AMPLITUDE,
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
    this.clear();
    for (const curve of this.curves) {
      curve.draw();
    }

    requestAnimationFrame(this.draw.bind(this));
  }

  play() {
    this.tick = 0;
    this.curves.forEach(curve => (curve.baseAmplitude = PLAY_AMPLITUDE));
  }

  idle() {
    this.tick = 0;
    this.curves.forEach(curve => (curve.baseAmplitude = IDLE_AMPLITUDE));
  }
}
