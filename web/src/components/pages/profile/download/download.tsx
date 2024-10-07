import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { pick } from 'common/utility'
import { CloudIcon, MicIcon, UserIcon, RedoIcon } from '../../../ui/icons'
import { Button } from '../../../ui/ui'
import './download.css'
import API from '../../../../services/api'
import { useAccount, useAPI } from '../../../../hooks/store-hooks'
import {
  TakeoutRequest,
  TakeoutState,
  UserClient,
  Accent,
  TakeoutResponse,
} from 'common'
import { byteToSize } from '../../../../utility'
import Modal, { ModalProps } from '../../../modal/modal'

// you can request a new takeout every 7 days
const REQUEST_LIMIT = 7

const Section = ({
  title,
  titleAction,
  info = '',
  className = '',
  id = '',
  children,
  ...props
}: {
  title: string
  titleAction?: React.ReactNode
  info?: string
  className?: string
  id?: string
  children?: React.ReactNode
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
)

const Item = ({
  icon,
  title,
  size,
  info,
  type,
  action,
  className = '',
  disabledReason = '',
  isDisabled = false,
  ...props
}: {
  icon: React.ReactNode
  title: string
  size: string
  info: string
  type: 'profile' | 'clips'
  action: () => void
  className?: string
  isDisabled?: boolean
  disabledReason?: string
}) => {
  return (
    <div className={'download-item' + className} {...props}>
      {icon}
      <div className="download-item-info">
        <h3>{title}</h3>
        <p>{info}</p>
      </div>
      <p>{size}</p>

      {isDisabled ? (
        <span className="download-disabled">{disabledReason}</span>
      ) : (
        <Localized
          id={type === 'clips' ? 'download-request' : 'download-start'}>
          <Button rounded className="download-button" onClick={action} />
        </Localized>
      )}
    </div>
  )
}

const Request = ({
  request,
  sizeFormatter,
  className = '',
  onRequestLinks,
  onRefreshTakeouts,
  ...props
}: {
  request: TakeoutRequest
  sizeFormatter: (s: number) => string
  onRequestLinks: (id: number) => void
  onRefreshTakeouts: () => void
  className?: string
}) => {
  // Introduce a small delay for visual feedback.
  const [refreshing, setRefreshing] = useState(false)

  function doRefresh() {
    setRefreshing(true)
    onRefreshTakeouts()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
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
  )
}

interface LinkModalProps extends ModalProps {
  title: string
  description: string
  requestId: number
  api: API
}

const LinkModal = ({
  title,
  description,
  requestId,
  api,
  ...props
}: LinkModalProps) => {
  const [links, setLinks] = useState({ parts: [], metadata: '' })

  useEffect(() => {
    api
      .fetchTakeoutLinks(requestId)
      .then(setLinks)
      .catch((err: any) => console.error(err))
  }, [requestId])

  return (
    <Modal {...props} innerClassName="download-request-modal">
      <Section title={title} info={description}>
        {links.parts.length && (
          <ul>
            {links.parts.map((link: string, i: number) => (
              <li key={i}>
                <Localized
                  id="download-request-link-text"
                  vars={{ offset: i + 1, total: links.parts.length }}>
                  {/* Localized injects content into child tag */}
                  {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                  <a key={link} href={link} target="_blank" rel="noreferrer" />
                </Localized>
              </li>
            ))}
            <li>
              <Localized id="download-request-metadata-link">
                {/* Localized injects content into child tag */}
                {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                <a
                  key={links.metadata}
                  href={links.metadata}
                  target="_blank"
                  rel="noreferrer"
                />
              </Localized>
            </li>
          </ul>
        )}
        <Localized id="download-request-link-single">
          <p />
        </Localized>
        <textarea
          value={[links.parts, links.metadata].join('\n')}
          readOnly
          wrap="off"
          className="download-request-nl-links"
        />
        <Localized id="close">
          <Button outline rounded onClick={props.onRequestClose} />
        </Localized>
      </Section>
    </Modal>
  )
}

export function downloadTextAsFile(filename: string, text: string) {
  return downloadAsFile(
    filename,
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  )
}

function downloadAsFile(filename: string, url: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function getProfileInfo(account: UserClient) {
  return [
    ...Object.entries(pick(account, ['email', 'username', 'age', 'gender'])),
    ...account.languages.reduce((all, l, i) => {
      const localeLabel = 'language ' + (i + 1)
      const accents = l.accents
        .slice(1)
        .map((accent: Accent) => accent.name)
        .join(', ')
      const arr = [
        ...all,
        [localeLabel, l.locale],
        [localeLabel + ' accent(s)', accents],
      ]
      return arr
    }, []),
  ]
    .map(([key, value]) => key + ': ' + value)
    .join('\n')
}

function download(
  account: UserClient,
  api: API,
  type: 'profile' | 'clips',
  forceTakeoutRefresh: () => void
) {
  if (type === 'profile')
    downloadTextAsFile('profile.txt', getProfileInfo(account))

  if (type === 'clips')
    api
      .requestTakeout()
      .then(() => forceTakeoutRefresh())
      .catch((err: any) => console.error(err))
}

function DownloadProfile(props: WithLocalizationProps) {
  const api = useAPI()
  const account = useAccount()
  const { getString } = props

  const [serverDate, setServerDate] = useState(new Date())
  const [hasAnyPendingTakeout, setHasAnyPendingTakeout] = useState(false)
  const [hasRecentTakeout, setHasRecentTakeout] = useState(false)
  const [takeouts, setTakeouts] = useState(null)
  const [takeoutRefresh, setTakeoutRefresh] = useState(0)
  const forceTakeoutRefresh = () => setTakeoutRefresh(x => x + 1)
  const [takeoutRequestId, setTakeoutRequestId] = useState(null)

  useEffect(() => {
    api.fetchTakeouts().then(setTakeouts)
    api.getServerDate().then(date => setServerDate(new Date(date)))
  }, [takeoutRefresh])

  useEffect(() => {
    setHasAnyPendingTakeout(
      (takeouts || []).reduce(
        (acc: boolean, t: TakeoutRequest) =>
          acc || t.state !== TakeoutState.AVAILABLE,
        false
      )
    )

    setHasRecentTakeout(
      (takeouts || []).reduce((acc: boolean, t: TakeoutRequest) => {
        return (
          acc ||
          serverDate.getTime() <=
            new Date(t.requested_date).getTime() +
              REQUEST_LIMIT * 24 * 60 * 60 * 1000
        )
      }, false)
    )
  }, [takeouts])

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
          type="profile"
          action={() => download(account, api, 'profile', forceTakeoutRefresh)}
        />
        {account.clips_count > 0 ? (
          <Item
            icon={<MicIcon />}
            title={getString('download-recordings-title')}
            info={getString('download-recordings-info')}
            size={getString('download-recordings-size')}
            type="clips"
            action={() => download(account, api, 'clips', forceTakeoutRefresh)}
            isDisabled={hasAnyPendingTakeout || hasRecentTakeout}
            disabledReason={
              hasAnyPendingTakeout
                ? getString('download-recordings-unavailable')
                : getString('download-recently-requested', {
                    days: REQUEST_LIMIT,
                  })
            }
          />
        ) : null}
      </Section>
      {takeouts && takeouts.length > 0 && (
        <Section
          title={getString('download-requests')}
          info={getString('download-requests-info')}
          id="requests"
          className="download-requests"
          key={takeoutRefresh}>
          {takeouts.map((request: TakeoutRequest) => (
            <Request
              key={request.id}
              request={request}
              sizeFormatter={s => byteToSize(s, getString)}
              onRefreshTakeouts={forceTakeoutRefresh}
              onRequestLinks={setTakeoutRequestId}
            />
          ))}
        </Section>
      )}
    </>
  )
}

export default withLocalization(DownloadProfile)
