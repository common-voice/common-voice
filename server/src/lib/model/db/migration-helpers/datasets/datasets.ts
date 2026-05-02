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

export const insertLocaleDatasetStats = async (
  db: any,
  stats: DatasetStat[]
): Promise<any> => {
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
  // The bundler emits negative `size` / `validDurationSecs` for delta locales
  // with no new clips; the locale_datasets columns are BIGINT UNSIGNED, so
  // clamp every numeric field to 0 before insert.
  const clampNonNegative = (n: number) => (n < 0 ? 0 : n)
  for (const row of stats) {
    const {
      release_dir,
      locale_name,
      ld_total_clips_duration,
      ld_valid_clips_duration,
      average_clips_duration,
      total_users,
      size,
      checksum,
    } = row
    const dataset_id = datasets[release_dir]
    const locale_id = locales[locale_name]
    if (!locale_id || !dataset_id) continue
    const locale_dataset_values = [
      dataset_id,
      locale_id,
      clampNonNegative(ld_total_clips_duration),
      clampNonNegative(ld_valid_clips_duration),
      clampNonNegative(average_clips_duration),
      clampNonNegative(total_users),
      clampNonNegative(size),
      checksum ? sqlString(checksum) : 'NULL',
    ]
    await db.runSql(
      `INSERT INTO locale_datasets (dataset_id,locale_id,total_clips_duration,valid_clips_duration,average_clips_duration,total_users,size,checksum) VALUES (${locale_dataset_values.join(
        ', '
      )})`
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
