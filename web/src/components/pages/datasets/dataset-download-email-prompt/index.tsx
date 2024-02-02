import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react'
import classNames from 'classnames'

import { useAPI } from '../../../../hooks/store-hooks'
import useCopyToClipboard from '../../../../hooks/use-copy-to-clipboard'
import useIsMaxWindowWidth from '../../../../hooks/use-is-max-window-width'
import { CloudIcon } from '../../../ui/icons'
import {
  Button,
  LabeledCheckbox,
  LabeledInput,
  LinkButton,
} from '../../../ui/ui'
import DonateButton from '../../../donate-button/donate-button'
import { DonateModal } from '../donate-modal/donate-modal'

import './dataset-download-email-prompt.css'

// max width to show the donate modal
const MAX_WIDTH_FOR_DONATE_MODAL = 992

interface DownloadFormProps extends WithLocalizationProps {
  downloadPath: string
  isLight?: boolean
  selectedLocale: string
  releaseId: string
  checksum: string
  size: number | string
  isSubscribedToMailingList: boolean
}

interface FormState {
  email: string
  isEmailValid: boolean
  confirmNoIdentify: boolean
  confirmSize: boolean
  confirmJoinMailingList: boolean
  downloadLink?: string
  hideEmailForm: boolean
}

const DatasetDownloadEmailPrompt = ({
  downloadPath,
  isLight,
  selectedLocale,
  releaseId,
  checksum,
  size,
  getString,
  isSubscribedToMailingList,
}: DownloadFormProps) => {
  const api = useAPI()

  const isMaxWidth = useIsMaxWindowWidth(MAX_WIDTH_FOR_DONATE_MODAL)

  const [formState, setFormState] = useState({
    email: '',
    isEmailValid: false,
    confirmNoIdentify: false,
    confirmSize: false,
    confirmJoinMailingList: false,
    downloadLink: null,
    hideEmailForm: false,
  } as FormState)

  const [showDonateModal, setShowDonateModal] = useState(false)

  const [, copy] = useCopyToClipboard(getString)

  const {
    email,
    isEmailValid,
    confirmNoIdentify,
    confirmSize,
    confirmJoinMailingList,
    downloadLink,
    hideEmailForm,
  } = formState

  const canDownloadFile = isEmailValid && confirmNoIdentify && confirmSize

  const datasetDownloadPromptClassName = classNames('dataset-download-prompt', {
    'dataset-download-prompt--light': isLight,
  })

  const updateLink = async () => {
    // disable link while we load a new one
    setFormState(prevState => ({ ...prevState, downloadLink: null }))

    const key = downloadPath.replace('{locale}', selectedLocale)
    const { url } = await api.getPublicUrl(encodeURIComponent(key), 'dataset')
    return url
  }

  const saveHasDownloaded = async () => {
    if (!isMaxWidth && canDownloadFile) {
      setShowDonateModal(true)
    }

    if (canDownloadFile) {
      await api.saveHasDownloaded(email, selectedLocale, releaseId)
    }

    if (confirmJoinMailingList) {
      try {
        await api.subscribeToNewsletter(email)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const showEmailForm = () => {
    return setFormState(prevState => ({
      ...prevState,
      hideEmailForm: false,
    }))
  }

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, type, value, checked } = event.target

    setFormState(prevState => ({
      ...prevState,
      [name]: type !== 'checkbox' ? value : checked,
    }))
  }

  const handleCloseDonateModal = () => {
    setShowDonateModal(false)
  }

  useEffect(() => {
    updateLink().then(downloadLink => {
      setFormState(prevState => ({
        ...prevState,
        downloadLink,
      }))
    })
  }, [downloadPath, selectedLocale])

  // check if email is valid
  useEffect(() => {
    setFormState(prevState => ({
      ...prevState,
      isEmailValid: email.includes('@') && email.includes('.'),
    }))
  }, [email])

  return (
    <div className={datasetDownloadPromptClassName}>
      {showDonateModal && !isMaxWidth && (
        <DonateModal onCloseDonateModal={handleCloseDonateModal} />
      )}
      {hideEmailForm ? (
        <>
          <Button className="email-button" rounded onClick={showEmailForm}>
            <Localized id="email-to-download" />
            <CloudIcon />
          </Button>
          <Localized id="why-email" elems={{ b: <strong /> }}>
            <p className="why-email" />
          </Localized>
        </>
      ) : (
        <>
          <div className="input-group">
            <Localized id="email-input" attrs={{ label: true }}>
              <LabeledInput
                name="email"
                type="email"
                onInput={handleInputChange}
                value={email}
                required
              />
            </Localized>
            <LabeledCheckbox
              label={
                <Localized
                  id="confirm-size"
                  elems={{ b: <strong /> }}
                  vars={{ size }}>
                  <span />
                </Localized>
              }
              name="confirmSize"
              checked={confirmSize}
              onChange={handleInputChange}
              required
            />
            <LabeledCheckbox
              label={
                <Localized id="confirm-no-identify" elems={{ b: <strong /> }}>
                  <span />
                </Localized>
              }
              name="confirmNoIdentify"
              checked={confirmNoIdentify}
              onChange={handleInputChange}
              required
            />
            {!isSubscribedToMailingList && (
              <LabeledCheckbox
                label={<Localized id="confirm-join-mailing-list" />}
                name="confirmJoinMailingList"
                checked={confirmJoinMailingList}
                onChange={handleInputChange}
              />
            )}
          </div>
          <div className="input-group button-container">
            <div>
              <LinkButton
                role="button"
                href={canDownloadFile ? downloadLink : null}
                onClick={saveHasDownloaded}
                rounded
                blank
                className="download-language">
                <Localized
                  id={
                    canDownloadFile ? 'data-bundle-button' : 'email-to-download'
                  }
                />
                <CloudIcon />
              </LinkButton>
              <Localized id="why-email" elems={{ b: <strong /> }}>
                <p className="why-email" />
              </Localized>
              {checksum && (
                <div
                  className="checksum"
                  onClick={() => copy(checksum)}
                  onKeyDown={() => copy(checksum)}
                  role="button"
                  tabIndex={0}>
                  <strong>sha256 checksum</strong>: <p>{checksum}</p>
                </div>
              )}
            </div>
            <div className="donate-btn-container">
              <DonateButton />
              <Localized
                id="why-donate-datasets-page"
                elems={{ b: <strong /> }}>
                <p className="why-donate" />
              </Localized>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

DatasetDownloadEmailPrompt.defaultProps = {
  isLight: false,
}

export default withLocalization(DatasetDownloadEmailPrompt)
