import * as React from 'react'
import { useSelect } from 'downshift'
import classNames from 'classnames'

import {
  LocalizedGetAttribute,
  useAvailableLocales,
  useNativeNameAvailableLocales,
} from '../locale-helpers'
import VisuallyHidden from '../visually-hidden/visually-hidden'
import { AbortContributionModalStatus } from '../../stores/abort-contribution-modal'
import { useAbortContributionModal } from '../../hooks/store-hooks'

import './localization-select.css'

interface Props {
  locale?: string
  userLanguages?: string[]
  onLocaleChange?: (props: string) => void
}


const LocalizationSelectComplex = ({ locale, userLanguages, onLocaleChange }: Props) => {

  function getLocaleWithName(locale: string) {
    return availableLocalesWithNames.find(({ code }) => code === locale)
  }

  const availableLocales = useAvailableLocales()
  let availableLocalesWithNames = useNativeNameAvailableLocales()
  const { abortStatus } = useAbortContributionModal()

  // Get user languages to top of the list
  if (userLanguages) {
    const userLanguagesWithNames = userLanguages.map(lang => getLocaleWithName(lang))
    availableLocalesWithNames = userLanguagesWithNames.concat(availableLocalesWithNames.filter(item => !userLanguages.includes(item.code)))
  }

  const localWithName = getLocaleWithName(locale)
  const initialSelectedItem = localWithName
    ? localWithName.code
    : availableLocales[0]
  const items = availableLocalesWithNames.map(locale => locale.code)

  function onSelectedItemChange({ selectedItem }: { selectedItem: string }) {
    if (selectedItem && selectedItem !== locale) {
      onLocaleChange(selectedItem)
    }
  }

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useSelect({ items, initialSelectedItem, onSelectedItemChange })

  React.useEffect(() => {
    // if the user does not choose to switch in the abort modal
    // set the locale as the selected item
    if (abortStatus === AbortContributionModalStatus.REJECTED) {
      selectItem(locale)
    }
  }, [abortStatus])

  // don't show select if we dont have multiple locales
  if (items.length <= 1) {
    return null
  }

  return (
    <LocalizedGetAttribute id="localization-select" attribute="label">
      {(label: string) => (
        <div
          className={classNames('localization-select with-down-arrow', {
            'localization-select--open': isOpen,
          })}>
          <VisuallyHidden>
            <label {...getLabelProps()}>{label}</label>
          </VisuallyHidden>
          <button className="button" type="button" {...getToggleButtonProps()}>
            {locale}
          </button>
          <div className="list-wrapper">
            <ul {...getMenuProps()}>
              {items.map((item, index) => (
                <div
                  key={item}
                  className={classNames('list-item-wrapper', {
                    highlighted: index === highlightedIndex,
                  })}
                  style={{ borderBottomColor: userLanguages.length > 0 && index === userLanguages.length-1 ? "#333" : "#f3f2f0" }}
                >
                  <li {...getItemProps({ item })}>
                    {userLanguages.includes(item) ? <strong>{getLocaleWithName(item).name}</strong> : getLocaleWithName(item).name}
                  </li>
                  {item === locale && (
                    <img
                      src={require('../../components/ui/icons/checkmark-green.svg')}
                      alt=""
                      width={24}
                      height={24}
                    />
                  )}
                  {userLanguages.length > 0 && index === userLanguages.length ? <hr /> : <></>}
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
    </LocalizedGetAttribute>
  )
}

export default LocalizationSelectComplex
