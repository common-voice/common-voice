import { Localized } from '@fluent/react';
import * as React from 'react';
import { useLocale } from '../../locale-helpers';
import './dataset-corpus-download-table.css';

interface Props {
  releaseData: any[];
  onRowSelect: any;
  selectedId: number | null;
}

const COLUMNS = {
  name: {
    display: (value: string) => {
      return value;
    },
    label: 'dataset-version',
  },
  release_date: {
    display: (value: string, locale: string) => {
      return Intl.DateTimeFormat([locale, 'en']).format(new Date(value));
    },
    label: 'dataset-date',
  },
  size: {
    display: (value: number) => {
      return value;
    },
    label: 'size',
  },
  total_clips_duration: {
    display: (value: number) => {
      return value;
    },
    label: 'recorded-hours',
  },
  valid_clips_duration: {
    display: (value: number) => {
      const date = new Date(0);
      date.setMilliseconds(value); // specify value for SECONDS here;
      return date.getHours();
    },
    label: 'validated-hours',
  },
  license: {
    display: () => {
      return 'CC-0';
    },
    label: 'cv-license',
  },
  total_users: {
    display: (value: string) => {
      return value;
    },
    label: 'number-of-voices',
  },
  audio_format: {
    display: (value: string) => {
      return 'MP3';
    },
    label: 'audio-format',
  },
};

const DatasetCorpusDownloadTable = ({
  releaseData,
  onRowSelect,
  selectedId,
}: Props) => {
  const labels = Object.keys(COLUMNS).map((col: string) => col);
  console.log(labels);

  const [locale] = useLocale();

  return (
    <table className="table dataset-table">
      <thead>
        <tr>
          {Object.values(COLUMNS).map(column => {
            return (
              <th key={column.label}>
                <Localized id={column.label} />
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {releaseData.map(row => {
          return (
            <tr
              onClick={() => onRowSelect(row.id)}
              className={row.id === selectedId ? 'selected' : ''}
              key={row.id + row.release_dir}>
              {Object.keys(COLUMNS).map((col: string, index) => {
                return (
                  <td key={index + COLUMNS[col].label}>
                    {COLUMNS[col].display(row[col], locale)}
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
