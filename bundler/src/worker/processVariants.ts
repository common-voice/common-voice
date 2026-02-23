import * as fs from 'node:fs'
import { rm as rmAsync } from 'node:fs/promises'
import * as path from 'node:path'
import { pipeline } from 'node:stream/promises'

import { either as E, task as T, taskEither as TE } from 'fp-ts'
import { Job } from 'bullmq'
import { pipe } from 'fp-ts/lib/function'

import { AppEnv, ProcessLocaleJob, VariantInfo } from '../types'
import {
  getDatasetBundlerBucketName,
  getTmpDir,
  RELEASE_LOG_KEY_TTL_SEC,
  redisKeys,
} from '../config/config'
import { generateTarFilename } from '../core/compress'
import { doesFileExistInBucket, streamDownloadFileFromBucket } from '../infrastructure/storage'
import { redisClient } from '../infrastructure/redis'
import { logger } from '../infrastructure/logger'
import { extractTar } from '../infrastructure/tar'
import { concatFiles } from '../infrastructure/filesystem'
import { prepareDir } from '../infrastructure/filesystem'
import { CORPORA_CREATOR_CLIP_SPLIT_FILES, CORPORA_CREATOR_FILES } from '../infrastructure/corporaCreator'
import { TSV_COLUMNS } from '../core/clips'
import { flushReleaseLogs } from '../core/releaseLogger'
import { compressPipeline } from '../core/compress'
import { statsPipeline } from '../core/stats'
import { metadataPipeline } from '../core/metadata'
import { corporaCreatorPipeline } from '../infrastructure/corporaCreator'
import { uploadDatasetToPath } from '../core/upload'
import { runFilterProblemClips, runPushProblemClips } from '../core/problemClips'
import { cleanUp } from '../core/cleanUp'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const VARIANT_COL_IDX = TSV_COLUMNS.indexOf('variant')
const LOCALE_COL_IDX = TSV_COLUMNS.indexOf('locale')

/** CC output files that contain a locale column and need rewriting */
const CC_FILES_WITH_LOCALE = [...CORPORA_CREATOR_FILES] as string[]

// ---------------------------------------------------------------------------
// Pure helpers (exported for testing)
// ---------------------------------------------------------------------------

/**
 * Filters clips.tsv rows to only those whose variant column matches `variantName`.
 * Rewrites the locale column to the compound locale (e.g. "cy-southwes") so that
 * CorporaCreator routes output to the correct subdirectory.
 *
 * Returns the number of matching clips (excluding header).
 */
export const filterClipsTsvForVariant = (
  srcClipsTsv: string,
  dstClipsTsv: string,
  variantName: string,
  compoundLocale: string,
): number => {
  const content = fs.readFileSync(srcClipsTsv, 'utf-8')
  const lines = content.split('\n')
  const header = lines[0]

  const filtered: string[] = [header]
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    const cols = line.split('\t')
    if (cols[VARIANT_COL_IDX] === variantName) {
      // HACK: Rewrite locale to compound so CC creates output in the
      // correct subdirectory (CC uses `os.path.join(directory, self.locale)`).
      // This will be undone after CC runs -- see rewriteLocaleColumn call below.
      cols[LOCALE_COL_IDX] = compoundLocale
      filtered.push(cols.join('\t'))
    }
  }

  fs.mkdirSync(path.dirname(dstClipsTsv), { recursive: true })
  fs.writeFileSync(dstClipsTsv, filtered.join('\n') + '\n', 'utf-8')

  return filtered.length - 1 // exclude header
}

/**
 * Filters clip_durations.tsv to only clips present in the variant.
 * Returns the total duration in ms of matching clips.
 */
