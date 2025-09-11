import React, { useState } from 'react'
import { Localized, useLocalization } from '@fluent/react'
import classNames from 'classnames'

import { sections } from './sections'

import { TextButton } from '../../../ui/ui'

import CloseIcon from './assets/close.svg'

import PlusIcon from '../../../../components/ui/icons/plus.svg'

import './community-section.css'

export const CommunitySection: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(0)
  const { l10n } = useLocalization()

  const handleToggle = (index: number) => {
    setActiveSection(activeSection === index ? null : index)
  }

  return (
    <section className="community-section">
      <div className="community-section-container">
        <Localized id="community-section-title">
          <h1 className="title" />
        </Localized>
        <div className="pane-container">
          <div className="left-pane">
            {sections.map((section, index) => (
              <div key={index} className="section">
                <TextButton
                  className={classNames('section-header', {
                    active: activeSection === index,
                  })}
                  onClick={() => handleToggle(index)}>
                  {l10n.getString(section.title)}
                  <span className="toggle-icon">
                    {activeSection === index ? (
                      <img src={CloseIcon} alt="close icon" />
                    ) : (
                      <img src={PlusIcon} alt="open icon" className="open" />
                    )}
                  </span>
                </TextButton>
                {activeSection === index && (
                  <div className="section-content">
                    <p>{l10n.getString(section.content)}</p>
                    <div>
                      {section.actions.map((SectionAction, inx) => (
                        <SectionAction key={inx} />
                      ))}
                    </div>
                    <img
                      src={sections[activeSection].image}
                      alt=""
                      className="section-image"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="right-pane">
            {activeSection !== null && (
              <img
                src={sections[activeSection].image}
                alt="Community Section"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
