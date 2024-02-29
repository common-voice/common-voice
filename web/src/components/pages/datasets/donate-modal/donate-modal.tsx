import * as React from 'react'
import { Localized } from '@fluent/react'
import { Link } from 'react-router-dom'

import Modal from '../../../modal/modal'
import DonateButton from '../../../donate-button/donate-button'
import { CloseIcon } from '../../../ui/icons'

import { useLocale } from '../../../locale-helpers'
import URLS from '../../../../urls'
import { COMMON_VOICE_EMAIL } from 'common'

import './donate-modal.css'

type Props = {
  onCloseDonateModal: () => void
}

export const DonateModal = ({ onCloseDonateModal }: Props) => {
  const [, toLocaleRoute] = useLocale()

  return (
    <Modal testId="donate-modal" innerClassName="donate-modal hidden-md-down">
      <button type="button" className="close" onClick={onCloseDonateModal}>
        <CloseIcon black />
      </button>
      <div className="container">
        <div className="container-item first">
          <img
            src={require('./images/donate-bg1.png')}
            alt=""
            className="mars-bg"
          />
          <div className="download-message">
            <img
              src={require('./images/mozilla-logo.svg')}
              alt=""
              className="mozilla-logo"
            />
            <Localized id="donate-modal-message">
              <h2 />
            </Localized>
            <div className="links">
              <Localized id="faq">
                <Link to={toLocaleRoute(URLS.FAQ)} />
              </Localized>
              •
              <Localized id="contact-us">
                <a
                  href={`mailto:${COMMON_VOICE_EMAIL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </Localized>
              •
              <Localized id="accept-privacy-title">
                <Link to={toLocaleRoute(URLS.PRIVACY)} />
              </Localized>
            </div>
          </div>
        </div>
        <div className="container-item second">
          <Localized id="dataset-donate-modal-heading">
            <h3 />
          </Localized>
          <img src={require('./images/donate-bg2.png')} alt="" />
          <div className="explanation-button-container">
            <Localized id="donate-modal-explanation-1">
              <p className="donate-modal-explanation" />
            </Localized>
            <Localized id="donate-modal-explanation-2" elems={{ bold: <b /> }}>
              <p className="donate-modal-explanation" />
            </Localized>
            <DonateButton onClick={onCloseDonateModal} showHeartIcon={false} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
