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

export type Age = {
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

export type Gender = {
  '': number
  male_masculine: number
  female_feminine: number
  intersex: number
  transgender: number
  'non-binary': number
  do_not_wish_to_say: number
}
