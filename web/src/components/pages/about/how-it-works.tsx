import * as React from 'react';
import * as cx from 'classnames';
import { Localized } from '@fluent/react';

import './how-it-works.css';

const CHART_NODE_REQUIRED_COUNT = 4;
const CHART_NODE_BLOCK_WITHOUT_OPTIONS_COUNT = 2;

const FLOWCHART: any[] = [
  [['01', 'microphone.png', 'about-speak']],
  [
    [
      '02',
      'time.png',
      'about-listen-queue',
      {
        children: (
          <>
            <img
              src={require('./images/connecting-arrow.png')}
              className="connecting-arrow left desktop"
              alt=""
            />

            <img
              src={require('./images/connecting-arrow.png')}
              className="connecting-arrow right desktop"
              alt=""
            />

            <img
              src={require('./images/connecting-arrow-mobile.png')}
              className="connecting-arrow left mobile"
              alt=""
            />

            <img
              src={require('./images/connecting-arrow-mobile.png')}
              className="connecting-arrow right mobile"
              alt=""
            />

            <img
              src={require('./images/center-arrow.png')}
              className="center-arrow"
              alt=""
            />

            <img
              src={require('./images/center-arrow-mobile.png')}
              className="center-arrow mobile"
              alt=""
            />
          </>
        ),
      },
    ],
  ],
  [['03', 'headset.png', 'about-listen']],
  [
    [
      '04',
      'duotone.png',
      'about-is-it-valid',
      {
        className: 'spaced-below',
        children: (
          <>
            <img
              src={require('./images/forked-arrow.png')}
              className="center-arrow"
              alt=""
            />

            <img
              src={require('./images/forked-arrow-mobile.png')}
              className="center-arrow mobile"
              alt=""
            />
          </>
        ),
      },
    ],
  ],
  [
    [
      '5.1',
      'yes.png',
      'about-yes-votes',
      { className: 'after-fork inside-fork' },
    ],
    [
      '5.2',
      'cancel.png',
      'about-no-votes',
      { className: 'after-fork inside-fork' },
    ],
    { className: 'top' },
  ],
  [
    [
      '6.1',
      'brain.png',
      'about-dataset-new',
      {
        className: 'inside-fork',
        children: (
          <>
            <img
              src={require('./images/arrow-closer.png')}
              className="center-arrow"
              alt=""
            />

            <img
              src={require('./images/center-arrow-mobile.png')}
              className="center-arrow mobile"
              alt=""
            />
          </>
        ),
      },
    ],
    [
      '6.2',
      'rip.png',
      'about-clip-graveyard',
      {
        className: 'inside-fork',
        children: (
          <>
            <img
              src={require('./images/arrow-closer.png')}
              className="center-arrow"
              alt=""
            />

            <img
              src={require('./images/center-arrow-mobile.png')}
              className="center-arrow mobile"
              alt=""
            />
          </>
        ),
      },
    ],
    { className: 'bottom' },
  ],
];

interface ChartNodeProps {
  chartNode: any[];
}

const ChartNode: React.ComponentType<ChartNodeProps> = React.memo(
  ({ chartNode }: ChartNodeProps) => {
    const [id, icon, key, { className, children, ...props }] = chartNode;

    return (
      <div className={cx('flowchart-block', className)} {...props}>
        <div className="number">{id}</div>

        {icon && (
          <img
            className="icon"
            src={require(`./images/flowchart-icons/${icon}`)}
            alt=""
          />
        )}

        <Localized id={key}>
          <h2 className="title" />
        </Localized>

        <Localized id={`${key}-text`}>
          <div className="description" />
        </Localized>

        {children || (
          <>
            <img
              src={require('./images/center-arrow.png')}
              className="center-arrow"
              alt=""
            />

            <img
              src={require('./images/center-arrow-mobile.png')}
              className="center-arrow mobile"
              alt=""
            />
          </>
        )}
      </div>
    );
  }
);

const HowItWorks: React.ComponentType = React.memo(() => {
  return (
    <div className="about-content">
      <div className="about-container no-padding-xs">
        <div className="vertical-line" />

        <div className="flowchart">
          <Localized id="how-does-it-work-title">
            <h1 />
          </Localized>

          <Localized id="how-does-it-work-text">
            <h4 />
          </Localized>

          {FLOWCHART.map(f => {
            const chartNodes = f.map((chartNode: any[]) =>
              chartNode.length === CHART_NODE_REQUIRED_COUNT ||
              !Array.isArray(chartNode)
                ? chartNode
                : [...chartNode, {}]
            );

            return chartNodes.length == CHART_NODE_BLOCK_WITHOUT_OPTIONS_COUNT
              ? [...chartNodes, {}]
              : chartNodes;
          }).map((chartNodes: any[], index: number) => {
            if (chartNodes.length === 1) {
              return (
                <ChartNode
                  key={`chart-node-${index}`}
                  chartNode={chartNodes[0]}
                />
              );
            }

            const { className, ...props } = chartNodes.pop();

            return (
              <div
                key={`chart-node-block-${index}`}
                className={cx('fork-group', className)}
                {...props}>
                {chartNodes.map((chartNode: any[], index: number) => (
                  <ChartNode
                    key={`chart-node-${index}`}
                    chartNode={chartNode}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default HowItWorks;
