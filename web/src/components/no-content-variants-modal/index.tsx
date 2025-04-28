import React from 'react'
import { Localized } from '@fluent/react'

import Modal, { ModalButtons } from '../modal/modal'
import { Button } from '../ui/ui'

import './no-contents-variants-modal.css'

export const NoContentsVariantsModal = () => {
  return (
    <Modal
      innerClassName="record-abort"
      onRequestClose={() => console.log('close')}>
      <Localized id="record-abort-title">
        <h1 className="title" />
      </Localized>
      <Localized id="record-abort-text">
        <p className="text" />
      </Localized>
      <ModalButtons>
        <Localized id="record-abort-submit">
          <Button
            outline
            rounded
            // className={getTrackClass('fs', 'exit-submit-clips')}
            onClick={() => {
              // if (this.upload()) this.handleAbortConfirm(onConfirm)
              console.log('submit')
            }}
          />
        </Localized>
        <Localized id="record-abort-continue">
          <Button
            outline
            rounded
            // className={getTrackClass('fs', 'exit-continue-recording')}
            onClick={() => console.log('continue')}
          />
        </Localized>
      </ModalButtons>
    </Modal>
  )
}
