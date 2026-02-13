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
  UserLanguage,
  SentenceSubmission,
  SentenceVote,
  TakeoutResponse,
  SPSLocalesResponse,
} from 'common'
import {
  createBadGatewayError,
  createServiceUnavailableError,
  createGatewayTimeoutError,
  createInternalServerError,
  NotFoundError,
  RateLimitError,
  ConflictError,
  BusinessLogicError,
} from '../services/app-error'
import { Locale } from '../stores/locale'
import { User } from '../stores/user'
import { USER_KEY } from '../stores/root'
import { SPONTANEOUS_SPEECH_ROOT_URL } from '../urls'

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  isJSON?: boolean
  headers?: {
    [headerName: string]: string
  }
  body?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  signal?: AbortSignal
}

interface Vote extends Event {
  hasEarnedSessionToast?: boolean
  showFirstContributionToast?: boolean
  showFirstStreakToast?: boolean
  challengeEnded?: boolean
}

const API_PATH = location.origin + '/api/v1'

const getChallenge = (user: User.State): string => {
  return user?.account?.enrollment?.challenge
    ? user.account.enrollment.challenge
    : null
}

export default class API {
  private readonly locale: Locale.State
  private readonly user: User.State
  private readonly abortController: AbortController

  constructor(locale: Locale.State, user: User.State) {
    this.locale = locale
    this.user = user
    this.abortController = new AbortController()
  }

  /**
   * Enhanced fetch method with more comprehensive error handling
   * - System errors (5xx) trigger Error Boundary
   * - Client errors (4xx) are handled gracefully in components
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async fetch(path: string, options: FetchOptions = {}): Promise<any> {
    const { method, headers, body, isJSON } = Object.assign(
      {
        isJSON: true,
      },
      options
    )

    const finalHeaders = Object.assign(
      isJSON
        ? {
            'Content-Type': 'application/json; charset=utf-8',
          }
        : {},
      headers
    )

    const { user } = this
    if (path.startsWith(location.origin) && !user.account && user.userId) {
      finalHeaders['Authorization'] =
        'Basic ' + btoa(user.userId + ':' + user.authToken)
    }

    try {
      const response = await fetch(path, {
        method: method || 'GET',
        headers: finalHeaders,
        credentials: 'same-origin',
        body: body
          ? body instanceof Blob
            ? body
            : JSON.stringify(body)
          : undefined,
      })

      // Handle special case for success
      if (response.status === 204) {
        return null
      }

      // Handle 401 immediately and separately
      if (response.status === 401) {
        localStorage.removeItem(USER_KEY)
        location.reload()
        return // Stop execution here
      }

      // Handle system errors (5xx) - these trigger Error Boundary
      if (response.status >= 500) {
        return await this.handleSystemError(response)
      }

      // Handle client errors (4xx) - these are handled in components
      if (response.status >= 400) {
        return await this.handleClientError(response)
      }

      // Success case - parse response
      return isJSON ? response.json() : response.text()
    } catch (error) {
      // Network failures, timeouts, etc. - treat as system errors
      return this.handleNetworkError(error)
    }
  }

  /**
   * Handle system errors (5xx) that indicate infrastructure failures
   * These will trigger the Error Boundary and show system error pages
   *
   * Exception: Clip save errors (save_clip_error) at 500 should not crash
   * the page, but are still non-retryable server errors. They're thrown as
   * BusinessLogicError so the Speak page can catch and handle them gracefully
   * (alert user, skip clip) without triggering the Error Boundary.
   */
  private async handleSystemError(response: Response): Promise<never> {
    const errorText = await response.text()

    // Clip save server errors (OOM, transcode failures) should not retry
    // but also should not crash the page - let Speak page handle gracefully
    if (errorText.includes('save_clip_error')) {
      throw new BusinessLogicError(errorText, response.status)
    }

    switch (response.status) {
      case 502:
        throw createBadGatewayError(`Bad Gateway: ${errorText}`)
      case 503:
        throw createServiceUnavailableError(`Service Unavailable: ${errorText}`)
      case 504:
        throw createGatewayTimeoutError(`Gateway Timeout: ${errorText}`)
      default:
        throw createInternalServerError(
          `Server Error ${response.status}: ${errorText}`
        )
    }
  }

