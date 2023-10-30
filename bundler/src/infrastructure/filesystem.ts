import fs from 'node:fs'

import { io as IO } from 'fp-ts'

export const prepareDir =
  (dirPath: string): IO.IO<void> =>
  () => {
    console.log(`Creating ${dirPath}`)
    fs.mkdirSync(dirPath, { recursive: true })
  }
