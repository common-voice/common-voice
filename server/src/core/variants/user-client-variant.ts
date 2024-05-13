import * as A from 'fp-ts/Array'
import { Variant } from './variant'
import { pipe } from 'fp-ts/lib/function'

export type UserClientVariant = {
  localeId: number
  variant: Variant
  isPreferredOption: boolean
}

export type IsVariantPreferredOption = (
  localeId: number
) => (userClientVariants: UserClientVariant[]) => boolean
export const isVariantPreferredOption: IsVariantPreferredOption =
  (localeId: number) => (usv: UserClientVariant[]) =>
    pipe(
      usv,
      A.exists(ucv => ucv.localeId === localeId && ucv.isPreferredOption)
    )

export const getPreferredVariantFromList =
  (localeId: number) => (usv: UserClientVariant[]) =>
    pipe(
      usv,
      A.findFirst(ucv => ucv.localeId === localeId && ucv.isPreferredOption)
    )
