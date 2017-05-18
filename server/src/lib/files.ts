const TEMP ='/undefined/0084df77f1837e09e750c66509aaea5c3e0405543413bf52ebad5826e17f5488';

const Promise = require('bluebird');

export default class Files {
  private initialized: boolean;

  constructor() {
    this.initialized = false;
  }

  private ensure(): Promise<any> {
    if (this.initialized) {
      return Promise.resolve();
    }

    return this.init();
  }

  init(): Promise<any> {
    // TODO: Load a list of files from the file system.
    this.initialized = false;
    return Promise.resolve();
  }


  getRandomClip(): Promise<string[2]> {
    return this.ensure().then(() => {
      // TODO: Grab sentences from the file system.
      return Promise.resolve([TEMP, 'This is a HODE CODED sentence.']);
    });
  }
}
