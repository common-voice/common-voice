export type Filters = 'rejected' | 'hasEmail';

export type QueryOptions = {
    filter?: Filters;
    groupByColumn?: string;
    isDistinct?: boolean;
    isDuplicate?: boolean;
    year?: number;
  };