export const filterClipDurationsForVariant = (
  srcDurationsPath: string,
  dstDurationsPath: string,
  matchingClipPaths: Set<string>,
): number => {
  if (!fs.existsSync(srcDurationsPath)) return 0

  const content = fs.readFileSync(srcDurationsPath, 'utf-8')
  const lines = content.split('\n')
  const header = lines[0]

  const filtered: string[] = [header]
  let totalDurationMs = 0

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    const [clip, durationStr] = line.split('\t')
    if (matchingClipPaths.has(clip)) {
      filtered.push(line)
      totalDurationMs += Number(durationStr)
    }
  }

  fs.writeFileSync(dstDurationsPath, filtered.join('\n') + '\n', 'utf-8')
  return totalDurationMs
}

/**
 * Derives the AppEnv for a single variant within a locale job.
 *
 * Key naming decisions:
 * - `locale` = compound (e.g. "cy-southwes") -- used by CC and pipeline steps
 * - `releaseName` = effective name with "-variants" suffix -- used for GCS paths and Redis keys
 * - `uploadPath` uses effective release name for directory, base release name for filename
 */
export const deriveVariantEnv = (
  jobData: ProcessLocaleJob,
  variant: VariantInfo,
  tmpDir: string,
): AppEnv => {
  const baseReleaseName = jobData.releaseName
  const effectiveReleaseName = `${baseReleaseName}-variants`
  const compoundLocale = `${jobData.locale}-${variant.variantToken}`

  const releaseDirPath = path.join(tmpDir, effectiveReleaseName)
  // Tarball filename uses BASE release name for short naming
  const tarFilename = generateTarFilename(compoundLocale, baseReleaseName)
  const uploadPath = `${effectiveReleaseName}/${tarFilename}`

  return {
    ...jobData,
    locale: compoundLocale,
    releaseName: effectiveReleaseName,
    type: 'variants',
    releaseDirPath,
    clipsDirPath: path.join(releaseDirPath, compoundLocale, 'clips'),
    releaseTarballsDirPath: path.join(releaseDirPath, 'tarballs'),
    uploadPath,
    problemClips: [],
    clipCount: 0,
    startTimestamp: new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// uploadToGcsDir -- upload a tarball to a specific GCS directory
// ---------------------------------------------------------------------------

/**
 * Uploads a tarball to a specific GCS directory. Unlike `uploadDataset` which
 * derives the directory from the tarball's releaseName, this allows uploading
 * to a different directory -- e.g. uploading a tarball named with the base
 * releaseName into the `${releaseName}-variants/` directory.
 */
const uploadToGcsDir = (
  tarFilepath: string,
  gcsDir: string,
): TE.TaskEither<Error, string> =>
  pipe(
    TE.Do,
    TE.let('readStream', () => fs.createReadStream(tarFilepath)),
    TE.let('filename', () => path.basename(tarFilepath)),
    TE.let('uploadPath', ({ filename }) => `${gcsDir}/${filename}`),
    TE.chainFirst(({ readStream, uploadPath }) =>
      uploadDatasetToPath(uploadPath)(readStream),
    ),
    TE.map(({ uploadPath }) => uploadPath),
  )

// ---------------------------------------------------------------------------
// rewriteLocaleColumn -- rewrite locale column in CC output TSV files
// ---------------------------------------------------------------------------

/**
 * Rewrites the `locale` column in TSV files from `fromLocale` to `toLocale`.
 *
 * Used to undo the CorporaCreator locale hack: CC uses the locale column
 * for output directory routing (`os.path.join(directory, self.locale)`), so
 * we temporarily set it to a compound name (e.g. "cy-southwes") before CC.
 * After CC, we rewrite back to the original locale (e.g. "cy") so that
 * tarball consumers see the correct locale.
 *
 * Only processes files that exist; silently skips missing ones.
 */
export const rewriteLocaleColumn = (
  dir: string,
  filenames: string[],
  fromLocale: string,
  toLocale: string,
): void => {
  for (const filename of filenames) {
    const filepath = path.join(dir, filename)
    if (!fs.existsSync(filepath)) continue

    const content = fs.readFileSync(filepath, 'utf-8')
    const lines = content.split('\n')
    if (lines.length === 0) continue

    // Find the locale column index from the header
    const header = lines[0].split('\t')
    const localeIdx = header.indexOf('locale')
    if (localeIdx === -1) continue

    const rewritten = lines.map((line, i) => {
      if (i === 0 || !line.trim()) return line
      const cols = line.split('\t')
      if (cols[localeIdx] === fromLocale) {
        cols[localeIdx] = toLocale
      }
      return cols.join('\t')
    })

    fs.writeFileSync(filepath, rewritten.join('\n'), 'utf-8')
    logger.debug(
      'PIPELINE-TOOLS',
      `[${filename}] Rewrote locale column: ${fromLocale} -> ${toLocale}`,
    )
  }
}

// ---------------------------------------------------------------------------
// linkMatchingClips -- hard-link MP3 files from full release to variant dir
// ---------------------------------------------------------------------------

const linkMatchingClips = (
  srcClipsDir: string,
  dstClipsDir: string,
  clipPaths: Set<string>,
): { linked: number; missing: string[] } => {
  fs.mkdirSync(dstClipsDir, { recursive: true })
  let linked = 0
  const missing: string[] = []
  for (const clipFile of clipPaths) {
    const src = path.join(srcClipsDir, clipFile)
    const dst = path.join(dstClipsDir, clipFile)
    if (fs.existsSync(src)) {
      try {
        fs.linkSync(src, dst)
        linked++
      } catch {
        // If hard-link fails (cross-device), fall back to copy
        fs.copyFileSync(src, dst)
        linked++
      }
    } else {
      missing.push(clipFile)
    }
  }
  return { linked, missing }
}

/**
 * Removes rows from clips.tsv whose path column references a missing MP3.
 * Returns the reduced set of clip paths that remain.
 */
const reconcileClipsTsv = (
  clipsTsvPath: string,
  missingClips: Set<string>,
): Set<string> => {
  const content = fs.readFileSync(clipsTsvPath, 'utf-8')
  const lines = content.split('\n')
  const header = lines[0]
  const kept: string[] = [header]
  const keptPaths = new Set<string>()

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    const clipPath = line.split('\t')[1]
    if (clipPath && !missingClips.has(clipPath)) {
      kept.push(line)
      keptPaths.add(clipPath)
    }
  }

  fs.writeFileSync(clipsTsvPath, kept.join('\n') + '\n', 'utf-8')
  return keptPaths
}

/**
 * Extracts the set of clip filenames (path column) from a clips.tsv file.
 */
const extractClipPaths = (clipsTsvPath: string): Set<string> => {
  const content = fs.readFileSync(clipsTsvPath, 'utf-8')
  const lines = content.split('\n')
  const paths = new Set<string>()
  // path is column index 1 (after client_id)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    const clipPath = line.split('\t')[1]
    if (clipPath) paths.add(clipPath)
  }
  return paths
}

