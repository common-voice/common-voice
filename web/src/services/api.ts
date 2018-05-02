import { Locale } from '../stores/locale';
import { User } from '../stores/user';

export interface Clip {
  id: string;
  glob: string;
  text: string;
  sound: string;
}

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  isJSON?: boolean;
  headers?: {
    [headerName: string]: string;
  };
  body?: any;
}

const API_PATH = location.origin + '/api/v1';
const CLIP_PATH = API_PATH + '/clips';
const SENTENCES_PATH = API_PATH + '/sentences';

export default class API {
  private readonly locale: Locale.State;
  private readonly user: User.State;

  constructor(locale: Locale.State, user: User.State) {
    this.locale = locale;
    this.user = user;
  }

  private fetch(path: string, options: FetchOptions = {}): Promise<any> {
    const { method, headers, body, isJSON } = Object.assign(
      { isJSON: true },
      options
    );
    return new Promise(
      (resolve: (r: any) => void, reject: (r: XMLHttpRequest) => void) => {
        const request = new XMLHttpRequest();
        request.open(method || 'GET', path);

        const finalHeaders = Object.assign(
          {
            'Content-type': isJSON
              ? 'application/json; charset=utf-8'
              : 'text/plain',
          },
          headers
        );

        if (path.startsWith(location.origin)) {
          finalHeaders.uid = this.user.userId;
        }

        for (const header of Object.keys(finalHeaders)) {
          request.setRequestHeader(header, finalHeaders[header]);
        }

        request.addEventListener('load', () => {
          if (request.status === 200) {
            resolve(
              isJSON ? JSON.parse(request.response) : request.responseText
            );
          } else {
            reject(request);
          }
        });
        request.send(body instanceof Blob ? body : JSON.stringify(body));
      }
    );
  }

  fetchRandomSentences(count: number = 1): Promise<string[]> {
    return this.fetch(`${SENTENCES_PATH}?count=${count}`);
  }

  fetchRandomClips(count: number = 1): Promise<Clip[]> {
    return this.fetch(`${CLIP_PATH}?count=${count}`);
  }

  syncDemographics(): Promise<Event> {
    // Note: Do not add more properties of this.user w/o legal review
    const { userId, accent, age, gender } = this.user;
    return this.fetch(API_PATH + '/user_clients/' + userId, {
      method: 'PUT',
      body: { accent, age, gender },
    });
  }

  syncUser(): Promise<any> {
    const {
      age,
      accent,
      email,
      gender,
      hasDownloaded,
      sendEmails,
      userId,
    } = this.user;

    return this.fetch(`${API_PATH}/users/${userId}`, {
      method: 'PUT',
      body: {
        age,
        accent,
        email,
        gender,
        has_downloaded: hasDownloaded,
        send_emails: sendEmails,
      },
    });
  }

  uploadClip(blob: Blob, sentence: string): Promise<void> {
    return this.fetch(CLIP_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': blob.type,
        sentence: encodeURIComponent(sentence),
      },
      body: blob,
    });
  }

  saveVote(id: string, isValid: boolean): Promise<Event> {
    return this.fetch(`${CLIP_PATH}/${id}/votes`, {
      method: 'POST',
      body: { isValid },
    });
  }

  fetchValidatedHours(): Promise<number> {
    return this.fetch(CLIP_PATH + '/validated_hours');
  }

  fetchLocaleMessages(locale: string): Promise<string> {
    return this.fetch(`/locales/${locale}/messages.ftl`, {
      isJSON: false,
    });
  }

  async fetchCrossLocaleMessages(): Promise<string[][]> {
    return Object.entries(await this.fetch(`/cross-locale-messages.json`));
  }

  fetchRequestedLanguages(): Promise<string[]> {
    return this.fetch(`${API_PATH}/requested_languages`);
  }

  requestLanguage(language: string): Promise<void> {
    return this.fetch(`${API_PATH}/requested_languages`, {
      method: 'POST',
      body: { language },
    });
  }

  fetchPontoonLanguages() {
    return this.fetch('https://pontoon.mozilla.org/graphql', {
      method: 'POST',
      body: {
        query: `{
          project(slug: "common-voice") {
            slug
            localizations {
              totalStrings
              approvedStrings
              locale {
                code
                name
                population
              }
            }
          }
        }`,
        variables: null,
      },
    });
  }

  fetchDocument(name: 'privacy' | 'terms'): Promise<string> {
    return this.fetch(`/${name}/${this.locale}.html`, {
      isJSON: false,
    });
  }
}
