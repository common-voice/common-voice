import { Language } from 'common';
import { Request, Response } from 'express';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import AddSentenceCommandHandler from '../../../application/sentence-collector/use-case/command-handler/add-sentence-command-handler';
import { AddSentenceCommand } from '../../../application/sentence-collector/use-case/command-handler/command/add-sentence-command';
import Model from '../../../lib/model';

export default async (req: Request, res: Response) => {
  const test = req.body as AddSentenceCommand;

  pipe(
    await AddSentenceCommandHandler({
      clientId: req.client_id,
      sentence: test.sentence,
      localeId: test.localeId,
      localeName: test.localeName,
      source: 'self',
    })(),
    E.fold(
      err => res.status(500).send(err),
      _ => res.status(200).send('Success')
    )
  );
};
