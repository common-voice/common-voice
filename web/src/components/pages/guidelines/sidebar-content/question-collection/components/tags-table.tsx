import * as React from 'react'
import { Localized } from '@fluent/react'

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
            <code>[laugh]</code>
          </td>
          <td style={cellStyle}>
            <Localized id="tags-laugh-explanation" />
          </td>
        </tr>
        <tr>
          <td style={cellStyle}>
            <code>[disfluency]</code>
          </td>
          <td style={cellStyle}>
            <Localized id="tags-disfluency-explanation" />
          </td>
        </tr>
        <tr>
          <td style={cellStyle}>
            <code>
              <code>[unclear]</code>
            </code>
          </td>
          <td style={cellStyle}>
            <Localized id="tags-unclear-explanation" />
          </td>
        </tr>
        <tr>
          <td style={cellStyle}>
            <code>[noise]</code>
          </td>
          <td style={cellStyle}>
            <Localized id="tags-noise-explanation" />
          </td>
        </tr>
      </tbody>
    </table>
  )
}
