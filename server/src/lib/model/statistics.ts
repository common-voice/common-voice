import lazyCache from '../lazy-cache';
import { getMySQLInstance } from './db/mysql';
import { QueryOptions, TableNames, TimeUnits } from 'common';

const db = getMySQLInstance();

type StatisticsCount = {
  total_count: number;
  date?: string;
};

type ClipsMetaDataCount = {
  clips_metadata_count: number;
};

const FILTERS = {
  rejected: 'is_valid = false',
  hasEmail: 'email IS NOT null',
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
  const isDistinct = options?.isDistinct ?? false;
  const isDuplicate = options?.isDuplicate ?? false;
  const hasMetadata = options?.hasMetadata ?? false;
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

  const yearlySum = monthlyIncrease.reduce(
    (total: number, row) => (total += row.total_count),
    0
  );
  
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

const queryClipsWithMetadata = async (year: Number): Promise<ClipsMetaDataCount> => {
  const [[rows]] = await db.query(`
    SELECT
	COUNT(1) as clips_metatadata_count
    FROM
	(
	SELECT
		c.id
	FROM
		clips c
	LEFT JOIN user_client_accents uca ON
		uca.client_id = c.client_id
	LEFT JOIN user_client_variants ucv ON
		ucv.client_id = c.client_id
	LEFT JOIN demographics d ON
		d.client_id = c.client_id
	WHERE
	YEAR(c.created_at) = ${year} AND
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
  `);

  return rows;
};

const getYearFromOptions = (options?: QueryOptions): number => options?.year ?? new Date().getFullYear();

export const getStatistics = lazyCache(
  'get-stats',
  async (tableName: TableNames, options?: QueryOptions) => {
    const { yearlySum, totalCount, monthlyIncrease } = await queryStatistics(
      tableName,
      options
    );

    const clipsWithMetadata = tableName === TableNames.CLIPS && typeof options.hasMetadata !== 'undefined'
      ? await queryClipsWithMetadata(getYearFromOptions(options))
      : undefined;

    const formattedStatistics = await formatStatistics(
      yearlySum,
      totalCount,
      monthlyIncrease
    );

    const metadata = getResponseMetadata();

    return {
      ...clipsWithMetadata,
      ...formattedStatistics,
      metadata,
    };
  },
  TimeUnits.DAY
);
