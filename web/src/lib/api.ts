import User from './user';
import AudioIOS from './components/pages/record/audio-ios';

export interface Clip {
  glob: string;
  audio: string;
  sentence: string;
}

/**
 * Handles any ajax and web 2.0 server ninjas.
 */
export default class API {
  private static DEFAULT_BASE: string = './api/';
  private static SOUNDCLIP_URL: string = '/upload/';
  private static CLIP_VOTE_URL: string = '/upload/vote/';

  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  /**
   * Sadly, had to implement fetch myself as it's not supported enough.
   */
  private fetch(path: string, options?: any): Promise<any> {
    options = options || {};
    return new Promise((res: Function, rej: Function) => {
      var req = new XMLHttpRequest();
      req.open(options.type || 'GET', path);

      if (options.headers) {
        Object.keys(options.headers).forEach((header: string) => {
          req.setRequestHeader(header, options.headers[header]);
        });
      }

      if (options.responseType) {
        req.responseType = options.responseType;
      }

      req.onload = () => {
        res(req);
      };
      req.onerror = (err: ErrorEvent) => {
        rej(err);
      };

      req.send(options.body || '');
    });
  }

  private fetchText(path: string, options?: any): Promise<any> {
    return this.fetch(path, options).then((req: XMLHttpRequest) => {
      return req.responseText;
    });
  }

  private requestResourceText(resource): Promise<string> {
    return this.fetchText(this.getPath(resource));
  }

  private requestResource(resource): Promise<string> {
    return this.fetch(this.getPath(resource));
  }

  private getPath(resource: string): string {
    return API.DEFAULT_BASE + resource;
  }

  getRandomSentences(count?: number): Promise<string> {
    return this.requestResourceText('sentence' + (count ? '/' + count : ''));
  }

  /**
   * Ask the server for a clip
   */
  getRandomClip(): Promise<Clip> {
    return this.fetch('upload/random/', { responseType: 'blob' })
      .then((req: XMLHttpRequest) => {
        let src = window.URL.createObjectURL(req.response);
        let glob = decodeURIComponent(req.getResponseHeader('glob'));
        let sentence = decodeURIComponent(req.getResponseHeader('sentence'));
        return Promise.resolve({ glob: glob, audio: src, sentence: sentence });
      });
  }

  castVote(glob: string, vote: boolean): Promise<Event> {
    return new Promise((resolve: EventListener, reject: EventListener) => {
      var req = new XMLHttpRequest();
      req.upload.addEventListener('load', resolve);
      req.upload.addEventListener('error', reject);
      req.open('POST', API.CLIP_VOTE_URL);
      req.setRequestHeader('glob', glob);
      req.setRequestHeader('uid', this.user.getId());
      req.setRequestHeader('vote', encodeURIComponent(vote.toString()));

      req.send(vote);
    });
  }

  uploadAudio(blob: Blob, sentence: string, progress?: Function): Promise<Event> {
    return new Promise((resolve: EventListener, reject: EventListener) => {
      var req = new XMLHttpRequest();
      req.upload.addEventListener('load', resolve);
      req.upload.addEventListener('error', reject);
      req.open('POST', API.SOUNDCLIP_URL);
      req.setRequestHeader('uid', this.user.getId());
      req.setRequestHeader('sentence',
        encodeURIComponent(sentence));

      // For IOS, we don't upload binary data but base64. Here we
      // make sure the server knows what to expect.
      if (blob.type === AudioIOS.AUDIO_TYPE) {
        req.setRequestHeader('content-type', AudioIOS.AUDIO_TYPE);
      }

      if (progress) {
        req.addEventListener('progress', evt => {
          let total = evt.lengthComputable ? evt.total : 100;
          progress(100 * evt.loaded / total);
        });
      }

      req.send(blob);
    });
  }
}
