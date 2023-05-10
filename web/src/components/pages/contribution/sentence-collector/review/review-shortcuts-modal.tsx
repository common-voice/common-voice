import React from 'react'
import {
  Localized,
  WithLocalizationProps,
  withLocalization,
} from '@fluent/react'

import Modal from '../../../../modal/modal'

type Props = WithLocalizationProps & {
  shortcuts: {
    key: string
    label: string
    icon?: React.ReactNode
  }[]
  toggleModalVisibility: () => void
}

const ReviewShortCutsModal: React.FC<Props> = ({
  getString,
  shortcuts,
  toggleModalVisibility,
}) => {
  return (
    <Modal
      innerClassName="shortcuts-modal"
      onRequestClose={toggleModalVisibility}>
      <Localized id="shortcuts">
        <h1 />
      </Localized>
      <div className="shortcuts">
        {shortcuts.map(({ key, label, icon }) => (
          <div key={key} className="shortcut">
            <kbd title={getString(key).toUpperCase()}>
              {icon ? icon : getString(key).toUpperCase()}
            </kbd>
            <div className="label">{getString(label)}</div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default withLocalization(ReviewShortCutsModal)
