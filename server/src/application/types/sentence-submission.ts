export type SentenceSubmission = {
  sentence: string;
  source: string;
  locale_id: number;
  client_id: string;
  domain_id?: number | null
};
