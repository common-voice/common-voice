import lazyCache from '../lazy-cache';
import { getMySQLInstance } from './db/mysql';
import { TableNames } from 'common';

const db = getMySQLInstance();

type StatisticsCount = {
  total_count: number;
  date: string;
};

/**
 * Attach metadata about the stats (like when it was fetched)
 *
 */
const getFetchMetadata = () => {
  const today = new Date();
  return {
    last_fetched: today,
  };
};

const buildResponse = (data: any) => {
  return { ...data, metadata: getFetchMetadata() };
};

export const getTableStatistics = lazyCache(
  'get-table-statisticsx',
  async (tableName: TableNames) => {
    const { total_count } = (await getTotal(tableName))[0];
    const monthly_count = await getMonthlyContributions(tableName);

    const monthlyContributions = monthly_count.map(row => {
      return { [row.date]: row.total_count };
    });

    let currentSum = 0;
    const monthly_running_totals = monthly_count.map(row => {
      const diff = total_count - currentSum;
      currentSum += row.total_count;
      const date = row.date;
      return { [date]: diff };
    });

    return buildResponse({
      total_count,
      monthly_contributions: monthlyContributions,
      montly_running_totals: monthly_running_totals,
    });
  },
  1
);

const getMonthlyContributions = async (
  tableName: TableNames
): Promise<StatisticsCount[]> => {
  const [rows] = await db.query(`
  SELECT
    MAX(DATE_FORMAT(created_at, "%Y-%c-%d")) as date,
    COUNT(id) as total_count
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

const getTotal = async (tableName: TableNames) => {
  const [rows] = await db.query(`
    SELECT
    count(1) as total_count
    FROM
      ${tableName} d
  `);
  return rows;
};
