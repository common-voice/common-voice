import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import React, { useState } from 'react';

import { QuestionIcon, SendIcon } from '../../../ui/icons';
import { Button, LabeledCheckbox, LinkButton } from '../../../ui/ui';
import URLS from '../../../../urls';
import ExpandableInformation from '../../../expandable-information/expandable-information';
import { PrimaryButton } from '../../../primary-buttons/primary-buttons';

import './write.css';
import { SentenceInputAndRules } from './sentence-input-and-rules/sentence-input-and-rules';

export type WriteProps = WithLocalizationProps;

const Write: React.FC<WriteProps> = ({ getString }) => {
  const [confirmPublicDomain, setConfirmPublicDomain] = useState(false);

  const handlePublicDomainChange = () => {
    setConfirmPublicDomain(!confirmPublicDomain);
  };

  return (
    <div className="write-page">
      <div className="write-wrapper">
        <div className="write">
          <div className="inputs-and-rules-container">
            <SentenceInputAndRules getString={getString} />

            <div className="expandable-container">
              <ExpandableInformation summaryLocalizedId="how-to-cite">
                <Localized id="how-to-cite-explanation-bold">
                  <span className="bold" />
                </Localized>
                <Localized id="how-to-cite-explanation">
                  <span />
                </Localized>
              </ExpandableInformation>
            </div>
          </div>

          <div className="buttons">
            <div>
              <LinkButton
                rounded
                outline
                className="hidden-sm-down guidelines-button"
                blank
                to={URLS.SPEAK}>
                <QuestionIcon />
                <Localized id="guidelines">
                  <span />
                </Localized>
              </LinkButton>
              <Button
                rounded
                outline
                className="hidden-sm-down"
                onClick={() => console.log('sksksk')}>
                <SendIcon />
                <Localized id="contact-us">
                  <span />
                </Localized>
              </Button>
            </div>
            <div>
              <form className="guidelines-form" data-testid="guidelines-form">
                <LabeledCheckbox
                  label={
                    <Localized
                      id="sc-submit-confirm"
                      elems={{
                        wikipediaLink: (
                          <a
                            href="https://en.wikipedia.org/wiki/Public_domain"
                            target="_blank"
                            rel="noreferrer"
                          />
                        ),
                      }}>
                      <span />
                    </Localized>
                  }
                  required
                  onChange={handlePublicDomainChange}
                  data-testid="checkbox"
                />
                <Localized id="submit-form-action">
                  <PrimaryButton
                    className="submit"
                    type="submit"
                    disabled={!confirmPublicDomain}
                  />
                </Localized>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLocalization(Write);
