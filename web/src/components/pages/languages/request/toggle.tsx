import * as React from 'react'
import { useLocalization } from '@fluent/react'

import './toggle.css'

type ToggleProps = {
  label: string
  checked: boolean
  onToggle: (checked: boolean) => void
  disabled: boolean
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, onToggle, disabled }) => {
  const { l10n } = useLocalization()

  const handleToggle = (evt: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(evt.target.checked)
  }

  return (
    <div className="toggle-row">
      <span>{l10n.getString(label)}</span>
      <label className="switch" htmlFor={`toggle-${label}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          id={`toggle-${label}`}
          aria-label={l10n.getString(label)}
          data-testid={label}
          disabled={disabled}
        />
        <span className="slider"></span>
      </label>
    </div>
  )
}

export default Toggle
