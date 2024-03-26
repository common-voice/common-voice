import { SentenceDomain } from 'common'

export const SENTENCE_DOMAIN_MAPPING: Record<SentenceDomain, string> = {
  agriculture: 'Agriculture',
  automotive: 'Automotive',
  finance: 'Finance',
  food_service_retail: 'Food, Service and Retail',
  general: 'General',
  healthcare: 'Healthcare',
  history_law_government: 'History, Law and Government',
  language_fundamentals: 'Language Fundamentals (e.g. Digits, Letters, Money)',
  media_entertainment: 'Media and Entertainment',
  nature_environment: 'Nature and Environment',
  news_current_affairs: 'News and Current Affairs',
  technology_robotics: 'Technology and Robotics',
}

export const sentenceDomains = [
  { id: 'agriculture', name: 'Agriculture' },
  { id: 'automotive', name: 'Automotive' },
  { id: 'finance', name: 'Finance' },
  { id: 'food_service_retail', name: 'Food, Service and Retail' },
  { id: 'general', name: 'General' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'history_law_government', name: 'History, Law and Government' },
  {
    id: 'language_fundamentals',
    name: 'Language Fundamentals (e.g. Digits, Letters, Money)',
  },
  { id: 'media_entertainment', name: 'Media and Entertainment' },
  { id: 'nature_environment', name: 'Nature and Environment' },
  { id: 'news_current_affairs', name: 'News and Current Affairs' },
  { id: 'technology_robotics', name: 'Technology and Robotics' },
]
