import { LanguageStats } from '../../../common/language-stats';
import { Locale } from '../stores/locale';
import { User } from '../stores/user';
import { Recordings } from '../stores/recordings';

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

    const finalHeaders = Object.assign(
      isJSON
        ? {
            'Content-Type': 'application/json; charset=utf-8',
          }
        : {},
      headers
    );

    if (path.startsWith(location.origin)) {
      finalHeaders.uid = this.user.userId;
    }

    return fetch(path, {
      method: method || 'GET',
      headers: finalHeaders,
      body: body
        ? body instanceof Blob ? body : JSON.stringify(body)
        : undefined,
    }).then(response => (isJSON ? response.json() : response.text()));
  }

  getLocalePath() {
    return API_PATH + '/' + this.locale;
  }

  getClipPath() {
    return this.getLocalePath() + '/clips';
  }

  fetchRandomSentences(count: number = 1): Promise<Recordings.Sentence[]> {
    return this.fetch(`${this.getLocalePath()}/sentences?count=${count}`);
  }

  fetchRandomClips(count: number = 1): Promise<Clip[]> {
    return this.fetch(`${this.getClipPath()}?count=${count}`);
  }

  syncDemographics(): Promise<Event> {
    // Note: Do not add more properties of this.user w/o legal review
    const { userId, accents, age, gender } = this.user;
    return this.fetch(API_PATH + '/user_clients/' + userId, {
      method: 'PUT',
      body: { accents, age, gender },
    });
  }

  syncUser(): Promise<any> {
    const {
      age,
      accents,
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
        accents,
        email,
        gender,
        has_downloaded: hasDownloaded,
        send_emails: sendEmails,
      },
    });
  }

  uploadClip(blob: Blob, sentenceId: string, sentence: string): Promise<void> {
    return this.fetch(this.getClipPath(), {
      method: 'POST',
      headers: {
        'Content-Type': blob.type,
        sentence: encodeURIComponent(sentence),
        sentence_id: sentenceId,
      },
      body: blob,
    });
  }

  saveVote(id: string, isValid: boolean): Promise<Event> {
    return this.fetch(`${this.getClipPath()}/${id}/votes`, {
      method: 'POST',
      body: { isValid },
    });
  }

  fetchValidatedHours(): Promise<number> {
    return this.fetch(this.getClipPath() + '/validated_hours');
  }

  fetchDailyClipsCount(): Promise<number> {
    return this.fetch(this.getClipPath() + '/daily_count');
  }

  fetchDailyVotesCount(): Promise<number> {
    return this.fetch(this.getClipPath() + '/votes/daily_count');
  }

  fetchLocaleMessages(locale: string): Promise<string> {
    return this.fetch(`/locales/${locale}/messages.ftl`, {
      isJSON: false,
    });
  }

  async fetchCrossLocaleMessages(): Promise<string[][]> {
    return Object.entries(
      await this.fetch(`/cross-locale-messages.json`)
    ) as string[][];
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

  async fetchLanguageStats(): Promise<LanguageStats> {
    return this.fetch(`${API_PATH}/language_stats`);
  }

  fetchDocument(name: 'privacy' | 'terms'): Promise<string> {
    return this.fetch(`/${name}/${this.locale}.html`, {
      isJSON: false,
    });
  }

  skipSentence(id: string) {
    return this.fetch(`${API_PATH}/skipped_sentences/` + id, {
      method: 'POST',
    });
  }
}