// ---------------------------------------------------------------------------
// reconstructClipsTsv -- rebuild clips.tsv from CC output files
// ---------------------------------------------------------------------------

/**
 * Reconstructs clips.tsv by concatenating validated.tsv + invalidated.tsv + other.tsv
 * from the extracted full release tarball. This is the same pattern used by
 * generateStatistics -> runGenerateClipsTsv in dataset.ts.
 */
const reconstructClipsTsv = (
  locale: string,
  releaseDir: string,
): TE.TaskEither<Error, void> => {
  const clipsTsvPath = path.join(releaseDir, locale, 'clips.tsv')
  const filepaths = CORPORA_CREATOR_CLIP_SPLIT_FILES.map(f =>
    path.join(releaseDir, locale, f),
  )

  // Remove any pre-existing clips.tsv so the append-mode concatFiles calls
  // start from a clean slate. Without this, a stale clips.tsv left over from
  // an earlier pipeline run (e.g. the full release that produced the tarball)
  // would survive tar extraction (clips.tsv is excluded from the tarball) and
  // the CC output rows would be appended to it, doubling the entries.
  if (fs.existsSync(clipsTsvPath)) {
    fs.rmSync(clipsTsvPath)
  }

  return pipe(
    TE.Do,
    TE.chain(() => concatFiles(filepaths[0], clipsTsvPath)),
    TE.chain(() =>
      concatFiles(filepaths[1], clipsTsvPath, { skipFirstLine: true }),
    ),
    TE.chain(() =>
      concatFiles(filepaths[2], clipsTsvPath, { skipFirstLine: true }),
    ),
  )
}

