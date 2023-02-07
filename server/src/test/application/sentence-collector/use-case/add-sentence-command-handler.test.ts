import AddSentenceCommandHandler from '../../../../application/sentence-collector/use-case/command-handler/add-sentence-command-handler';

import * as E from 'fp-ts/Either';

describe('Add sentence command', () => {
  it('Should not execute command with invalid sentence', () => {
    const sentence = 'That sounds about right.'
    const result = AddSentenceCommandHandler({
      userId: 'abc',
      sentence,
      source: 'me',
      localeId: 1,
    });
    expect(
      E.fold(
        err => err,
        res => res
      )(result)
    ).toBe(sentence);
  });
});
