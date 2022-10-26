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

const buildResponse = (data: any) => {
  return { ...data, metadata: getResponseMetadata() };
};

export const queryStatistics = async (
  tableName: TableNames,
  options?: QueryOptions
) => {
  const isDistinict = options?.isDistinict ?? false;
  let monthly_count;

  // Two basic query paths (queries with distinct have to use group by)
  if (isDistinict) {
    monthly_count = await getUniqueMonthlyContributions(tableName, options);
  } else {
    monthly_count = await getMonthlyContributions(tableName);
  }
  const total_count = monthly_count.reduce(
    (total: number, row) => (total += row.total_count),
    0
  );
  return getTableStatistics(total_count, monthly_count);
};

export const getTableStatistics = lazyCache(
  'get-table-statistics',
  async (total_count: number, monthly_count: StatisticsCount[]) => {
    const monthlyContributions = monthly_count.reduce((obj: any, row) => {
      obj[row.date] = row.total_count;
      return obj;
    }, {});

    let currentSum = 0;
    const monthly_running_totals = monthly_count.reduce((obj: any, row) => {
      const diff = total_count - currentSum;
      currentSum += row.total_count;
      obj[row.date] = diff;
      return obj;
    }, {});

    return buildResponse({
      total_count,
      monthly_contributions: monthlyContributions,
      montly_running_totals: monthly_running_totals,
    });
  },
  TimeUnits.DAY
);

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

const getTotal = async (tableName: TableNames) => {
  const [rows] = await db.query(`
    SELECT
    count(1) as total_count
    FROM
      ${tableName} d
  `);
  return rows;
};