// ---------------------------------------------------------------------------
// processVariants -- main entry point
// ---------------------------------------------------------------------------

export const processVariants = async (job: Job<ProcessLocaleJob>) => {
  const { locale, releaseName, variants } = job.data
  const tmpDir = getTmpDir()
  const bucketName = getDatasetBundlerBucketName()

  // 1. VALIDATE
  if (!variants || variants.length === 0) {
    logger.error('VARIANTS', `[${locale}] No variants found in job data`)
    return
  }

  // 2. GUARD: Check full release tarball exists in GCS
  // Variant releases source clips from the same release (-r), not a previous one.
  const fullTarFilename = generateTarFilename(locale, releaseName)
  const fullTarGcsPath = `${releaseName}/${fullTarFilename}`

  const fullExists = await pipe(
    doesFileExistInBucket(bucketName)(fullTarGcsPath),
    TE.getOrElse(() => T.of(false)),
  )()

  if (!fullExists) {
    logger.error(
      'VARIANTS',
      `[${locale}] Full release tarball not found at ${fullTarGcsPath}. ` +
        `Run -t full first before -t variants.`,
    )
    // Flush error status for each variant so progress counters stay accurate
    for (const variant of variants) {
      const env = deriveVariantEnv(job.data, variant, tmpDir)
      await flushReleaseLogs(env, 'error')
    }
    return
  }

  // 3. Download + extract full release tarball
  const fullTarLocalPath = path.join(tmpDir, fullTarFilename)

  logger.info('VARIANTS', `[${locale}] Downloading full release tarball: ${fullTarGcsPath}`)
  const downloadResult = await pipe(
    TE.tryCatch(async () => {
      const writeStream = fs.createWriteStream(fullTarLocalPath)
      await pipeline(
        streamDownloadFileFromBucket(bucketName)(fullTarGcsPath),
        writeStream,
      )
    }, (err: unknown) => Error(String(err))),
  )()

  if (E.isLeft(downloadResult)) {
    logger.error('VARIANTS', `[${locale}] Failed to download full tarball: ${String(downloadResult.left)}`)
    for (const variant of variants) {
      const env = deriveVariantEnv(job.data, variant, tmpDir)
      await flushReleaseLogs(env, 'error')
    }
    return
  }

  // Extract into tmpDir -- tar will recreate the releaseName/locale/ structure
  logger.info('VARIANTS', `[${locale}] Extracting full release tarball`)
  const extractResult = await extractTar(fullTarLocalPath, tmpDir)()
  if (E.isLeft(extractResult)) {
    logger.error('VARIANTS', `[${locale}] Failed to extract tarball: ${String(extractResult.left)}`)
    for (const variant of variants) {
      const env = deriveVariantEnv(job.data, variant, tmpDir)
      await flushReleaseLogs(env, 'error')
    }
    return
  }

  // The tarball extracts to releaseName/locale/ structure
  const fullReleaseDir = path.join(tmpDir, releaseName)
  const fullLocaleDir = path.join(fullReleaseDir, locale)

  // 4. Reconstruct clips.tsv from CC output (validated + invalidated + other)
  logger.info('VARIANTS', `[${locale}] Reconstructing clips.tsv from CC output`)
  const clipsTsvResult = await reconstructClipsTsv(locale, fullReleaseDir)()
  if (E.isLeft(clipsTsvResult)) {
    logger.error('VARIANTS', `[${locale}] Failed to reconstruct clips.tsv: ${String(clipsTsvResult.left)}`)
    for (const variant of variants) {
      const env = deriveVariantEnv(job.data, variant, tmpDir)
      await flushReleaseLogs(env, 'error')
    }
    return
  }

  const srcClipsTsv = path.join(fullLocaleDir, 'clips.tsv')
  const srcDurationsPath = path.join(fullLocaleDir, 'clip_durations.tsv')
  const srcClipsDir = path.join(fullLocaleDir, 'clips')
  const effectiveReleaseName = `${releaseName}-variants`

  // 5. FOR EACH variant
  for (const variant of variants) {
    const compoundLocale = `${locale}-${variant.variantToken}`
    const env = deriveVariantEnv(job.data, variant, tmpDir)

    logger.info('', '-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --')
    logger.info(
      'VARIANTS',
      `[${compoundLocale}] Processing variant: ${variant.variantName} (${variant.clipCount} clips)`,
    )

    try {
      // 5a. Skip check: Redis done-set + GCS existence
      const isDoneInRedis =
        (await redisClient.sismember(redisKeys.done(effectiveReleaseName), compoundLocale)) > 0

      if (isDoneInRedis) {
        logger.info('VARIANTS', `[${compoundLocale}] Already done (Redis), skipping`)
        await flushReleaseLogs(env, 'skipped')
        continue
      }

      const variantTarFilename = generateTarFilename(compoundLocale, releaseName)
      const variantGcsPath = `${effectiveReleaseName}/${variantTarFilename}`

      const existsInGcs = await pipe(
        doesFileExistInBucket(bucketName)(variantGcsPath),
        TE.getOrElse(() => T.of(false)),
      )()

      if (existsInGcs) {
        await redisClient.sadd(redisKeys.done(effectiveReleaseName), compoundLocale)
        await redisClient.expire(redisKeys.done(effectiveReleaseName), RELEASE_LOG_KEY_TTL_SEC)
        logger.info('VARIANTS', `[${compoundLocale}] Already exists in GCS, skipping`)
        await flushReleaseLogs(env, 'skipped')
        continue
      }

      // 5b. Filter clips.tsv for this variant
      const variantDir = path.join(env.releaseDirPath, compoundLocale)
      const variantClipsTsv = path.join(variantDir, 'clips.tsv')
      const matchCount = filterClipsTsvForVariant(
        srcClipsTsv,
        variantClipsTsv,
        variant.variantName,
        compoundLocale,
      )

      if (matchCount === 0) {
        logger.warn('VARIANTS', `[${compoundLocale}] No clips matched variant "${variant.variantName}", skipping`)
        await flushReleaseLogs(env, 'skipped')
        continue
      }

      logger.info('VARIANTS', `[${compoundLocale}] ${matchCount} clips matched`)

      // 5c. Hard-link matching MP3 files
      let clipPaths = extractClipPaths(variantClipsTsv)
      const variantClipsDir = path.join(variantDir, 'clips')
      const linkResult = linkMatchingClips(srcClipsDir, variantClipsDir, clipPaths)
      logger.info('VARIANTS', `[${compoundLocale}] Linked ${linkResult.linked} MP3 files`)

      // Defense-in-depth: if some TSV entries have no matching MP3, drop them
      // from clips.tsv so CorporaCreator and the tarball stay consistent.
      if (linkResult.missing.length > 0) {
        logger.warn(
          'VARIANTS',
          `[${compoundLocale}] ${linkResult.missing.length} clip(s) in TSV but missing from source -- removing from clips.tsv`,
        )
        const missingSet = new Set(linkResult.missing)
        clipPaths = reconcileClipsTsv(variantClipsTsv, missingSet)
      }

      // 5d. Filter clip_durations.tsv
      const variantDurationsPath = path.join(variantDir, 'clip_durations.tsv')
      const rawDurationInMs = filterClipDurationsForVariant(
        srcDurationsPath,
        variantDurationsPath,
        clipPaths,
      )
      logger.info('VARIANTS', `[${compoundLocale}] Total duration: ${rawDurationInMs} ms`)

      // 5e. Problem-clip filter (reads clip_durations.tsv, rewrites clips.tsv)
      const problemClipResult = await runFilterProblemClips(rawDurationInMs)(env)()
      const totalDurationInMs = E.isRight(problemClipResult)
        ? problemClipResult.right
        : rawDurationInMs

      // 5f. Run CorporaCreator
      const ccResult = await corporaCreatorPipeline(compoundLocale, env.releaseDirPath)()
      if (E.isLeft(ccResult)) {
        logger.error('VARIANTS', `[${compoundLocale}] CorporaCreator failed: ${String(ccResult.left)}`)
        await flushReleaseLogs(env, 'error')
        continue
      }

      // 5g. UNDO HACK: Rewrite locale column back to original locale in CC output files.
      // CC wrote the compound locale (e.g. "cy-southwes") because it uses the locale column
      // for directory routing. Tarball consumers should see the real locale (e.g. "cy").
      rewriteLocaleColumn(
        path.join(env.releaseDirPath, compoundLocale),
        CC_FILES_WITH_LOCALE,
        compoundLocale,
        locale,
      )

      // 5h. Compress -- tarball named with BASE releaseName (short name)
      const tarballsDir = env.releaseTarballsDirPath
      prepareDir(tarballsDir)()

      const compressResult = await compressPipeline(
        compoundLocale,
        releaseName, // base release name for short tarball filename
        env.releaseDirPath,
        tarballsDir,
        'variants',
      )()

      if (E.isLeft(compressResult)) {
        logger.error('VARIANTS', `[${compoundLocale}] Compress failed: ${String(compressResult.left)}`)
        await flushReleaseLogs(env, 'error')
        continue
      }

      const tarFilepath = compressResult.right

      // 5i. Upload tarball to ${releaseName}-variants/ GCS directory
      const uploadResult = await uploadToGcsDir(tarFilepath, effectiveReleaseName)()
      if (E.isLeft(uploadResult)) {
        logger.error('VARIANTS', `[${compoundLocale}] Upload failed: ${String(uploadResult.left)}`)
        await flushReleaseLogs(env, 'error')
        continue
      }

      // 5j. Upload metadata
      const metaResult = await metadataPipeline(
        compoundLocale,
        effectiveReleaseName,
        env.releaseDirPath,
        tarballsDir,
      )()
      if (E.isLeft(metaResult)) {
        logger.warn('VARIANTS', `[${compoundLocale}] Metadata upload failed: ${String(metaResult.left)}`)
        // Non-fatal: continue to stats
      }

      // 5k. Stats
      const statsResult = await statsPipeline(
        compoundLocale,
        totalDurationInMs,
        tarFilepath,
        env.releaseDirPath,
        effectiveReleaseName,
      )()
      if (E.isRight(statsResult)) {
        env.clipCount = statsResult.right.locales[compoundLocale]?.clips ?? 0
      }

      // 5l. Cleanup variant dir + tarball
      const cleanResult = await cleanUp(
        compoundLocale,
        env.releaseDirPath,
        tarFilepath,
      )()
      if (E.isLeft(cleanResult)) {
        logger.warn('VARIANTS', `[${compoundLocale}] Cleanup failed: ${String(cleanResult.left)}`)
      }

      // 5m. Push problem clips
      await runPushProblemClips()(env)()

      // 5n. Mark done + flush release logs
      await redisClient.sadd(redisKeys.done(effectiveReleaseName), compoundLocale)
      await redisClient.expire(redisKeys.done(effectiveReleaseName), RELEASE_LOG_KEY_TTL_SEC)
      await flushReleaseLogs(env, 'success')

      logger.info('VARIANTS', `[${compoundLocale}] Variant completed successfully`)
    } catch (err) {
      logger.error('VARIANTS', `[${compoundLocale}] Unexpected error: ${String(err)}`)
      await flushReleaseLogs(env, 'error')
    }
  }

  // 6. Clean up extracted full release source directory + downloaded tarball
  try {
    await rmAsync(fullReleaseDir, { recursive: true, force: true })
    await rmAsync(fullTarLocalPath, { force: true })
    logger.info('VARIANTS', `[${locale}] Cleaned up full release source`)
  } catch (err) {
    logger.warn('VARIANTS', `[${locale}] Cleanup of full release failed: ${String(err)}`)
  }
}
