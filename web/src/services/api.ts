import {
  AllGoals,
  CustomGoalParams,
  LanguageStatistics,
  Language,
  UserClient,
  WeeklyChallenge,
  Challenge,
  TeamChallenge,
  Sentence,
  Clip,
} from 'common';
import { Locale } from '../stores/locale';
import { User } from '../stores/user';
import { USER_KEY } from '../stores/root';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  isJSON?: boolean;
  headers?: {
    [headerName: string]: string;
  };
  body?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface Vote extends Event {
  hasEarnedSessionToast?: boolean;
  showFirstContributionToast?: boolean;
  showFirstStreakToast?: boolean;
  challengeEnded?: boolean;
}

const API_PATH = location.origin + '/api/v1';

const getChallenge = (user: User.State): string => {
  return user?.account?.enrollment?.challenge
    ? user.account.enrollment.challenge
    : null;
};

export default class API {
  private readonly locale: Locale.State;
  private readonly user: User.State;

  constructor(locale: Locale.State, user: User.State) {
    this.locale = locale;
    this.user = user;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      if (response.statusText.includes('save_clip_error')) {
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

  async fetchRandomSentences(count = 1): Promise<Sentence[]> {
    return this.fetch(`${this.getLocalePath()}/sentences?count=${count}`);
  }

  async fetchRandomClips(count = 1): Promise<Clip[]> {
    return this.fetch(`${this.getClipPath()}?count=${count}`);
  }

  uploadClip(
    blob: Blob,
    sentenceId: string,
    fromDemo?: boolean
  ): Promise<{
    showFirstContributionToast?: boolean;
    hasEarnedSessionToast?: boolean;
    showFirstStreakToast?: boolean;
    challengeEnded: boolean;
  }> {
    // make sure nginx server has allow_underscore turned on
    return this.fetch(this.getClipPath(), {
      method: 'POST',
      headers: {
        'Content-Type': blob.type,
        sentence_id: sentenceId,
        challenge: getChallenge(this.user),
        from_demo: fromDemo ? 'true' : 'false',
        source: 'web',
      },
      body: blob,
    });
  }
  saveVote(id: string, isValid: boolean): Promise<Vote> {
    return this.fetch(`${this.getClipPath()}/${id}/votes`, {
      method: 'POST',
      body: {
        isValid,
        challenge: getChallenge(this.user),
      },
    });
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

  async fetchAllLanguages(): Promise<Language[]> {
    return this.fetch(`${API_PATH}/languages`);
  }

  async fetchLanguageStats(): Promise<LanguageStatistics[]> {
    return this.fetch(`${API_PATH}/stats/languages`);
  }

  fetchDocument(
    name: 'privacy' | 'terms' | 'challenge-terms'
  ): Promise<string> {
    const locale = name === 'challenge-terms' ? 'en' : this.locale;
    return this.fetch(`/${name}/${locale}.html`, { isJSON: false });
  }

  skipSentence(id: string) {
    return this.fetch(`${API_PATH}/skipped_sentences/` + id, {
      method: 'POST',
    });
  }

  skipClip(id: string) {
    return this.fetch(`${API_PATH}/skipped_clips/` + id, {
      method: 'POST',
    });
  }

  fetchClipsStats(locale?: string): Promise<
    {
      date: string;
      total: number;
      valid: number;
    }[]
  > {
    return this.fetch(API_PATH + (locale ? '/' + locale : '') + '/clips/stats');
  }

  fetchClipVoices(locale?: string): Promise<
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
  ): Promise<{ date: string; value: number }[]> {
    let endpoint = API_PATH;

    if (locale) {
      endpoint += `/${locale}`;
    }

    return this.fetch(`${endpoint}/contribution_activity?from=${from}`);
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

  getJob(jobId: number) {
    return this.fetch(`${API_PATH}/job/${jobId}`);
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

  fetchTakeouts() {
    return this.fetch(API_PATH + '/user_client/takeout');
  }

  requestTakeout() {
    return this.fetch(API_PATH + '/user_client/takeout/request', {
      method: 'POST',
    });
  }

  fetchTakeoutLinks(id: number) {
    return this.fetch(
      [API_PATH, 'user_client', 'takeout', id, 'links'].join('/'),
      {
        method: 'POST',
      }
    );
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

  saveHasDownloaded(
    email: string,
    locale: string,
    dataset: string
  ): Promise<void> {
    return this.fetch(this.getLocalePath() + '/downloaders', {
      method: 'POST',
      body: { email, locale, dataset },
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report(body: any) {
    return this.fetch(API_PATH + '/reports', {
      method: 'POST',
      body,
    });
  }

  // Challenge
  fetchChallengePoints(): Promise<{
    user: number;
    team: number;
  }> {
    if (getChallenge(this.user)) {
      return this.fetch(
        `${API_PATH}/challenge/${this.user.account.enrollment.challenge}/points`
      );
    }
    return null;
  }

  fetchWeeklyProgress(): Promise<WeeklyChallenge> {
    if (getChallenge(this.user)) {
      return this.fetch(
        `${API_PATH}/challenge/${this.user.account.enrollment.challenge}/progress`
      );
    }
    return null;
  }

  fetchTopTeams(
    locale?: string,
    cursor?: [number, number]
  ): Promise<TeamChallenge[]> {
    if (getChallenge(this.user)) {
      return this.fetch(
        `${API_PATH}/challenge/${
          this.user.account.enrollment.challenge
        }/${locale}/teams?cursor=${cursor ? JSON.stringify(cursor) : ''}`
      );
    }
    return null;
  }

  fetchTopContributors(
    locale?: string,
    type?: 'vote' | 'clip',
    cursor?: [number, number]
  ): Promise<Challenge[]> {
    if (getChallenge(this.user)) {
      return this.fetch(
        `${API_PATH}/challenge/${
          this.user.account.enrollment.challenge
        }/${locale}/contributors/${type}?cursor=${
          cursor ? JSON.stringify(cursor) : ''
        }`
      );
    }
    return null;
  }

  fetchTopMembers(
    locale?: string,
    type?: 'vote' | 'clip',
    cursor?: [number, number]
  ): Promise<Challenge[]> {
    if (getChallenge(this.user)) {
      return this.fetch(
        `${API_PATH}/challenge/${
          this.user.account.enrollment.challenge
        }/${locale}/members/${type}?cursor=${
          cursor ? JSON.stringify(cursor) : ''
        }`
      );
    }
    return null;
  }
  // check whether or not is the first invite
  fetchInviteStatus(): Promise<{
    showInviteSendToast: boolean;
    hasEarnedSessionToast: boolean;
    challengeEnded: boolean;
  }> {
    if (getChallenge(this.user)) {
      return this.fetch(
        `${API_PATH}/challenge/${this.user.account.enrollment.challenge}/achievement/invite`
      );
    }
    return null;
  }

  // Tell back-end user get unexpected achievement: invite + contribute in the same session
  // Each user can only get once.
  setInviteContributeAchievement(): Promise<void> {
    if (getChallenge(this.user)) {
      return this.fetch(
        `${API_PATH}/challenge/${this.user.account.enrollment.challenge}/achievement/session`,
        {
          method: 'POST',
        }
      );
    }
    return null;
  }

  getPublicUrl(path: string, bucketType: string): Promise<{ url: string }> {
    return this.fetch(`${API_PATH}/bucket/${bucketType}/${path}`, {
      method: 'GET',
    });
  }

  async getServerDate(): Promise<string> {
    return await this.fetch(`${API_PATH}/server_date`);
  }

  getAccents(lang?: string) {
    return this.fetch(`${API_PATH}/language/accents${lang ? '/' + lang : ''}`);
  }

  getVariants(lang?: string) {
    return this.fetch(`${API_PATH}/language/variants${lang ? '/' + lang : ''}`);
  }

  getDatasets(releaseType: string) {
    const query = releaseType ? `?releaseType=${releaseType}` : '';
    return this.fetch(`${API_PATH}/datasets${query ? query : ''}`);
  }

  getLanguagesWithDatasets() {
    return this.fetch(`${API_PATH}/datasets/languages`);
  }

  getLanguageDatasetStats(languageCode: string) {
    return this.fetch(`${API_PATH}/datasets/languages/${languageCode}`);
  }
  async sendLanguageRequest({
    email,
    languageInfo,
    languageLocale,
  }: {
    email: string;
    languageInfo: string;
    languageLocale: string;
  }) {
    return this.fetch(`${API_PATH}/language/request`, {
      method: 'POST',
      body: {
        email,
        languageInfo,
        languageLocale,
      },
    });
  }
}
