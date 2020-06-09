import { Localized } from '@fluent/react';
import * as React from 'react';
import { useState } from 'react';
import { InView } from 'react-intersection-observer';
import URLS from '../../../urls';
import { useLocalizedDiscourseURL } from '../../locale-helpers';
import { Button, LinkButton, StyledLink } from '../../ui/ui';
import Dots from './dots';
import datasets from './other-datasets';

import './resources.css';

const NAV_IDS = {
  getStarted: 'get-started',
  other: 'other-datasets',
  feedback: 'feedback',
};

const Dataset = React.memo(
  ({ color, name, nick, size, url, download, license }: any) => {
    const [collapsed, setCollapsed] = useState(true);
    return (
      <div className="other-dataset box">
        <img src={require(`./images/${nick}.jpg`)} alt="" />
        <div className="banner" style={{ backgroundColor: color }} />
        <div className="dots-and-content">
          <Dots backgroundColor={'var(--lighter-grey)'} space={20} />
          <div className="content">
            <h2>
              <StyledLink href={url} blank>
                {name || (
                  <Localized id={'data-other-' + nick + '-name'}>
                    <span />
                  </Localized>
                )}
              </StyledLink>
            </h2>
            <Localized id={'data-other-' + nick + '-description'}>
              <p />
            </Localized>
            {!collapsed && (
              <ul>
                {[
                  [
                    'cv-license',
                    <Localized id={license.name}>
                      <StyledLink href={license.url}>{license.name}</StyledLink>
                    </Localized>,
                  ],
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
              <Localized id={collapsed ? 'more' : 'close'}>
                <Button
                  onClick={() => setCollapsed(!collapsed)}
                  rounded
                  outline
                />
              </Localized>
              {!collapsed && download && (
                <Localized id="download">
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
);

const Section = React.memo(({ name, onChangeIntersection, ...props }: any) => (
  <InView
    onChange={(isVisible, entry) => {
      const { width, height } = entry.intersectionRect;
      onChangeIntersection(name, width * height);
    }}
    threshold={[0.1, 0.2, 0.3, 0.4, 0.5]}>
    <a id={name} />
    <section {...props} />
  </InView>
));

export default React.memo(() => {
  const [intersections, setIntersections] = useState({});
  const handleIntersectionChange = (name: string, intersection: number) =>
    setIntersections({ ...intersections, [name]: intersection });
  const activeSection = Object.entries(intersections).reduce(
    ([maxId, maxValue], [id, value]) =>
      value > maxValue ? [id, value] : [maxId, maxValue],
    [null, 0]
  )[0];
  const discourseURL = useLocalizedDiscourseURL();

  return (
    <div className="dataset-resources">
      <nav>
        <ul>
          {[
            ['get-started-speech', NAV_IDS.getStarted],
            ['other-datasets', NAV_IDS.other],
            ['feedback-q', NAV_IDS.feedback],
          ].map(([labelId, id]) => (
            <li key={id} className={id == activeSection ? 'active' : ''}>
              <div className="line" />
              <Localized id={labelId} key={labelId}>
                <a href={'#' + id} />
              </Localized>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sections">
        <Section
          name={NAV_IDS.getStarted}
          onChangeIntersection={handleIntersectionChange}
          className="get-started">
          <div key="deepspeech-info" className="box">
            <img src={require(`./images/deepspeech.png`)} />
            <div className="dots-and-content">
              <Dots backgroundColor={'var(--lighter-grey)'} space={20} />
              <div className="content">
                <h2>
                  <StyledLink
                    href="https://discourse.mozilla.org/c/deep-speech"
                    blank>
                    DeepSpeech
                  </StyledLink>
                </h2>
                <Localized
                  id="deepspeech-info"
                  elems={{
                    githubLink: (
                      <StyledLink
                        href="https://github.com/mozilla/DeepSpeech"
                        blank
                      />
                    ),
                    discourseLink: (
                      <StyledLink
                        href="https://discourse.mozilla.org/c/deep-speech"
                        blank
                      />
                    ),
                  }}>
                  <p />
                </Localized>
              </div>
            </div>
          </div>

          <div key="common-voice-info-new" className="box">
            <img src={require(`./images/discourse.png`)} />
            <div className="dots-and-content">
              <Dots backgroundColor={'var(--lighter-grey)'} space={20} />
              <div className="content">
                <h2>
                  <StyledLink href={discourseURL} blank>
                    Discourse
                  </StyledLink>
                </h2>
                <Localized
                  id="common-voice-info-new"
                  elems={{
                    discourseLink: <StyledLink href={discourseURL} blank />,
                  }}>
                  <p />
                </Localized>
              </div>
            </div>
          </div>
        </Section>

        <Section
          name={NAV_IDS.other}
          onChangeIntersection={handleIntersectionChange}
          className="other-datasets">
          {datasets.map(props => (
            <Dataset key={props.nick} {...props} />
          ))}
        </Section>

        <Section
          name={NAV_IDS.feedback}
          onChangeIntersection={handleIntersectionChange}>
          <div className="box feedback">
            <img src={require('./images/feedback.png')} />
            <div className="dots-and-content">
              <Dots backgroundColor={'var(--lighter-grey)'} space={20} />
              <div className="content">
                <div className="described-button">
                  <Localized id="your-feedback">
                    <p />
                  </Localized>
                  <Localized id="go-discourse">
                    <LinkButton href={discourseURL} blank rounded outline />
                  </Localized>
                </div>
                <div className="described-button">
                  <Localized id="missing-language">
                    <p />
                  </Localized>
                  <Localized id="go-languages-page">
                    <LinkButton to={URLS.LANGUAGES} rounded outline />
                  </Localized>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
});
