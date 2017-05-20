import { map } from '../promisify';
import { getFileExt } from './utility';

// This is how many file reads we can do at once.
const BATCH_SIZE = 5;
const UPLOAD_PATH = '../../upload/';

// Files we want to convert to mp3.
const CONVERTABLE_EXTS = ['.ogg', '.m4a'];
const MP3_EXT = '.mp3';

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const walk = require('walk').walk;
const Queue = require('better-queue');
const spawn = require('child_process').spawn;

export default class Files {
  private initialized: boolean;
  private files: {
    // fileGlob: [
    //   sentence: 'the text of the sentenct',
    //   exts : ['.txt', '.ogg', '.mp3', etc..]
    // ]
  };
  private paths: string[];
  private mp3s: string[];

  constructor() {
    this.initialized = false;
    this.files = {};
    this.paths = [];
    this.mp3s = [];
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
   * Find the uploads that haven't been converted to mp3.
   */
  private getMissingMP3s() {
    let missing = [];
    this.paths.forEach((path: string) => {
      if (this.files[path].exts.indexOf(MP3_EXT) === -1) {
        missing.push(path);
      }
    });

    return missing;
  }

  private convert(jobs: any, cb: Function) {
    if (!Array.isArray(jobs)) {
      jobs = [jobs];
    }

    let finished = 0;
    jobs.forEach(job => {
      let glob = job.glob;
      let ext = job.ext;
      let proc = spawn('ffmpeg', ['-i', glob + ext, glob + MP3_EXT]);

      proc.on('close', () => {
        this.files[glob].exts.push(MP3_EXT);
        ++finished;
        if (finished === jobs.length) {
          cb();
        }
      });

      proc.on('error', (err: ErrorEvent) => {
        console.error('could not spawn task', err);
        cb();
      });
    });
  }

  /**
   * Convert any sound clips that are not mp3 format into mp3.
   */
  private convertMissingToMP3s(): Promise<any> {
    let missing = this.getMissingMP3s();
    if (missing.length < 1) {
      // Nothing to convert, so we are done here;
      return Promise.resolve();
    }

    return new Promise((res: Function, rej: Function) => {

      let batches = new Queue(this.convert.bind(this), { batchSize: 5 });
      batches.on('error', (err: any) => {
        console.error('error process mp3 conversions', err);
        rej(err);
        return;
      });

      missing.forEach(glob => {
        let ext;
        let info = this.files[glob];
        for (let i = 0; i < info.exts.length; i++) {
          if (CONVERTABLE_EXTS.indexOf(info.exts[i]) !== -1) {
            ext = info.exts[i];
            break;
          }
        }

        // If we got a convertable extension, add it to our task queue
        if (ext) {
          batches.push({
            glob: glob,
            ext: ext
          });
        }
      });

      batches.on('drain', () => {
        console.log(`Converted ${missing.length} files to mp3.`);
        res();
      });
    });
  }

  /**
   * Make a list of mp3s so we can randomly choose one later.
   */
  private generateMP3List() {
    this.mp3s = [];
    this.paths.forEach(glob => {
      if (this.files[glob].exts.indexOf(MP3_EXT) !== -1) {
        this.mp3s.push(glob);
      }
    });
  }

  /**
   * Load a list of files from the filesystem.
   */
  init(): Promise<any> {
    // Create our batch processor to help us read all sentences
    // from the filesystem without overloading the server.
    let batches = new Queue(this.processBatch.bind(this),
      { batchSize: BATCH_SIZE });

    return new Promise((res: Function, rej: Function) => {
      let walker = walk(path.resolve(__dirname, UPLOAD_PATH));

      walker.on('file', (root, fileStats, next) => {
        let file = path.join(root, fileStats.name);
        let glob = this.getGlob(file);
        let ext = getFileExt(file);

        // Track file gobs and extensions of the voice clips.
        if (!this.files[glob]) {
          this.files[glob] = {
            sentence: null,
            exts: []
          }
        }

        // Text files go into our batch processing queue for later reading.
        if (ext === '.txt') {
          batches.push({
            path: file,
            glob: glob
          });
        } else {
          this.files[glob].exts.push(ext);
        }

        next();
      });

      walker.on('end', () => {
        this.paths = Object.keys(this.files);
        if (this.paths.length === 0) {
          // No files found, so we are done
          console.log('warning, no sound files found');
          this.initialized = true;
          res();
          return;
        }

        // Convert any files that haven't been converted to mp3 yet.
        this.convertMissingToMP3s().then(() => {
          this.generateMP3List();
          this.initialized = true;
          res();
        });
      });
    });
  }

  /**
   * Grab a random sentence and associated sound file path.
   */
  getRandomClip(): Promise<string[2]> {
    // If we haven't been initialized yet, we cannot get a random clip.
    if (!this.initialized) {
      console.error('cannot get random clip before files is initialized');
      return Promise.reject('Files not init.');
    }

    // Make sure we have at least 1 file to choose from.
    if (this.mp3s.length === 0) {
      return Promise.reject('No files.');
    }

    let items = this.mp3s;
    let glob = items[Math.floor(Math.random()*items.length)];
    let file = glob + MP3_EXT;
    let info = this.files[glob];
    return Promise.resolve([file, info.sentence]);
  }
}
