import {
  insertDatasets,
  deleteDatasetsByName,
  DatasetRegistration,
} from '../migration-helpers/'

const DATASETS: DatasetRegistration[] = [
  {
    name: 'Common Voice Corpus 26.0',
    release_dir: 'cv-corpus-26.0-2026-06-12',
    multilingual: true,
    bundle_date: '2026-06-12',
    release_date: '2026-06-17',
    total_clips_duration: 152602857283,
    valid_clips_duration: 104019274000,
    release_type: 'complete',
    download_path:
      'cv-corpus-26.0-2026-06-12/cv-corpus-26.0-2026-06-12-{locale}.tar.gz',
  },
  {
    name: 'Common Voice Delta Segment 26.0',
    release_dir: 'cv-corpus-26.0-delta-2026-06-12',
    multilingual: true,
    bundle_date: '2026-06-12',
    release_date: '2026-06-17',
    total_clips_duration: 1991225376,
    valid_clips_duration: 132345000,
    release_type: 'delta',
    download_path:
      'cv-corpus-26.0-delta-2026-06-12/cv-corpus-26.0-delta-2026-06-12-{locale}.tar.gz',
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const up = async function (db: any): Promise<any> {
  await insertDatasets(db, DATASETS)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const down = async function (db: any): Promise<any> {
  await deleteDatasetsByName(
    db,
    DATASETS.map(d => d.name)
  )
}
