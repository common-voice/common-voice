import { program } from 'commander'
import { Language } from 'common'
import { getConfig } from '../../config-helper'
import fetch from 'node-fetch'
import { AddBulkSentencesCommand } from '../../application/sentences/use-case/command-handler/command/add-bulk-sentences-command'
import * as fs from 'fs'
import { AddBulkSentencesCommandHandler } from '../../application/sentences/use-case/command-handler/add-bulk-sentences-command-handler'
import { pipe } from 'fp-ts/lib/function'
import { taskEither as TE, task as T } from 'fp-ts'

const importSentences = async (args: any, options: any) => {
  const config = getConfig()
  const languagesResponse = await fetch(
    `http://localhost:${config.SERVER_PORT}/api/v1/languages`
  )
  const languages: Language[] = await languagesResponse.json()
  const localeId = languages.find(language => language.name === args.locale).id

  const cmd: AddBulkSentencesCommand = {
    clientId: args.client_id,
    localeId: localeId,
    tsvFile: fs.createReadStream(args.filepath, { encoding: 'utf-8' }),
  }

  const executeCmd = pipe(
    cmd,
    AddBulkSentencesCommandHandler,
    TE.getOrElse(err => T.of(console.log(err)))
  )

  await executeCmd()
}

program
  .name('import bulk sentences')
  .requiredOption(
    '-f, --filepath <filepath>',
    'path to the tsv file containing the sentences'
  )
  .requiredOption('-l, --locale <locale>', 'the locale, e.g. en, de, fr, etc.')
  .requiredOption(
    '-cid, --client_id <id>',
    'the client_id which should be associated with that import'
  )
  .option('-v, --verbose')
  .action(importSentences)

program.parse()
