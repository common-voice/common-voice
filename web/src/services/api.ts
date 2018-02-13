import { User } from '../stores/user';
import AudioIOS from '../components/pages/record/audio-ios';

export interface Clip {
  id: string;
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
  private static SOUNDCLIP_URL: string = '/api/upload/';
  private static CLIP_VOTE_URL: string = '/api/upload/vote/';
  private static DEMOGRAPHIC_URL: string = '/api/upload/demographic/';

  private user: User.State;

  constructor(user: User.State) {
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
    const { response } = await this.fetch('api/upload/random.json', {
      responseType: 'json',
      headers: { uid: this.user.userId },
    });

    return typeof response == 'string' ? JSON.parse(response) : response;
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

  castVote(glob: string, id: string, vote: boolean): Promise<Event> {
    const headers = {
      glob,
      clip_id: id,
      uid: this.user.userId,
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
      accent: this.user.accent,
      age: this.user.age,
      gender: this.user.gender,
    };

    const headers = {
      uid: this.user.userId,
      demographic: JSON.stringify(demographicInfo),
    };

    return this.createPostRequest(API.DEMOGRAPHIC_URL, headers, req => {
      req.send(demographicInfo);
    });
  }

  uploadAudio(blob: Blob, sentence: string): Promise<Event> {
    const headers: HeadersMap = {
      uid: this.user.userId,
      sentence: encodeURIComponent(sentence),
    };

    // For IOS, we don't upload binary data but base64. Here we
    // make sure the server knows what to expect.
    if (blob.type === AudioIOS.AUDIO_TYPE) {
      headers['content-type'] = AudioIOS.AUDIO_TYPE;
    }

    return this.createPostRequest(API.SOUNDCLIP_URL, headers, req => {
      req.send(blob);
    });
  }

  async syncUser(): Promise<any> {
    const {
      age,
      accent,
      email,
      gender,
      hasDownloaded,
      sendEmails,
      userId,
    } = this.user;

    return this.createPostRequest(
      API.USER_URL,
      {
        'Content-Type': 'application/json',
        uid: userId,
      },
      req => {
        req.send(
          JSON.stringify({
            age,
            accent,
            email,
            gender,
            has_downloaded: hasDownloaded,
            send_emails: sendEmails,
          })
        );
      }
    );
  }

  async fetchValidatedHours(): Promise<number> {
    return parseInt(
      (await this.fetch('/api/upload/hours', {
        responseType: 'text',
      })).responseText,
      10
    );
  }

  async fetchLocale(locale: string): Promise<string> {
    const { response } = await this.fetch(`/locales/${locale}/messages.ftl`);
    return response;
  }
}
