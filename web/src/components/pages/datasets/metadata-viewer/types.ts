export type LanguageDataset = {
  id: number
  dataset_id: number
  locale_id: number
  total_clips_duration: number
  valid_clips_duration: number
  average_clips_duration: number
  total_users: number
  size: number
  checksum: string
  release_date: Date
  name: string
  release_dir: string
  download_path: string
  splits?: Splits
}

export type Splits = {
  gender: Gender
  age: Age
}

type Age = {
  '': number
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

type Gender = {
  '': number
  male: number
  female: number
  other: number
}
