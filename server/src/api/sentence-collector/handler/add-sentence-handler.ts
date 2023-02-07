import { Request, Response } from 'express';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import AddSentenceCommandHandler from '../../../application/sentence-collector/use-case/command-handler/add-sentence-command-handler';
import { AddSentenceCommand } from '../../../application/sentence-collector/use-case/command-handler/command/add-sentence-command';

export default (req: Request, res: Response) => {
  const test = req.body as AddSentenceCommand;

  const result = pipe(
    AddSentenceCommandHandler({
      userId: test.userId,
      sentence: test.sentence,
      localeId: test.localeId,
      source: 'self',
    }),
    E.match(
      err => err,
      result => 'all good'
    )
  );

  res.send(result);
};
