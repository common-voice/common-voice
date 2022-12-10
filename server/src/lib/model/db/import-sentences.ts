import * as eventStream from 'event-stream';
import * as fs from 'fs';
import * as path from 'path';
import { PassThrough } from 'stream';
import promisify from '../../../promisify';
import { hashSentence } from '../../utility';
import { redis, useRedis } from '../../redis';

const CWD = process.cwd();
const SENTENCES_FOLDER = path.resolve(CWD, 'server/data/');

// for sources with sentences that are likely to have repeats across
// locales, we want to generate a unique hash for each locale + sentence,
// not just each sentence
const LOCALE_HASH_SOURCES = ['singleword-benchmark'];

function print(...args: any[]) {
  args.unshift('IMPORT --');
  console.log.apply(console, args);
}

async function getFilesInFolder(path: string): Promise<string[]> {
  const fileNames = await promisify(fs, fs.readdir, path);
  return fileNames
  .map((name: string) => {
    return path + '/' + name;
  });
}

const SENTENCES_PER_CHUNK = 200;

function streamSentences(localePath: string) {
  const stream = new PassThrough({ objectMode: true });

  getFilesInFolder(localePath)
    .then(p => p.filter((name: string) => name.endsWith('.txt')))
    .then(async filePaths => {
      for (const filePath of filePaths) {
        const source = path.basename(filePath).split('.')[0];
        let sentences: string[] = [];
        function write() {
          stream.write({
            sentences,
            source,
          });
          sentences = [];
        }
        await new Promise(resolve => {
          const fileStream = fs
            .createReadStream(filePath)
            .pipe(eventStream.split())
            .pipe(
              eventStream
                .mapSync((line: string) => {
                  fileStream.pause();

                  sentences.push(line);

                  if (sentences.length >= SENTENCES_PER_CHUNK) {
                    write();
                  }

                  fileStream.resume();
                })
                .on('end', () => {
                  if (sentences.length > 0) {
                    write();
                  }
                  resolve();
                })
            );
        });
      }
      stream.end();
    });

  return stream;
}

async function importLocaleSentences(
  pool: any,
  locale: string,
  version: number
) {
  await pool.query('INSERT IGNORE INTO locales (name) VALUES (?)', [locale]);
  const [[{ localeId }]] = await pool.query(
    'SELECT id AS localeId FROM locales WHERE name = ? LIMIT 1',
    [locale]
  );

  await new Promise(async resolve => {
    print('importing', locale);
    const stream = streamSentences(path.join(SENTENCES_FOLDER, locale));
    stream
      .on(
        'data',
        async ({
          sentences,
          source,
        }: {
          sentences: string[];
          source: string;
        }) => {
          stream.pause();
          try {
            await pool.query(
              `
              INSERT INTO sentences
              (id, text, is_used, locale_id, source, version)
              VALUES ${sentences
                .map(sentence => {
                  return `(${[
                    LOCALE_HASH_SOURCES.includes(source)
                      ? hashSentence(localeId + sentence)
                      : hashSentence(sentence),
                    sentence,
                    true,
                    localeId,
                    source,
                    version,
                  ]
                    .map(v => pool.escape(v))
                    .join(', ')})`;
                })
                .join(', ')}
              ON DUPLICATE KEY UPDATE
                source = VALUES(source),
                version = VALUES(version),
                is_used = VALUES(is_used);
            `
            );
          } catch (e) {
            console.error(
              'error when inserting sentence batch from "',
              sentences[0],
              '" to "',
              sentences[sentences.length - 1],
              '":',
              e
            );
          }
          stream.resume();
        }
      )
      .on('end', resolve);
  });
}

export async function importSentences(pool: any) {
  const oldVersion = Number(
    (await useRedis) ? await redis.get('sentences-version') : 0
  );
  const version = ((oldVersion || 0) + 1) % 256; //== max size of version column
  const locales = (
    (await new Promise(resolve =>
      fs.readdir(SENTENCES_FOLDER, (_, names) => resolve(names))
    )) as string[]
  ).filter(name => name !== 'LICENSE');

  print('locales', locales.join(','));

  for (const locale of locales) {
    if (locale === 'ar') {
      await importLocaleSentences(pool, locale, version);
    }
  }

  (await useRedis) &&
    (await redis.set('sentences-version', version.toString()));

  await pool.query(
    `
      DELETE FROM sentences
      WHERE id NOT IN (SELECT original_sentence_id FROM clips) AND
            id NOT IN (SELECT sentence_id FROM skipped_sentences) AND
            id NOT IN (SELECT sentence_id FROM reported_sentences) AND
            id NOT IN (SELECT sentence_id FROM taxonomy_entries) AND
            version <> ?
    `,
    [version]
  );
  await pool.query(
    `
      UPDATE sentences
      SET is_used = FALSE
      WHERE version <> ?
    `,
    [version]
  );

  const [localeCounts] = (await pool.query(
    `
      SELECT locales.name AS locale, COUNT(*) AS count
      FROM sentences
      LEFT JOIN locales ON locale_id = locales.id
      WHERE is_used
      GROUP BY locale_id
    `
  )) as { locale: string; count: number }[][];

  print(
    'sentences',
    JSON.stringify(
      localeCounts.reduce((obj, { count, locale }) => {
        obj[locale] = count;
        return obj;
      }, {} as { [locale: string]: number }),
      null,
      2
    )
  );
}
