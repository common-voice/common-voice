import { Localized } from '@fluent/react';
import * as React from 'react';
import { useLocale } from '../../locale-helpers';
import './dataset-corpus-download-table.css';

interface Props {
  releaseData: any[];
  onRowSelect: any;
  selectedId: number | null;
}

const MS_IN_HOUR = 3600000;
const msToHours = (msDuration: number) => {
  return Math.ceil(msDuration / MS_IN_HOUR);
};

const formatBytes = (bytes: number, locale: string) => {
  if (bytes === 0) return '0 Bytes';
  const DECIMAL_PLACES = 2;
  const BYTES_IN_KILOBYTE = 1024;
  const sizes = ['btye', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'];
  const i = Math.floor(Math.log(bytes) / Math.log(BYTES_IN_KILOBYTE));

  return parseFloat(
    (bytes / Math.pow(BYTES_IN_KILOBYTE, i)).toFixed(DECIMAL_PLACES)
  ).toLocaleString(locale, {
    style: 'unit',
    unit: sizes[i],
  });
};

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
    display: (value: number, locale: string) => {
      return formatBytes(value, locale);
    },
    label: 'size',
  },
  total_clips_duration: {
    display: (value: number, locale: string) => {
      return Intl.NumberFormat([locale, 'en']).format(msToHours(value));
    },
    label: 'recorded-hours',
  },
  valid_clips_duration: {
    display: (value: number, locale: string) => {
      return Intl.NumberFormat([locale, 'en']).format(msToHours(value));
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
    display: (value: number, locale: string) => {
      return value.toLocaleString(locale, {
        style: 'decimal',
      });
    },
    label: 'number-of-voices',
  },
  audio_format: {
    display: () => {
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
