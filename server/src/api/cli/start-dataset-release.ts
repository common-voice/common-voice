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
  // -f is required for delta releases (defines the start of the time window)
  if (args.type === 'delta' && args.from === '1970-01-01 00:00:00') {
    console.error(
      'Error: -f (--from) is required for -t delta.\n' +
        'It defines the start of the time window for clips included in the delta.\n' +
        "Example: -t delta -f '2025-09-05 00:00:00' -u '2026-03-06 23:59:59'",
    )
    process.exit(1)
  }

  // -p is required for full releases (bootstraps clips from previous tarball)
  if (args.type === 'full' && !args.previousReleaseName) {
    console.error(
      'Error: -p (--previousReleaseName) is required for -t full.\n' +
        'It specifies the previous release whose clips bootstrap the new one.\n' +
        'Example: -t full -r cv-corpus-25.0-2026-03-06 -p cv-corpus-24.0-2025-12-01',
    )
    process.exit(1)
  }

  // -p is ignored for variants (source is always the same release, derived from -r)
  if (args.type === 'variants' && args.previousReleaseName) {
    console.warn(
      'Warning: -p (--previousReleaseName) is ignored for -t variants.\n' +
        'Variant releases use -r (releaseName) as the source full release.',
    )
  }

  // -p is ignored for delta and statistics
  if ((args.type === 'delta' || args.type === 'statistics') && args.previousReleaseName) {
    console.warn(
      `Warning: -p (--previousReleaseName) is ignored for -t ${args.type}.`,
    )
  }

  const licenseMode: LicenseMode = args.licenseMode || 'unlicensed'

  const run = pipe(
    getQueue<InitDatasetReleaseJob>('datasetRelease')(),
    addJobToQueue<InitDatasetReleaseJob>('init')({
      type: args.type,
      from: args.from,
      until: args.until,
      releaseName: args.releaseName,
      // Only pass previousReleaseName for full releases
      previousReleaseName: args.type === 'full' ? args.previousReleaseName : undefined,
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
  .option(
    '-f, --from <datetime>',
    "Earliest date to be included in the release, e.g. '2000-01-01 00:00:00'",
    '1970-01-01 00:00:00'
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
    Required for full releases. The previous release whose clips will be downloaded
    to bootstrap the new release. Ignored for delta, statistics, and variants.
    Usually in the shape of 'cv-corpus-24.0-2025-12-01'.
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
