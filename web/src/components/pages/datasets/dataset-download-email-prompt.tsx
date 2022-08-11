import * as React from 'react';
import { useState, useEffect } from 'react';
import { Localized } from '@fluent/react';
import classNames from 'classnames';

import { useAPI } from '../../../hooks/store-hooks';
import { CloudIcon } from '../../ui/icons';
import { Button, LabeledCheckbox, LabeledInput, LinkButton } from '../../ui/ui';
import './dataset-download-email-prompt.css';
interface DownloadFormProps {
  downloadPath: string;
  isLight: boolean;
  selectedLocale: string;
  releaseId: string;
  checksum: string;
  size: number | string;
}

interface FormState {
  email: string;
  isEmailValid: boolean;
  confirmNoIdentify: boolean;
  confirmSize: boolean;
  downloadLink?: string;
  hideEmailForm: boolean;
}

const DatasetDownloadEmailPrompt = ({
  downloadPath,
  isLight,
  selectedLocale,
  releaseId,
  checksum,
  size,
}: DownloadFormProps) => {
  const api = useAPI();

  const [formState, setFormState] = useState({
    email: '',
    isEmailValid: false,
    confirmNoIdentify: false,
    confirmSize: false,
    downloadLink: null,
    hideEmailForm: false,
  } as FormState);

  const {
    email,
    isEmailValid,
    confirmNoIdentify,
    confirmSize,
    downloadLink,
    hideEmailForm,
  } = formState;

  const canDownloadFile = isEmailValid && confirmNoIdentify && confirmSize;

  const datasetDownloadPromptClassName = classNames('dataset-download-prompt', {
    'dataset-download-prompt--light': isLight,
  });

  const updateLink = async () => {
    // disable link while we load a new one
    setFormState(prevState => ({ ...prevState, downloadLink: null }));

    const key = downloadPath.replace('{locale}', selectedLocale);
    const { url } = await api.getPublicUrl(encodeURIComponent(key), 'dataset');
    return url;
  };

  const saveHasDownloaded = async () => {
    if (canDownloadFile) {
      await api.saveHasDownloaded(email, selectedLocale, releaseId);
    }
  };

  const showEmailForm = () => {
    return setFormState(prevState => ({
      ...prevState,
      hideEmailForm: false,
    }));
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, type, value, checked } = event.target;

    setFormState(prevState => ({
      ...prevState,
      [name]: type !== 'checkbox' ? value : checked,
    }));
  };

  useEffect(() => {
    updateLink().then(downloadLink => {
      setFormState(prevState => ({
        ...prevState,
        downloadLink,
      }));
    });
  }, [downloadPath, selectedLocale]);

  // check if email is valid
  useEffect(() => {
    setFormState(prevState => ({
      ...prevState,
      isEmailValid: email.includes('@') && email.includes('.'),
    }));
  }, [email]);

  return (
    <div className={datasetDownloadPromptClassName}>
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
          </div>
          <div className="input-group">
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
              <p className="why-email " />
            </Localized>
            {checksum && (
              <div className="checksum">
                <strong>sha256 checksum</strong>: {checksum}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
DatasetDownloadEmailPrompt.defaultProps = {
  isLight: false,
};
export default DatasetDownloadEmailPrompt;
