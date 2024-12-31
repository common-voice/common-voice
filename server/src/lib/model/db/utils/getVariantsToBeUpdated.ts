import { UserVariant } from 'common'

const haveSamePreference = (a: UserVariant, b: UserVariant) => {
  return a.is_preferred_option === b.is_preferred_option
}
export const getVariantsToBeUpdated = (
  requestedVariants: UserVariant[],
  savedVariants: UserVariant[]
): UserVariant[] => {
  const variantsToBeUpdated = requestedVariants.filter(requestedVariant => {
    const savedVariant = savedVariants.find(
      savedVariant => savedVariant.id === requestedVariant.id
    )
    if (!savedVariant) return false

    return !haveSamePreference(requestedVariant, savedVariant)
  })
  return variantsToBeUpdated
}
