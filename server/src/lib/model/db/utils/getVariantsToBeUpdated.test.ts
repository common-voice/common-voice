import { UserVariant } from 'common'
import { getVariantsToBeUpdated } from './getVariantsToBeUpdated'

describe('Test getVariantsToBeUpdated', () => {
  it('should return correct list of variants to be updated', () => {
    const requestedVariants: UserVariant[] = [
      { id: 1, name: 'a', token: 'a', is_preferred_option: false },
      { id: 2, name: 'b', token: 'b', is_preferred_option: true },
      { id: 3, name: 'c', token: 'c', is_preferred_option: false },
    ]
    const savedVariants: UserVariant[] = [
      { id: 1, name: 'a', token: 'a', is_preferred_option: true },
      { id: 2, name: 'b', token: 'b', is_preferred_option: false },
      { id: 3, name: 'c', token: 'c', is_preferred_option: false },
    ]

    const variantsToBeUpdated = getVariantsToBeUpdated(
      requestedVariants,
      savedVariants
    )

    expect(variantsToBeUpdated).toEqual([
      { id: 1, name: 'a', token: 'a', is_preferred_option: false },
      { id: 2, name: 'b', token: 'b', is_preferred_option: true },
    ])
  })

  it('should return empty list of variants to be updated', () => {
    const requestedVariants: UserVariant[] = [
      { id: 1, name: 'a', token: 'a', is_preferred_option: true },
      { id: 2, name: 'b', token: 'b', is_preferred_option: true },
      { id: 3, name: 'c', token: 'c', is_preferred_option: false },
    ]
    const savedVariants: UserVariant[] = [
      { id: 1, name: 'a', token: 'a', is_preferred_option: true },
      { id: 2, name: 'b', token: 'b', is_preferred_option: true },
      { id: 3, name: 'c', token: 'c', is_preferred_option: false },
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
