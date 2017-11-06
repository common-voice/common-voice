import User from './user';
import AudioIOS from './components/pages/record/audio-ios';

export interface Clip {
  glob: string;
  text: string;
  sound: string;
}

interface HeadersMap {
  [headerName: string]: string;
}

interface FetchOptions {
  type?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  responseType?: XMLHttpRequestResponseType;
  headers?: HeadersMap;
  body?: any;
}

/**
 * Handles any ajax and web 2.0 server ninjas.
 */
export default class API {
  private static DEFAULT_BASE: string = './api/';
  private static USER_URL: string = '/api/user/';
  private static SOUNDCLIP_URL: string = '/upload/';
  private static CLIP_VOTE_URL: string = '/upload/vote/';
  private static DEMOGRAPHIC_URL: string = '/upload/demographic/';

  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  /**
   * Sadly, had to implement fetch ourselves as it's not supported enough.
   * See: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   */
  private fetch(
    path: string,
    options: FetchOptions = {}
  ): Promise<XMLHttpRequest> {
    return new Promise(
      (
        resolve: (r: XMLHttpRequest) => void,
        reject: (r: XMLHttpRequest) => void
      ) => {
        const req = new XMLHttpRequest();
        req.open(options.type || 'GET', path);

        if (options.headers) {
          Object.keys(options.headers).forEach((header: string) => {
            req.setRequestHeader(header, options.headers[header]);
          });
        }

        if (options.responseType) {
          req.responseType = options.responseType;
        }

        req.addEventListener('load', () => {
          if (req.status === 200) {
            resolve(req);
          } else {
            reject(req);
          }
        });

        req.send(options.body || null);
      }
    );
  }

  private async fetchText(path: string): Promise<any> {
    const req = await this.fetch(path, { responseType: 'text' });
    return req.responseText;
  }

  private requestResourceText(resource: string): Promise<string> {
    return this.fetchText(this.getPath(resource));
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

  /**
   * Create a new XMLHttpRequest with method 'POST', to the given `url`, using
   * the given `headers` for the request.
   * 
   * **IMPORTANT:** The created request is not sent by this method. You have
   * to invoke the request's `send()` method yourself in the `requestCallback`
   * that you pass to this method!
   * 
   * @returns A Promise that resolves to the success event when the POST 
   *   request succeeds, or rejects with the error event if an error occurs.
   */
  private createPostRequest(
    url: string,
    headers: HeadersMap,
    requestCallback: (request: XMLHttpRequest) => void
  ) {
    return new Promise((resolve: EventListener, reject: EventListener) => {
      const req = new XMLHttpRequest();
      req.upload.addEventListener('load', resolve);
      req.upload.addEventListener('error', reject);
      req.open('POST', url);

      Object.keys(headers).forEach((header: string) => {
        req.setRequestHeader(header, headers[header]);
      });

      requestCallback && requestCallback(req);
    });
  }

  castVote(glob: string, vote: boolean): Promise<Event> {
    const headers = {
      glob,
      uid: this.user.getId(),
      vote: encodeURIComponent(vote.toString()),
    };

    return this.createPostRequest(API.CLIP_VOTE_URL, headers, req => {
      req.responseType = 'text';
      req.send(vote);
    });
  }

  uploadDemographicInfo(): Promise<Event> {
    // Note: Do not add more properties of this.user w/o legal review
    const demographicInfo = {
      accent: this.user.getState().accent,
      age: this.user.getState().age,
      gender: this.user.getState().gender,
    };

    const headers = {
      uid: this.user.getId(),
      demographic: JSON.stringify(demographicInfo),
    };

    return this.createPostRequest(API.DEMOGRAPHIC_URL, headers, req => {
      req.send(demographicInfo);
    });
  }

  uploadAudio(
    blob: Blob,
    sentence: string,
    progress?: Function
  ): Promise<Event> {
    const headers: HeadersMap = {
      uid: this.user.getId(),
      sentence: encodeURIComponent(sentence),
    };

    // For IOS, we don't upload binary data but base64. Here we
    // make sure the server knows what to expect.
    if (blob.type === AudioIOS.AUDIO_TYPE) {
      headers['content-type'] = AudioIOS.AUDIO_TYPE;
    }

    return this.createPostRequest(API.SOUNDCLIP_URL, headers, req => {
      if (progress) {
        req.addEventListener('progress', evt => {
          let total = evt.lengthComputable ? evt.total : 100;
          progress(100 * evt.loaded / total);
        });
      }

      req.send(blob);
    });
  }

  async syncUser(): Promise<Event> {
    const headers = {
      uid: this.user.getId(),
    };

    const body = {
      email: this.user.getEmail(),
    };

    return this.createPostRequest(API.USER_URL, headers, req => {
      req.send(JSON.stringify(body));
    });
  }
}
