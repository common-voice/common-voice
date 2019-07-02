import { Localized } from 'fluent-react/compat';
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
};

const Dataset = React.memo(
  ({ color, name, nick, size, url, download, license }: any) => {
    const [collapsed, setCollapsed] = useState(true);
    return (
      <div className="other-dataset box">
        <div className="banner" style={{ backgroundColor: color }} />
        <img src={require(`./images/${nick}.png`)} alt="" />
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
                {[].map(([label, value]) => (
                  <li key={label as any}>
                    <Localized id={label as any}>
                      <div className="label" />
                    </Localized>
                    <div className="value">{value}</div>
                  </li>
                ))}
              </ul>
            )}
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
          {[
            [
              'DeepSpeech',
              'deepspeech-info',
              'deepspeech',
              {
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
              },
            ],
            [
              'Kaldi',
              'common-voice-info-new',
              'discourse',
              {
                discourseLink: (
                  <StyledLink href="http://kaldi-asr.org/" blank />
                ),
                githubLink: <StyledLink href="https://tal.ru.is/" blank />,
              },
            ],
          ].map(([title, descriptionId, imgSrc, props]) => (
            <div className="box">
              <img src={require(`./images/${imgSrc}.png`)} />
              <div className="dots-and-content">
                <Dots backgroundColor={'var(--lighter-grey)'} space={20} />
                <div className="content">
                  <h2>
                    {React.cloneElement((props as any).discourseLink, {
                      children: title,
                    })}
                  </h2>
                  <Localized id={descriptionId as string} {...props}>
                    <p />
                  </Localized>
                </div>
              </div>
            </div>
          ))}
        </Section>

        <Section
          name={NAV_IDS.other}
          onChangeIntersection={handleIntersectionChange}
          className="other-datasets">
          {datasets.map(props => (
            <Dataset key={props.nick} {...props} />
          ))}
        </Section>
      </div>
    </div>
  );
});
