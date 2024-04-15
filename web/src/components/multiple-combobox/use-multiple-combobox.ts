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

  const getFilteredItems = ({ inputValue }: { inputValue: string }) => {
    return items.filter(
      item =>
        !selectedItems.includes(item) &&
        item.toLowerCase().startsWith(inputValue.toLowerCase())
    )
  }

  const multipleComboBoxItems = useMemo(
    () => getFilteredItems({ inputValue }),
    [selectedItems, inputValue]
  )

  return {
    multipleComboBoxItems,
    inputValue,
    setInputValue,
  }
}
