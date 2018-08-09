import { Localized } from 'fluent-react';
import * as React from 'react';
import pointsToBezier from './points-to-bezier';

import './clips-stats.css';

const TICK_COUNT = 7;
const Y_SCALE = 1.25;
const Y_OFFSET = 10;
const LINE_MARGIN = 22;
const TEXT_OFFSET = 25;
const LINE_OFFSET = TEXT_OFFSET + 5;
const PLOT_PADDING = 13;
const PLOT_STROKE_WIDTH = 2;
const CIRCLE_RADIUS = 8;

type Attribute = 'total' | 'valid' | 'unverified';

const data = [
  { date: '2018-07-24T20:00:00.000Z', total: 0, valid: 0, unverified: 0 },
  { date: '2018-07-27T05:36:00.000Z', total: 15, valid: 4, unverified: 2 },
  { date: '2018-07-29T15:12:00.000Z', total: 34, valid: 24, unverified: 8 },
  { date: '2018-08-01T00:48:00.000Z', total: 45, valid: 34, unverified: 0 },
  { date: '2018-08-03T10:24:00.000Z', total: 92, valid: 70, unverified: 11 },
];
const max =
  Y_SCALE *
  data.reduce((max, d) => Math.max(max, d.total, d.valid, d.unverified), 0);

const Metric = ({
  labelId,
  attribute,
}: {
  labelId: string;
  attribute: Attribute;
}) => (
  <div className={'metric ' + attribute}>
    <Localized id={labelId}>
      <div className="label" />
    </Localized>
    <div className="value">
      <div className="point">●</div>
      {data[data.length - 1][attribute]}
    </div>
  </div>
);

const pointFromDatum = (x: number, y: number, width: number) =>
  [
    LINE_OFFSET +
      PLOT_PADDING +
      x *
        (width - LINE_OFFSET - 2 * PLOT_PADDING - CIRCLE_RADIUS) /
        (data.length - 1),
    Y_OFFSET -
      PLOT_STROKE_WIDTH / 2 +
      (1 - y / max) * (data.length + 1) * LINE_MARGIN,
  ] as [number, number];

const Path = ({
  attribute,
  width,
}: {
  attribute: Attribute;
  width: number;
}) => {
  const lastIndex = data.length - 1;
  const [x, y] = pointFromDatum(lastIndex, data[lastIndex][attribute], width);
  return (
    <React.Fragment>
      <path
        d={pointsToBezier(
          data.map((datum, i) => pointFromDatum(i, datum[attribute], width))
        )}
        className={attribute}
        fill="none"
        strokeWidth={PLOT_STROKE_WIDTH}
      />
      <circle
        cx={x}
        cy={y}
        r={CIRCLE_RADIUS}
        fill="white"
        className={'outer ' + attribute}
      />
      <circle
        cx={x}
        cy={y}
        r={CIRCLE_RADIUS - 2}
        className={'inner ' + attribute}
      />
    </React.Fragment>
  );
};

export default class ClipsStats extends React.Component<{}, { width: number }> {
  state = { width: 0 };

  svgRef = React.createRef<SVGSVGElement>();

  componentDidMount() {
    this.updateSize();
    window.addEventListener('resize', this.updateSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
  }

  updateSize = () => {
    this.setState({ width: this.svgRef.current.getBoundingClientRect().width });
  };

  render() {
    const { width } = this.state;
    const lastDatum = data[data.length - 1];

    return (
      <div className="home-card">
        <div className="metrics">
          <Metric labelId="speak-goal-text" attribute="total" />
          <Metric labelId="listen-goal-text" attribute="valid" />
          <Metric labelId="total-hours" attribute="unverified" />
        </div>
        <svg width="100%" height="100%" ref={this.svgRef}>
          {Array.from({ length: TICK_COUNT }).map((_, i) => {
            const y = i * LINE_MARGIN + Y_OFFSET;
            return (
              <React.Fragment key={i}>
                <text
                  className="tick-label"
                  x={TEXT_OFFSET}
                  y={y}
                  dominantBaseline="middle"
                  textAnchor="end">
                  {Math.round((TICK_COUNT - 1 - i) * max / (TICK_COUNT - 1))}
                </text>
                <line
                  x1={LINE_OFFSET}
                  y1={y}
                  x2={width}
                  y2={y}
                  stroke="rgba(0,0,0,0.2)"
                />
              </React.Fragment>
            );
          })}
          {data.map(({ date }, i) => (
            <text
              key={i}
              className="tick-label"
              x={LINE_OFFSET + i * width / data.length}
              y={Y_OFFSET + LINE_MARGIN * TICK_COUNT}>
              {new Date(date).toLocaleDateString()}
            </text>
          ))}
          <Path attribute="unverified" width={width} />
          <Path attribute="valid" width={width} />
          <Path attribute="total" width={width} />
        </svg>
      </div>
    );
  }
}
