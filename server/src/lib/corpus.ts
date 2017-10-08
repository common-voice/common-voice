import * as path from 'path';
import { getFilesInFolder, getAllFileContents } from './fs-helper';
import { getFileExt } from './utility';

const Random = require('random-js');

const CWD = process.cwd();
const SENTENCE_FOLDER = path.resolve(CWD, 'server/data/');

/**
 * Corpus. Handles local text corpus.
 */
export default class Corpus {
  cache: string[];
  randomEngine: any;

  constructor() {
    this.randomEngine = Random.engines.mt19937();
    this.randomEngine.autoSeed();
  }

  /**
   * Load sentences from file system into memory.
   */
  async loadCache(): Promise<void> {
    this.cache = [];

    // Get all text files in the sentences folder.
    let filePaths = await getFilesInFolder(SENTENCE_FOLDER);
    filePaths = filePaths.filter((name: string) => {
      return getFileExt(name) === '.txt';
    });

    const fileContents = await getAllFileContents(filePaths);

    for (var i = 0; i < fileContents.length; i++) {
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

      // Add any non-black lines to the sentence cache.
      this.cache = this.cache.concat(
        sentences.filter((s: string) => {
          return !!s;
        })
      );
    }
    console.log('finished', this.cache.length);
  }

  /**
   * Get a random sentence from loaded corpus.
   */
  getRandom(): string {
    let distribution = Random.integer(0, this.cache.length - 1);
    return this.cache[distribution(this.randomEngine)];
  }

  /**
   * Get a bunch of random sentences at once.
   */
  getMultipleRandom(count: number): string[] {
    let randoms = [];
    for (var i = 0; i < count; i++) {
      randoms.push(this.getRandom());
    }
    return randoms;
  }
}
