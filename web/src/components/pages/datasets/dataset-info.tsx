import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { CloudIcon } from '../../ui/icons';
import {
  Button,
  LabeledCheckbox,
  LabeledInput,
  LabeledSelect,
  LinkButton,
  TextButton,
} from '../../ui/ui';
import CircleStats from './circle-stats';

import './dataset-info.css';

class DatasetInfo extends React.Component<
  LocalizationProps,
  {
    showIntroTextMdDown: boolean;
    hideEmailForm: boolean;
    email: string;
    confirmSize: boolean;
    confirmNoIdentify: boolean;
  }
> {
  state = {
    showIntroTextMdDown: false,
    hideEmailForm: true,
    email: '',
    confirmSize: false,
    confirmNoIdentify: false,
  };

  emailInputRef = React.createRef<HTMLInputElement>();

  showEmailForm = () => this.setState({ hideEmailForm: false });

  handleInputChange = ({ target }: any) => {
    this.setState({
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    } as any);
  };

  render() {
    const { getString } = this.props;
    const {
      showIntroTextMdDown,
      hideEmailForm,
      email,
      confirmSize,
      confirmNoIdentify,
    } = this.state;

    return (
      <div className="dataset-info">
        <div className="top">
          <div className="cloud-circle">
            <CloudIcon />
          </div>
          <div className="intro">
            <Localized id="datasets-headline">
              <h1 />
            </Localized>

            {!showIntroTextMdDown && (
              <Localized id="show-wall-of-text">
                <TextButton
                  className="hidden-lg-up"
                  onClick={() => {
                    this.setState({ showIntroTextMdDown: true });
                  }}
                />
              </Localized>
            )}

            <Localized id="datasets-positioning">
              <p className={showIntroTextMdDown ? '' : 'hidden-md-down'} />
            </Localized>
          </div>
          <div className="info">
            <div className="inner">
              <LabeledSelect label={getString('language')} />
              <ul className="facts">
                {Object.entries({
                  size: 54,
                  'validated-hr-total': 189,
                  'overall-hr-total': 200,
                  'cv-license': 'CC-0',
                  'number-of-voices': (1234).toLocaleString(),
                  'audio-format': 'MP3',
                  splits: <div>hi</div>,
                }).map(([id, value], i) => (
                  <li key={id}>
                    <Localized id={id}>
                      <span className="label" />
                    </Localized>
                    <span className="value">{value}</span>
                  </li>
                ))}
              </ul>
              {hideEmailForm ? (
                <>
                  <Button
                    className="show-email-form"
                    rounded
                    onClick={this.showEmailForm}>
                    <Localized id="email-to-download">
                      <span />
                    </Localized>
                    <CloudIcon />
                  </Button>
                  <Localized id="why-email" b={<b />}>
                    <p className="why-email" />
                  </Localized>
                </>
              ) : (
                <>
                  <Localized id="email-input" attrs={{ label: true }}>
                    <LabeledInput
                      name="email"
                      onChange={this.handleInputChange}
                      ref={this.emailInputRef}
                      type="email"
                    />
                  </Localized>
                  <LabeledCheckbox
                    label={
                      <Localized
                        id="confirm-size"
                        b={<b />}
                        $size={10 + getString('size-gigabyte')}>
                        <span />
                      </Localized>
                    }
                    name="confirmSize"
                    onChange={this.handleInputChange}
                    style={{ marginBottom: 40 }}
                  />
                  <LabeledCheckbox
                    label={
                      <Localized id="confirm-no-identify" b={<b />}>
                        <span />
                      </Localized>
                    }
                    name="confirmNoIdentify"
                    onChange={this.handleInputChange}
                    style={{ marginBottom: 20 }}
                  />
                  <LinkButton
                    href={
                      confirmSize &&
                      confirmNoIdentify &&
                      email &&
                      this.emailInputRef.current.checkValidity()
                        ? 'someurl'
                        : null
                    }
                    rounded
                    className="download-language"
                    style={{ minWidth: 300 }}>
                    <Localized
                      id="download-language"
                      $language={getString('en')}>
                      <span />
                    </Localized>
                    <CloudIcon />
                  </LinkButton>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="description">
          <CircleStats className="hidden-md-down" />
          <div className="text">
            <div className="line" />
            <Localized id="whats-inside">
              <h1 />
            </Localized>
            <CircleStats className="hidden-lg-up" />
            <Localized id="dataset-description" b={<b />}>
              <p />
            </Localized>
          </div>
        </div>
      </div>
    );
  }
}

export default withLocalization(DatasetInfo);
