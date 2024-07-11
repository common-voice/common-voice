import * as fs from 'fs'
import * as path from 'path'
import * as React from 'react'
import { LocalizationProvider, ReactLocalization } from '@fluent/react'

import { asBundleGenerator } from '../src/services/localization'

function collectFilesWithExtension(
  dirPath: string,
  fileType: string
): string[] {
  let filesWithExtension: string[] = []

  // Read the contents of the directory
  const items = fs.readdirSync(dirPath)

  items.forEach(item => {
    const itemPath = path.join(dirPath, item)
    const stat = fs.statSync(itemPath)

    if (stat.isDirectory()) {
      // If the item is a directory, recurse into it
      filesWithExtension = filesWithExtension.concat(
        collectFilesWithExtension(itemPath, fileType)
      )
    } else if (stat.isFile() && item.endsWith(fileType)) {
      // If the item is a file and ends with the specified extension, add it to the list
      filesWithExtension.push(itemPath)
    }
  })

  return filesWithExtension
}

function readAndConcatFiles(filePaths: string[]): string {
  let concatenatedContent = ''

  filePaths.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8')
    concatenatedContent += content + '\n' // Add a newline to separate contents of different files
  })

  return concatenatedContent
}

function readENMessageFile() {
  const filepath = path.resolve(__dirname, '../locales/en')
  return readAndConcatFiles(collectFilesWithExtension(filepath, '.ftl'))
}

function createMockLocalization() {
  const localeMessages = [['en', readENMessageFile()]]
  return new ReactLocalization(asBundleGenerator(localeMessages))
}

const MOCK_LOCALIZATION = createMockLocalization()

function MockLocalizationProvider({ children }: { children: React.ReactNode }) {
  return (
    <LocalizationProvider l10n={MOCK_LOCALIZATION}>
      {children}
    </LocalizationProvider>
  )
}

export default MockLocalizationProvider
