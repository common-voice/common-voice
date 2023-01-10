import * as React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';

import Nav from './nav';
import { SECTIONS } from './constants';
import HowItWorks from './how-it-works';
import Playbook from './playbook';
import GetInvolved from './get-involved';
import WhyCommonVoice from './why-common-voice';
import Subscribe from '../../email-subscribe-block/subscribe';
import useActiveSection from '../../../hooks/use-active-section';
import Page from '../../ui/page';
import StateTree from '../../../stores/tree';

import './about.css';

interface PropsFromState {
  basketToken?: string;
}

const About: React.FC<PropsFromState> = ({ basketToken }) => {
  const activeSection = useActiveSection(Object.values(SECTIONS));

  return (
    <Page className="about-main-container">
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
        [SECTIONS.SUBSCRIBE, Subscribe],
        [SECTIONS.PLAYBOOK, Playbook],
        [SECTIONS.GET_INVOLVED, GetInvolved],
      ].map(
        (
          [section, SectionComponent]: [string | Record<string, string>, any],
          index: number
        ) => {
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
              {section === SECTIONS.SUBSCRIBE ? (
                <SectionComponent light subscribeText="about-subscribe-text" />
              ) : (
                <SectionComponent basketToken={basketToken} />
              )}
            </section>
          );
        }
      )}
    </Page>
  );
};

About.displayName = 'About';

export default connect<PropsFromState>(({ user }: StateTree) => ({
  basketToken: user.account?.basket_token,
}))(About);
