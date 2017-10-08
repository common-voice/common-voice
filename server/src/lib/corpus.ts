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
   * Load txt files from path, and parse into an array of lines.
   */
  private async loadSentences(path: string): Promise<string[]> {
    let allSentences: string[] = [];
    // Get all text files in the sentences folder.
    let filePaths = await getFilesInFolder(path);
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

      allSentences = allSentences.concat(
        sentences.filter((s: string) => {
          return !!s;
        })
      );
    }

    return allSentences;
  }

  /**
   * Load sentences from file system into memory.
   */
  async loadCache(): Promise<void> {
    if (this.cache) {
      return;
    }
    this.cache = await this.loadSentences(SENTENCE_FOLDER);
    console.log(`corpus loaded ${this.cache.length} sentences`);
  }

  /**
   * Get a random sentence from loaded corpus.
   */
  getRandom(): string {
    if (!this.cache) {
      return null;
    }
    let distribution = Random.integer(0, this.cache.length - 1);
    return this.cache[distribution(this.randomEngine)];
  }

  /**
   * Get a bunch of random sentences at once.
   */
  getMultipleRandom(count: number): string[] {
    if (!this.cache) {
      return null;
    }
    let randoms = [];
    for (var i = 0; i < count; i++) {
      randoms.push(this.getRandom());
    }
    return randoms;
  }
}
