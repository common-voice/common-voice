import * as fs from 'fs';
import * as path from 'path';
const utf8 = require('utf8');
import promisify from '../../../promisify';
import { getFileExt } from '../../utility';
import { hash } from '../../clip';

const CWD = process.cwd();
const SENTENCE_FOLDER = path.resolve(CWD, 'server/data/');
const UNUSED_FOLDER = path.join(SENTENCE_FOLDER, 'not-used');

const CHUNK_SIZE = 50;

function print(...args: any[]) {
  args.unshift('IMPORT --');
  console.log.apply(console, args);
}

/**
 * This is a job queue that will only process CHUNK_SIZE jobs concurrently.
 */
async function processInChunks(
  list: any[],
  context: any,
  method: Function
): Promise<any> {
  // Trap function for ignoring inividual task errors.
  let trap = (err: any) => {
    console.error('chunked job fail', err.code);
  };

  let resultList: string[] = [];
  let i = 0;

  // Run chunk of tasks until we have processed everything.
  while (i < list.length) {
    // Calculate the size of current chunk.
    // If we are at the last chunk, calculate how many tasks are left.
    let size = i + CHUNK_SIZE > list.length ? list.length - i : CHUNK_SIZE;
    const slice = new Array(size);

    // Store tasks promises in chunk sized array to process concurrently.
    for (let j = 0; j < size; j++) {
      let params = list[i + j];
      // Trap and essentially ignore any read errors.
      slice[j] = promisify(context, method, params).catch(trap);
    }

    // We already trap errors, so simply await for all tasks to finish.
    let results = await Promise.all(slice);
    resultList = resultList.concat(results);
    i += size;
  }

  return resultList;
}

async function getFilesInFolder(path: string): Promise<string[]> {
  const fileNames = await promisify(fs, fs.readdir, path);
  return fileNames.map((name: string) => {
    return path + '/' + name;
  });
}

/**
 * Get all the contents from a list of files.
 */
async function getAllFileContents(fileList: string[]): Promise<any> {
  const withEncoding = fileList.map((fileName: string) => {
    return [fileName, 'utf8'];
  });
  return await processInChunks(withEncoding, fs, fs.readFile);
}

const loadSentences = async (path: string): Promise<string[]> => {
  let allSentences: string[] = [];
  // Get all text files in the sentences folder.
  const filePaths = (await getFilesInFolder(path)).filter(
    (name: string) => getFileExt(name) === '.txt'
  );

  const fileContents = await getAllFileContents(filePaths);

  for (let i = 0; i < fileContents.length; i++) {
    const content = fileContents[i];
    if (!content) {
      console.error('missing file content', filePaths[i]);
      continue;
    }

    const sentences = content.split('\n');
    if (sentences.length < 1) {
      console.error('empty file content', filePaths[i]);
      continue;
    }

    allSentences = allSentences.concat(sentences.filter((s: string) => !!s));
  }

  return allSentences;
};

export async function importSentences(pool: any) {
  await pool.query(
    'DELETE FROM sentences WHERE id NOT IN (SELECT original_sentence_id FROM clips)'
  );
  await pool.query('UPDATE sentences SET is_used = FALSE');

  for (const sentence of await loadSentences(SENTENCE_FOLDER)) {
    const encodedSentence = utf8.encode(sentence).trim();
    await pool.query(
      'INSERT INTO sentences (id, text, is_used) VALUES (?, ?, TRUE) ON DUPLICATE KEY UPDATE is_used = TRUE',
      [hash(encodedSentence), encodedSentence]
    );
  }

  for (const sentence of await loadSentences(UNUSED_FOLDER)) {
    const encodedSentence = utf8.encode(sentence).trim();
    await pool.query(
      'INSERT INTO sentences (id, text, is_used) VALUES (?, ?, FALSE) ON DUPLICATE KEY UPDATE is_used = FALSE',
      [hash(encodedSentence), encodedSentence]
    );
  }

  const [[{ count }]] = (await pool.query(
    'SELECT COUNT(*) AS count FROM sentences'
  )) as any;

  print(count, 'sentences');
}
