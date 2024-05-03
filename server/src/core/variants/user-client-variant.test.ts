import {
  UserClientVariant,
  isVariantPreferredOption,
} from './user-client-variant'

describe('User client variant', () => {
  const availableUserClientVariants: UserClientVariant[] = [
    {
      localeId: 1,
      variant: {
        id: 123,
        locale: 'ca',
        name: 'Central',
        tag: 'ca-central',
      },
      isPreferredOption: true,
    },
    {
      localeId: 35,
      variant: {
        id: 3,
        locale: 'cy',
        name: 'South-Eastern Welsh',
        tag: 'cy-southeas',
      },
      isPreferredOption: false,
    },
    {
      localeId: 172,
      variant: {
        id: 8,
        locale: 'sw',
        name: 'Kipemba (TZ) - Southern dialect',
        tag: 'sw-kipemba',
      },
      isPreferredOption: true,
    },
  ]
  test.each([
    {
      localeId: 1,
      userClientVariants: availableUserClientVariants,
      expectedResult: true,
    },
    {
      localeId: 172,
      userClientVariants: availableUserClientVariants,
      expectedResult: true,
    },
    {
      localeId: 35,
      userClientVariants: availableUserClientVariants,
      expectedResult: false,
    },
    {
      localeId: 1337,
      userClientVariants: availableUserClientVariants,
      expectedResult: false,
    },
    { localeId: 123, userClientVariants: [], expectedResult: false },
  ])(
    'for the given user client variants and localeId $localeId it should return $expectedResult',
    ({ localeId, userClientVariants, expectedResult }) =>
      expect(isVariantPreferredOption(localeId)(userClientVariants)).toBe(
        expectedResult
      )
  )
})
