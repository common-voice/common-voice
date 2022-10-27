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
  let monthlyIncrease;

  // Two basic query paths (queries with distinct have to use group by)
  if (isDistinict) {
    monthlyIncrease = await getUniqueMonthlyContributions(tableName, options);
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
      SELECT DISTINCT * 
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

export const getStatistics = lazyCache(
  'get-statistics-test',
  async (tableName: TableNames, options?: QueryOptions) => {
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
