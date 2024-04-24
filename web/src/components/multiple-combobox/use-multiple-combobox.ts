import { useCallback, useMemo, useState } from 'react'

type UseMultipleComboBoxParams = {
  items: readonly string[]
  selectedItems: string[]
}

export const useMultipleComboBox = ({
  items,
  selectedItems,
}: UseMultipleComboBoxParams) => {
  const [inputValue, setInputValue] = useState('')

  const getFilteredItems = useCallback(
    ({ inputValue }: { inputValue: string }) => {
      return items.filter(
        item =>
          !selectedItems.includes(item) &&
          item.toLowerCase().startsWith(inputValue.toLowerCase())
      )
    },
    [items, selectedItems]
  )

  const multipleComboBoxItems = useMemo(
    () => getFilteredItems({ inputValue }),
    [getFilteredItems, inputValue]
  )

  return {
    multipleComboBoxItems,
    inputValue,
    setInputValue,
  }
}
