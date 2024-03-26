import * as React from 'react'
import { useCombobox, useMultipleSelection } from 'downshift'
import { Localized } from '@fluent/react'

import { LabeledInput } from '../ui/ui'
import { SelectedItemsList } from './selected-items-list'

import './multiple-combobox.css'

export type MultipleComboBoxItem = { id: string; name: string }

// TODO: move this to a hook
const getFilteredItems = ({
  elements,
  selectedItems,
  inputValue,
}: {
  elements: MultipleComboBoxItem[]
  selectedItems: MultipleComboBoxItem[]
  inputValue: string
}) => {
  const lowerCasedInputValue = inputValue.toLowerCase()

  return elements.filter(
    element =>
      !selectedItems.includes(element) &&
      element.name.toLowerCase().startsWith(lowerCasedInputValue)
  )
}

type Props = {
  elements: MultipleComboBoxItem[]
  maxNumberOfSelectedElements?: number
}

// TODO: can we fix the any
const Input = LabeledInput as any

export const MultipleCombobox: React.FC<Props> = ({
  elements,
  maxNumberOfSelectedElements,
}) => {
  const [inputValue, setInputValue] = React.useState('')
  const [selectedItems, setSelectedItems] = React.useState<
    MultipleComboBoxItem[]
  >([])

  const items = React.useMemo(
    () => getFilteredItems({ elements, selectedItems, inputValue }),
    [selectedItems, inputValue]
  )

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
    stateReducer(state, actionAndChanges) {
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
          setSelectedItems([...selectedItems, newSelectedItem])

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
          />
        </Localized>
      </div>

      <ul {...getMenuProps()} className={isOpen ? 'downshift-open' : ''}>
        {isOpen &&
          items.map((item, index) => (
            <li
              style={
                highlightedIndex === index ? { backgroundColor: '#bde4ff' } : {}
              }
              key={`${item}${index}`}
              {...getItemProps({ item, index })}>
              {item.name}
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
