import { secondsToHours } from './secondsToHours';

describe('secondsToHours', () => {
  test('converts numerical value into hours', () => {
    expect(secondsToHours(3600)).toBe(1);
  });

  test('converts large numerical value into hours', () => {
    expect(secondsToHours(999999999)).toBe(277778);
  });

  test('converts 0 value into 0 hours', () => {
    expect(secondsToHours(0)).toBe(0);
  });

  test('converts -1 value into 0 hours', () => {
    expect(secondsToHours(-1)).toBe(0);
  });

  test('converts -453 value into 0 hours', () => {
    expect(secondsToHours(-453)).toBe(0);
  });

  test('converts 60.234 value into 1 hours', () => {
    expect(secondsToHours(60.234)).toBe(1);
  });
});
