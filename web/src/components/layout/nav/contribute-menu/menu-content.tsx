import * as React from 'react'
import { Localized, WithLocalizationProps } from '@fluent/react'

import { ContributeMenuItem } from '.'
import { MenuItemRenderer } from './menu-item-renderer'

type Props = {
  contributeMenuItems: ContributeMenuItem[]
  isUserLoggedIn: boolean
  isLocaleContributable: boolean
  toggleMenu?: () => void
} & WithLocalizationProps

export const MenuContent = ({
  contributeMenuItems,
  isUserLoggedIn,
  isLocaleContributable,
  getString,
  toggleMenu,
}: Props) => {
  const isItemVisible = (item: ContributeMenuItem) =>
    (item.requiresAuth && isUserLoggedIn) || !item.requiresAuth

  const visibleMenuItems = contributeMenuItems.filter(isItemVisible)

  const scriptedSpeechItems = visibleMenuItems.filter(
    item => item.type === 'scripted'
  )
  const spontaneousSpeechItems = visibleMenuItems.filter(
    item => item.type === 'spontaneous'
  )
  const generalItems = visibleMenuItems.filter(item => item.type === 'general')

  const hasGeneralItems = generalItems.length > 0

  return (
    <div className="content-container">
      <div className="contribution-items-container">
        {scriptedSpeechItems.length > 0 && (
          <>
            <Localized id="scripted-speech">
              <p className="content-title" />
            </Localized>
            <ul className="scripted-speech-list">
              {scriptedSpeechItems.map(item => (
                <MenuItemRenderer
                  key={item.localizedId}
                  item={item}
                  toggleMenu={toggleMenu}
                  getString={getString}
                  isLocaleContributable={isLocaleContributable}
                />
              ))}
            </ul>
          </>
        )}

        {spontaneousSpeechItems.length > 0 && (
          <>
            <Localized id="spontaneous-speech">
              <p className="content-title spontaneous" />
            </Localized>
            <ul className="spontaneous-speech-list">
              {spontaneousSpeechItems.map(item => (
                <MenuItemRenderer
                  key={item.localizedId}
                  item={item}
                  toggleMenu={toggleMenu}
                  getString={getString}
                  isLocaleContributable={isLocaleContributable}
                />
              ))}
            </ul>
          </>
        )}
      </div>

      {hasGeneralItems && (
        <ul>
          {generalItems.map(item => (
            <MenuItemRenderer
              key={item.localizedId}
              item={item}
              toggleMenu={toggleMenu}
              getString={getString}
              isLocaleContributable={isLocaleContributable}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
