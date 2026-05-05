// Helpers for dataset-release migrations.
//
// A dataset release is two related records:
//   1. A row in `datasets` (corpus-level metadata)
//   2. One row in `locale_datasets` per locale (per-locale stats)
//
// Each release ships as two datasets: a complete corpus + a delta segment.

export type DatasetRegistration = {
  name: string
  release_dir: string
  multilingual: boolean
  bundle_date: string
  release_date: string
  total_clips_duration: number
  valid_clips_duration: number
  release_type: 'complete' | 'delta'
  download_path: string
}

export type DatasetStat = {
  locale_name: string
  ld_total_clips_duration: number
  ld_valid_clips_duration: number
  average_clips_duration: number
  total_users: number
  size: number
  checksum: string | null
  name: string
  release_dir: string
}

const sqlString = (value: string) => `'${value.replace(/'/g, "''")}'`

export const insertDatasets = async (
  db: any,
  rows: DatasetRegistration[]
): Promise<any> => {
  if (rows.length === 0) return
  const values = rows
    .map(
      r =>
        `(${sqlString(r.name)}, ${sqlString(r.release_dir)}, ${
          r.multilingual ? 'TRUE' : 'FALSE'
        }, ${sqlString(r.bundle_date)}, ${sqlString(r.release_date)}, ${
          r.total_clips_duration
        }, ${r.valid_clips_duration}, ${sqlString(r.release_type)}, ${sqlString(
          r.download_path
        )})`
    )
    .join(',\n      ')
  await db.runSql(`
    INSERT IGNORE INTO datasets(name, release_dir, multilingual, bundle_date, release_date, total_clips_duration, valid_clips_duration, release_type, download_path)
    VALUES
      ${values}
    ON DUPLICATE KEY UPDATE name=name
  `)
}

export const deleteDatasetsByName = async (
  db: any,
  names: string[]
): Promise<any> => {
  if (names.length === 0) return
  const list = names.map(sqlString).join(',')
  await db.runSql(`DELETE FROM datasets WHERE name IN (${list})`)
}

// `locale_datasets` has no UNIQUE(dataset_id, locale_id), so plain INSERT
// would create duplicates if the migration is re-run after an interruption.
// We delete-then-insert per dataset to keep the helper idempotent without
// requiring a schema change.
const LOCALE_DATASETS_INSERT_CHUNK = 200

const clampNonNegative = (n: number) => (n < 0 ? 0 : n)

export const insertLocaleDatasetStats = async (
  db: any,
  stats: DatasetStat[]
): Promise<any> => {
  if (stats.length === 0) return

  const languageQuery = await db.runSql(
    `SELECT id, name FROM locales where name is not null`
  )
  const locales = languageQuery.reduce((obj: any, current: any) => {
    obj[current.name] = current.id
    return obj
  }, {})
  const datasetQuery = await db.runSql(
    `SELECT id, release_dir FROM datasets where release_dir is not null`
  )
  const datasets = datasetQuery.reduce((obj: any, current: any) => {
    obj[current.release_dir] = current.id
    return obj
  }, {})

  const targetDatasetIds = Array.from(
    new Set(
      stats
        .map(row => datasets[row.release_dir])
        .filter((id): id is number => Boolean(id))
    )
  )
  if (targetDatasetIds.length > 0) {
    await db.runSql(
      `DELETE FROM locale_datasets WHERE dataset_id IN (${targetDatasetIds.join(
        ','
      )})`
    )
  }

  // The bundler emits negative `size` / `validDurationSecs` for delta locales
  // with no new clips (compression noise, GDPR deletions, re-validations);
  // the locale_datasets columns are BIGINT UNSIGNED, so clamp every numeric
  // field to 0 before insert.
  const valueTuples: string[] = []
  for (const row of stats) {
    const dataset_id = datasets[row.release_dir]
    const locale_id = locales[row.locale_name]
    if (!locale_id || !dataset_id) continue
    valueTuples.push(
      `(${dataset_id}, ${locale_id}, ${clampNonNegative(
        row.ld_total_clips_duration
      )}, ${clampNonNegative(row.ld_valid_clips_duration)}, ${clampNonNegative(
        row.average_clips_duration
      )}, ${clampNonNegative(row.total_users)}, ${clampNonNegative(
        row.size
      )}, ${row.checksum ? sqlString(row.checksum) : 'NULL'})`
    )
  }

  for (let i = 0; i < valueTuples.length; i += LOCALE_DATASETS_INSERT_CHUNK) {
    const chunk = valueTuples.slice(i, i + LOCALE_DATASETS_INSERT_CHUNK)
    await db.runSql(
      `INSERT INTO locale_datasets (dataset_id,locale_id,total_clips_duration,valid_clips_duration,average_clips_duration,total_users,size,checksum) VALUES ${chunk.join(
        ','
      )}`
    )
  }
}

export const deleteLocaleDatasetStatsByDatasetNames = async (
  db: any,
  names: string[]
): Promise<any> => {
  if (names.length === 0) return
  const list = names.map(sqlString).join(',')
  return db.runSql(`
    DELETE FROM locale_datasets WHERE dataset_id IN (SELECT id FROM datasets WHERE name IN (${list}))
  `)
}
