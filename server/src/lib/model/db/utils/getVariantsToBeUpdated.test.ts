import { UserVariant } from 'common'
import { getVariantsToBeUpdated } from './getVariantsToBeUpdated'

describe('Test getVariantsToBeUpdated', () => {
  it('should return correct list of variants to be updated', () => {
    const requestedVariants: UserVariant[] = [
      {
        id: 1,
        name: 'a',
        tag: 'a',
        is_preferred_option: false,
        locale: 'locale-a',
      },
      {
        id: 2,
        name: 'b',
        tag: 'b',
        is_preferred_option: true,
        locale: 'locale-b',
      },
      {
        id: 3,
        name: 'c',
        tag: 'c',
        is_preferred_option: false,
        locale: 'locale-c',
      },
    ]
    const savedVariants: UserVariant[] = [
      {
        id: 1,
        name: 'a',
        tag: 'a',
        is_preferred_option: true,
        locale: 'locale-a',
      },
      {
        id: 2,
        name: 'b',
        tag: 'b',
        is_preferred_option: false,
        locale: 'locale-b',
      },
      {
        id: 3,
        name: 'c',
        tag: 'c',
        is_preferred_option: false,
        locale: 'locale-c',
      },
    ]

    const variantsToBeUpdated = getVariantsToBeUpdated(
      requestedVariants,
      savedVariants
    )

    expect(variantsToBeUpdated).toEqual([
      {
        id: 1,
        name: 'a',
        tag: 'a',
        is_preferred_option: false,
        locale: 'locale-a',
      },
      {
        id: 2,
        name: 'b',
        tag: 'b',
        is_preferred_option: true,
        locale: 'locale-b',
      },
    ])
  })

  it('should return empty list of variants to be updated', () => {
    const requestedVariants: UserVariant[] = [
      {
        id: 1,
        name: 'a',
        tag: 'a',
        is_preferred_option: true,
        locale: 'locale-a',
      },
      {
        id: 2,
        name: 'b',
        tag: 'b',
        is_preferred_option: true,
        locale: 'locale-b',
      },
      {
        id: 3,
        name: 'c',
        tag: 'c',
        is_preferred_option: false,
        locale: 'locale-c',
      },
    ]
    const savedVariants: UserVariant[] = [
      {
        id: 1,
        name: 'a',
        tag: 'a',
        is_preferred_option: true,
        locale: 'locale-a',
      },
      {
        id: 2,
        name: 'b',
        tag: 'b',
        is_preferred_option: true,
        locale: 'locale-b',
      },
      {
        id: 3,
        name: 'c',
        tag: 'c',
        is_preferred_option: false,
        locale: 'locale-c',
      },
    ]

    const variantsToBeUpdated = getVariantsToBeUpdated(
      requestedVariants,
      savedVariants
    )

    const emptyDifference = getVariantsToBeUpdated([], [])
    const noRequestedVariants = getVariantsToBeUpdated([], savedVariants)
    const noSavedVariants = getVariantsToBeUpdated(requestedVariants, [])

    expect(variantsToBeUpdated).toEqual([])
    expect(emptyDifference).toEqual([])
    expect(noRequestedVariants).toEqual([])
    expect(noSavedVariants).toEqual([])
  })
})
