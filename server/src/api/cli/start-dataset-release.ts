import { program } from 'commander'
import { pipe } from 'fp-ts/lib/function'
import { addJobToQueue, getQueue } from '../../infrastructure/queues/queues'

type InitDatasetReleaseJob = {
  type: 'full' | 'delta'
  from: string
  until: string
  releaseName: string
}

const startDatasetRelease = async (args: any, options: any) => {
  const run = pipe(
    getQueue<InitDatasetReleaseJob>('datasetRelease')(),
    addJobToQueue<InitDatasetReleaseJob>({
      type: args.type,
      from: args.from,
      until: args.until,
      releaseName: args.releaseName,
    })('init')({})
  )

  await run()

  process.exit(0)
}

program
  .name('start the dataset release process')
  .requiredOption(
    '-t, --type <type>',
    "Determines the type of the dataset release\n<type>: 'full | delta'"
  )
  .requiredOption(
    '-f, --from <datetime>',
    "Earliest date to be included in the release, e.g. '2000-01-01 00:00:00'"
  )
  .requiredOption(
    '-u, --until <datetime>',
    "Latest date until (exclusive) to include clips in the release, e.g. '2070-05-10 00:00:00'"
  )
  .requiredOption(
    '-r, --releaseName <name>',
    "Define the release name, usually in the shape of 'cv-corpus-15-{delta-}2023-10-19'"
  )
  .action(startDatasetRelease)

program.parse()
