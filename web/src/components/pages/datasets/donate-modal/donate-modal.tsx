import * as React from 'react'

import Modal from '../../../modal/modal'
import DonateButton from '../../../donate-button/donate-button'

import './donate-modal.css'

export const DonateModal = () => (
  <Modal testId="donate" innerClassName="donate-modal">
    <div className="container">
      <div className="container-item">Hello Modal</div>
      <div className="container-item">
        Another div
        <DonateButton />
      </div>
    </div>
  </Modal>
)
