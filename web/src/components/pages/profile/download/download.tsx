import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { CloudIcon, MicIcon, UserIcon, RedoIcon } from '../../../ui/icons';
import { Button, LabeledCheckbox } from '../../../ui/ui';
import './download.css';
import API from '../../../../services/api';
import { useAccount, useAPI } from '../../../../hooks/store-hooks';
import { TakeoutRequest, TakeoutState, UserClient } from 'common';
import { byteToSize } from '../../../../utility';
import Modal, { ModalProps } from '../../../modal/modal';

const pick = require('lodash.pick');

const Section = ({
  title,
  titleAction,
  info = '',
  className = '',
  id = '',
  children,
  ...props
}: {
  title: string;
  titleAction?: React.ReactNode;
  info?: string;
  className?: string;
  id?: string;
  children?: React.ReactNode;
}) => (
  <section className={'profile-download ' + className} {...props}>
    <div className="section-title">
      <h2 id={id}>{title}</h2>
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
  size,
  info,
  className = '',
  disabledReason = '',
  isSelected = true,
  isDisabled = false,
  setIsSelected,
  children,
  ...props
}: {
  icon: React.ReactNode;
  title: string;
  size: string;
  info: string;
  className?: string;
  isSelected: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
  setIsSelected: any;
  children?: React.ReactNode;
}) => {
  return (
    <div className={'download-item' + className} {...props}>
      {icon}
      <div className="download-item-info">
        <h3>{title}</h3>
        <p>{info}</p>
      </div>
      <div className="download-item-size">
        <p>{size}</p>
      </div>
      {isDisabled ? (
        <span className="download-disabled">{disabledReason}</span>
      ) : (
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
      )}
    </div>
  );
};

const Request = ({
  request,
  sizeFormatter,
  className = '',
  onRequestLinks,
  onRefreshTakeouts,
  ...props
}: {
  request: TakeoutRequest;
  sizeFormatter: (s: number) => string;
  onRequestLinks: (id: number) => void;
  onRefreshTakeouts: () => void;
  className?: string;
}) => {
  // Introduce a small delay for visual feedback.
  const [refreshing, setRefreshing] = useState(false);

  function doRefresh() {
    setRefreshing(true);
    onRefreshTakeouts();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }

  return (
    <div className={'download-request-item' + className} {...props}>
      <div className="download-request-icon">
        <MicIcon />
      </div>
      <Localized
        id="download-request-title"
        vars={{
          created: new Date(request.requested_date).toLocaleDateString([], {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }),
        }}>
        <p className="download-request-title" />
      </Localized>
      {request.state === TakeoutState.AVAILABLE ? (
        <p className="download-request-description">
          {request.archive_count === 1 ? (
            <Localized id="download-request-archive-single">
              <span />
            </Localized>
          ) : (
            <Localized
              id="download-request-archive-multiple"
              vars={{ archiveCount: request.archive_count }}>
              <span />
            </Localized>
          )}
          &#32;
          <Localized
            id="download-request-description"
            vars={{
              size: sizeFormatter(request.clip_total_size),
              clipCount: request.clip_count,
              expires: new Date(request.expiration_date).toLocaleDateString(
                [],
                {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }
              ),
            }}>
            <span />
          </Localized>
        </p>
      ) : (
        <Localized id="download-request-assembling-description">
          <p className="download-request-description" />
        </Localized>
      )}
      {request.state === TakeoutState.AVAILABLE ? (
        <Button
          rounded
          outline
          className="download-request-button"
          onClick={() => onRequestLinks(request.id)}>
          <CloudIcon />{' '}
          <Localized id="download-request-button">
            <span />
          </Localized>
        </Button>
      ) : (
        <Button
          rounded
          outline
          disabled={refreshing}
          className="download-request-button"
          onClick={doRefresh}>
          <RedoIcon />{' '}
          <Localized id="download-request-refresh-button">
            <span />
          </Localized>
        </Button>
      )}
    </div>
  );
};

interface LinkModalProps extends ModalProps {
  title: string;
  description: string;
  requestId: number;
  api: API;
}

