import Nav from './nav';
import * as React from 'react';
import * as cx from 'classnames';
import Partners from './partners';
import { SECTIONS } from './constants';
import HowItWorks from './how-it-works';
import GetInvolved from './get-involved';
import WhyCommonVoice from './why-common-voice';
import useActiveSection from '../../../hooks/use-active-section';

import './about.css';

const About: React.ComponentType = React.memo(() => {
  const activeSection = useActiveSection(Object.values(SECTIONS));

  return (
    <section className="about-main-container">
      {[
        [SECTIONS.WHY_COMMON_VOICE, WhyCommonVoice],
        [
          {
            activeSection: activeSection,
            navType: 'desktop',
          },
          Nav,
        ],
        [SECTIONS.HOW_IT_WORKS, HowItWorks],
        // [SECTIONS.PARTNERS, Partners],
        [SECTIONS.GET_INVOLVED, GetInvolved],
        [
          {
            activeSection: activeSection,
            navType: 'mobile',
          },
          Nav,
        ],
      ].map(([section, SectionComponent]: [string, any], index: number) => {
        if (typeof section === 'object') {
          return <SectionComponent key={`section-${index}`} {...section} />;
        }

        return (
          <section
            id={section}
            key={`section-${section}`}
            className={cx('about-hero', section, {
              active: section === activeSection,
            })}>
            <SectionComponent />
          </section>
        );
      })}
    </section>
  );
});

export default About;
