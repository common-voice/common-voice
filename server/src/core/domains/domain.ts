import { SentenceDomain, SentenceDomainDescription } from 'common'

export type DomainDescriptionMap = Readonly<{
  [key in SentenceDomain]: SentenceDomainDescription
}>

export const domainDescriptionMap: DomainDescriptionMap = {
  general: 'General',
  agriculture: 'Agriculture and Food',
  automotive: 'Automotive and Transport',
  finance: 'Finance',
  food_service_retail: 'Service and Retail',
  healthcare: 'Healthcare',
  history_law_government: 'History, Law and Governmant',
  language_fundamentals: 'Language Fundamentals (e.g. Digits, Letters, Money)',
  media_entertainment: 'Media and Entertainment',
  nature_environment: 'Nature and Environment',
  news_current_affairs: 'News and Current Affairs',
  technology_robotics: 'Technology and Robotics',
}

export type Domain = {
  id: number
  name: SentenceDomain
  description: SentenceDomainDescription
}
