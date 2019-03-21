import * as React from 'react';

import './ui.css';

export function Fraction({
  numerator,
  denominator,
}: {
  numerator: React.ReactNode;
  denominator: React.ReactNode;
}) {
  return (
    <div className="fraction">
      <div className="numerator">{numerator}</div>
      <div className="denominator">
        {' / '}
        {denominator}
      </div>
    </div>
  );
}

const RADIUS = 32;
const STROKE = 2;
const CENTER = RADIUS + STROKE;

const Circle = (props: React.SVGProps<SVGCircleElement>) => (
  <circle
    strokeWidth={STROKE}
    r={RADIUS}
    cx={CENTER}
    cy={CENTER}
    fill="transparent"
    {...props}
  />
);

const CIRCUM = 2 * Math.PI * RADIUS;

export function CircleProgress({ value }: { value: number }) {
  return (
    <div className="circle-progress">
      <svg>
        <Circle />
        <Circle
          className="progress-circle"
          strokeDasharray={CIRCUM}
          strokeDashoffset={CIRCUM * Math.max(1 - value, 0)}
        />
        <text
          x={CENTER}
          y={CENTER}
          textAnchor="middle"
          dominantBaseline="central">
          {Math.round(100 * value)}%
        </text>
      </svg>
    </div>
  );
}
