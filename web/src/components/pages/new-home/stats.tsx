const spline = require('@yr/monotone-cubic-spline');
import { Localized } from 'fluent-react';
import * as React from 'react';
import { Component, SVGProps } from 'react';
import { connect } from 'react-redux';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';

import './stats.css';

const { Tooltip } = require('react-tippy');

const contributableLocales = require('../../../../../locales/contributable.json') as string[];

const Y_OFFSET = 10;
const TOTAL_LINE_MARGIN = 154;
const TEXT_OFFSET = 40;
const LINE_OFFSET = TEXT_OFFSET + 5;
const PLOT_PADDING = 13;
const PLOT_STROKE_WIDTH = 2;

type Attribute = 'total' | 'valid';

interface PropsFromState {
  api: API;
}

type State = { data: any[]; locale: string; max: number; width: number };

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

const ALL_LOCALES = 'all';

const StatsCard = connect<PropsFromState>(mapStateToProps)(
  class extends React.Component<
    {
      children: (state: State) => React.ReactNode;
      getMax: (data: any[]) => number;
      fetchData: (api: API, locale?: string) => Promise<any[]>;
      formatNumber: (n: number) => string;
      renderHeader: (state: State) => React.ReactNode;
      renderTooltipContents?: (state: State) => React.ReactNode;
      renderXTickLabel: (datum: any, i: number) => React.ReactNode;
      tickCount: number;
    } & PropsFromState &
      SVGProps<SVGElement>,
    State
  > {
    state: State = {
      data: [],
      max: this.props.tickCount - 1,
      locale: ALL_LOCALES,
      width: 0,
    };

    svgRef = React.createRef<SVGSVGElement>();

    async componentDidMount() {
      window.addEventListener('resize', this.updateSize);
      this.updateSize();

      await this.updateData();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateSize);
    }

    updateData = async () => {
      const { api, fetchData, getMax, tickCount } = this.props;
      const { locale } = this.state;
      const data = await fetchData(api, locale === ALL_LOCALES ? null : locale);
      if (locale !== this.state.locale) return;
      const max = getMax(data);
      const ticks = tickCount - 1;
      this.setState({
        data,
        max: max + (ticks - max % ticks),
      });
    };

    changeLocale = (event: any) => {
      this.setState(
        { data: [], max: this.props.tickCount - 1, locale: event.target.value },
        this.updateData
      );
    };

    updateSize = () => {
      this.setState({
        width: this.svgRef.current.getBoundingClientRect().width,
      });
    };

    render() {
      const {
        children,
        formatNumber,
        onMouseMove,
        onMouseOut,
        renderHeader,
        renderTooltipContents,
        renderXTickLabel,
        tickCount,
      } = this.props;
      const { state } = this;
      const { data, locale, max, width } = state;

      const tooltipContents =
        renderTooltipContents && renderTooltipContents(state);

      return (
        <div className="home-card">
          <div className="head">
            {renderHeader(state)}
            <select value={locale} onChange={this.changeLocale}>
              <option value={ALL_LOCALES}>All Languages</option>
              {contributableLocales.map(locale => (
                <Localized key={locale} id={locale}>
                  <option value={locale} />
                </Localized>
              ))}
            </select>
          </div>
          <Tooltip
            arrow={true}
            duration={0}
            html={tooltipContents}
            open={Boolean(tooltipContents)}
            theme="white"
            followCursor>
            <svg
              width="100%"
              height="100%"
              ref={this.svgRef}
              {...{ onMouseMove, onMouseOut }}>
              {Array.from({ length: tickCount }).map((_, i) => {
                const y = i * TOTAL_LINE_MARGIN / tickCount + Y_OFFSET;
                return (
                  <React.Fragment key={i}>
                    <text
                      className="tick-label"
                      x={TEXT_OFFSET}
                      y={y}
                      dominantBaseline="middle"
                      textAnchor="end">
                      {formatNumber(
                        Math.round((tickCount - 1 - i) * max / (tickCount - 1))
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
                  className="tick-label"
                  x={
                    LINE_OFFSET +
                    i * ((width - PLOT_PADDING - TEXT_OFFSET) / data.length)
                  }
                  y={Y_OFFSET + TOTAL_LINE_MARGIN}>
                  {renderXTickLabel(datum, i)}
                </text>
              ))}
              {children(state)}
            </svg>
          </Tooltip>
        </div>
      );
    }
  }
);

export namespace ClipsStats {
  const DATA_LENGTH = 5;
  const TICK_COUNT = 7;
  const CIRCLE_RADIUS = 8;

  function formatSeconds(totalSeconds: number) {
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);

    if (hours >= 1000) {
      return (hours / 1000).toPrecision(2) + 'k';
    }

    const timeParts = [];

    if (hours > 0) {
      timeParts.push(hours + 'h');
    }

    if (hours < 10 && minutes > 0) {
      timeParts.push(minutes + 'm');
    }

    if (hours == 0 && minutes < 10 && seconds > 0) {
      timeParts.push(seconds + 's');
    }

    return timeParts.join(' ') || '0';
  }

  const MetricValue = ({ attribute, children }: any) => (
    <div className={'metric-value ' + attribute}>
      <div className="point">●</div>
      {children}
    </div>
  );

  const Metric = ({
    data,
    labelId,
    attribute,
  }: {
    data: any[];
    labelId: string;
    attribute: Attribute;
  }) => (
    <div className="metric">
      <Localized id={labelId}>
        <div className="label" />
      </Localized>
      <MetricValue attribute={attribute}>
        {data.length > 0
          ? formatSeconds(data[data.length - 1][attribute])
          : '?'}
      </MetricValue>
    </div>
  );

  const Path = React.forwardRef(
    (
      {
        state,
        attribute,
      }: {
        state: State;
        attribute: Attribute;
      },
      ref: any
    ) => {
      const { data, max, width } = state;
      if (data.length === 0) return null;

      const pointFromDatum = (x: number, y: number): [number, number] => [
        LINE_OFFSET +
          PLOT_PADDING +
          x *
            (width - LINE_OFFSET - 2 * PLOT_PADDING - CIRCLE_RADIUS) /
            (data.length - 1),
        Y_OFFSET -
          PLOT_STROKE_WIDTH / 2 +
          (1 - y / max) * (data.length + 1) * TOTAL_LINE_MARGIN / TICK_COUNT,
      ];

      const lastIndex = data.length - 1;
      const [x, y] = pointFromDatum(lastIndex, data[lastIndex][attribute]);

      return (
        <React.Fragment>
          <path
            d={spline.svgPath(
              spline.points(
                data.map((datum, i) => pointFromDatum(i, datum[attribute]))
              )
            )}
            className={attribute}
            fill="none"
            ref={ref}
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
  );

  type ClipsStatsState = { hoveredIndex: number };

  export class Root extends Component<{}, ClipsStatsState> {
    state: ClipsStatsState = { hoveredIndex: null };

    pathRef: any = React.createRef();

    handleMouseMove = (event: any) => {
      const path = this.pathRef.current;
      if (!path) {
        this.setState({ hoveredIndex: null });
      }
      const { left, width } = path.getBoundingClientRect();
      const hoveredIndex =
        Math.round(DATA_LENGTH * (event.clientX - left) / width) - 1;
      this.setState({
        hoveredIndex:
          hoveredIndex >= 0 && hoveredIndex < DATA_LENGTH ? hoveredIndex : null,
      });
    };

    handleMouseOut = () => this.setState({ hoveredIndex: null });

    render() {
      const { hoveredIndex } = this.state;
      return (
        <StatsCard
          fetchData={(api, locale) => api.fetchClipsStats(locale)}
          formatNumber={formatSeconds}
          getMax={data =>
            data.reduce((max, d) => Math.max(max, d.total, d.valid), 0)
          }
          onMouseMove={this.handleMouseMove}
          onMouseOut={this.handleMouseOut}
          renderHeader={({ data }) => (
            <div className="metrics">
              <Metric data={data} labelId="hours-recorded" attribute="total" />
              <Metric data={data} labelId="hours-validated" attribute="valid" />
            </div>
          )}
          renderTooltipContents={({ data }) => {
            const datum = data[hoveredIndex];
            if (!datum) return null;

            const { date, total, valid } = datum;
            return (
              <React.Fragment>
                <b>
                  {new Date(date).toLocaleDateString([], {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </b>
                <div className="metrics">
                  <MetricValue attribute="total">
                    {formatSeconds(total)}
                  </MetricValue>
                  <MetricValue attribute="valid">
                    {formatSeconds(valid)}
                  </MetricValue>
                </div>
              </React.Fragment>
            );
          }}
          renderXTickLabel={({ date }) => new Date(date).toLocaleDateString()}
          tickCount={TICK_COUNT}>
          {state => (
            <React.Fragment>
              <Path state={state} attribute="valid" />
              <Path state={state} attribute="total" ref={this.pathRef} />
            </React.Fragment>
          )}
        </StatsCard>
      );
    }
  }
}

export namespace VoiceStats {
  const TICK_COUNT = 4;
  const BAR_COUNT = 10;
  const BAR_WIDTH = 15;
  const BAR_HEIGHT = TOTAL_LINE_MARGIN * ((TICK_COUNT - 1) / TICK_COUNT);

  function formatNumber(n: number) {
    return n > 1000 ? Math.round(n / 1000) + 'k' : n.toString();
  }

  export const Root = () => (
    <StatsCard
      fetchData={(api, locale) => api.fetchClipVoices(locale)}
      formatNumber={formatNumber}
      getMax={data => data.reduce((max, d) => Math.max(max, d.voices), 0)}
      renderHeader={({ data }) => (
        <div>
          <h3>Voices Online Now</h3>
          <div className="online-voices">
            {data.length > 0
              ? data[data.length - 1].voices.toLocaleString()
              : '?'}
          </div>
        </div>
      )}
      renderXTickLabel={({ date }) =>
        new Date(date)
          .toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
          .replace(' AM', '')
          .replace(' PM', '')
      }
      tickCount={TICK_COUNT}>
      {({ data, max, width }) => {
        const getBarX = (i: number) =>
          LINE_OFFSET +
          PLOT_PADDING -
          BAR_WIDTH / 2 +
          i * (width - PLOT_PADDING - TEXT_OFFSET) / BAR_COUNT;

        return (
          <React.Fragment>
            {Array.from({ length: BAR_COUNT }).map((_, i) => (
              <rect
                key={i}
                className="bg"
                x={getBarX(i)}
                y={Y_OFFSET}
                width={BAR_WIDTH}
                height={BAR_HEIGHT}
              />
            ))}

            <defs>
              <linearGradient id="blue-purple" x2="0%" y2="100%">
                <stop offset="5%" stopColor="#88d1f1" />
                <stop offset="95%" stopColor="#b1b5e5" />
              </linearGradient>
            </defs>
            {data.map(({ voices }, i) => {
              const height = voices * BAR_HEIGHT / max || 0;
              return (
                <rect
                  key={i}
                  fill="url(#blue-purple)"
                  className={i + 1 === BAR_COUNT ? 'current' : ''}
                  x={getBarX(i)}
                  y={Y_OFFSET + BAR_HEIGHT - height}
                  width={BAR_WIDTH}
                  height={height}
                />
              );
            })}
          </React.Fragment>
        );
      }}
    </StatsCard>
  );
}
