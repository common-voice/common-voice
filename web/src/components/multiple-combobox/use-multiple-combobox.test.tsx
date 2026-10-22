import * as React from 'react'
import { FluentBundle, FluentResource } from '@fluent/bundle'
import { LocalizationProvider, ReactLocalization } from '@fluent/react'
import { act, renderHook } from '@testing-library/react-hooks'

import { useMultipleComboBox } from './use-multiple-combobox'

const items = ['general', 'agriculture_food']

const createLocalization = (locale: string, messages: string) => {
  const bundle = new FluentBundle(locale)
  bundle.addResource(new FluentResource(messages))
  return new ReactLocalization([bundle])
}

const persian = createLocalization(
  'fa',
  'general = عمومی\nagriculture_food = کشاورزی و غذا'
)
const english = createLocalization(
  'en',
  'general = General\nagriculture_food = Agriculture and Food'
)

const wrapper: React.FC<{ l10n: ReactLocalization }> = ({ l10n, children }) => (
  <LocalizationProvider l10n={l10n}>{children}</LocalizationProvider>
)

const renderCombobox = (l10n = persian, selectedItems: string[] = []) =>
  renderHook(() => useMultipleComboBox({ items, selectedItems }), {
    wrapper,
    initialProps: { l10n },
  })

describe('useMultipleComboBox', () => {
  it.each(['ع', 'عمومی'])(
    'matches the Persian label for "%s" and returns the item ID',
    input => {
      const { result } = renderCombobox()

      act(() => result.current.setInputValue(input))

      expect(result.current.multipleComboBoxItems).toEqual(['general'])
    }
  )

  it('matches English labels case-insensitively', () => {
    const { result } = renderCombobox(english)

    act(() => result.current.setInputValue('gE'))

    expect(result.current.multipleComboBoxItems).toEqual(['general'])
  })

  it('returns all unselected items for an empty query', () => {
    const { result } = renderCombobox(persian, ['general'])

    expect(result.current.multipleComboBoxItems).toEqual(['agriculture_food'])
  })

  it.each(['ناموجود', 'G', 'مومی'])(
    'excludes items whose displayed label does not start with "%s"',
    input => {
      const { result } = renderCombobox()

      act(() => result.current.setInputValue(input))

      expect(result.current.multipleComboBoxItems).toEqual([])
    }
  )

  it('excludes selected items even when their labels match', () => {
    const { result } = renderCombobox(persian, ['general'])

    act(() => result.current.setInputValue('ع'))

    expect(result.current.multipleComboBoxItems).toEqual([])
  })

  it('updates matches when the localization changes', () => {
    const { result, rerender } = renderCombobox(english)

    act(() => result.current.setInputValue('ع'))
    expect(result.current.multipleComboBoxItems).toEqual([])

    rerender({ l10n: persian })
    expect(result.current.multipleComboBoxItems).toEqual(['general'])
  })
})
