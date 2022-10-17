import { Localized } from '@fluent/react';
import * as React from 'react';
import { useState } from 'react';
import { InView } from 'react-intersection-observer';
import URLS from '../../../urls';
import { useLocalizedDiscourseURL } from '../../locale-helpers';
import { Button, LinkButton, StyledLink } from '../../ui/ui';
import Dots from './dots';
import datasets from './other-datasets';
import getStartedResource from './get-started';

import './resources.css';

const NAV_IDS = {
  getStarted: 'get-started',
  other: 'other-datasets',
  feedback: 'feedback',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GetStartedResource = React.memo((props: any) => {
  const { title, id, trademark, titleLocalized, image, url, description } =
    props;

  Object.keys(description.linkElems).forEach(el => {
    description.linkElems[el] = (
      <StyledLink href={description.linkElems[el]} blank />
    );
  });

  return (
    <div key={id} className="box">
      <img src={require(`${image}`)} alt="" role="presentation" />
      <div className="dots-and-content">
        <Dots backgroundColor={'var(--lighter-grey)'} space={20} />
        <div className="content">
          <h2>
            <StyledLink href={url} blank>
              {titleLocalized ? <Localized id={id} /> : title}
            </StyledLink>
            {trademark ? trademark : ''}
          </h2>
          <Localized
            id={description.localizationId}
            elems={description.linkElems}>
            <p />
          </Localized>
        </div>
      </div>
    </div>
  );
});

GetStartedResource.displayName = 'GetStartedResource';

const Dataset = React.memo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ color, name, id, url, download, license }: any) => {
    const [collapsed, setCollapsed] = useState(true);
    return (
      <div className="other-dataset box">
        <img src={require(`./images/${id}.jpg`)} alt="" role="presentation" />
        <div className="dataset-banner" style={{ backgroundColor: color }} />
        <div className="dots-and-content">
          <Dots backgroundColor={'var(--lighter-grey)'} space={20} />
          <div className="content">
            <h2>
              <StyledLink href={url} blank>
                {name || <Localized id={`data-other-${id}-name`} />}
              </StyledLink>
            </h2>
            <p>
              <Localized id={`data-other-${id}-description`} />
            </p>
            {!collapsed && (
              <ul>
                <li>
                  <Localized id="cv-license">
                    <div className="label" />
                  </Localized>
                  <div className="value">
                    <Localized id={license.name}>
                      <StyledLink href={license.url}>{license.name}</StyledLink>
                    </Localized>
                  </div>
                </li>

                <li>
                  <Localized id="size">
                    <div className="label" />
                  </Localized>
                  <div className="value">
                    <Localized id="size-gigabyte" />
                  </div>
                </li>
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

Dataset.displayName = 'Dataset';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Section = ({ name, onChangeIntersection, ...props }: any) => (
  <InView
    onChange={(_isVisible, entry) => {
      const { width, height } = entry.intersectionRect;
      onChangeIntersection(name, width * height);
    }}
    threshold={[0.1, 0.2, 0.3, 0.4, 0.5]}>
    <section id={name} {...props} />
  </InView>
);

Section.displayName = 'Section';

const Resources = () => {
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
              <a href={`#${id}`}>
                <Localized id={labelId} />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sections">
        <Section
          name={NAV_IDS.getStarted}
          onChangeIntersection={handleIntersectionChange}
          className="get-started">
          {getStartedResource.map(resource => (
            <GetStartedResource key={resource.id} {...resource} />
          ))}
        </Section>

        <Section
          name={NAV_IDS.other}
          onChangeIntersection={handleIntersectionChange}
          className="other-datasets">
          {datasets.map(dataset => (
            <Dataset key={dataset.id} {...dataset} />
          ))}
        </Section>

        <Section
          name={NAV_IDS.feedback}
          onChangeIntersection={handleIntersectionChange}>
          <div className="box feedback">
            <img
              src={require('./images/feedback.png')}
              alt=""
              role="presentation"
            />
            <div className="dots-and-content">
              <Dots backgroundColor={'var(--lighter-grey)'} space={20} />
              <div className="content">
                <div className="described-button">
                  <p>
                    <Localized id="your-feedback" />
                  </p>

                  <LinkButton href={discourseURL} blank rounded outline>
                    <Localized id="go-discourse" />
                  </LinkButton>
                </div>
                <div className="described-button">
                  <p>
                    <Localized id="missing-language" />
                  </p>
                  <LinkButton to={URLS.LANGUAGES} rounded outline>
                    <Localized id="go-languages-page" />
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

Resources.displayName = 'Resources';

export default Resources;
