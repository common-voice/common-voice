const STATS = [
  {
    locale_name: 'ka',
    dataset_id: 37,
    locale_id: 3,
    ld_total_clips_duration: 1009362672,
    ld_valid_clips_duration: 556198916,
    average_clips_duration: 5189,
    total_users: 2352,
    size: 5904522303,
    checksum:
      '47635132f7713b2d86bfe755115c1634b160864e845671e6abb22adfd8b9ac43',
    release_date: '2024-06-19',
    name: 'Common Voice Corpus 18.0',
    release_dir: 'cv-corpus-18.0-2024-06-14',
    download_path:
      'cv-corpus-18.0-2024-06-14/cv-corpus-18.0-2024-06-14-{locale}.tar.gz',
    total_clips_duration: 115639805731,
    valid_clips_duration: 75397609000,
  },
  {
    locale_name: 'ka',
    dataset_id: 41,
    locale_id: 3,
    ld_total_clips_duration: 238222476,
    ld_valid_clips_duration: 56495750,
    average_clips_duration: 5189,
    total_users: 673,
    size: 1377630187,
    checksum:
      '47635132f7713b2d86bfe755115c1634b160864e845671e6abb22adfd8b9ac43',
    release_date: '2024-06-19',
    name: 'Common Voice Delta Segment 18.0',
    release_dir: 'cv-corpus-18.0-delta-2024-06-14',
    download_path:
      'cv-corpus-18.0-delta-2024-06-14/cv-corpus-18.0-delta-2024-06-14-{locale}.tar.gz',
    total_clips_duration: 3408609216,
    valid_clips_duration: 1926662000,
  },
]

export const up = async function (db: any): Promise<any> {
  const languageQuery = await db.runSql(
    `SELECT id, name FROM locales where name is not null`
  )
  // {en: 1, fr: 2}
  const locales = languageQuery.reduce((obj: any, current: any) => {
    obj[current.name] = current.id
    return obj
  }, {})
  const datasetQuery = await db.runSql(
    `SELECT id, release_dir FROM datasets where release_dir is not null`
  )
  // {cv-corpus-1: 1, cv-corpus-2: 2}
  const datasets = datasetQuery.reduce((obj: any, current: any) => {
    obj[current.release_dir] = current.id
    return obj
  }, {})
  for (const row of STATS) {
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
    //need ids for data to exist
    if (!locale_id || !dataset_id) continue
    const locale_dataset_values = [
      dataset_id,
      locale_id,
      ld_total_clips_duration,
      ld_valid_clips_duration,
      average_clips_duration,
      total_users,
      size,
      checksum ? `'${checksum}'` : 'NULL',
    ]
    await db.runSql(
      `INSERT INTO locale_datasets (dataset_id,locale_id,total_clips_duration,valid_clips_duration,average_clips_duration,total_users,size,checksum) VALUES (${locale_dataset_values.join(
        ', '
      )})`
    )
  }
}

export const down = async (db: any): Promise<any> => {
  const datasetReleaseName = STATS[0].name
  return db.runSql(`
      DELETE FROM locale_datasets WHERE dataset_id = (SELECT id FROM datasets WHERE name = '${datasetReleaseName}')
    `)
}
