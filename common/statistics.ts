export type Filters = 'rejected' | 'hasEmail';

export type QueryOptions = {
    filter?: Filters;
    groupByColumn?: string;
    hasMetadata?: boolean;
    isDistinct?: boolean;
    isDuplicate?: boolean;
    year?: number;
  };
