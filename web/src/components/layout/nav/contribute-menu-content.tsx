import * as React from 'react';
import { Localized } from '@fluent/react';
import classNames from 'classnames';

import { LocaleLink } from '../../locale-helpers';
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
  // TODO: refactor this component so that active page is passed as props
  const speakActive = pathname.includes(URLS.SPEAK)
  const listenActive = pathname.includes(URLS.LISTEN)
  const writeActive = pathname.includes(URLS.WRITE)
  const reviewActive = pathname.includes(URLS.REVIEW)

  return (
    <div className={className}>
      <div>
        <Localized id="contribute-voice-collection-nav-header">
          <p className="nav-header-item" />
        </Localized>
        <ul>
          <li
            className={classNames({
              'selected-option': speakActive,
            })}>
            <MicIcon />
            <LocaleLink to={URLS.SPEAK} className="contribute-link">
              <Localized id="speak" />
            </LocaleLink>
            {speakActive && <span className="border" />}
          </li>
          <li
            className={classNames({
              'selected-option': listenActive,
            })}>
            <ListenIcon />
            <LocaleLink to={URLS.LISTEN} className="contribute-link">
              <Localized id="listen" />
            </LocaleLink>
            {listenActive && <span className="border" />}
          </li>
        </ul>
      </div>
      <div className="vertical-line" />
      <div>
        <Localized id="contribute-sentence-collection-nav-header">
          <p className="nav-header-item" />
        </Localized>
        <ul>
          <li
            className={classNames('write', {
              'selected-option': writeActive,
            })}>
            <EditIcon />
            <LocaleLink to={URLS.WRITE} className="contribute-link">
              <Localized id="write" />
            </LocaleLink>
            {writeActive && <span className="border" />}
          </li>
          {isUserLoggedIn && (
            <li
              className={classNames('review', {
                'selected-option': reviewActive,
              })}>
              <ReviewIcon />
              <LocaleLink to={URLS.REVIEW} className="contribute-link">
                <Localized id="review" />
              </LocaleLink>
              {reviewActive && <span className="border" />}
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
