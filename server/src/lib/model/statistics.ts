import pick = require('lodash.pick');

import lazyCache from '../lazy-cache';
import { getMySQLInstance } from './db/mysql';
import { QueryOptions, TableNames, TimeUnits } from 'common';

const db = getMySQLInstance();

export type StatisticsCount = {
  total_count: number;
  date?: string;
};

const FILTERS = {
  rejected: 'is_valid = false',
  hasEmail: 'email IS NOT null',
};

const yearlySumReducer = (total: number, row: StatisticsCount) =>
  (total += row.total_count);

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
  const isDistinct = options?.isDistinct ?? false;
  const isDuplicate = options?.isDuplicate ?? false;
  const year = getYearFromOptions(options);
  options = { ...options, year };
  let monthlyIncrease, totalCount;

  if (isDistinct) {
    // Queries with distinct have to use group by
    monthlyIncrease = await getUniqueMonthlyContributions(tableName, options);
    totalCount = await getUniqueSpeakersTotal();
  } else if (isDuplicate) {
    // Specific query flow since logic is more complicated
    monthlyIncrease = await getMonthlyDuplicateSentences(options);
    totalCount = await getTotalDuplicateSentences();
  } else {
    // Simple queries
    monthlyIncrease = await getMonthlyContributions(tableName, options);
    totalCount = await getTotal(tableName, options);
  }

  const yearlySum = monthlyIncrease.reduce(yearlySumReducer, 0);

  totalCount = totalCount.total_count;

  return { yearlySum, totalCount, monthlyIncrease };
};

const formatStatistics = async (
  yearlySum: number,
  totalCount: number,
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
    total_count: totalCount,
    monthly_increase: monthlyContributions,
    monthly_running_totals: monthlyRunningTotals,
  };
};

const getMonthlyContributions = async (
  tableName: TableNames,
  options: QueryOptions
): Promise<StatisticsCount[]> => {
  const filter = options?.filter;
  const conditional = filter && FILTERS[filter];

  const [rows] = await db.query(`
    SELECT
      MAX(DATE_FORMAT(created_at, "%Y-%m-%d")) as date,
      COUNT(created_at) as total_count
    FROM
      ${tableName} d
    WHERE
      YEAR(created_at) = ${options.year}
      ${conditional ? 'AND ' + conditional : ''}
    GROUP BY
      DATE_FORMAT(created_at, "%Y-%m")
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
      MAX(DATE_FORMAT(created_at, "%Y-%m-%d")) as date,
      COUNT(created_at) as total_count
   FROM
    (
      SELECT * 
      FROM ${tableName} d 
      WHERE YEAR(created_at) = ${options.year}
      GROUP BY ${groupByColumn}
    ) d
    GROUP BY
      DATE_FORMAT(created_at, "%Y-%m")
    ORDER BY created_at DESC;
  `);
  return rows;
};

const getMonthlyDuplicateSentences = async (
  options: QueryOptions
): Promise<StatisticsCount[]> => {
  const [rows] = await db.query(`
    SELECT
      MAX(DATE_FORMAT(created_at, "%Y-%m-%d")) as date,
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
      YEAR(created_at) = ${options.year}
    GROUP BY
      DATE_FORMAT(created_at, "%Y-%m")
    ORDER BY
      created_at DESC;
  `);
  return rows;
};

const getTotalDuplicateSentences = async (): Promise<StatisticsCount> => {
  const [[rows]] = await db.query(`
    SELECT
      SUM(d.total_count) as total_count
    FROM
      (
      SELECT
        count(1) as total_count
      FROM
        clips c
      GROUP BY
        original_sentence_id
      HAVING
        total_count > 1) d
  `);
  return rows;
};

const getUniqueSpeakersTotal = async (): Promise<StatisticsCount> => {
  const [[rows]] = await db.query(`
  SELECT
	  count(d.total_count) as total_count
  FROM
    (
    SELECT
      count(1) as total_count
    FROM
      clips c
    GROUP BY
      client_id) d
    `);
  return rows;
};

const getTotal = async (
  tableName: TableNames,
  options?: QueryOptions
): Promise<StatisticsCount> => {
  const filter = options?.filter;
  const conditional = filter && FILTERS[filter];

  const [[rows]] = await db.query(`
    SELECT
    count(1) as total_count
    FROM
      ${tableName} d
    ${conditional ? 'WHERE ' + conditional : ''}
  `);
  return rows;
};

