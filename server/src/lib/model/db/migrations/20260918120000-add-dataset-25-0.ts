import {
  insertDatasets,
  deleteDatasetsByName,
  DatasetRegistration,
} from '../migration-helpers/'

const DATASETS: DatasetRegistration[] = [
  {
    name: 'Common Voice Corpus 25.0',
    release_dir: 'cv-corpus-25.0-2026-03-09',
    multilingual: true,
    bundle_date: '2026-03-09',
    release_date: '2026-03-18',
    total_clips_duration: 150455392087,
    valid_clips_duration: 102162829000,
    release_type: 'complete',
    download_path:
      'cv-corpus-25.0-2026-03-09/cv-corpus-25.0-2026-03-09-{locale}.tar.gz',
  },
  {
    name: 'Common Voice Delta Segment 25.0',
    release_dir: 'cv-corpus-25.0-delta-2026-03-09',
    multilingual: true,
    bundle_date: '2026-03-09',
    release_date: '2026-03-18',
    total_clips_duration: 11198548944,
    valid_clips_duration: 2821693000,
    release_type: 'delta',
    download_path:
      'cv-corpus-25.0-delta-2026-03-09/cv-corpus-25.0-delta-2026-03-09-{locale}.tar.gz',
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
