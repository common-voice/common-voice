import * as React from 'react';

import './ui.css';

export function Fraction({
  numerator,
  denominator,
  percentage,
  className,
}: {
  numerator: React.ReactNode;
  denominator?: React.ReactNode;
  percentage?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`fraction${className ? ` ${className}` : ''}${
        numerator <= 99 ? ' md-right' : ''
      }`}>
      <div className="numerator">{numerator}</div>
      {/* <div className="denominator">
        {percentage ? ' % ' : ' / '}
        {denominator}
      </div> */}
    </div>
  );
}

const Circle = ({
  radius,
  strokeW,
  center,
  ...rest
}: React.SVGProps<SVGCircleElement> & {
  radius: number;
  strokeW: number;
  center: number;
}) => (
  <circle
    strokeWidth={strokeW}
    r={radius}
    cx={center}
    cy={center}
    fill="transparent"
    {...rest}
  />
);

const RADIUS = 30;
const STROKE = 2;

export function CircleProgress({
  className = '',
  value,
  denominator,
  radius = RADIUS,
  strokeW = STROKE,
}: {
  className?: string;
  value: number;
  denominator?: number; // If unset, we show `value` as a percentage.
  radius?: number;
  strokeW?: number;
}) {
  if (0.1 <= value || value <= 0.99) {
    radius = 44;
  } else if (value >= 1) {
    radius = 50;
  }
  const circumference = 2 * Math.PI * radius;
  const center = radius + strokeW;
  const size = center * 2;
  return (
    <div
      className={`circle-progress ${className}`}
      style={{ color: 'var(--red)' }}>
      <svg width={size} height={size}>
        <Circle radius={radius} strokeW={strokeW} center={center} />
        <Circle
          radius={radius}
          strokeW={strokeW}
          center={center}
          className="progress-circle"
          strokeDasharray={circumference}
          strokeDashoffset={
            circumference * Math.max(1 - value / (denominator || 1), 0)
          }
        />
        {/* {!denominator && (
            <text
              x={center}
              y={center}
              textAnchor="middle"
              dominantBaseline="central">
              {Math.round(100 * value)}%
            </text>
        )} */}
      </svg>
      {denominator ? (
        <Fraction numerator={value} denominator={denominator} />
      ) : (
        <Fraction
          numerator={
            Math.round(100 * value) >= 100 ? '100' : Math.round(100 * value)
          }
          percentage
        />
      )}
    </div>
  );
}
