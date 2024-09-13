import { program } from 'commander'
import { Language } from 'common'
import { getConfig } from '../../config-helper'
import fetch from 'node-fetch'
import { AddBulkSentencesCommand } from '../../application/sentences/use-case/command-handler/command/add-bulk-sentences-command'
import * as fs from 'fs'
import { AddBulkSentencesCommandHandler } from '../../application/sentences/use-case/command-handler/add-bulk-sentences-command-handler'
import { pipe } from 'fp-ts/lib/function'
import { taskEither as TE, task as T, identity as Id } from 'fp-ts'
import { readTsvIntoMemory } from '../../infrastructure/parser/tsvParser'
import { fetchUserClientIdByEmail } from '../../application/repository/user-repository'
import { insertBulkSentencesIntoDb } from '../../application/repository/sentences-repository'
import { fetchSentenceDomains } from '../../application/repository/domain-repository'
import { fetchVariantsFromDb } from '../../application/repository/variant-repository'

const importSentences = async (args: any, options: any) => {
  const config = getConfig()
  const languagesResponse = await fetch(
    `http://localhost:${config.SERVER_PORT}/api/v1/languages`
  )
  const languages: Language[] = await languagesResponse.json()
  const localeId = languages.find(language => language.name === args.locale).id

  const cmd: AddBulkSentencesCommand = {
    email: args.email,
    localeId: localeId,
    tsvFile: fs.createReadStream(args.filepath, { encoding: 'utf-8' }),
  }

  const executeCmd = pipe(
    AddBulkSentencesCommandHandler,
    Id.ap(readTsvIntoMemory),
    Id.ap(fetchUserClientIdByEmail),
    Id.ap(fetchSentenceDomains),
    Id.ap(fetchVariantsFromDb),
    Id.ap(insertBulkSentencesIntoDb),
    Id.ap(cmd),
    TE.getOrElse(err => T.of(console.log(err)))
  )

  await executeCmd()
  console.log('Sentences imported')
  process.exit(0)
}

program
  .name('import bulk sentences')
  .requiredOption(
    '-f, --filepath <filepath>',
    'path to the tsv file containing the sentences'
  )
  .requiredOption('-l, --locale <locale>', 'the locale, e.g. en, de, fr, etc.')
  .requiredOption(
    '-e, --email <email>',
    'the email which should be associated with that import, e.g. user@example.com'
  )
  .option('-v, --verbose')
  .action(importSentences)

program.parse()
