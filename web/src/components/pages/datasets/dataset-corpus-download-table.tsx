import * as React from 'react';

interface Props {
  releaseData: any[];
}

const COLUMN_LABELS = [
  'total_clips_duration',
  'valid_clips_duration',
  'average_clips_duration',
  'total_users',
  'size',
  'name',
  'release_date',
  'release_type',
];

const DatasetCorpusDownloadTable = ({ releaseData }: Props) => {
  return (
    <table>
      <thead>
        <tr>
          {COLUMN_LABELS.map(name => {
            return <td key={name}>{name} </td>;
          })}
        </tr>
      </thead>
      <tbody>
        {releaseData.map(row => {
          return (
            <tr key={row.id + row.releasE_dir}>
              {Object.entries(row).map(([key, value]) => {
                if (COLUMN_LABELS.includes(key))
                  return <td key={key + value}>{value} </td>;
              })}{' '}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DatasetCorpusDownloadTable;