const queryClipsWithMetadata = async (): Promise<StatisticsCount[]> => {
  const [rows] = await db.query(`
  SELECT
	  MAX(DATE_FORMAT(created_at, "%Y-%m")) as date,
	  COUNT(1) as total_count
  FROM
	(
	SELECT
		c.id,
		c.created_at
	FROM
		clips c
	LEFT JOIN user_client_accents uca ON
		uca.client_id = c.client_id
	LEFT JOIN user_client_variants ucv ON
		ucv.client_id = c.client_id
	LEFT JOIN demographics d ON
		d.client_id = c.client_id
	WHERE
		(uca.id IS NOT NULL
			OR 
		ucv.id IS NOT NULL
			OR 
		d.age_id IS NOT NULL
			OR 
		d.gender_id IS NOT NULL)
	GROUP BY
		c.id 
        ) clips_with_metadata
    GROUP BY
            DATE_FORMAT(created_at, "%Y-%m")
    ORDER BY
            created_at DESC;
  `);

  return rows;
};

const getYearFromOptions = (options?: QueryOptions): number =>
  Number(options?.year ?? new Date().getFullYear());

export const getStatistics = lazyCache(
  'get-stats',
  async (tableName: TableNames, options?: QueryOptions) => {
    const { yearlySum, totalCount, monthlyIncrease } = await queryStatistics(
      tableName,
      options
    );

    const formattedStatistics = await formatStatistics(
      yearlySum,
      totalCount,
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

export const formatMetadataStatistics = (
  yearlySumMetadata: number,
  yearlySumClips: number,
  totalCountMetadata: number,
  totalCountClips: number,
  monthlyIncreaseMetadata: StatisticsCount[],
  monthlyIncreaseClips: StatisticsCount[]
) => {
  const flatMonthlyIncreaseMetadata: { [key: string]: number } =
    monthlyIncreaseMetadata
      .map(row => ({ [row.date]: row.total_count }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  const flatMonthlyIncreaseClips: { [key: string]: number } =
    monthlyIncreaseClips
      .map(row => ({ [row.date]: row.total_count }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  const monthlyIncrease = Object.keys(flatMonthlyIncreaseClips)
    .map(key => ({
      [key]: `${flatMonthlyIncreaseMetadata[key] ?? 0}/${
        flatMonthlyIncreaseClips[key]
      }`,
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  const monthlyIncreaseCoverage = Object.keys(flatMonthlyIncreaseClips)
    .map(key => ({
      [key]: +(
        (flatMonthlyIncreaseMetadata[key] ?? 0) / flatMonthlyIncreaseClips[key]
      ).toFixed(2),
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  const metadata = getResponseMetadata();

  return {
    yearly_sum: `${yearlySumMetadata}/${yearlySumClips}`,
    yearly_sum_coverage: +(yearlySumMetadata / yearlySumClips).toFixed(2) || 0,
    total_count: `${totalCountMetadata}/${totalCountClips}`,
    total_count_coverage: +(totalCountMetadata / totalCountClips).toFixed(2),
    monthly_increase: monthlyIncrease,
    monthly_increase_coverage: monthlyIncreaseCoverage,
    metadata,
  };
};

// The route parameter is just a placeholder to have a unique redis cache key. Without it, we would have
// an overlap with the clips endpoint.
const getMetadataQueryHandlerImpl = async (
  table: TableNames,
  options?: QueryOptions,
  route = 'metadata'
) => {
  const year = getYearFromOptions(options);
  options = { ...options, year };
  const [metadata, clips, totalCountClips] = await Promise.all([
    queryClipsWithMetadata(),
    getMonthlyContributions(table, options),
    getTotal(table, options),
  ]);

  const formatDate = (row: StatisticsCount): StatisticsCount => ({
    date: row.date.split('-').slice(0, 2).join('-'),
    total_count: row.total_count,
  });

  const monthlyIncreaseClips = clips.map(formatDate);

  const monthlyIncreaseMeta = metadata
    .filter(row => new Date(row.date).getFullYear() === year);

  const yearlySumMeta = monthlyIncreaseMeta
    .map(row => pick(row, ['total_count']))
    .reduce(yearlySumReducer, 0);

  const yearlySumClips = monthlyIncreaseClips
    .map(row => pick(row, ['total_count']))
    .reduce(yearlySumReducer, 0);

  const totalCountMeta = metadata
    .map(row => pick(row, ['total_count']))
    .reduce(yearlySumReducer, 0);

  return formatMetadataStatistics(
    yearlySumMeta,
    yearlySumClips,
    totalCountMeta,
    totalCountClips.total_count,
    monthlyIncreaseMeta,
    monthlyIncreaseClips
  );
};

export const getMetadataQueryHandler = lazyCache(
  'get-stats',
  getMetadataQueryHandlerImpl,
  TimeUnits.DAY
);
