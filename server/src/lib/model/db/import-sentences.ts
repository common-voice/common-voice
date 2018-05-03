import * as fs from 'fs';
import * as path from 'path';
import promisify from '../../../promisify';
import { hash } from '../../clip';
import { randomBucketFromDistribution, rowsToDistribution } from '../split';

const CWD = process.cwd();
const SENTENCES_FOLDER = path.resolve(CWD, 'server/data/');

const CHUNK_SIZE = 50;

function getFileExt(path: string): string {
  const i = path.lastIndexOf('.');
  if (i === -1) {
    return '';
  }
  return path.substr(i - path.length);
}

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

  const locales = ((await new Promise(resolve =>
    fs.readdir(SENTENCES_FOLDER, (dunno, names) => resolve(names))
  )) as string[]).filter(name => name !== 'LICENSE');

  for (const locale of locales) {
    await pool.query('INSERT IGNORE INTO locales (name) VALUES (?)', [locale]);
    let [[{ id: localeId }]] = await pool.query(
      'SELECT id FROM locales WHERE name = ?',
      [locale]
    );

    const [rows] = await pool.query(
      'SELECT bucket, COUNT(bucket) AS count FROM sentences WHERE locale_id = ? GROUP BY bucket',
      [localeId]
    );
    const distribution = rowsToDistribution(rows);

    for (const sentence of await loadSentences(
      path.join(SENTENCES_FOLDER, locale)
    )) {
      const id = hash(sentence);

      const [[sentenceExists]] = await pool.query(
        'SELECT 1 FROM sentences WHERE id = ?',
        [id]
      );

      if (sentenceExists) {
        await pool.query('UPDATE sentences SET is_used = TRUE WHERE id = ?', [
          id,
        ]);
      } else {
        const bucket = randomBucketFromDistribution(distribution);
        distribution[bucket]++;
        await pool.query(
          'INSERT INTO sentences (id, text, is_used, bucket, locale_id) VALUES (?, ?, TRUE, ?, ?)',
          [id, sentence, bucket, localeId]
        );
      }
    }
  }

  const [localeCounts] = (await pool.query(
    `
      SELECT locales.name AS locale, COUNT(*) AS count
      FROM sentences
      LEFT JOIN locales ON locale_id = locales.id
      GROUP BY locale_id
    `
  )) as any;

  print(
    'sentences',
    JSON.stringify(
      localeCounts.reduce((obj: any, { count, locale }: any) => {
        obj[locale] = count;
        return obj;
      }, {})
    )
  );
}
