import { replacePathLocale } from './utility';

describe('replacePathLocale', () => {
  it('replaces the path locale correctly', () => {
    const pathname = '/en/demo';
    const newLocale = 'fr';
    expect(replacePathLocale(pathname, newLocale)).toBe('/fr/demo');
  });
});
