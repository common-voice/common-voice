import { Localized } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
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

type Attribute = 'total' | 'valid';

interface PropsFromState {
  api: API;
}

type State = { data: any[]; width: number };

class ClipsStats extends React.Component<PropsFromState, State> {
  state: State = { data: [], width: 0 };

  svgRef = React.createRef<SVGSVGElement>();

  async componentDidMount() {
    window.addEventListener('resize', this.updateSize);
    this.updateSize();

    this.setState({ data: await this.props.api.fetchClipsStats() });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
  }

  updateSize = () => {
    this.setState({ width: this.svgRef.current.getBoundingClientRect().width });
  };

  getMax = () =>
    Y_SCALE *
    this.state.data.reduce((max, d) => Math.max(max, d.total, d.valid), 0);

  pointFromDatum = (x: number, y: number) => {
    const { data, width } = this.state;
    return [
      LINE_OFFSET +
        PLOT_PADDING +
        x *
          (width - LINE_OFFSET - 2 * PLOT_PADDING - CIRCLE_RADIUS) /
          (data.length - 1),
      Y_OFFSET -
        PLOT_STROKE_WIDTH / 2 +
        (1 - y / this.getMax()) * (data.length + 1) * LINE_MARGIN,
    ] as [number, number];
  };

  render() {
    const { data, width } = this.state;

    return (
      <div className="home-card">
        <div className="metrics">
          {this.renderMetric('total-hours', 'total')}
          {this.renderMetric('total-hours', 'valid')}
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
                  {Math.round(
                    (TICK_COUNT - 1 - i) * this.getMax() / (TICK_COUNT - 1)
                  )}
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
          {this.renderPath('valid')}
          {this.renderPath('valid')}
          {this.renderPath('total')}
        </svg>
      </div>
    );
  }

  renderMetric(labelId: string, attribute: Attribute) {
    const { data } = this.state;
    return (
      <div className={'metric ' + attribute}>
        <Localized id={labelId}>
          <div className="label" />
        </Localized>
        <div className="value">
          <div className="point">●</div>
          {data.length > 0 ? data[data.length - 1][attribute] : '?'}
        </div>
      </div>
    );
  }

  renderPath(attribute: Attribute) {
    const { data } = this.state;
    if (data.length === 0) return;

    const lastIndex = data.length - 1;
    const [x, y] = this.pointFromDatum(lastIndex, data[lastIndex][attribute]);

    return (
      <React.Fragment>
        <path
          d={pointsToBezier(
            data.map((datum, i) => this.pointFromDatum(i, datum[attribute]))
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
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(ClipsStats);
