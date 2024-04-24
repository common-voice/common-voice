import { SentenceDomain, SentenceDomainName } from 'common'

export type DomainNameMap = Readonly<{
  [key in SentenceDomain]: SentenceDomainName
}>

export const domainNameMap: DomainNameMap = {
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
