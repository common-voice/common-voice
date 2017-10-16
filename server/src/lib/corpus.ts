import * as path from 'path';
import { getFilesInFolder, getAllFileContents } from './fs-helper';
import { getFileExt } from './utility';
import * as Random from 'random-js';

const CWD = process.cwd();
const SENTENCE_FOLDER = path.resolve(CWD, 'server/data/');
const UNUSED_FOLDER = path.join(SENTENCE_FOLDER, 'not-used');

/**
 * Corpus. Handles local text corpus.
 */
export default class Corpus {
  cache: string[];
  deactive: string[];
  sources: number;
  randomEngine: any;

  constructor() {
    this.randomEngine = Random.engines.mt19937();
    this.randomEngine.autoSeed();
  }

  /**
   * Log corpus level messages in a common format.
   */
  private print(...args: any[]) {
    args.unshift('CORPUS --');
    console.log.apply(console, args);
  }

  /**
   * Load txt files from path, and parse into an array of lines.
   */
  private async loadSentences(path: string): Promise<string[]> {
    this.sources = 0;
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

      ++this.sources;

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
    this.print(`${this.cache.length} sentences loaded`);
  }

  async loadCacheDeactive(): Promise<void> {
    if (this.deactive) {
      return;
    }
    this.deactive = await this.loadSentences(UNUSED_FOLDER);
    this.print(`${this.deactive.length} deactive sentences loaded`);
  }

  /**
   * Display a nice count of the senteces in our corpus.
   */
  async displayMetrics(): Promise<void> {
    await this.loadCache();
    const sources = this.sources;
    await this.loadCacheDeactive();
    const dSources = this.sources;
    console.log(`\nActive: ${this.cache.length} lines from ${sources} sources`);
    console.log(
      `Deactive: ${this.deactive.length} lines from ${dSources} sources\n`
    );
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
