export type Project = 'spontaneous-speech' | 'common-voice'

export const isProject = (value: any): value is Project => {
  return value === 'spontaneous-speech' || value === 'common-voice'
}
