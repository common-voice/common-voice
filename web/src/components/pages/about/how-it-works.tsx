import * as React from 'react';
import * as cx from 'classnames';
import { Localized } from 'fluent-react/compat';

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
      'about-dataset',
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

interface FlowchartProps {
  flowchart: any[];
}

const Flowchart: React.ComponentType<FlowchartProps> = React.memo(
  ({ flowchart }: FlowchartProps) => {
    const [id, icon, key, { className, children, ...props }] = flowchart;

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
            const flowchart = f
              .map((flowchart: any[]) =>
                flowchart.length === 4 || !Array.isArray(flowchart)
                  ? flowchart
                  : flowchart.length < 3
                  ? null
                  : [...flowchart, {}]
              )
              .filter((e: any[] | null) => e);

            return flowchart.length == 2 ? [...flowchart, {}] : flowchart;
          }).map((flowchart: any[], index: number) => {
            if (flowchart.length === 1) {
              return (
                <Flowchart
                  key={`flowchart-${index}`}
                  flowchart={flowchart[0]}
                />
              );
            }

            const { className, ...props } = flowchart.pop();

            return (
              <div
                key={`flowchart-${index}`}
                className={cx('fork-group', className)}
                {...props}>
                {flowchart.map((flowchart: any[], index: number) => (
                  <Flowchart key={`flowchart-${index}`} flowchart={flowchart} />
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
