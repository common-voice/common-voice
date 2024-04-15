import * as React from 'react'
import { useSelect } from 'downshift'
import { useLocalization } from '@fluent/react'
import classNames from 'classnames'

import { ChevronDown } from '../ui/icons'

import './select.css'

type Props = {
  items: string[]
  selectedItem: string
  setSelectedItem: (item: string) => void
  label: string
  placeHolderText: string
}

export const Select: React.FC<Props> = ({
  items,
  selectedItem,
  setSelectedItem,
  label,
  placeHolderText,
}) => {
  const { l10n } = useLocalization()

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items,
    selectedItem,
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) =>
      setSelectedItem(newSelectedItem),
  })

  return (
    <div className="select">
      <span {...getLabelProps()} className="select-label">
        {label}
      </span>

      <button
        className={classNames('toggle-btn', {
          'is-open': isOpen,
          'item-selected': selectedItem,
        })}
        type="button"
        {...getToggleButtonProps()}
        data-testid="select-toggle-btn">
        <span>
          {selectedItem ? l10n.getString(selectedItem) : placeHolderText}
        </span>
        <ChevronDown />
      </button>

      <ul {...getMenuProps()} className={isOpen ? 'downshift-open' : ''}>
        {isOpen &&
          items.map((item, index) => (
            <li
              style={
                highlightedIndex === index
                  ? { backgroundColor: 'var(--light-grey)' }
                  : {}
              }
              key={`${item}`}
              {...getItemProps({ item, index })}>
              <span>{l10n.getString(item)}</span>
            </li>
          ))}
      </ul>
    </div>
  )
}
