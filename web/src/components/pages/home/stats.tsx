const spline = require('@yr/monotone-cubic-spline');
import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react/compat';
import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import API from '../../../services/api';
import { trackHome } from '../../../services/tracker';
import StateTree from '../../../stores/tree';
import LanguageSelect, {
  ALL_LOCALES,
} from '../../language-select/language-select';
import Plot, {
  BarPlot,
  LINE_OFFSET,
  PLOT_PADDING,
  TOTAL_LINE_MARGIN,
  Y_OFFSET,
} from '../../plot/plot';

import './stats.css';

const { Tooltip } = require('react-tippy');

const PLOT_STROKE_WIDTH = 2;

type Attribute = 'total' | 'valid';

interface State {
  locale: string;
}

function StatsCard({
  children,
  onLocaleChange,
  header,
}: {
  children?: React.ReactNode;
  header: React.ReactNode;
  onLocaleChange: (locale: string) => any;
}) {
  const [locale, setLocale] = useState(ALL_LOCALES);
  return (
    <div className="home-card">
      <div className="head">
        {header}
        <LanguageSelect
          value={locale}
          onChange={locale => {
            trackHome('metric-locale-change', locale);
            setLocale(locale);
            onLocaleChange(locale == ALL_LOCALES ? null : locale);
          }}
        />
      </div>
      {children}
    </div>
  );
}

interface PropsFromState {
  api: API;
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export namespace ClipsStats {
  const DATA_LENGTH = 5;
  const TICK_COUNT = 7;
  const CIRCLE_RADIUS = 8;

  function formatSeconds(totalSeconds: number, precise: boolean = false) {
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);

    if (precise) return `${hours.toLocaleString()}h`;
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

  const MetricValue = ({ attribute, title, children }: any) => (
    <div className={'metric-value ' + attribute} title={title}>
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
      <MetricValue
        attribute={attribute}
        title={
          data.length > 0
            ? formatSeconds(data[data.length - 1][attribute], true)
            : ''
        }>
        {data.length > 0
          ? formatSeconds(data[data.length - 1][attribute])
          : '?'}
      </MetricValue>
    </div>
  );

  const Path = React.forwardRef(
    (
      {
        attribute,
        data,
        max,
        width,
      }: {
        attribute: Attribute;
        data: any[];
        max: number;
        width: number;
      },
      ref: any
    ) => {
      if (data.length === 0) return null;

      const pointFromDatum = (x: number, y: number): [number, number] => [
        LINE_OFFSET +
          PLOT_PADDING +
          (x * (width - LINE_OFFSET - 2 * PLOT_PADDING - CIRCLE_RADIUS)) /
            (data.length - 1),
        Y_OFFSET -
          PLOT_STROKE_WIDTH / 2 +
          ((1 - y / max) * (data.length + 1) * TOTAL_LINE_MARGIN) / TICK_COUNT,
      ];

      const lastIndex = data.length - 1;
      const [x, y] = pointFromDatum(lastIndex, data[lastIndex][attribute]);

      return (
        <>
          <path
            d={spline.svgPath(
              spline.points(
                data.map((datum: any, i: number) =>
                  pointFromDatum(i, datum[attribute])
                )
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
        </>
      );
    }
  );

  class BareRoot extends React.Component<WithLocalizationProps & PropsFromState> {
    state: { data: any[]; hoveredIndex: number } = {
      data: [],
      hoveredIndex: null,
    };

    pathRef: any = React.createRef();

    async componentDidMount() {
      await this.updateData();
    }

    updateData = async (locale?: string) => {
      this.setState({ data: await this.props.api.fetchClipsStats(locale) });
    };

    handleMouseMove = (event: any) => {
      const path = this.pathRef.current;
      if (!path) {
        this.setState({ hoveredIndex: null });
      }
      const { left, width } = path.getBoundingClientRect();
      const hoveredIndex =
        Math.round((DATA_LENGTH * (event.clientX - left)) / width) - 1;
      this.setState({
        hoveredIndex:
          hoveredIndex >= 0 && hoveredIndex < DATA_LENGTH ? hoveredIndex : null,
      });
    };

    handleMouseOut = () => this.setState({ hoveredIndex: null });

    render() {
      const { getString } = this.props;
      const { data, hoveredIndex } = this.state;

      const datum = data[hoveredIndex];
      const { date, total, valid } = datum || ({} as any);
      const tooltipContents = datum ? (
        <>
          <b>
            {new Date(date).toLocaleDateString([], {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </b>
          <div className="metrics">
            <MetricValue attribute="total">{formatSeconds(total)}</MetricValue>
            <MetricValue attribute="valid">{formatSeconds(valid)}</MetricValue>
          </div>
        </>
      ) : null;

      return (
        <StatsCard
          header={
            <div className="metrics">
              <Metric data={data} labelId="hours-recorded" attribute="total" />
              <Metric data={data} labelId="hours-validated" attribute="valid" />
            </div>
          }
          onLocaleChange={this.updateData}>
          <Tooltip
            arrow={true}
            duration={0}
            html={tooltipContents}
            open={Boolean(tooltipContents)}
            theme="white"
            followCursor>
            <Plot
              data={data}
              formatNumber={formatSeconds}
              max={data.reduce(
                (max: number, d: any) => Math.max(max, d.total, d.valid),
                0
              )}
              onMouseMove={this.handleMouseMove}
              onMouseOut={this.handleMouseOut}
              renderXTickLabel={({ date }: any) => {
                const dateObj = new Date(date);
                const dayDiff = Math.ceil(
                  Math.abs(dateObj.getTime() - new Date().getTime()) /
                    (1000 * 3600 * 24)
                );
                if (dayDiff <= 1) return getString('today');
                if (dayDiff < 30) {
                  return getString('x-weeks-short', {
                    count: Math.floor(dayDiff / 7),
                  });
                }
                if (dayDiff < 365) {
                  return getString('x-months-short', {
                    count: Math.floor(dayDiff / 30),
                  });
                }

                return getString('x-years-short', {
                  count: Math.floor(dayDiff / 365),
                });
              }}
              tickCount={TICK_COUNT}
              tickMultipliers={[10, 60, 600, 3600, 36000, 360000]}>
              {state => (
                <>
                  <Path attribute="valid" data={data} {...state} />
                  <Path
                    attribute="total"
                    data={data}
                    {...state}
                    ref={this.pathRef}
                  />
                </>
              )}
            </Plot>
          </Tooltip>
        </StatsCard>
      );
    }
  }

  export const Root = connect<PropsFromState>(mapStateToProps)(
    withLocalization(BareRoot)
  );
}

export const VoiceStats = connect<PropsFromState>(mapStateToProps)(
  class BareRoot extends React.Component<PropsFromState> {
    state: { data: any[] } = { data: [] };

    async componentDidMount() {
      await this.updateData();
    }

    updateData = async (locale?: string) => {
      this.setState({ data: await this.props.api.fetchClipVoices(locale) });
    };

    render() {
      const { data } = this.state;
      return (
        <StatsCard
          header={
            <div>
              <Localized id="voices-online">
                <h3 />
              </Localized>
              <div className="online-voices">
                {data.length > 0
                  ? data[data.length - 1].value.toLocaleString()
                  : '?'}
              </div>
            </div>
          }
          onLocaleChange={this.updateData}>
          <BarPlot data={data} />
        </StatsCard>
      );
    }
  }
);
