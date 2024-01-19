import { Age } from './types'

export const AGE_MAPPING: Record<keyof Age, string> = {
  '': 'No information available',
  teens: '< 20',
  twenties: '20 - 29',
  thirties: '30 - 39',
  fourties: '40 - 49',
  fifties: '50 - 59',
  sixties: '60 - 69',
  seventies: '70 - 79',
  eighties: '80 - 89',
  nineties: '90 - 99',
}
