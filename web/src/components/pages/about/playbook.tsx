import * as React from 'react';
import { useState, useEffect } from 'react';
import { Localized } from '@fluent/react';
import WhatIsLanguage from './playbook-content/what-is-language';
import HowAddLanguage from './playbook-content/how-add-language';

import './playbook.css';

// type TabContentComponentType = React.Component & { title: string };

interface TabEntryType {
  title: string;
  contentComponent: React.ComponentType;
}

// about-playbook-what-is-language = What is a language on Common Voice?
// about-playbook-how-add-language = How do I add a language?
// about-playbook-how-localize = How does site localization work?
// about-playbook-how-add-sentences = How do I add sentences?
// about-playbook-how-record-quality = How do I record a high quality voice clip?
// about-playbook-how-grow-language = How can we effectively grow a language on Common Voice?
// about-playbook-how-validate = How do I know whether to approve a voice clip?
// about-playbook-how-access-dataset = How do I access and use the dataset?
// about-playbook-how-project-governance = How are project decisions made?

const tabs: TabEntryType[] = [
  {
    title: 'what-is-language',
    contentComponent: WhatIsLanguage,
  },
  {
    title: 'how-localize',
    contentComponent: HowAddLanguage,
  },
  {
    title: 'how-add-language',
    contentComponent: WhatIsLanguage, // @TODO
  },
  {
    title: 'how-add-sentences',
    contentComponent: HowAddLanguage, // @TODO
  },
  {
    title: 'how-record-quality',
    contentComponent: WhatIsLanguage, // @TODO
  },
  {
    title: 'how-grow-language',
    contentComponent: WhatIsLanguage, // @TODO
  },
  {
    title: 'how-validate',
    contentComponent: HowAddLanguage, // @TODO
  },
  {
    title: 'how-access-dataset',
    contentComponent: WhatIsLanguage, // @TODO
  },
  {
    title: 'how-project-governance',
    contentComponent: HowAddLanguage, // @TODO
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