  /**
   * Handle client errors (4xx) that represent expected application states
   * These are caught and handled gracefully in React components
   * Exception: 401 errors which are handled above specially
   */
  private async handleClientError(response: Response): Promise<never> {
    const errorText = await response.text()

    switch (response.status) {
      case 404:
        throw new NotFoundError(errorText)

      case 409:
        if (errorText.includes('ALREADY_EXISTS')) {
          throw new ConflictError(errorText)
        }
        throw new ConflictError(errorText)

      case 413:
        // Upload too large (clip size validation)
        throw new BusinessLogicError(errorText, response.status)

      case 429:
        throw new RateLimitError(
          response.headers.get('retry-after') || undefined
        )

      default:
        throw new BusinessLogicError(errorText, response.status)
    }
  }

  /**
   * Handle network-level failures (no response received)
   * These are treated as system errors and trigger Error Boundary
   */
  private handleNetworkError(error: Error): never {
    if (error.name === 'AbortError') {
      throw createGatewayTimeoutError('Request timeout')
    }

    if (
      error.message.includes('Failed to fetch') ||
      error.message.includes('Network Error')
    ) {
      throw createBadGatewayError(`Network failure: ${error.message}`)
    }

    // Unknown network error
    throw createBadGatewayError(`Connection error: ${error.message}`)
  }

  forLocale(locale: string) {
    return new API(locale, this.user)
  }

  getLocalePath() {
    return this.locale ? API_PATH + '/' + this.locale : API_PATH
  }

  getClipPath() {
    return this.getLocalePath() + '/clips'
  }

  async fetchRandomSentences(
    count = 1,
    ignoreClientVariant = false
  ): Promise<Sentence[]> {
    return this.fetch(
      `${this.getLocalePath()}/sentences?count=${count}${
        ignoreClientVariant ? '&ignoreClientVariant=true' : ''
      }`
    )
  }

  async fetchRandomClips(
    count = 1,
    ignoreClientVariant = false
  ): Promise<Clip[]> {
    return this.fetch(
      `${this.getClipPath()}?count=${count}${
        ignoreClientVariant ? '&ignoreClientVariant=true' : ''
      }`
    )
  }

  uploadClip(
    blob: Blob,
    sentenceId: string,
    fromDemo?: boolean
  ): Promise<{
    showFirstContributionToast?: boolean
    hasEarnedSessionToast?: boolean
    showFirstStreakToast?: boolean
    challengeEnded: boolean
  }> {
    return this.fetch(this.getClipPath(), {
      method: 'POST',
      headers: {
        'Content-Type': blob.type,
        'sentence-id': sentenceId,
        challenge: getChallenge(this.user),
        'from-demo': fromDemo ? 'true' : 'false',
        source: 'web',
      },
      body: blob,
    })
  }

  saveVote(id: string, isValid: boolean): Promise<Vote> {
    return this.fetch(`${this.getClipPath()}/${id}/votes`, {
      method: 'POST',
      body: {
        isValid,
        challenge: getChallenge(this.user),
      },
    })
  }

  fetchDailyClipsCount(): Promise<number> {
    return this.fetch(this.getClipPath() + '/daily_count')
  }

  fetchDailyVotesCount(): Promise<number> {
    return this.fetch(this.getClipPath() + '/votes/daily_count')
  }

  fetchLocaleMessages(locale: string): Promise<string> {
    return this.fetch(`${API_PATH}/languages/${locale}/translations`, {
      isJSON: false,
    })
  }

  async fetchCrossLocaleMessages(): Promise<string[][]> {
    return Object.entries(
      await this.fetch(`/cross-locale-messages.json`)
    ) as string[][]
  }

  fetchRequestedLanguages(): Promise<string[]> {
    return this.fetch(`${API_PATH}/requested_languages`)
  }

  requestLanguage(language: string): Promise<void> {
    return this.fetch(`${API_PATH}/requested_languages`, {
      method: 'POST',
      body: {
        language,
      },
    })
  }

  async fetchAllLanguages(): Promise<Language[]> {
    return this.fetch(`${API_PATH}/languages`)
  }

  async fetchSpontaneousSpeechLanguages(): Promise<string[]> {
    const data: SPSLocalesResponse = await this.fetch(
      `${SPONTANEOUS_SPEECH_ROOT_URL}/api/v1/locales`
    )
    return data?.locales?.contributable || []
  }

  async fetchLanguageStats(): Promise<LanguageStatistics[]> {
    return this.fetch(`${API_PATH}/stats/languages`)
  }

  fetchDocument(
    name: 'privacy' | 'terms' | 'challenge-terms'
  ): Promise<string> {
    const locale = name === 'challenge-terms' ? 'en' : this.locale
    return this.fetch(`/${name}/${locale}.html`, { isJSON: false })
  }

  skipSentence(id: string) {
    return this.fetch(`${API_PATH}/skipped_sentences/` + id, {
      method: 'POST',
    })
  }

