import * as React from 'react'

import { AddingSentences } from './sidebar-content/sentence-collection/adding-sentences'
import { CitingSentences } from './sidebar-content/sentence-collection/citing-sentences'
import { PublicDomain } from './sidebar-content/sentence-collection/public-domain'
import { ReviewingSentences } from './sidebar-content/sentence-collection/reviewing-sentences'
import { SentenceDomain } from './sidebar-content/sentence-collection/sentence-domain'

import { BackgoundNoise } from './sidebar-content/voice-collection/background-noise'
import { BackgoundVoices } from './sidebar-content/voice-collection/background-voices'
import { Effects } from './sidebar-content/voice-collection/effects'
import { Misreadings } from './sidebar-content/voice-collection/misreadings'
import { OffensiveContent } from './sidebar-content/voice-collection/offensive-content'
import { Unsure } from './sidebar-content/voice-collection/unsure'
import { VaryingPronounciation } from './sidebar-content/voice-collection/varying-pronunciations'
import { Volume } from './sidebar-content/voice-collection/volume'

import { GuidelinesSection } from './types'

export const VOICE_NAV_IDS = {
  PRONUNCIATIONS: 'varying-pronunciations',
  OFFENSIVE_CONTENT: 'offensive-content',
  MISREADINGS: 'misreadings',
  BACKGROUND_NOISE: 'background-noise',
  BACKGROUND_VOICES: 'background-voices',
  VOLUME: 'volume',
  EFFECTS: 'reader-effects',
  UNSURE: 'just-unsure',
}

export const SENTENCE_NAV_IDS = {
  PUBLIC_DOMAIN: 'public-domain',
  CITING_SENTENCES: 'citing-sentences',
  ADDING_SENTENCES: 'adding-sentences',
  REVIEWING_SENTENCES: 'reviewing-sentences',
  SENTENCE_DOMAIN: 'sentence-domain',
}

export const COLLECTING_QUESTIONS = 'collecting-questions'
export const ANSWER_QUESTIONS = 'answer-questions'
export const TRANSCRIBE_THE_AUDIO = 'transcribe-the-audio'
export const REVIEW_THE_TRANSCRIPTION = 'review-the-transcription'
export const CODE_SWITCHING = 'code-switching'
export const REPORTING_CONTENT = 'reporting-content'

export const voiceGuidelinesSections: GuidelinesSection[] = [
  {
    id: VOICE_NAV_IDS.PRONUNCIATIONS,
    component: VaryingPronounciation,
    visible: true,
  },
  {
    id: VOICE_NAV_IDS.OFFENSIVE_CONTENT,
    component: OffensiveContent,
    visible: true,
  },
  {
    id: VOICE_NAV_IDS.MISREADINGS,
    component: Misreadings,
    visible: true,
  },
  {
    id: VOICE_NAV_IDS.BACKGROUND_NOISE,
    component: BackgoundNoise,
    visible: true,
  },
  {
    id: VOICE_NAV_IDS.BACKGROUND_VOICES,
    component: BackgoundVoices,
    visible: true,
  },
  {
    id: VOICE_NAV_IDS.VOLUME,
    component: Volume,
    visible: true,
  },
  {
    id: VOICE_NAV_IDS.EFFECTS,
    component: Effects,
    visible: true,
  },
  {
    id: VOICE_NAV_IDS.UNSURE,
    component: Unsure,
    visible: true,
  },
]

export const sentenceGuidelineSections: GuidelinesSection[] = [
  {
    id: SENTENCE_NAV_IDS.PUBLIC_DOMAIN,
    component: PublicDomain,
    visible: true,
  },
  {
    id: SENTENCE_NAV_IDS.CITING_SENTENCES,
    component: CitingSentences,
    visible: true,
  },
  {
    id: SENTENCE_NAV_IDS.ADDING_SENTENCES,
    component: AddingSentences,
    visible: true,
  },
  {
    id: SENTENCE_NAV_IDS.REVIEWING_SENTENCES,
    component: ReviewingSentences,
    visible: true,
  },
  {
    id: SENTENCE_NAV_IDS.SENTENCE_DOMAIN,
    component: SentenceDomain,
    visible: true,
  },
]

