import User from './user';
import AudioIOS from './components/pages/record/audio-ios';

export interface Clip {
  glob: string;
  text: string;
  sound: string;
}

/**
 * Handles any ajax and web 2.0 server ninjas.
 */
export default class API {
  private static DEFAULT_BASE: string = './api/';
  private static SOUNDCLIP_URL: string = '/upload/';
  private static CLIP_VOTE_URL: string = '/upload/vote/';
  private static DEMOGRAPHIC_URL: string = '/upload/demographic/';

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
        if (req.status === 200) {
          res(req);
        } else {
          rej(req);
        }
      };

      req.send(options.body || '');
    });
  }

  private async fetchText(path: string): Promise<any> {
    const req = await this.fetch(path, { responseType: 'text' });
    return req.responseText;
  }

  private requestResourceText(resource: string): Promise<string> {
    return this.fetchText(this.getPath(resource));
  }

  private requestResource(resource: string): Promise<string> {
    return this.fetch(this.getPath(resource));
  }

  private getPath(resource: string): string {
    return API.DEFAULT_BASE + resource;
  }

  async getRandomSentences(count?: number): Promise<string[]> {
    const sentencesText = await this.requestResourceText(
      'sentence' + (count ? '/' + count : '')
    );
    return sentencesText.split('\n');
  }

  getTextFromUrl(url: string): Promise<string> {
    return this.fetchText(url);
  }

  /**
   * Ask the server for a random clip.
   */
  async getRandomClip(): Promise<Clip> {
    const req = await this.fetch('upload/random.json', {
      responseType: 'json',
      headers: { uid: this.user.getId() },
    });

    return req.response;
  }

  castVote(glob: string, vote: boolean): Promise<Event> {
    return new Promise((resolve: EventListener, reject: EventListener) => {
      var req = new XMLHttpRequest();
      req.responseType = 'text';
      req.upload.addEventListener('load', resolve);
      req.upload.addEventListener('error', reject);
      req.open('POST', API.CLIP_VOTE_URL);
      req.setRequestHeader('glob', glob);
      req.setRequestHeader('uid', this.user.getId());
      req.setRequestHeader('vote', encodeURIComponent(vote.toString()));

      req.send(vote);
    });
  }

  uploadDemographicInfo(): Promise<Event> {
    return new Promise((resolve: EventListener, reject: EventListener) => {
      var req = new XMLHttpRequest();
      req.upload.addEventListener('load', resolve);
      req.upload.addEventListener('error', reject);
      req.open('POST', API.DEMOGRAPHIC_URL);
      req.setRequestHeader('uid', this.user.getId());
      // Note: Do not add more properties of this.user w/o legal review
      let demographicInfo = {
        accent: this.user.getState().accent,
        age: this.user.getState().age,
        gender: this.user.getState().gender,
      };
      req.setRequestHeader('demographic', JSON.stringify(demographicInfo));
      req.send(demographicInfo);
    });
  }

  uploadAudio(
    blob: Blob,
    sentence: string,
    progress?: Function
  ): Promise<Event> {
    return new Promise((resolve: EventListener, reject: EventListener) => {
      var req = new XMLHttpRequest();
      req.upload.addEventListener('load', resolve);
      req.upload.addEventListener('error', reject);
      req.open('POST', API.SOUNDCLIP_URL);
      req.setRequestHeader('uid', this.user.getId());
      req.setRequestHeader('sentence', encodeURIComponent(sentence));

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
