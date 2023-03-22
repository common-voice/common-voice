import { validateSentence } from '../../../../core/sentences';
import * as E from 'fp-ts/Either';

describe('Sentence validation', () => {
  it('Should validate english sentence with no errors', () => {
    const result = validateSentence('en')('This is a simple question.');
    expect(
      E.fold(
        err => err,
        res => res
      )(result)
    ).toBe('This is a simple question.');
  });

  it('Should validate sentence with locale not in list', () => {
    const result = validateSentence('abc')('This is a simple question.');
    expect(
      E.fold(
        err => err,
        res => res
      )(result)
    ).toBe('This is a simple question.');
  });

  it('Should invalidate sentence with too many words', () => {
    const result = validateSentence('en')(
      'This is very very very very very very very very very very very very very very very very very very very very long'
    );
    expect(
      E.fold(
        err => err,
        res => res
      )(result)
    ).toBe('Number of words must be between 1 and 14 (inclusive)');
  });

  it('Should invalidate sentence that contains numbers', () => {
    const result = validateSentence('en')('This is 2valid');
    expect(
      E.fold(
        err => err,
        res => res
      )(result)
    ).toBe('Sentence should not contain numbers');
  });

  it('Should invalidate sentence that contains abbreviations', () => {
    const result = validateSentence('en')('This is the A.B.C company');
    expect(
      E.fold(
        err => err,
        res => res
      )(result)
    ).toBe('Sentence should not contain abbreviations');
  });

  const wrongSymbolDataProvider = [
    {
      sentence: 'This is @ test',
      error: 'Sentence should not contain symbols',
      symbol: '@',
    },
    {
      sentence: 'This is # test',
      error: 'Sentence should not contain symbols',
      symbol: '#',
    },
    {
      sentence: 'This is / test',
      error: 'Sentence should not contain symbols',
      symbol: '/',
    },
  ];

  it.each(wrongSymbolDataProvider)(
    'Should invalidate sentence that contains the symbol $symbol',
    ({ sentence, error }) => {
      const result = validateSentence('en')(sentence);
      expect(
        E.fold(
          err => err,
          res => res
        )(result)
      ).toBe(error);
    }
  );

  it('Should invalidate sentence that contains more than one sentence', () => {
    const result = validateSentence('it')(
      'This is one test. Here is one more.'
    );
    expect(
      E.fold(
        err => err,
        res => res
      )(result)
    ).toBe(
      'Sentence should not contain sentence punctuation inside a sentence'
    );
  });

  it('Should invalidate sentence that contains wrong alphabet', () => {
    const result = validateSentence('ru')('This is a test');
    expect(
      E.fold(
        err => err,
        res => res
      )(result)
    ).toBe('Sentence should not contain latin alphabet characters');
  });

  const wrongEndDataProvider = [
    {
      sentence: 'This is wrong .',
      error: 'Sentence should not end with a space and a period',
      ending: 'space and period',
    },
    {
      sentence: 'This as well!.',
      error: 'Sentence should not end with a exclamation mark and a period',
      ending: 'exclamation mark and period',
    },
    {
      sentence: 'No;',
      error: 'Sentence should not end with a semicolon',
      ending: 'semicolon',
    },
    {
      sentence: 'Definitely not,',
      error: 'Sentence should not end with a comma',
      ending: 'comma',
    },
  ];

  it.each(wrongEndDataProvider)(
    'Should invalidate sentence that ends with a $ending',
    ({ sentence, error }) => {
      const result = validateSentence('bas')(sentence);
      expect(
        E.fold(
          err => err,
          res => res
        )(result)
      ).toBe(error);
    }
  );

  it('Should normalize sentence for the "ko" locale', () => {
    const result = validateSentence('ko')('콜');
    expect(
      E.fold(
        err => err,
        res => res
      )(result) === '콜'
    ).toBeFalsy();
  });
});
