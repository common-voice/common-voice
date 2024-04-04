import * as React from 'react'
import { useCombobox, useMultipleSelection } from 'downshift'
import { Localized, useLocalization } from '@fluent/react'

import { LabeledInput } from '../ui/ui'
import { SelectedItemsList } from './selected-items-list'

import './multiple-combobox.css'

const Input = LabeledInput

type Props = {
  items: string[]
  maxNumberOfSelectedElements?: number
  selectedItems: string[]
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  setSelectedItems: (items: string[]) => void
  inputValue: string
}

export const MultipleCombobox: React.FC<Props> = ({
  items,
  selectedItems,
  setSelectedItems,
  maxNumberOfSelectedElements,
  inputValue,
  setInputValue,
}) => {
  const { l10n } = useLocalization()

  const { getDropdownProps, removeSelectedItem } = useMultipleSelection({
    selectedItems,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          setSelectedItems(newSelectedItems)
          break
        default:
          break
      }
    },
  })

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    openMenu,
  } = useCombobox({
    items,
    inputValue,
    selectedItem: null,
    stateReducer(_, actionAndChanges) {
      const { changes, type } = actionAndChanges

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            inputValue: '',
          }
        case useCombobox.stateChangeTypes.InputClick:
          return {
            ...changes,
            isOpen: true,
          }
        default:
          return changes
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (newSelectedItem) {
            setSelectedItems([...selectedItems, newSelectedItem])
            setInputValue('')
          }
          break
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue)
          break
        default:
          break
      }
    },
  })

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = () => {
    openMenu()
  }

  const handleClick: React.MouseEventHandler<HTMLInputElement> = () => {
    openMenu()
  }

  return (
    <div className="multiple-sentence-domain-select">
      <div>
        <Localized id="sentence-domain-select" attrs={{ label: true }}>
          <Input
            {...getInputProps(
              getDropdownProps({
                preventKeyAction: isOpen,
                onFocus: handleFocus,
                onClick: handleClick,
                disabled: selectedItems.length === maxNumberOfSelectedElements,
              })
            )}
            placeholder={l10n.getString('sentence-domain-select-placeholder')}
            dataTestId="sentence-domain-select"
          />
        </Localized>
      </div>

      <ul {...getMenuProps()} className={isOpen ? 'downshift-open' : ''}>
        {isOpen &&
          items.map((item, index) => (
            <li
              style={
                highlightedIndex === index
                  ? { backgroundColor: 'var(--light-grey)' }
                  : {}
              }
              key={`${item}${index}`}
              {...getItemProps({ item, index })}
              data-testid={item}>
              {l10n.getString(item)}
            </li>
          ))}
      </ul>

      {selectedItems && (
        <SelectedItemsList
          selectedItems={selectedItems}
          removeItem={removeSelectedItem}
        />
      )}
    </div>
  )
}
