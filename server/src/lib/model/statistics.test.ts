import { formatMetadataStatistics, StatisticsCount } from './statistics';

const table = [
  {
    title: 'Happy path, all data is present and dates are matching',
    parameters: {
      yearlySumMetadata: 90,
      yearlySumClips: 100,
      totalCountMetadata: 990,
      totalCountClips: 1000,
      monthlyIncreaseMetadata: [
        { date: '2022-05', total_count: 7 },
        { date: '2022-04', total_count: 2 },
        { date: '2022-03', total_count: 8 },
        { date: '2022-02', total_count: 9 },
      ],
      monthlyIncreaseClips: [
        { date: '2022-05', total_count: 10 },
        { date: '2022-04', total_count: 10 },
        { date: '2022-03', total_count: 10 },
        { date: '2022-02', total_count: 10 },
      ],
    },
    expected: {
      yearly_sum: '90/100',
      yearly_sum_coverage: 0.9,
      total_count: '990/1000',
      total_count_coverage: 0.99,
      monthly_increase: {
        '2022-05': '7/10',
        '2022-04': '2/10',
        '2022-03': '8/10',
        '2022-02': '9/10',
      },
      monthly_increase_coverage: {
        '2022-05': 0.7,
        '2022-04': 0.2,
        '2022-03': 0.8,
        '2022-02': 0.9,
      },
    },
  },
  {
    title: 'Check when there no clips with metadata in one month',
    parameters: {
      yearlySumMetadata: 90,
      yearlySumClips: 100,
      totalCountMetadata: 990,
      totalCountClips: 1000,
      monthlyIncreaseMetadata: [
        { date: '2022-04', total_count: 2 },
        { date: '2022-03', total_count: 8 },
        { date: '2022-02', total_count: 9 },
      ],
      monthlyIncreaseClips: [
        { date: '2022-05', total_count: 10 },
        { date: '2022-04', total_count: 10 },
        { date: '2022-03', total_count: 10 },
        { date: '2022-02', total_count: 10 },
      ],
    },
    expected: {
      yearly_sum: '90/100',
      yearly_sum_coverage: 0.9,
      total_count: '990/1000',
      total_count_coverage: 0.99,
      monthly_increase: {
        '2022-05': '0/10',
        '2022-04': '2/10',
        '2022-03': '8/10',
        '2022-02': '9/10',
      },
      monthly_increase_coverage: {
        '2022-05': 0,
        '2022-04': 0.2,
        '2022-03': 0.8,
        '2022-02': 0.9,
      },
    },
  },
  {
    title: 'Check when there are no clips at all in a given year',
    parameters: {
      yearlySumMetadata: 0,
      yearlySumClips: 0,
      totalCountMetadata: 990,
      totalCountClips: 1000,
      monthlyIncreaseMetadata: [] as StatisticsCount[],
      monthlyIncreaseClips: [] as StatisticsCount[],
    },
    expected: {
      yearly_sum: '0/0',
      yearly_sum_coverage: 0,
      total_count: '990/1000',
      total_count_coverage: 0.99,
      monthly_increase: {},
      monthly_increase_coverage: {},
    },
  },
  {
    title: 'Check when there are clips but no clips with metadata',
    parameters: {
      yearlySumMetadata: 0,
      yearlySumClips: 100,
      totalCountMetadata: 990,
      totalCountClips: 1000,
      monthlyIncreaseMetadata: [] as StatisticsCount[],
      monthlyIncreaseClips: [
        { date: '2022-05', total_count: 10 },
        { date: '2022-04', total_count: 10 },
      ],
    },
    expected: {
      yearly_sum: '0/100',
      yearly_sum_coverage: 0,
      total_count: '990/1000',
      total_count_coverage: 0.99,
      monthly_increase: {
        '2022-05': '0/10',
        '2022-04': '0/10',
      },
      monthly_increase_coverage: {
        '2022-05': 0,
        '2022-04': 0,
      },
    },
  },
];

describe('format metadata statistics', () => {
  test.each(table)(
    '$title',
    ({ parameters, expected }) => {
      expect(
        formatMetadataStatistics(
          parameters.yearlySumMetadata,
          parameters.yearlySumClips,
          parameters.totalCountMetadata,
          parameters.totalCountClips,
          parameters.monthlyIncreaseMetadata,
          parameters.monthlyIncreaseClips
        )    
      ).toMatchObject(expected);
    }
  );
});
