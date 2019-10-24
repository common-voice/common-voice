import { AllGoals, CustomGoalParams } from 'common/goals';
import { LanguageStats } from 'common/language-stats';
import { UserClient } from 'common/user-clients';
import { WeeklyChallenge, Challenge } from 'common/challenge';
import { Locale } from '../stores/locale';
import { User } from '../stores/user';
import { USER_KEY } from '../stores/root';
import { Sentences } from '../stores/sentences';

export interface Clip {
  id: string;
  glob: string;
  text: string;
  sound: string;
}

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
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

  private async fetch(path: string, options: FetchOptions = {}): Promise<any> {
    const { method, headers, body, isJSON } = Object.assign(
      {
        isJSON: true,
      },
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

    const { user } = this;
    if (path.startsWith(location.origin) && !user.account && user.userId) {
      finalHeaders['Authorization'] =
        'Basic ' + btoa(user.userId + ':' + user.authToken);
    }

    const response = await fetch(path, {
      method: method || 'GET',
      headers: finalHeaders,
      credentials: 'same-origin',
      body: body
        ? body instanceof Blob
          ? body
          : JSON.stringify(body)
        : undefined,
    });
    if (response.status == 401) {
      localStorage.removeItem(USER_KEY);
      location.reload();
      return;
    }
    if (response.status >= 400) {
      if (response.statusText === 'save_clip_error') {
        throw new Error(response.statusText);
      }
      throw new Error(await response.text());
    }
    return isJSON ? response.json() : response.text();
  }

  forLocale(locale: string) {
    return new API(locale, this.user);
  }

  getLocalePath() {
    return this.locale ? API_PATH + '/' + this.locale : API_PATH;
  }

  getClipPath() {
    return this.getLocalePath() + '/clips';
  }

  fetchRandomSentences(count: number = 1): Promise<Sentences.Sentence[]> {
    return this.fetch(`${this.getLocalePath()}/sentences?count=${count}`);
  }

  fetchRandomClips(count: number = 1): Promise<Clip[]> {
    return this.fetch(`${this.getClipPath()}?count=${count}`);
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
      body: {
        isValid,
      },
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
    return this.fetch(`/locales/${locale}/messages.ftl`, { isJSON: false });
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
      body: {
        language,
      },
    });
  }

  async fetchLanguageStats(): Promise<LanguageStats> {
    return this.fetch(`${API_PATH}/language_stats`);
  }

  fetchDocument(name: 'privacy' | 'terms'): Promise<string> {
    return this.fetch(`/${name}/${this.locale}.html`, { isJSON: false });
  }

  skipSentence(id: string) {
    return this.fetch(`${API_PATH}/skipped_sentences/` + id, {
      method: 'POST',
    });
  }

  fetchClipsStats(
    locale?: string
  ): Promise<
    {
      date: string;
      total: number;
      valid: number;
    }[]
  > {
    return this.fetch(API_PATH + (locale ? '/' + locale : '') + '/clips/stats');
  }

  fetchClipVoices(
    locale?: string
  ): Promise<
    {
      date: string;
      value: number;
    }[]
  > {
    return this.fetch(
      API_PATH + (locale ? '/' + locale : '') + '/clips/voices'
    );
  }

  fetchContributionActivity(
    from: 'you' | 'everyone',
    locale?: string
  ): Promise<
    {
      date: string;
      value: number;
    }[]
  > {
    return this.fetch(
      API_PATH +
        (locale ? '/' + locale : '') +
        '/contribution_activity?from=' +
        from
    );
  }

  fetchUserClients(): Promise<UserClient[]> {
    return this.fetch(API_PATH + '/user_clients');
  }

  fetchAccount(): Promise<UserClient> {
    return this.fetch(API_PATH + '/user_client');
  }

  saveAccount(data: UserClient): Promise<UserClient> {
    return this.fetch(API_PATH + '/user_client', {
      method: 'PATCH',
      body: data,
    });
  }

  subscribeToNewsletter(email: string): Promise<void> {
    return this.fetch(API_PATH + '/newsletter/' + email, { method: 'POST' });
  }

  saveAvatar(type: 'default' | 'file' | 'gravatar', file?: Blob) {
    return this.fetch(API_PATH + '/user_client/avatar/' + type, {
      method: 'POST',
      isJSON: false,
      ...(file
        ? {
            body: file,
          }
        : {}),
    }).then(body => JSON.parse(body));
  }

  saveAvatarClip(blob: Blob): Promise<void> {
    return this.fetch(API_PATH + '/user_client/avatar_clip', {
      method: 'POST',
      headers: {
        'Content-Type': blob.type,
      },
      body: blob,
    })
      .then(body => body)
      .catch(err => err);
  }

  fetchAvatarClip() {
    return this.fetch(API_PATH + '/user_client/avatar_clip');
  }

  deleteAvatarClip() {
    return this.fetch(API_PATH + '/user_client/delete_avatar_clip');
  }

  fetchLeaderboard(type: 'clip' | 'vote', cursor?: [number, number]) {
    return this.fetch(
      this.getClipPath() +
        (type == 'clip' ? '' : '/votes') +
        '/leaderboard' +
        (cursor ? '?cursor=' + JSON.stringify(cursor) : '')
    );
  }

  createGoal(locale: string, body: CustomGoalParams): Promise<void> {
    return this.fetch([API_PATH, 'user_client', locale, 'goals'].join('/'), {
      method: 'POST',
      body,
    });
  }

  fetchGoals(locale?: string): Promise<AllGoals> {
    return this.fetch(
      API_PATH + '/user_client' + (locale ? '/' + locale : '') + '/goals'
    );
  }

  claimAccount(): Promise<void> {
    return this.fetch(
      API_PATH + '/user_clients/' + this.user.userId + '/claim',
      { method: 'POST' }
    );
  }

  saveHasDownloaded(email: string): Promise<void> {
    return this.fetch(this.getLocalePath() + '/downloaders/' + email, {
      method: 'POST',
    });
  }

  seenAwards(kind: 'award' | 'notification' = 'award'): Promise<void> {
    return this.fetch(
      API_PATH +
        '/user_client/awards/seen' +
        (kind == 'notification' ? '?notification' : ''),
      { method: 'POST' }
    );
  }

  report(body: any) {
    return this.fetch(API_PATH + '/reports', {
      method: 'POST',
      body,
    });
  }

  // Challenge
  fetchChallengePoints(
    email?: string
  ): Promise<{
    user: number;
    team: number;
  }> {
    return this.fetch(`${API_PATH}/challenge/points/${email}`);
  }

  fetchWeeklyChallenge(email?: string, date?: Date): Promise<WeeklyChallenge> {
    return this.fetch(`${API_PATH}/challenge/weekly/${email}/${date}`);
  }

  fetchTopTeams(
    locale?: string,
    type?: 'validated' | 'recorded',
    cursor?: [number, number]
  ): Array<Challenge> {
    //return this.fetch(`${API_PATH}/${locale}/top/teams/{type}?cursor=${cursor? JSON.stringify(cursor) : ''}`);

    return [
      {
        position: 1,
        name: 'Catherine',
        logo: 'base641...',
        points: 12341,
        approved: 51,
        accuracy: 11.99,
      },
      {
        position: 2,
        name: 'SAP2',
        logo: 'base642...',
        points: 12342,
        approved: 52,
        accuracy: 12.99,
      },
      {
        position: 3,
        name: 'SAP3',
        logo: 'base643...',
        points: 12343,
        approved: 53,
        accuracy: 13.99,
      },
      {
        position: 4,
        name: 'SAP4',
        logo: 'base644...',
        points: 12344,
        approved: 54,
        accuracy: 14.99,
      },
      {
        position: 5,
        name: 'SAP5',
        logo: 'base645...',
        points: 12345,
        approved: 55,
        accuracy: 15.99,
      },
      {
        position: 6,
        name: 'SAP6',
        logo: 'base646...',
        points: 12346,
        approved: 56,
        accuracy: 16.99,
      },
      {
        position: 7,
        name: 'SAP7',
        logo: 'base647...',
        points: 12347,
        approved: 57,
        accuracy: 17.99,
      },
      {
        position: 8,
        name: 'SAP8',
        logo: 'base648...',
        points: 12348,
        approved: 58,
        accuracy: 18.99,
      },
      {
        position: 9,
        name: 'SAP9',
        logo: 'base649...',
        points: 12349,
        approved: 59,
        accuracy: 19.99,
      },
      {
        position: 10,
        name: 'SAP10',
        logo: 'base6410...',
        points: 12340,
        approved: 60,
        accuracy: 20.99,
      },
    ];
  }
}
