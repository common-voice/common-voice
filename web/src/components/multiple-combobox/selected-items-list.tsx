import React from 'react'

import { MultipleComboBoxItem } from '.'
import { CloseIcon } from '../ui/icons'
import VisuallyHidden from '../visually-hidden/visually-hidden'

type Props = {
  selectedItems: MultipleComboBoxItem[]
  removeItem: (item: MultipleComboBoxItem) => void
}

export const SelectedItemsList: React.FC<Props> = ({
  selectedItems,
  removeItem,
}) => {
  return (
    <div className="selected-accents-list">
      {selectedItems.map(item => (
        <span key={`accent-${item.id}`} className="selected-accent">
          {item.name}
          <button
            className="selected-accent--button"
            onClick={() => removeItem(item)}
            type="button">
            <VisuallyHidden>Remove {item.name}</VisuallyHidden>
            <CloseIcon black />
          </button>
        </span>
      ))}
    </div>
  )
}
