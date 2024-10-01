import * as React from 'react';

export const Y_OFFSET = 10;
export const TOTAL_LINE_MARGIN = 154;
export const TEXT_OFFSET = 40;
export const LINE_OFFSET = TEXT_OFFSET + 5;
export const PLOT_PADDING = 13;

import './plot.css';

export type PlotProps = {
  children: (state: { max: number; width: number }) => React.ReactNode;
  data: any[];
  formatNumber: (n: number) => string;
  max: number;
  renderXTickLabel: (datum: any, i: number) => React.ReactNode;
  tickCount: number;
  tickMultipliers: number[];
} & React.SVGProps<SVGElement>;

export default class Plot extends React.Component<
  PlotProps,
  {
    width: number;
  }
> {
  state: {
    width: number;
  } = {
    width: 0,
  };

  svgRef = React.createRef<SVGSVGElement>();

  async componentDidMount() {
    window.addEventListener('resize', this.updateSize);
    this.updateSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
  }

  updateSize = () => {
    this.setState({
      width: this.svgRef.current.getBoundingClientRect().width,
    });
  };

  render() {
    let {
      children,
      data,
      formatNumber,
      max,
      renderXTickLabel,
      tickCount,
      tickMultipliers,
      ...props
    } = this.props;
    const { width } = this.state;

    const tickMultiplier =
      tickMultipliers
        .slice()
        .reverse()
        .find(m => max > m) || 1;
    const ticksCeiling = (tickCount - 1) * tickMultiplier;

    // If max is larger than the natural ceiling based on biggest
    // tickMultiplier and number of ticks, add padding equivalent
    // to another full tickMultiplier
    if (max >= ticksCeiling) {
      max = max + (ticksCeiling - (max % ticksCeiling));
    } else {
      // if max is smaller than the natural ceiling based on biggest
      // tickMultiplier and number of ticks, add padding that will bring
      // max to the next step of multiplier
      max = max + (tickMultiplier - (max % tickMultiplier));
    }

    return (
      <svg
        width="100%"
        height="100%"
        className="plot"
        {...props}
        ref={this.svgRef}>
        {Array.from({ length: tickCount }).map((_, i) => {
          const y = (i * TOTAL_LINE_MARGIN) / tickCount + Y_OFFSET;
          return (
            <React.Fragment key={i}>
              <text
                className="tick-label"
                x={TEXT_OFFSET}
                y={y}
                dominantBaseline="middle"
                textAnchor="end">
                {formatNumber(
                  Math.round(((tickCount - 1 - i) * max) / (tickCount - 1))
                )}
              </text>
              <line
                x1={LINE_OFFSET}
                y1={y}
                x2={width + PLOT_PADDING}
                y2={y}
                stroke="rgba(0,0,0,0.2)"
              />
            </React.Fragment>
          );
        })}
        {data.map((datum, i) => (
          <text
            key={i}
            className="x tick-label"
            x={
              LINE_OFFSET +
              i * ((width - PLOT_PADDING - TEXT_OFFSET) / data.length)
            }
            y={Y_OFFSET + TOTAL_LINE_MARGIN}>
            {renderXTickLabel(datum, i)}
          </text>
        ))}
        {children({ width, max })}
      </svg>
    );
  }
}

const BAR_COUNT = 10;
const BAR_WIDTH_LG = 15;
const BAR_WIDTH_XS = 7;
const TICK_COUNT = 4;
const BAR_HEIGHT = TOTAL_LINE_MARGIN * ((TICK_COUNT - 1) / TICK_COUNT);

function formatNumber(n: number) {
  return n > 1000 ? Math.round(n / 1000) + 'k' : n.toString();
}

export const BarPlot = ({
  data,
}: {
  data: { date: string; value: number }[];
}) => (
  <Plot
    data={data}
    formatNumber={formatNumber}
    max={(data || []).reduce((max, d) => Math.max(max, d.value), 0)}
    renderXTickLabel={({ date }) => {
      const timeString = new Date(date)
        .toLocaleString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(':00 ', '')
        .replace(/\./g, '');

      return timeString;
    }}
    tickCount={TICK_COUNT}
    tickMultipliers={[5, 10, 100, 1000]}>
    {({ max, width }) => {
      const barWidth = width < 400 ? BAR_WIDTH_XS : BAR_WIDTH_LG;
      const getBarX = (i: number) =>
        LINE_OFFSET +
        PLOT_PADDING -
        barWidth / 2 +
        (i * (width - PLOT_PADDING - TEXT_OFFSET)) / BAR_COUNT;

      return (
        <>
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <rect
              key={i}
              className="bg"
              x={getBarX(i)}
              y={Y_OFFSET}
              width={barWidth}
              height={BAR_HEIGHT}
            />
          ))}

          <defs>
            <linearGradient id="teal-gradient" x2="0%" y2="100%">
              <stop offset="5%" stopColor="#88d1f1" />
              <stop offset="95%" stopColor="#b1b5e5" />
            </linearGradient>
          </defs>
          {(data || []).map(({ value }: any, i: number) => {
            const height = (value * BAR_HEIGHT) / max || 0;
            return (
              <rect
                key={i}
                fill="#007C8F"
                className={i + 1 === BAR_COUNT ? 'current' : ''}
                x={getBarX(i)}
                y={Y_OFFSET + BAR_HEIGHT - height}
                width={barWidth}
                height={height}
              />
            );
          })}
        </>
      );
    }}
  </Plot>
);
