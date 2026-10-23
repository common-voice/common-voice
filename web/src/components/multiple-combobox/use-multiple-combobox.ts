import { useCallback, useMemo, useState } from 'react'
import { useLocalization } from '@fluent/react'

type UseMultipleComboBoxParams = {
  items: readonly string[]
  selectedItems: string[]
}

export const useMultipleComboBox = ({
  items,
  selectedItems,
}: UseMultipleComboBoxParams) => {
  const { l10n } = useLocalization()
  const [inputValue, setInputValue] = useState('')

  const getFilteredItems = useCallback(
    ({ inputValue }: { inputValue: string }) => {
      return items.filter(
        item =>
          !selectedItems.includes(item) &&
          l10n
            .getString(item)
            .toLowerCase()
            .startsWith(inputValue.toLowerCase())
      )
    },
    [items, selectedItems, l10n]
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