  skipClip(id: string) {
    return this.fetch(`${API_PATH}/skipped_clips/` + id, {
      method: 'POST',
    })
  }

  fetchClipsStats(locale?: string): Promise<
    {
      date: string
      total: number
      valid: number
    }[]
  > {
    return this.fetch(API_PATH + (locale ? '/' + locale : '') + '/clips/stats')
  }

  fetchClipVoices(locale?: string): Promise<
    {
      date: string
      value: number
    }[]
  > {
    return this.fetch(API_PATH + (locale ? '/' + locale : '') + '/clips/voices')
  }

  fetchContributionActivity(
    from: 'you' | 'everyone',
    locale?: string
  ): Promise<{ date: string; value: number }[]> {
    let endpoint = API_PATH

    if (locale) {
      endpoint += `/${locale}`
    }

    return this.fetch(`${endpoint}/contribution_activity?from=${from}`)
  }

  fetchUserClients(): Promise<UserClient[]> {
    return this.fetch(API_PATH + '/user_clients')
  }

  fetchAccount(): Promise<UserClient> {
    return this.fetch(API_PATH + '/user_client')
  }

  saveAccount(data: UserClient): Promise<UserClient> {
    return this.fetch(API_PATH + '/user_client', {
      method: 'PATCH',
      body: data,
    })
  }

  saveAnonymousAccountLanguages(data: {
    languages: UserLanguage[]
  }): Promise<UserClient> {
    return this.fetch(`${API_PATH}/anonymous_user`, {
      method: 'PATCH',
      body: data,
    })
  }

  subscribeToNewsletter(email: string): Promise<void> {
    return this.fetch(
      `${API_PATH}/newsletter/${email}?language=${this.locale}`,
      { method: 'POST' }
    )
  }

  async saveAvatar(type: 'default' | 'file' | 'gravatar', file?: Blob) {
    const body = await this.fetch(API_PATH + '/user_client/avatar/' + type, {
      method: 'POST',
      isJSON: false,
      ...(file
        ? {
            body: file,
          }
        : {}),
    })
    return JSON.parse(body)
  }

  getJob(jobId: number) {
    return this.fetch(`${API_PATH}/job/${jobId}`)
  }

  async saveAvatarClip(blob: Blob): Promise<void> {
    try {
      const body = await this.fetch(API_PATH + '/user_client/avatar_clip', {
        method: 'POST',
        headers: {
          'Content-Type': blob.type,
        },
        body: blob,
      })
      return body
    } catch (err) {
      return err
    }
  }

  fetchAvatarClip() {
    return this.fetch(API_PATH + '/user_client/avatar_clip')
  }

  deleteAvatarClip() {
    return this.fetch(API_PATH + '/user_client/delete_avatar_clip')
  }

  fetchTakeouts() {
    return this.fetch(API_PATH + '/user_client/takeout')
  }

  requestTakeout() {
    return this.fetch(API_PATH + '/user_client/takeout/request', {
      method: 'POST',
    })
  }

  fetchTakeoutLinks(id: number): Promise<TakeoutResponse> {
    return this.fetch(
      [API_PATH, 'user_client', 'takeout', id, 'links'].join('/'),
      {
        method: 'POST',
      }
    )
  }

  fetchLeaderboard(type: 'clip' | 'vote', cursor?: [number, number]) {
    return this.fetch(
      this.getClipPath() +
        (type == 'clip' ? '' : '/votes') +
        '/leaderboard' +
        (cursor ? '?cursor=' + JSON.stringify(cursor) : '')
    )
  }

  createGoal(locale: string, body: CustomGoalParams): Promise<void> {
    return this.fetch([API_PATH, 'user_client', locale, 'goals'].join('/'), {
      method: 'POST',
      body,
    })
  }

  fetchGoals(locale?: string): Promise<AllGoals> {
    return this.fetch(
      API_PATH + '/user_client' + (locale ? '/' + locale : '') + '/goals'
    )
  }

  claimAccount(): Promise<void> {
    return this.fetch(
      API_PATH + '/user_clients/' + this.user.userId + '/claim',
      { method: 'POST' }
    )
  }

  saveHasDownloaded(
    email: string,
    locale: string,
    dataset: string
  ): Promise<void> {
    return this.fetch(this.getLocalePath() + '/downloaders', {
      method: 'POST',
      body: { email, locale, dataset },
    })
  }

