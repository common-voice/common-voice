const PLOT_SMOOTHING = 0.05;

type Point = [number, number];

const line = (pointA: Point, pointB: Point) => {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX),
  };
};

const controlPoint = (
  current: Point,
  previous: Point,
  next: Point,
  reverse = false
): Point => {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current;
  const n = next || current;

  // Properties of the opposed-line
  const o = line(p, n);

  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0);
  const length = o.length * PLOT_SMOOTHING;

  const x = current[0] + Math.cos(angle) * length;
  const y = current[1] + Math.sin(angle) * length;
  return [x, y];
};

const bezierCommand = (point: Point, i: number, a: Point[]) => {
  const start = controlPoint(a[i - 1], a[i - 2], point);
  const end = controlPoint(point, a[i - 1], a[i + 1], true);
  return `C ${start[0]},${start[1]} ${end[0]},${end[1]} ${point[0]},${
    point[1]
  }`;
};

export default function pointsToBezier(points: Point[]) {
  return points.reduce(
    (acc, point, i, a) =>
      i === 0
        ? `M ${point[0]},${point[1]}`
        : `${acc} ${bezierCommand(point, i, a)}`,
    ''
  );
}
