import * as React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { ContributableLocaleLock, LocaleLink } from '../../locale-helpers'
import { EditIcon, ListenIcon, MicIcon, ReviewIcon } from '../../ui/icons'
import URLS from '../../../urls'

type ContributeMenuContentProps = {
  className?: string
  pathname?: string
  isUserLoggedIn: boolean
}

export const ContributeMenuContent: React.FC<ContributeMenuContentProps> = ({
  className,
  pathname = '',
  isUserLoggedIn,
}) => {
  const speakActive = pathname.includes(URLS.SPEAK)
  const listenActive = pathname.includes(URLS.LISTEN)
  const writeActive = pathname.includes(URLS.WRITE)
  const reviewActive = pathname.includes(URLS.REVIEW)

  return (
    <div className={className}>
      <ContributableLocaleLock>
        <div>
          <Localized id="contribute-voice-collection-nav-header">
            <p className="nav-header-item" />
          </Localized>
          <ul>
            <li
              className={classNames({
                'selected-option': speakActive,
              })}>
              <div className="content">
                <MicIcon />
                <LocaleLink to={URLS.SPEAK} className="contribute-link">
                  <Localized id="speak" />
                </LocaleLink>
              </div>
            </li>
            <li
              className={classNames({
                'selected-option': listenActive,
              })}>
              <div className="content">
                <ListenIcon />
                <LocaleLink to={URLS.LISTEN} className="contribute-link">
                  <Localized id="listen" />
                </LocaleLink>
              </div>
            </li>
          </ul>
        </div>
        <div className="vertical-line" />
      </ContributableLocaleLock>
      <div>
        <Localized id="contribute-sentence-collection-nav-header">
          <p className="nav-header-item" />
        </Localized>
        <ul>
          <li
            className={classNames('write', {
              'selected-option': writeActive,
            })}>
            <div className="content">
              <EditIcon />
              <LocaleLink to={URLS.WRITE} className="contribute-link">
                <Localized id="write" />
              </LocaleLink>
            </div>
          </li>
          {isUserLoggedIn && (
            <li
              className={classNames('review', {
                'selected-option': reviewActive,
              })}>
              <div className="content">
                <ReviewIcon />
                <LocaleLink to={URLS.REVIEW} className="contribute-link">
                  <Localized id="review" />
                </LocaleLink>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
