import * as React from 'react';
import { useState, useEffect } from 'react';
import { Localized } from '@fluent/react';
import { PLAYBOOK } from './constants';
import WhatIsLanguage from './playbook-content/what-is-language';
import HowAddLanguage from './playbook-content/how-add-language';
import HowLocalize from './playbook-content/how-localize';
import HowAddSentences from './playbook-content/how-add-sentences';
import HowRecordQuality from './playbook-content/how-record-quality';
import HowGrowLanguage from './playbook-content/how-grow-language';
import HowValidate from './playbook-content/how-validate';
import HowAccessDataset from './playbook-content/how-access-dataset';
import HowProjectGovernance from './playbook-content/how-project-governance';

import './playbook.css';

interface TabEntryType {
  title: string;
  contentComponent: React.ComponentType;
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
    title: PLAYBOOK.HOW_ACCESS_DATASET,
    contentComponent: HowAccessDataset,
  },
  {
    title: PLAYBOOK.HOW_PROJECT_GOVERNANCE,
    contentComponent: HowProjectGovernance,
  },
];

const TabEntry = React.memo(
  ({ tabEntry, ...props }: { tabEntry: TabEntryType }) => {
    return (
      <div className="about-playbook-content">
        <Localized id={`about-playbook-${tabEntry.title}`}>
          <h2 />
        </Localized>
        <tabEntry.contentComponent />
      </div>
    );
  }
);

const Playbook = React.memo(() => {
  const [activeTab, setActiveTab] = useState(tabs[0].title);

  useEffect(() => {
    // @TODO - figure out active tab based on URL fragment
  });

  const toggleActiveTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  const concatTitle = (className: string, tabTitle: string) => {
    const classes = [className];
    if (activeTab === tabTitle) classes.push('active');

    return classes.join(' ');
  };

  return (
    <>
      <div className="cv-tab-group about-container">
        {tabs.length
          ? tabs.map(tabEntry => {
              return (
                <React.Fragment key={tabEntry.title}>
                  <div className={concatTitle('cv-tab-title', tabEntry.title)}>
                    <Localized id={`about-playbook-${tabEntry.title}`}>
                      <a
                        href={`#${tabEntry.title}`}
                        onClick={() => setActiveTab(tabEntry.title)}
                        id={`#${tabEntry.title}`}
                      />
                    </Localized>
                  </div>
                  <div
                    className={concatTitle('cv-tab-content', tabEntry.title)}>
                    <TabEntry tabEntry={tabEntry} />
                  </div>
                </React.Fragment>
              );
            })
          : null}
      </div>
    </>
  );
});

export default Playbook;
