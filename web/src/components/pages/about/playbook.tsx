import * as React from 'react';
import { useState, useEffect } from 'react';
import WhatIsLanguage from './playbook-content/playbook-what-is-language';
import HowAddLanguage from './playbook-content/playbook-how-add-language';

import './playbook.css';

interface TabEntry {
  title: string;
  contentComponent: React.ComponentType;
}

const tabs: TabEntry[] = [
  {
    title: 'playbook-what-is-language',
    contentComponent: WhatIsLanguage,
  },
  {
    title: 'playbook-how-add-language',
    contentComponent: HowAddLanguage,
  },
];

const Playbook = React.memo(() => {
  const [activeTab, setActiveTab] = useState(tabs[0].title);

  useEffect(() => {
    // @TODO - figure out active tab based on URL fragment
  });

  const toggleActiveTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <div className="cv-tab-group">
        {tabs.length
          ? tabs.map(tabEntry => {
              return (
                <React.Fragment key={tabEntry.title}>
                  <a
                    href={`#${tabEntry.title}`}
                    className={`cv-tab-title`}
                    onClick={() => setActiveTab(tabEntry.title)}
                    id={`#${tabEntry.title}`}>
                    {tabEntry.title}
                  </a>
                  <div
                    className={`cv-tab-content ${
                      activeTab === tabEntry.title ? 'active' : ''
                    }`}>
                    <tabEntry.contentComponent />
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
