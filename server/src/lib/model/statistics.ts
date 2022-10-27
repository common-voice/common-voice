import lazyCache from '../lazy-cache';
import { getMySQLInstance } from './db/mysql';
import { TableNames, TimeUnits } from 'common';
const db = getMySQLInstance();

// TODO: Replace with query that calculates average
const AVG_CLIP_SECONDS = 4.694;

type StatisticsCount = {
  total_count: number;
  date: string;
};

type QueryOptions = {
  groupByColumn: string;
  isDistinict: boolean;
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
    monthlyIncrease = await getMonthlyContributions(tableName);
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
  tableName: TableNames
): Promise<StatisticsCount[]> => {
  const [rows] = await db.query(`
    SELECT
      MAX(DATE_FORMAT(created_at, "%Y-%c-%d")) as date,
      COUNT(created_at) as total_count
    FROM
      ${tableName} d
    WHERE
      created_at > now() - INTERVAL 12 MONTH
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
  'get-statisticsx22222',
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
