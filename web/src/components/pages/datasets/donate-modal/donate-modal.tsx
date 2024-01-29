import * as React from 'react'

import Modal from '../../../modal/modal'
import DonateButton from '../../../donate-button/donate-button'
import { CloseIcon } from '../../../ui/icons'

import './donate-modal.css'

type Props = {
  onCloseDonateModal: () => void
}

export const DonateModal = ({ onCloseDonateModal }: Props) => (
  <Modal testId="donate" innerClassName="donate-modal">
    <button type="button" className="close" onClick={onCloseDonateModal}>
      <CloseIcon black />
    </button>
    <div className="container">
      <div className="container-item">Hello Modal</div>
      <div className="container-item">
        Another div
        <DonateButton onClick={onCloseDonateModal} />
      </div>
    </div>
  </Modal>
)
