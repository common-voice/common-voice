import * as React from 'react'
import { useLocalization } from '@fluent/react'

import { CloseIcon } from '../ui/icons'
import VisuallyHidden from '../visually-hidden/visually-hidden'

type Props = {
  selectedItems: string[]
  removeItem: (item: string) => void
}

export const SelectedItemsList: React.FC<Props> = ({
  selectedItems,
  removeItem,
}) => {
  const { l10n } = useLocalization()

  return (
    <div className="selected-items-list">
      {selectedItems.map(item => (
        <div key={`domain-${item}`} className="selected-item">
          <p title={l10n.getString(item)}>{l10n.getString(item)}</p>
          <button
            className="selected-item--button"
            onClick={() => removeItem(item)}
            type="button">
            <VisuallyHidden>Remove {l10n.getString(item)}</VisuallyHidden>
            <CloseIcon black />
          </button>
        </div>
      ))}
    </div>
  )
}
