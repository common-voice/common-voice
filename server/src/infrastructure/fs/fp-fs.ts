import * as fs from 'fs'
import * as path from 'path'

import * as IO from 'fp-ts/IO'

/**
 * Recursively collect all files with a specific extension within a directory.
 *
 * @param dirPath - The directory path to start the search.
 * @param fileType - The file extension to search for (e.g., '.ftl').
 * @returns - A list of paths to files with the specified extension.
 */
export function collectFilesWithExtension(
  dirPath: string,
  fileType: string
): IO.IO<string[]> {
  return () => {
    let filesWithExtension: string[] = []

    // Read the contents of the directory
    const items = fs.readdirSync(dirPath)

    items.forEach(item => {
      const itemPath = path.join(dirPath, item)
      const stat = fs.statSync(itemPath)

      if (stat.isDirectory()) {
        // If the item is a directory, recurse into it
        filesWithExtension = filesWithExtension.concat(
          collectFilesWithExtension(itemPath, fileType)()
        )
      } else if (stat.isFile() && item.endsWith(fileType)) {
        // If the item is a file and ends with the specified extension, add it to the list
        filesWithExtension.push(itemPath)
      }
    })

    return filesWithExtension
  }
}

/**
 * Reads the content of a list of files and concatenates their content.
 *
 * @param filePaths - The list of file paths to read and concatenate.
 * @returns - A string containing the concatenated content of the files.
 */
export function readAndConcatFiles(filePaths: string[]): IO.IO<string> {
  return () => {
    let concatenatedContent = ''

    filePaths.forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8')
      concatenatedContent += content + '\n' // Add a newline to separate contents of different files
    })

    return concatenatedContent
  }
}

/**
 * Gets all folder names inside a given directory.
 *
 * @param dirPath - The directory path to start the search.
 * @returns - A list of folder names inside the directory.
 */
export function getFolderNames(dirPath: string): IO.IO<string[]> {
  return () => {
    // Read the contents of the directory
    const items = fs.readdirSync(dirPath)

    // Filter the items to include only directories
    const folders = items.filter(item => {
      const itemPath = path.join(dirPath, item)
      return fs.statSync(itemPath).isDirectory()
    })

    return folders
  }
}
