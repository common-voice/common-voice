import * as React from 'react'
import { Localized, useLocalization } from '@fluent/react'

const tableStyle: React.CSSProperties = {
  border: '1px solid',
  borderCollapse: 'collapse',
  marginBlockEnd: '16px',
}

const cellStyle: React.CSSProperties = {
  border: '1px solid',
  padding: '10px',
}

export const TagsTable = () => {
  const { l10n } = useLocalization()

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <Localized id="tags-table-header-1">
            <th style={cellStyle} />
          </Localized>
          <Localized id="tags-table-header-2">
            <th style={cellStyle} />
          </Localized>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={cellStyle}>
            <code>[{l10n.getString('laugh')}]</code>
          </td>
          <td style={cellStyle}>
            <Localized id="tags-laugh-explanation" />
          </td>
        </tr>
        <tr>
          <td style={cellStyle}>
            <code>[{l10n.getString('disfluency')}]</code>
          </td>
          <td style={cellStyle}>
            <Localized id="tags-disfluency-explanation" />
          </td>
        </tr>
        <tr>
          <td style={cellStyle}>
            <code>
              <code>[{l10n.getString('unclear')}]</code>
            </code>
          </td>
          <td style={cellStyle}>
            <Localized id="tags-unclear-explanation" />
          </td>
        </tr>
        <tr>
          <td style={cellStyle}>
            <code>[{l10n.getString('noise')}]</code>
          </td>
          <td style={cellStyle}>
            <Localized id="tags-noise-explanation" />
          </td>
        </tr>
      </tbody>
    </table>
  )
}
