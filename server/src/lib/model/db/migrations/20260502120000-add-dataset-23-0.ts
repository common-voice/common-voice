import {
  insertDatasets,
  deleteDatasetsByName,
  DatasetRegistration,
} from '../migration-helpers/'

const DATASETS: DatasetRegistration[] = [
  {
    name: 'Common Voice Corpus 23.0',
    release_dir: 'cv-corpus-23.0-2025-09-05',
    multilingual: true,
    bundle_date: '2025-09-05',
    release_date: '2025-09-17',
    total_clips_duration: 129319692655,
    valid_clips_duration: 88566730000,
    release_type: 'complete',
    download_path:
      'cv-corpus-23.0-2025-09-05/cv-corpus-23.0-2025-09-05-{locale}.tar.gz',
  },
  {
    name: 'Common Voice Delta Segment 23.0',
    release_dir: 'cv-corpus-23.0-delta-2025-09-05',
    multilingual: true,
    bundle_date: '2025-09-05',
    release_date: '2025-09-17',
    total_clips_duration: 7582094676,
    valid_clips_duration: 7059001000,
    release_type: 'delta',
    download_path:
      'cv-corpus-23.0-delta-2025-09-05/cv-corpus-23.0-delta-2025-09-05-{locale}.tar.gz',
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
