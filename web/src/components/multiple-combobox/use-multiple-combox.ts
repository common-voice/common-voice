import { useMemo, useState } from 'react'

type UseMultipleComboBoxParams = {
  items: readonly string[]
  selectedItems: string[]
}

export const useMultipleComboBox = ({
  items,
  selectedItems,
}: UseMultipleComboBoxParams) => {
  const [inputValue, setInputValue] = useState('')

  const getFilteredItems = ({
    elements,
    selectedItems,
    inputValue,
  }: {
    elements: readonly string[]
    selectedItems: string[]
    inputValue: string
  }) => {
    const lowerCasedInputValue = inputValue.toLowerCase()

    return elements.filter(
      element =>
        !selectedItems.includes(element) &&
        element.toLowerCase().startsWith(lowerCasedInputValue)
    )
  }

  const multipleComboBoxItems = useMemo(
    () => getFilteredItems({ elements: items, selectedItems, inputValue }),
    [selectedItems, inputValue]
  )

  return {
    multipleComboBoxItems,
    inputValue,
    setInputValue,
  }
}
