import * as React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import { ChevronDown } from '../../../ui/icons'

type Props = {
  sectionId: string
  items?: { label: string }[]
  selectedTabOption: string
  setSelectedTabOption: (option: string) => void
  selectedSection: string
  setSelectedSection: (section: string) => void
  tabSearchParam: string
}

export const SidebarNavSection = ({
  sectionId,
  items,
  selectedTabOption,
  setSelectedTabOption,
  selectedSection,
  setSelectedSection,
  tabSearchParam,
}: Props) => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <div className="sidebar-nav-section-btn-wrapper">
        <Localized id={sectionId}>
          <button
            className={classNames({
              'active-tab-option': selectedTabOption === sectionId,
            })}
            onClick={() => {
              setSelectedTabOption(sectionId)
              setVisible(!visible)
            }}
          />
        </Localized>
        {items?.length > 0 && (
          <ChevronDown
            className={classNames('chevron', { 'rotate-180': visible })}
          />
        )}
      </div>
      {visible && (
        <ul>
          {items?.map(item => (
            <li key={item.label}>
              <div className="line" />
              <Link
                to={{
                  pathname: location.pathname,
                  hash: `#${item.label}`,
                  search: tabSearchParam,
                }}
                className={classNames({
                  'selected-option': item.label === selectedSection,
                })}
                onClick={() => {
                  if (selectedTabOption !== sectionId) {
                    setSelectedTabOption(sectionId)
                  }
                  setSelectedSection(item.label)
                }}>
                <Localized id={item.label} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
