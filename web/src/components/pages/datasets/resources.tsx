import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { Button, LinkButton } from '../../ui/ui';
import Dots from './dots';
import datasets from './other-datasets';

import './resources.css';

const NAV_IDS = {
  getStarted: 'get-started',
  other: 'other-datasets',
  feedback: 'feedback',
};

const A = (props: any) => <a {...props} />;

class Dataset extends React.Component<any, { collapsed: boolean }> {
  state = { collapsed: true };

  render() {
    const { color, name, nick, size, url, download, license } = this.props;
    const { collapsed } = this.state;
    return (
      <div className="other-dataset box">
        <div className="banner" style={{ backgroundColor: color }} />
        <img src="" alt="" />
        <div className="dots-and-content">
          <Dots backgroundColor={'var(--lighter-grey)'} space={20} />
          <div className="content">
            <h2>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {name || (
                  <Localized id={'data-other-' + nick + '-name'}>
                    <span />
                  </Localized>
                )}
              </a>
            </h2>
            <Localized id={'data-other-' + nick + '-description'}>
              <p />
            </Localized>
            {!collapsed && (
              <ul>
                {[
                  ['cv-license', <a href={license.url}>{license.name}</a>],
                  [
                    'size',
                    <span>
                      {size}{' '}
                      <Localized id="size-gigabyte">
                        <span />
                      </Localized>
                    </span>,
                  ],
                ].map(([label, value]) => (
                  <li key={label as any}>
                    <Localized id={label as any}>
                      <div className="label" />
                    </Localized>
                    <div className="value">{value}</div>
                  </li>
                ))}
              </ul>
            )}
            <div className="buttons">
              <Localized
                id={collapsed ? 'languages-show-more' : 'languages-show-less'}>
                <Button
                  onClick={() => this.setState({ collapsed: !collapsed })}
                  rounded
                  outline
                />
              </Localized>
              {!collapsed && download && (
                <Localized id="download-language" $language="">
                  <LinkButton
                    rounded
                    outline
                    className="download"
                    href={download}
                  />
                </Localized>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default () => (
  <div className="dataset-resources">
    <nav>
      <ul>
        {[
          ['get-started-speech', NAV_IDS.getStarted],
          ['other-datasets', NAV_IDS.other],
          ['feedback-q', NAV_IDS.feedback],
        ].map(([labelId, id], i) => (
          <li className={i == 0 ? 'active' : ''}>
            <div className="line" />
            <Localized id={labelId} key={labelId}>
              <a href={'#' + id} />
            </Localized>
          </li>
        ))}
      </ul>
    </nav>

    <div className="sections">
      <A name={NAV_IDS.getStarted} />
      <section className="get-started">
        {[
          [
            'DeepSpeech',
            'deepspeech-info',
            'deepspeech',
            { githubLink: <b />, discourseLink: <b /> },
          ],
          [
            'Discourse',
            'common-voice-info',
            'discourse',
            { discourseLink: <b /> },
          ],
        ].map(([title, descriptionId, imgSrc, props]) => (
          <div className="box">
            <img src={`/img/datasets/${imgSrc}.png`} />
            <div className="dots-and-content">
              <Dots backgroundColor={'var(--lighter-grey)'} space={20} />
              <div className="content">
                <h2>{title}</h2>
                <Localized id={descriptionId as string} {...props}>
                  <p />
                </Localized>
              </div>
            </div>
          </div>
        ))}
      </section>

      <A name={NAV_IDS.other} />
      <section>
        {datasets.map(props => (
          <Dataset {...props} />
        ))}
      </section>

      <A name={NAV_IDS.feedback} />
      <section />
    </div>
  </div>
);
