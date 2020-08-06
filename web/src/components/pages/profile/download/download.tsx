import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import { MicIcon, UserIcon } from '../../../ui/icons';
import {
  LabeledCheckbox,
  Button,
} from '../../../ui/ui';
const pick = require('lodash.pick');
import './download.css';
import API from '../../../../services/api';
import { useState } from 'react';
import { useAPI, useAccount } from '../../../../hooks/store-hooks';
import { UserClient } from 'common';

const Section = ({
  title,
  titleAction,
  info = '',
  className = '',
  children,
  ...props
}: {
  title: string;
  titleAction?: React.ReactNode;
  info?: string;
  className?: string;
  children?: React.ReactNode;
}) => (
    <section className={'profile-download ' + className} {...props}>
      <div className="section-title">
        <h2>{title}</h2>
        {titleAction}
      </div>
      <div className="section-info">
        <p>{info}</p>
      </div>
      {children && <div className="section-body">{children}</div>}
    </section>
  );

const Item = ({
  icon,
  title,
  info = '',
  className = '',
  isSelected = true,
  setIsSelected,
  children,
  ...props
}: {
  icon: React.ReactNode;
  title: string;
  info?: string;
  className?: string;
  isSelected: boolean;
  setIsSelected: any;
  children?: React.ReactNode;
}) => {

  return (
    <div className={'download-item three-columns' + className} {...props}>
      {icon}
      <div className='download-item-info'>
        <h3>{title}</h3>
        <p>{info}</p>
      </div>
      <div className='download-item-size'>
        <Localized id="download-size">
          <p className="download-size" />
        </Localized>
        <Localized id="download-speed">
          <p className="download-speed" />
        </Localized>
      </div>
      <LabeledCheckbox
        checked={isSelected}
        onChange={(event: any) => {
          setIsSelected(event.target.checked);
        }}
        label={
          <Localized id="download-selected">
            <span />
          </Localized>
        }
      />
    </div>
  );
}

function downloadTextAsFile(filename: string, text: string) {
  return downloadAsFile(filename, 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
}

function downloadBlobAsFile(filename: string, blob: any) {
  return downloadAsFile(filename, window.URL.createObjectURL(blob));
}

function downloadAsFile(filename: string, url: string) {
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function getProfileInfo(account: UserClient) {
  return [
    ...Object.entries(pick(account, 'email', 'username', 'age', 'gender')),
    ...account.locales.reduce((all, l, i) => {
      const localeLabel = 'language ' + (i + 1);
      return [
        ...all,
        [localeLabel, l.locale],
        [localeLabel + ' accent', l.accent],
      ];
    }, []),
  ]
    .map(([key, value]) => key + ': ' + value)
    .join('\n');
}

function download(account: UserClient, api: API, infoSelected: boolean, recordingsSelected: boolean) {
  if (infoSelected)
    downloadTextAsFile('profile.txt', getProfileInfo(account));

  if (recordingsSelected)
    api.fetchRecordings()
      .then((response: any) => response.blob())
      .then((blob: any) => downloadBlobAsFile('recordings.zip', blob))
      .catch((err: any) => console.error(err));;
}

function DownloadProfile(props: WithLocalizationProps) {
  const api = useAPI();
  const account = useAccount();
  const { getString } = props;

  const [infoSelected, setInfoSelected] = useState(true);
  const [recordingsSelected, setRecordingsSelected] = useState(true);

  return (
    <Section title={getString('download-q')} info={getString('download-info')} >
      <Item
        icon={<UserIcon />}
        title={getString('download-profile-title')}
        info={getString('download-profile-info')}
        isSelected={infoSelected}
        setIsSelected={setInfoSelected}
      />
      <Item
        icon={<MicIcon />}
        title={getString('download-recordings-title')}
        info={getString('download-recordings-info')}
        isSelected={recordingsSelected}
        setIsSelected={setRecordingsSelected}
      />
      <Localized id="download-start">
        <Button rounded disabled={!infoSelected && !recordingsSelected} onClick={() => download(account, api, infoSelected, recordingsSelected)} />
      </Localized>
    </Section>
  );
}

export default withLocalization(DownloadProfile);