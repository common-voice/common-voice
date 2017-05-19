import { map } from '../promisify';

// This is how many file reads we can do at once.
const BATCH_SIZE = 5;
const UPLOAD_PATH = '../../upload/';

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const walk = require('walk').walk;
const Queue = require('better-queue');

export default class Files {
  private initialized: boolean;
  private files: {};
  private paths: string[];

  constructor() {
    this.initialized = false;
    this.files = {};
  }

  private ensure(): Promise<any> {
    if (this.initialized) {
      return Promise.resolve();
    }

    return this.init();
  }

  /**
   * Get the file extension.
   */
  private getExt(path: string): string {
    return path.substr(path.indexOf('.') - path.length);
  }

  /**
   * Returns the file path with extension stripped.
   */
  private getGlob(path: string): string {
    return path.substr(0, path.indexOf('.'));
  }

  /**
   * Read a sentence in from a file.
   */
  private process(data: any, cb: Function) {
    fs.readFile(data.path, (err: ErrorEvent, txt: Buffer) => {
      if (err) {
        console.error('Could not read file', data.path, err);
        return cb(err);
      }

      let sentence = txt.toString();
      this.files[data.glob].sentence = sentence;
      cb(null);
    });
  }

  private processBatch(batches: any[], cb: Function) {
    map(this, this.process, batches)
      .then(cb)
      .error((err: ErrorEvent) => {
        console.log('got an error pocessing the batches', err);
      });
  }

  /**
   * Load a list of files from the filesystem.
   */
  init(): Promise<any> {
    // Create our batch processing unit, to keep from overloading
    // on boot.
    let batches = new Queue(this.processBatch.bind(this),
      { batchSize: BATCH_SIZE });

    return new Promise((res: Function, rej: Function) => {
      let walker = walk(path.resolve(__dirname, UPLOAD_PATH));

      walker.on('file', (root, fileStats, next) => {
        let file = path.join(root, fileStats.name);
        let glob = this.getGlob(file);
        let ext = this.getExt(file);

        // Track file gobs and extensions of the voice clips.
        if (!this.files[glob]) {
          this.files[glob] = {
            sentence: null,
            ext: null
          }
        }

        // Text files go into our batch processing queue for later reading.
        if (ext === '.txt') {
          batches.push({
            path: file,
            glob: glob
          });
        } else {
          this.files[glob].ext = ext;
        }

        next();
      });

      walker.on('end', () => {
        this.paths = Object.keys(this.files);
        res();
      });
    });
  }

  /**
   * Grab a random sentence and associated sound file path.
   */
  getRandomClip(): Promise<string[2]> {
    return this.ensure().then(() => {
      if (this.paths.length === 0) {
        return null;
      }

      let items = this.paths;
      let path = items[Math.floor(Math.random()*items.length)];
      let file = this.files[path];
      return Promise.resolve([path, file.sentence]);
    });
  }
}
