export type Filters = 'rejected' | 'hasEmail';

export type QueryOptions = {
    groupByColumn?: string;
    isDistinct?: boolean;
    isDuplicate?: boolean;
    filter?: Filters;
    year?: number;
  };