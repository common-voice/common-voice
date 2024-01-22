import * as React from 'react'
import classNames from 'classnames'
import { Localized } from '@fluent/react'
import { RouteComponentProps, withRouter } from 'react-router'

import { TextButton } from '../../../ui/ui'
import { ChevronDown } from '../../../ui/icons'
import ContributeMenuContent from '../contribute-menu-content'

import './contribute-menu.css'

interface ContributeMenuProps extends RouteComponentProps {
  showMenu: boolean
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
  showMobileMenu: boolean
  toggleMobileMenuVisible: () => void
  isContributionPageActive: boolean
  isUserLoggedIn: boolean
}

const ContributeMenu: React.FC<ContributeMenuProps> = ({
  showMenu,
  setShowMenu,
  showMobileMenu,
  toggleMobileMenuVisible,
  isContributionPageActive,
  location,
  isUserLoggedIn,
}) => {
  const handleMouseEnter = () => {
    if (!isContributionPageActive) {
      setShowMenu(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isContributionPageActive) {
      setShowMenu(false)
    }
  }

  return (
    <div className="contribute-wrapper">
      <div id="contribute-btn-wrapper">
        <Localized id="contribute">
          <TextButton
            className={classNames('contribute-btn', {
              'contribution-page-active': isContributionPageActive,
            })}
            onClick={toggleMobileMenuVisible}
          />
        </Localized>
        {!isContributionPageActive && (
          <ChevronDown
            className={classNames({ 'rotate-180': showMobileMenu })}
            onClick={toggleMobileMenuVisible}
          />
        )}
      </div>
      <div
        className={classNames('contribute-menu', {
          active: showMenu,
          'contribution-page-active': isContributionPageActive,
        })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid="contribute-menu">
        <div
          className={classNames('contribute-links-wrapper', {
            'show-border': isContributionPageActive,
          })}>
          <p className="nav-link-item">
            <Localized id="contribute" />
          </p>
          {!isContributionPageActive && (
            <ChevronDown className={classNames({ 'rotate-180': showMenu })} />
          )}
        </div>
        {(showMobileMenu || isContributionPageActive) && (
          <div
            className="menu-wrapper-mobile"
            data-testid="contribute-mobile-menu">
            <ContributeMenuContent
              pathname={location.pathname}
              className="mobile-menu-list"
              isUserLoggedIn={isUserLoggedIn}
            />
          </div>
        )}
        <div className="menu-wrapper" data-testid="menu-wrapper">
          <div className="menu">
            <ContributeMenuContent
              className="menu-list"
              isUserLoggedIn={isUserLoggedIn}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(ContributeMenu)