export const questionGuidelineSections: GuidelinesSection[] = [
  {
    id: COLLECTING_QUESTIONS,
    component: React.lazy(() =>
      import('./sidebar-content/question-collection/adding-questions').then(
        module => ({ default: module.AddingQuestions })
      )
    ),
    visible: true,
  },
  {
    id: ANSWER_QUESTIONS,
    component: React.lazy(() =>
      import('./sidebar-content/question-collection/answer-questions').then(
        module => ({ default: module.AnswerQuestions })
      )
    ),
    visible: true,
  },
  {
    id: TRANSCRIBE_THE_AUDIO,
    component: React.lazy(() =>
      import('./sidebar-content/question-collection/transcribe-the-audio').then(
        module => ({ default: module.TranscribeAudio })
      )
    ),
    visible: true,
  },
  {
    id: REVIEW_THE_TRANSCRIPTION,
    component: React.lazy(() =>
      import(
        './sidebar-content/question-collection/review-the-transcription'
      ).then(module => ({ default: module.ReviewTheTranscription }))
    ),
    visible: true,
  },
  {
    id: CODE_SWITCHING,
    component: React.lazy(() =>
      import('./sidebar-content/question-collection/code-switching').then(
        module => ({ default: module.CodeSwitching })
      )
    ),
    visible: true,
  },
  {
    id: REPORTING_CONTENT,
    component: React.lazy(() =>
      import('./sidebar-content/question-collection/reporting-content').then(
        module => ({ default: module.ReportingContent })
      )
    ),
    visible: true,
  },
]

export const VOICE_COLLECTION_ITEMS = [
  {
    label: VOICE_NAV_IDS.PRONUNCIATIONS,
  },
  {
    label: VOICE_NAV_IDS.OFFENSIVE_CONTENT,
  },
  {
    label: VOICE_NAV_IDS.MISREADINGS,
  },
  {
    label: VOICE_NAV_IDS.BACKGROUND_NOISE,
  },
  {
    label: VOICE_NAV_IDS.BACKGROUND_VOICES,
  },
  {
    label: VOICE_NAV_IDS.VOLUME,
  },
  {
    label: VOICE_NAV_IDS.EFFECTS,
  },
  {
    label: VOICE_NAV_IDS.UNSURE,
  },
]

export const SENTENCE_COLLECTION_ITEMS = [
  {
    label: SENTENCE_NAV_IDS.PUBLIC_DOMAIN,
  },
  {
    label: SENTENCE_NAV_IDS.CITING_SENTENCES,
  },
  {
    label: SENTENCE_NAV_IDS.ADDING_SENTENCES,
  },
  {
    label: SENTENCE_NAV_IDS.REVIEWING_SENTENCES,
  },
  {
    label: SENTENCE_NAV_IDS.SENTENCE_DOMAIN,
  },
]

export const QUESTION_COLLECTION_ITEMS = [
  {
    label: 'what-makes-a-good-question-subheader',
  },
  {
    label: 'dont-add-subheader',
  },
]

export const ANSWER_QUESTIONS_ITEMS = [
  {
    label: 'answer-questions-subheader',
  },
  {
    label: 'answer-questions-explanation',
  },
]

export const TRANSCRIBE_AUDIO_ITEMS = [
  {
    label: 'transcribe-the-audio-subheader-1',
  },
  {
    label: 'transcribe-the-audio-subheader-2',
  },
  {
    label: 'transcribe-the-audio-subheader-3',
  },
  {
    label: 'transcribe-the-audio-subheader-4',
  },
  {
    label: 'transcribe-the-audio-subheader-5',
  },
]

export const CODE_SWITCHING_ITEMS = [
  {
    label: 'code-switching-adding-question-subheader',
  },
  {
    label: 'code-switching-types-subheader',
  },
  {
    label: 'code-switching-avoid-subheader',
  },
  {
    label: 'code-switching-review-subheader',
  },
  {
    label: 'code-switching-answer-subheader',
  },
  {
    label: 'code-switching-answer-dont-subheader',
  },
  {
    label: 'code-switching-transcribe-subheader',
  },
  {
    label: 'code-switching-cleanup-header',
  },
  {
    label: 'code-switching-tagging-subheader',
  },
]

export const SPONTANEOUS_SPEECH_NAV_IDS = {
  QUESTION_COLLECTION: 'question-collection',
  ANSWER_QUESTIONS: 'answer-questions',
  TRANSCRIBE_THE_AUDIO: 'transcribe-the-audio',
  REVIEW_THE_TRANSCRIPTION: 'review-the-transcription',
  REPORTING_CONTENT: 'reporting-content',
}
