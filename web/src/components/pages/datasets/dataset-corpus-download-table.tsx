import * as React from 'react';
import './dataset-corpus-download-table.css';

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
  const columnWidth = 100 / COLUMN_LABELS.length + '%';
  return (
    <table className="table dataset-table">
      <thead>
        <tr>
          {COLUMN_LABELS.map(name => {
            return (
              <th style={{ width: columnWidth }} key={name}>
                {name}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {releaseData.map(row => {
          return (
            <tr key={row.id + row.release_dir}>
              {Object.entries(row).map(([key, value]) => {
                if (COLUMN_LABELS.includes(key))
                  return (
                    <td style={{ width: columnWidth }} key={key + value}>
                      {value || 0}{' '}
                    </td>
                  );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DatasetCorpusDownloadTable;
