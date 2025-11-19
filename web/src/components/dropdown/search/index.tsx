import React from 'react'

import { SearchIcon } from '../../ui/icons'

import './search.css'
import { useLocalization } from '@fluent/react'

type Props = {
  searchBoxLabel?: string
  searchBoxPlaceholder?: string
  searchBoxAriaLabel?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  searchValue: string
}

export const SearchBox: React.FC<Props> = ({
  searchBoxLabel,
  searchBoxPlaceholder,
  searchBoxAriaLabel,
  onChange,
  searchValue,
}) => {
  const { l10n } = useLocalization()
  return (
    <div className="search-container">
      <p className="search-label">
        {searchBoxLabel
          ? searchBoxLabel
          : l10n.getString('searchbox-default-label')}
      </p>
      <div className="search-input-wrapper">
        <SearchIcon className="search-icon" aria-hidden="true" />
        <input
          type="text"
          className="search-input"
          data-testid="search-input"
          placeholder={
            searchBoxPlaceholder
              ? searchBoxPlaceholder
              : l10n.getString('searchbox-default-placeholder')
          }
          aria-label={
            searchBoxAriaLabel
              ? searchBoxAriaLabel
              : l10n.getString('searchbox-default-aria-label')
          }
          onChange={onChange}
          value={searchValue}
        />
      </div>
    </div>
  )
}