const LinkModal = ({
  title,
  description,
  requestId,
  api,
  ...props
}: LinkModalProps) => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    api
      .fetchTakeoutLinks(requestId)
      .then(setLinks)
      .catch((err: any) => console.error(err));
  }, [requestId]);

  return (
    <Modal {...props} innerClassName="download-request-modal">
      <Section title={title} info={description}>
        <ul>
          {links.map((link, i) => (
            <li>
              <Localized
                id="download-request-link-text"
                vars={{ offset: i + 1, total: links.length }}>
                <a key={link} href={link} target="_blank" />
              </Localized>
            </li>
          ))}
        </ul>
        <Localized id="download-request-link-single">
          <p />
        </Localized>
        <textarea
          value={links.join('\n')}
          readOnly
          wrap="off"
          className="download-request-nl-links"
        />
        <Localized id="close">
          <Button outline rounded onClick={props.onRequestClose} />
        </Localized>
      </Section>
    </Modal>
  );
};

function downloadTextAsFile(filename: string, text: string) {
  return downloadAsFile(
    filename,
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  );
}

function downloadAsFile(filename: string, url: string) {
  const a = document.createElement('a');
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

function download(
  account: UserClient,
  api: API,
  infoSelected: boolean,
  recordingsSelected: boolean,
  forceTakeoutRefresh: () => void
) {
  if (infoSelected) downloadTextAsFile('profile.txt', getProfileInfo(account));

  if (recordingsSelected)
    api
      .requestTakeout()
      .then((data: any) => forceTakeoutRefresh())
      .catch((err: any) => console.error(err));
}

function DownloadProfile(props: WithLocalizationProps) {
  const api = useAPI();
  const account = useAccount();
  const { getString } = props;

  const [infoSelected, setInfoSelected] = useState(true);
  const [recordingsSelected, setRecordingsSelected] = useState(true);

  const [hasAnyPendingTakeout, setHasAnyPendingTakeout] = useState(false);
  const [takeouts, setTakeouts] = useState(null);
  const [takeoutRefresh, setTakeoutRefresh] = useState(0);
  const forceTakeoutRefresh = () => setTakeoutRefresh(x => x + 1);
  const [takeoutRequestId, setTakeoutRequestId] = useState(null);

  useEffect(() => {
    api.fetchTakeouts().then(setTakeouts);
  }, [takeoutRefresh]);

  useEffect(() => {
    setHasAnyPendingTakeout(
      (takeouts || []).reduce(
        (acc: boolean, t: TakeoutRequest) =>
          acc || t.state !== TakeoutState.AVAILABLE,
        false
      )
    );
  }, [takeouts]);

  useEffect(() => {
    if (hasAnyPendingTakeout) setRecordingsSelected(false);
  }, [hasAnyPendingTakeout]);

  return (
    <>
      {takeoutRequestId !== null && (
        <LinkModal
          title={getString('download-request-modal-title')}
          description={getString('download-request-modal-description')}
          requestId={takeoutRequestId}
          api={api}
          onRequestClose={() => setTakeoutRequestId(null)}
        />
      )}
      <Section
        title={getString('download-q')}
        info={getString('download-info')}>
        <Item
          icon={<UserIcon />}
          title={getString('download-profile-title')}
          info={getString('download-profile-info')}
          size={getString('download-profile-size')}
          isSelected={infoSelected}
          setIsSelected={setInfoSelected}
        />
        <Item
          icon={<MicIcon />}
          title={getString('download-recordings-title')}
          info={getString('download-recordings-info')}
          size={getString('download-recordings-size')}
          isSelected={recordingsSelected}
          setIsSelected={setRecordingsSelected}
          isDisabled={hasAnyPendingTakeout}
          disabledReason={getString('download-recordings-unavailable')}
        />
        <Localized id="download-start">
          <Button
            rounded
            disabled={!infoSelected && !recordingsSelected}
            className="download-button"
            onClick={() =>
              download(
                account,
                api,
                infoSelected,
                recordingsSelected,
                forceTakeoutRefresh
              )
            }
          />
        </Localized>
      </Section>
      <Section
        title={getString('download-requests')}
        info={getString('download-requests-info')}
        id="requests"
        className="download-requests">
        {takeouts && takeouts.length === 0 && (
          <p>{getString('download-no-requests')}</p>
        )}
        {takeouts &&
          takeouts.length &&
          takeouts.map((request: TakeoutRequest) => (
            <Request
              key={request.id}
              request={request}
              sizeFormatter={s => byteToSize(s, getString)}
              onRefreshTakeouts={forceTakeoutRefresh}
              onRequestLinks={setTakeoutRequestId}
            />
          ))}
      </Section>
    </>
  );
}

export default withLocalization(DownloadProfile);
