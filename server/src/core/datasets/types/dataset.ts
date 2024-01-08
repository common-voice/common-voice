export type DatasetStatistics = {
  id: number
  dataset_id: number
  locale_id: number
  total_clips_duration: number
  valid_clips_duration: number
  average_clips_duration: number
  total_users: number
  size: number
  checksum: string
  release_date: string
  name: string
  release_dir: string
  download_path: string
  splits: DatasetSplits
}

export type DatasetSplits = {
  gender: {
    male: number
    female: number
    other: number
  }
  age: {
    twenties: number
    thirties: number
    teens: number
    fourties: number
    fifties: number
    sixties: number
    seventies: number
    eighties: number
    nineties: number
  }
}
