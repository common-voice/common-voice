import { Localized } from '@fluent/react';
import * as React from 'react';
import './dataset-corpus-download-table.css';

interface Props {
  releaseData: any[];
  onRowSelect: any;
}

const COLUMN_VALUES = {
  name: 'dataset-version',
  release_date: 'dataset-date',
  size: 'size',
  total_clips_duration: 'recorded-hours',
  valid_clips_duration: 'validated-hours',
  license: 'cv-license',
  total_users: 'number-of-voices',
  audio_format: 'audio-format',
};

const DatasetCorpusDownloadTable = ({ releaseData, onRowSelect }: Props) => {
  const columnWidth = 100 / Object.keys(COLUMN_VALUES).length + '%';

  return (
    <table className="table dataset-table">
      <thead>
        <tr>
          {Object.values(COLUMN_VALUES).map(name => {
            return (
              <th style={{ width: columnWidth }} key={name}>
                <Localized id={name} />
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {releaseData.map(row => {
          return (
            <tr onClick={onRowSelect} key={row.id + row.release_dir}>
              {Object.keys(COLUMN_VALUES).map((col, index) => {
                return (
                  <td style={{ width: columnWidth }} key={index + col}>
                    {row[col] || 0}
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
