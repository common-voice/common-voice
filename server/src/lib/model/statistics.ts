import lazyCache from '../lazy-cache';
import { getMySQLInstance } from './db/mysql';
import { TableNames, TimeUnits } from 'common';
const db = getMySQLInstance();

type StatisticsCount = {
  total_count: number;
  date: string;
};

const FILTERS = {
  rejected: 'AND is_valid = false',
  hasEmail: 'AND email IS NOT null',
};

type Filters = 'rejected' | 'hasEmail';

type QueryOptions = {
  groupByColumn?: string;
  isDistinict?: boolean;
  isDuplicate?: boolean;
  filter?: Filters;
};

/**
 * Attach metadata about the stats (like when it was fetched)
 *
 */
const getResponseMetadata = () => {
  const today = new Date();
  return {
    last_fetched: today,
  };
};

const queryStatistics = async (
  tableName: TableNames,
  options?: QueryOptions
) => {
  const isDistinict = options?.isDistinict ?? false;
  const isDuplicate = options?.isDuplicate ?? false;
  let monthlyIncrease;

  // Two basic query paths (queries with distinct have to use group by)
  if (isDistinict) {
    monthlyIncrease = await getUniqueMonthlyContributions(tableName, options);
  } else if (isDuplicate) {
    monthlyIncrease = await getMonthlyDuplicateSentences();
  } else {
    monthlyIncrease = await getMonthlyContributions(tableName, options);
  }
  const yearlySum = monthlyIncrease.reduce(
    (total: number, row) => (total += row.total_count),
    0
  );

  return { yearlySum, monthlyIncrease };
};

const formatStatistics = async (
  yearlySum: number,
  monthlyIncrease: StatisticsCount[]
) => {
  //format raw query data
  const monthlyContributions = monthlyIncrease.reduce((obj: any, row) => {
    obj[row.date] = row.total_count;
    return obj;
  }, {});

  let currentSum = 0;
  const monthlyRunningTotals = monthlyIncrease.reduce((obj: any, row) => {
    const diff = yearlySum - currentSum;
    currentSum += row.total_count;
    obj[row.date] = diff;
    return obj;
  }, {});

  return {
    yearly_sum: yearlySum,
    monthly_increase: monthlyContributions,
    monthly_running_totals: monthlyRunningTotals,
  };
};

const getMonthlyContributions = async (
  tableName: TableNames,
  options?: QueryOptions
): Promise<StatisticsCount[]> => {
  const filter = options?.filter;
  const conditional = filter && FILTERS[filter];

  const [rows] = await db.query(`
    SELECT
      MAX(DATE_FORMAT(created_at, "%Y-%c-%d")) as date,
      COUNT(created_at) as total_count
    FROM
      ${tableName} d
    WHERE
      created_at > now() - INTERVAL 12 MONTH
      ${conditional ? conditional : ''}
    GROUP BY
      DATE_FORMAT(created_at, "%Y-%c")
    ORDER BY created_at DESC;
  `);
  return rows;
};

const getUniqueMonthlyContributions = async (
  tableName: TableNames,
  options: QueryOptions
): Promise<StatisticsCount[]> => {
  const { groupByColumn } = options;
  const [rows] = await db.query(`
  SELECT
      MAX(DATE_FORMAT(created_at, "%Y-%c-%d")) as date,
      COUNT(created_at) as total_count
   FROM
    (
      SELECT * 
      FROM ${tableName} d GROUP BY ${groupByColumn}
    ) d
    WHERE
      created_at > now() - INTERVAL 12 MONTH
    GROUP BY
      DATE_FORMAT(created_at, "%Y-%c")
    ORDER BY created_at DESC;
  `);
  return rows;
};

const getMonthlyDuplicateSentences = async (): Promise<StatisticsCount[]> => {
  const [rows] = await db.query(`
    SELECT
      MAX(DATE_FORMAT(created_at, "%Y-%c-%d")) as date,
      COUNT(created_at) as total_count
    FROM
      (
      SELECT
        created_at,
        count(1) as sentenceCount
      FROM
        clips c
      GROUP BY
        original_sentence_id
      HAVING
        sentenceCount > 1
        ) d
    WHERE
      created_at > now() - INTERVAL 12 MONTH
    GROUP BY
      DATE_FORMAT(created_at, "%Y-%c")
    ORDER BY
      created_at DESC;
  `);
  return rows;
};

export const getStatistics = lazyCache(
  'get-statistics-value22',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (tableName: TableNames, options?: QueryOptions, _filter?: string) => {
    const { yearlySum, monthlyIncrease } = await queryStatistics(
      tableName,
      options
    );

    const formattedStatistics = await formatStatistics(
      yearlySum,
      monthlyIncrease
    );

    const metadata = getResponseMetadata();

    return {
      ...formattedStatistics,
      metadata,
    };
  },
  TimeUnits.DAY
);