  seenAwards(kind: 'award' | 'notification' = 'award'): Promise<void> {
    return this.fetch(
      API_PATH +
        '/user_client/awards/seen' +
        (kind == 'notification' ? '?notification' : ''),
      { method: 'POST' }
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report(body: any) {
    return this.fetch(API_PATH + '/reports', {
      method: 'POST',
      body,
    })
  }

  // Challenge
  fetchChallengePoints(): Promise<{
    user: number
    team: number
  }> {
    if (getChallenge(this.user)) {
      return this.fetch(
        `${API_PATH}/challenge/${this.user.account.enrollment.challenge}/points`
      )
    }
    return null
  }

  fetchWeeklyProgress(): Promise<WeeklyChallenge> {
    if (getChallenge(this.user)) {
      return this.fetch(
        `${API_PATH}/challenge/${this.user.account.enrollment.challenge}/progress`
      )
    }
    return null
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
      )
    }
    return null
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
      )
    }
    return null
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
      )
    }
    return null
  }

  // check whether or not is the first invite
  fetchInviteStatus(): Promise<{
    showInviteSendToast: boolean
    hasEarnedSessionToast: boolean
    challengeEnded: boolean
  }> {
    if (getChallenge(this.user)) {
      return this.fetch(
        `${API_PATH}/challenge/${this.user.account.enrollment.challenge}/achievement/invite`
      )
    }
    return null
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
      )
    }
    return null
  }

  getPublicUrl(path: string, bucketType: string): Promise<{ url: string }> {
    return this.fetch(`${API_PATH}/bucket/${bucketType}/${path}`, {
      method: 'GET',
    })
  }

  async getServerDate(): Promise<string> {
    return await this.fetch(`${API_PATH}/server_date`)
  }

  getAccents(lang?: string) {
    return this.fetch(`${API_PATH}/language/accents${lang ? '/' + lang : ''}`)
  }

  getVariants(lang?: string) {
    return this.fetch(`${API_PATH}/language/variants${lang ? '/' + lang : ''}`)
  }

  getDatasets(releaseType: string) {
    const query = releaseType ? `?releaseType=${releaseType}` : ''
    return this.fetch(`${API_PATH}/datasets${query ? query : ''}`)
  }

  getLanguagesWithDatasets() {
    return this.fetch(`${API_PATH}/datasets/languages`)
  }

  getLanguageDatasetStats(languageCode: string) {
    return this.fetch(`${API_PATH}/datasets/languages/${languageCode}`)
  }

  async sendLanguageRequest({
    email,
    languageInfo,
    languageLocale,
    platforms,
  }: {
    email: string
    languageInfo: string
    languageLocale: string
    platforms: string[]
  }) {
    return this.fetch(`${API_PATH}/language/request`, {
      method: 'POST',
      body: {
        email,
        languageInfo,
        languageLocale,
        platforms,
      },
    })
  }

  createSentence({
    sentenceSubmission: { sentence, source, localeName, domains, variant },
    isSmallBatch,
  }: {
    sentenceSubmission: SentenceSubmission
    isSmallBatch?: boolean
  }) {
    const data = {
      domains,
      ...(isSmallBatch ? { sentences: sentence } : { sentence }),
      source,
      localeName,
      ...(variant && { variant }),
    }

    if (isSmallBatch) {
      return this.fetch(`${API_PATH}/sentences/batch`, {
        method: 'POST',
        body: data,
      })
    }

    return this.fetch(`${API_PATH}/sentences`, {
      method: 'POST',
      body: data,
    })
  }

  fetchPendingSentences(localeId: number) {
    return this.fetch(`${API_PATH}/sentences/review?localeId=${localeId}`)
  }

  voteSentence({ vote, sentence_id }: SentenceVote) {
    const data = { vote, sentence_id }

    return this.fetch(`${API_PATH}/sentences/vote`, {
      method: 'POST',
      body: data,
    })
  }

  async bulkSubmissionRequest({
    file,
    locale,
    fileName,
  }: {
    file: File
    locale: string
    fileName: string
  }) {
    const { signal } = this.abortController
    const content = await file.arrayBuffer()

    return fetch(`${API_PATH}/${locale}/bulk_submissions`, {
      method: 'POST',
      body: content,
      headers: {
        filename: fileName,
      },
      signal,
    })
  }

  abortBulkSubmissionRequest() {
    this.abortController.abort()
  }

  createAPICredentials(description: string) {
    return this.fetch(`${API_PATH}/profiles/api-credentials`, {
      method: 'POST',
      body: { description },
    })
  }

  getAPICredentials() {
    return this.fetch(`${API_PATH}/profiles/api-credentials`)
  }

  deleteAPICredentials(clientID: string) {
    return this.fetch(`${API_PATH}/profiles/api-credentials/${clientID}`, {
      method: 'DELETE',
    })
  }
}
