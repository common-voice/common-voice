import React from 'react'
import './toggle.css'

type ToggleProps = {
  label: string
  checked: boolean
  onToggle: (checked: boolean) => void
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, onToggle }) => {
  const handleToggle = (evt: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(evt.target.checked)
  }

  return (
    <div className="toggle-row">
      <span>{label}</span>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={handleToggle} />
        <span className="slider"></span>
      </label>
    </div>
  )
}

export default Toggle
