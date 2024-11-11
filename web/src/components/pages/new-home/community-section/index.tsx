import React, { useState } from 'react'
import { Localized } from '@fluent/react'

import { TextButton } from '../../../ui/ui'

import './community-section.css'
import classNames from 'classnames'

import PlusIcon from '../../../../components/ui/icons/plus.svg'
import CloseIcon from './assets/close.svg'

interface Section {
  title: string
  content: string
  image: string
}

const sections: Section[] = [
  {
    title: 'Join Discord Community',
    content:
      'Participate in language community discussions, ask questions, and learn about upcoming events and talks.',
    image: '/path-to-discord-image.jpg', // Placeholder for image URL
  },
  {
    title: 'Find us on Matrix',
    content: 'Information about joining on Matrix.',
    image: '', // Placeholder for image URL
  },
  {
    title: 'Ask Mozilla to share your events',
    content: 'Details about sharing events with Mozilla.',
    image: '', // Placeholder for image URL
  },
  {
    title: 'Download your contribution certificate',
    content: 'Instructions for downloading your certificate.',
    image: '', // Placeholder for image URL
  },
  {
    title: 'Contribute on Github',
    content: 'Information about contributing on GitHub.',
    image: '', // Placeholder for image URL
  },
]

export const CommunitySection: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null)

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
                  {section.title}
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
                    <p>{section.content}</p>
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
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
