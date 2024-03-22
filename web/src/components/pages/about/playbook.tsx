import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Localized } from '@fluent/react';
import { Link } from 'react-router-dom';
import { PLAYBOOK, SECTIONS } from './constants';
import WhatIsLanguage from './playbook-content/what-is-language';
import HowAddLanguage from './playbook-content/how-add-language';
import HowLocalize from './playbook-content/how-localize';
import HowAddSentences from './playbook-content/how-add-sentences';
import HowRecordQuality from './playbook-content/how-record-quality';
import HowGrowLanguage from './playbook-content/how-grow-language';
import HowValidate from './playbook-content/how-validate';
import HowAccessDataset from './playbook-content/how-access-dataset';
import HowProjectGovernance from './playbook-content/how-project-governance';
import HowFunded from './playbook-content/how-funded';

import './playbook.css';

interface TabEntryType {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentComponent: React.ComponentType<any> & { getFragment?: any };
}

const tabs: TabEntryType[] = [
  {
    title: PLAYBOOK.WHAT_IS_LANGUAGE,
    contentComponent: WhatIsLanguage,
  },
  {
    title: PLAYBOOK.HOW_ADD_LANGUAGE,
    contentComponent: HowAddLanguage,
  },
  {
    title: PLAYBOOK.HOW_LOCALIZE,
    contentComponent: HowLocalize,
  },
  {
    title: PLAYBOOK.HOW_ADD_SENTENCES,
    contentComponent: HowAddSentences,
  },
  {
    title: PLAYBOOK.HOW_RECORD_QUALITY,
    contentComponent: HowRecordQuality,
  },
  {
    title: PLAYBOOK.HOW_GROW_LANGUAGE,
    contentComponent: HowGrowLanguage,
  },
  {
    title: PLAYBOOK.HOW_VALIDATE,
    contentComponent: HowValidate,
  },
  {
    title: PLAYBOOK.HOW_FUNDED,
    contentComponent: HowFunded,
  },
  {
    title: PLAYBOOK.HOW_ACCESS_DATASET,
    contentComponent: HowAccessDataset,
  },
  {
    title: PLAYBOOK.HOW_PROJECT_GOVERNANCE,
    contentComponent: HowProjectGovernance,
  },
];

const TabEntry = React.memo(
  ({
    tabEntry,
    getFragment,
  }: {
    tabEntry: TabEntryType;
    getFragment?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }) => {
    return (
      <div className="about-playbook-content">
        <h3 className="about-playbook-content__heading">
          <Localized id={`about-playbook-${tabEntry.title}`} />
        </h3>
        <tabEntry.contentComponent getFragment={getFragment} />
      </div>
    );
  }
);

TabEntry.displayName = 'TabEntry';

const Playbook = React.memo(() => {
  const [activeTab, setActiveTab] = useState(tabs[0].title);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.search && location.search.includes('tab=')) {
      const tab = location.search.split('tab=');
      if (tab.length > 1 && Object.values(PLAYBOOK).includes(tab[1])) {
        updateActiveTab(tab[1]);
      }
    }
  });

  const updateActiveTab = (tab: string) => {
    setActiveTab(tab);
    tabsRef.current.scrollIntoView(true);
  };

  const concatTitle = (className: string, tabTitle: string) => {
    const classes = [className];
    if (activeTab === tabTitle) classes.push('active');

    return classes.join(' ');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFragmentLink = (tab: string): React.ReactElement<any> => {
    return (
      <Link
        to={{
          pathname: location.pathname,
          hash: `#${SECTIONS.PLAYBOOK}`,
          search: `?tab=${tab}`,
        }}
        onClick={() => updateActiveTab(tab)}
      />
    ) as React.ReactElement;
  };

  return (
    <>
      <div className="cv-tab-group about-container" ref={tabsRef}>
        {tabs.length
          ? tabs.map(tabEntry => {
              return (
                <React.Fragment key={tabEntry.title}>
                  <div className={concatTitle('cv-tab-title', tabEntry.title)}>
                    <Localized id={`about-playbook-${tabEntry.title}`}>
                      {getFragmentLink(tabEntry.title)}
                    </Localized>
                  </div>
                  <div
                    className={concatTitle('cv-tab-content', tabEntry.title)}>
                    <TabEntry
                      tabEntry={tabEntry}
                      getFragment={getFragmentLink}
                    />
                  </div>
                </React.Fragment>
              );
            })
          : null}
      </div>
    </>
  );
});

Playbook.displayName = 'Playbook';

export default Playbook;
