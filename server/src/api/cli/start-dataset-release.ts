import { program, Option } from 'commander'
import { pipe } from 'fp-ts/lib/function'
import { addJobToQueue, getQueue } from '../../infrastructure/queues/queues'

type LicenseMode = 'unlicensed' | 'licensed' | 'both'

type InitDatasetReleaseJob = {
  type: 'full' | 'delta' | 'statistics' | 'variants'
  from: string
  until: string
  releaseName: string
  previousReleaseName?: string
  languages: string[]
  licenseMode?: LicenseMode
}

const startDatasetRelease = async (args: any, options: any) => {
  if (args.type === 'variants' && !args.previousReleaseName) {
    console.error(
      'Error: -p (--previousReleaseName) is required for -t variants.\n' +
        'It should point to the full release whose tarballs will be used as source.\n' +
        'Example: -t variants -p cv-corpus-25.0-2026-03-06 -r cv-corpus-25.0-2026-03-06',
    )
    process.exit(1)
  }

  const licenseMode: LicenseMode = args.licenseMode || 'unlicensed'

  const run = pipe(
    getQueue<InitDatasetReleaseJob>('datasetRelease')(),
    addJobToQueue<InitDatasetReleaseJob>('init')({
      type: args.type,
      from: args.from,
      until: args.until,
      releaseName: args.releaseName,
      previousReleaseName: args.previousReleaseName,
      languages: args.languages || [],
      licenseMode,
    })({})
  )

  await run()

  process.exit(0)
}

program
  .name('start the dataset release process')
  .requiredOption(
    '-t, --type <type>',
    `
     Determines the type of the dataset release or whether to generate statistics
     <type>: 'full | delta | statistics | variants'
    `
  )
  .requiredOption(
    '-f, --from <datetime>',
    "Earliest date to be included in the release, e.g. '2000-01-01 00:00:00'"
  )
  .requiredOption(
    '-u, --until <datetime>',
    "Latest date (inclusive) to include clips in the release, e.g. '2026-03-06 23:59:59'"
  )
  .requiredOption(
    '-r, --releaseName <name>',
    "Define the release name, usually in the shape of 'cv-corpus-15.0-{delta-}2023-10-19'"
  )
  .option(
    '-l, --languages <language...>',
    `
    Optional list of languages to create a release for. Every other language will be ignored.
    This option is useful if you want to create a release for only certain languages.
    `
  )
  .option(
    '-p, --previousReleaseName <name>',
    `
    Required for full and variants releases.
    For full: the previous release whose clips will be downloaded to bootstrap the new release.
    For variants: the full release whose tarballs will be used as source for variant extraction.
    Usually in the shape of 'cv-corpus-14.0-{delta-}2023-10-19'.
    `
  )
  .addOption(
    new Option(
      '--license-mode <mode>',
      `
    Define how to handle licensed and unlicensed sentences/clips:
    - 'unlicensed' (default): Only include CC0 (unlicensed) sentences/clips
    - 'licensed': Only include licensed sentences/clips (optimized: only processes locales with licenses)
    - 'both': Create separate bundles for unlicensed and each license type
    `
    )
      .choices(['unlicensed', 'licensed', 'both'])
      .default('unlicensed')
  )
  .action(startDatasetRelease)

program.parse()
