import { secondsToHours } from './secondsToHours'

describe('secondsToHours', () => {
  test('converts numerical value into hours', () => {
    expect(secondsToHours(3600)).toBe(1)
  })

  test('converts large numerical value into hours', () => {
    expect(secondsToHours(999999999)).toBe(277778)
  })

  test('converts 0 value into 0 hours', () => {
    expect(secondsToHours(0)).toBe(0)
  })

  test('converts -1 value into 0 hours', () => {
    expect(secondsToHours(-1)).toBe(0)
  })

  test('converts -453 value into 0 hours', () => {
    expect(secondsToHours(-453)).toBe(0)
  })

  test('converts 4,560 value into 1.3 hours', () => {
    expect(secondsToHours(4560)).toBe(1.3)
  })

  test('converts 35,640 value into 9.9 hours', () => {
    expect(secondsToHours(35640)).toBe(9.9)
  })

  test('converts 40,320 value into 12 hours', () => {
    expect(secondsToHours(40320)).toBe(12)
  })
})
