/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useMemo, useState } from 'react'
import { useSelect } from 'downshift'
import { useLocalization } from '@fluent/react'
import Fuse from 'fuse.js'

import { CheckMarkGreenIcon } from '../ui/icons'
import { SearchBox } from './search'

import './dropdown.css'

interface LabeledOption {
  code: string
  label: string
}

interface DropDownProps {
  options: string[]
  currentValue?: string
  buttonIcon?: React.ReactNode
  searchBoxLabel?: string
  searchBoxPlaceholder?: string
  searchBoxAriaLabel?: string
  notFoundMessage?: string
  bottomComponent?: React.ReactNode
  onChange: (value: string) => void
}

const DropDown = ({
  options,
  currentValue,
  buttonIcon,
  searchBoxLabel,
  searchBoxPlaceholder,
  searchBoxAriaLabel,
  notFoundMessage,
  bottomComponent,
  onChange,
}: DropDownProps) => {
  const { l10n } = useLocalization()
  const [searchValue, setSearchValue] = useState('')

  const labeledOptions = useMemo(
    () =>
      options.map(code => ({
        code: code,
        label: l10n.getString(code) || code,
      })),
    [options, l10n]
  )

  const fuse = useMemo(() => {
    return new Fuse(labeledOptions, {
      keys: ['label', 'code'],
      threshold: 0.5,
    })
  }, [labeledOptions])

  const filteredItems = useMemo(() => {
    if (!searchValue) {
      return labeledOptions
    }

    return fuse.search(searchValue).map(result => result.item)
  }, [searchValue, labeledOptions, fuse])

  const onSelectedItemChange = ({
    selectedItem,
  }: {
    selectedItem?: LabeledOption | null
  }) => {
    if (selectedItem) {
      onChange(selectedItem.code)
    }
  }

  const {
    isOpen,
    getMenuProps,
    getToggleButtonProps,
    getItemProps,
    closeMenu,
  } = useSelect<LabeledOption>({
    items: filteredItems,
    onSelectedItemChange,
    stateReducer: (state, actionAndChanges) => {
      const { type, changes } = actionAndChanges

      switch (type) {
        case useSelect.stateChangeTypes.ToggleButtonBlur:
          if (state.isOpen) {
            return { ...changes, isOpen: true }
          }
          return changes

        default:
          return changes
      }
    },
    itemToString: item => (item ? item.label : ''),
  })

  return (
    <>
      {isOpen && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div
          className="dropdown-overlay"
          data-testid="dropdown-overlay"
          onClick={() => {
            closeMenu()
            setSearchValue('')
          }}
        />
      )}
      <div className="dropdown-container" data-testid="dropdown-container">
        <button
          {...getToggleButtonProps()}
          aria-label="toggle menu"
          className="toggle-button"
          data-testid="toggle-button">
          {buttonIcon ? buttonIcon : null}
          <p className="language-label">{currentValue}</p>
        </button>
        <div
          className={isOpen ? 'menu-container isopen' : 'menu-container'}
          data-testid="menu-container">
          <SearchBox
            searchBoxLabel={searchBoxLabel}
            searchBoxPlaceholder={searchBoxPlaceholder}
            searchBoxAriaLabel={searchBoxAriaLabel}
            onChange={evt => setSearchValue(evt.target.value)}
            searchValue={searchValue}
          />
          <ul
            className="dropdown-menu"
            {...getMenuProps({ className: 'dropdown-menu' })}
            data-testid="dropdown-menu">
            {isOpen &&
              filteredItems?.map((option, index: number) => (
                <div
                  className={
                    currentValue === option.code
                      ? 'drop-down-item-container selected'
                      : 'drop-down-item-container'
                  }
                  key={option.code}>
                  <li
                    className="dropdown-item"
                    {...getItemProps({ item: option, index })}
                    title={option.label}
                    // tabIndex={0}
                    data-testid={`dropdown-${option.code}`}>
                    {option.label}
                    {currentValue === option.code && (
                      <CheckMarkGreenIcon viewBox="0 0 25 25" />
                    )}
                  </li>
                </div>
              ))}
            {filteredItems.length === 0 && (
              <div className="drop-down-item-container">
                <div className="dropdown-item" data-testid="no-results">
                  {notFoundMessage
                    ? notFoundMessage
                    : l10n.getString('dropdown-no-results')}
                </div>
              </div>
            )}
          </ul>
          {bottomComponent ? bottomComponent : null}
        </div>
      </div>
    </>
  )
}

export default DropDown
