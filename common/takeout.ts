export enum TakeoutState {
  PENDING = 0,
  IN_PROGRESS,
  AVAILABLE,
  EXPIRED,
  INCOMPLETE,
}

export type TakeoutRequest = {
  id: number;
  client_id: string;
  state: TakeoutState;
  requested_date: string;
  expiration_date: string | null;
  archive_count: number | null;
  clip_count: number | null;
  clip_total_size: number | null;
};

export type TakeoutResponse = {
  parts: string[]
  metadata: string
}
