import React from 'react'

import Modal from '../../../modal/modal'

import './donate-modal.css'
import DonateButton from '../../../donate-button/donate-button'

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
