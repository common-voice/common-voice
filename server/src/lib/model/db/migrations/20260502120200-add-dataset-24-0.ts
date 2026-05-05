import {
  insertDatasets,
  deleteDatasetsByName,
  DatasetRegistration,
} from '../migration-helpers/'

const DATASETS: DatasetRegistration[] = [
  {
    name: 'Common Voice Corpus 24.0',
    release_dir: 'cv-corpus-24.0-2025-12-05',
    multilingual: true,
    bundle_date: '2025-12-05',
    release_date: '2025-12-17',
    total_clips_duration: 140161062895,
    valid_clips_duration: 93193530000,
    release_type: 'complete',
    download_path:
      'cv-corpus-24.0-2025-12-05/cv-corpus-24.0-2025-12-05-{locale}.tar.gz',
  },
  {
    name: 'Common Voice Delta Segment 24.0',
    release_dir: 'cv-corpus-24.0-delta-2025-12-05',
    multilingual: true,
    bundle_date: '2025-12-05',
    release_date: '2025-12-17',
    total_clips_duration: 10841370240,
    valid_clips_duration: 4626800000,
    release_type: 'delta',
    download_path:
      'cv-corpus-24.0-delta-2025-12-05/cv-corpus-24.0-delta-2025-12-05-{locale}.tar.gz',
  },
]

export const up = async function (db: any): Promise<any> {
  await insertDatasets(db, DATASETS)
}

export const down = async function (db: any): Promise<any> {
  await deleteDatasetsByName(
    db,
    DATASETS.map(d => d.name)
  )
}
