import { Localized, WithLocalizationProps } from '@fluent/react';
import * as React from 'react';
import { useState } from 'react';
import { useAPI } from '../../../../hooks/store-hooks';
import Modal, { ModalProps } from '../../../modal/modal';
import { ArrowLeft } from '../../../ui/icons';
import { Button, Checkbox } from '../../../ui/ui';

import './report.css';

export interface ReportModalProps extends ModalProps, WithLocalizationProps {
  kind: 'clip' | 'sentence';
  id: string;
  reasons: string[];
  onSubmitted: () => any;
}

const CheckboxRow = ({ children, title, ...props }: any) => (
  <div className="checkbox-row">
    <label>
      <Localized id={title}>
        <div className="reason-title" />
      </Localized>
      <Checkbox {...(props as any)} />
    </label>
    <div className="detail">{children}</div>
  </div>
);

export function ReportModal({
  kind,
  id,
  reasons,
  onSubmitted,
  ...props
}: ReportModalProps) {
  const { getString } = props;
  const api = useAPI();
  const [selectedReasons, setSelectedReasons] = useState<{
    [key: string]: boolean;
  }>({});
  const [otherText, setOtherText] = useState<string>(null);
  const [submitStatus, setSubmitStatus] = useState<
    null | 'submitting' | 'submitted'
  >(null);

  if (submitStatus == 'submitted') {
    return (
      <Modal {...props} innerClassName="report-success-modal">
        <img className="check" src={require('./success.svg')} alt={getString('img-alt-green-checkmark')} />
        <Localized id="success">
          <h1 />
        </Localized>
        <Localized id="report-success">
          <h2 />
        </Localized>
        <Localized id="continue">
          <Button outline rounded onClick={props.onRequestClose} />
        </Localized>
      </Modal>
    );
  }

  return (
    <Modal {...props} innerClassName="report-modal">
      <Localized id="report-title">
        <h1 />
      </Localized>
      <Localized id="report-ask">
        <h2 />
      </Localized>
      <div>
        {reasons.map(reason => (
          <CheckboxRow
            key={reason}
            title={'report-' + reason}
            value={selectedReasons[reason]}
            onChange={(e: any) =>
              setSelectedReasons({
                ...selectedReasons,
                [reason]: e.target.checked,
              })
            }>
            <Localized id={['report', reason, 'detail'].join('-')}>
              <p />
            </Localized>
          </CheckboxRow>
        ))}
        <CheckboxRow
          title="other"
          onChange={(e: any) => setOtherText(e.target.checked ? '' : null)}
          value={otherText != null}>
          {otherText != null && (
            <Localized id="report-other-comment" attrs={{ placeholder: true }}>
              <textarea
                value={otherText}
                onChange={(e: any) => setOtherText(e.target.value)}
                style={{ marginTop: 8 }}
              />
            </Localized>
          )}
        </CheckboxRow>
      </div>
      <Button
        rounded
        disabled={
          submitStatus == 'submitting' ||
          (otherText !== null && otherText.trim() == '') ||
          (!Object.values(selectedReasons).some(Boolean) && otherText == null)
        }
        onClick={() => {
          api.report({
            kind,
            id,
            reasons: Object.entries(selectedReasons)
              .filter(([key, value]) => value)
              .map(([key]) => key)
              .concat(otherText || []),
          });
          setSubmitStatus('submitted');
          onSubmitted();
        }}>
        <Localized id="report">
          <span />
        </Localized>
        <ArrowLeft />
      </Button>
    </Modal>
  );
}

export const ReportButton = (props: React.HTMLProps<HTMLButtonElement>) => (
  <Button outline rounded className="open-report-button" {...props}>
    <svg width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <path
          id="flag-a"
          d="M20.4 2.1c-.4-.2-.8-.1-1.1.2 0 0-.9.7-3.3.7-1.3 0-2.4-.5-3.6-.9C11.1 1.5 9.7 1 8 1 4.8 1 3.5 2.1 3.3 2.3c-.2.2-.3.4-.3.7v19c0 .6.4 1 1 1s1-.4 1-1v-6.5c.4-.2 1.4-.5 3-.5 1.3 0 2.4.5 3.6.9 1.3.5 2.7 1.1 4.4 1.1 3.2 0 4.5-1.1 4.7-1.3.2-.2.3-.4.3-.7V3c0-.4-.2-.7-.6-.9zM19 14.5c-.4.2-1.4.5-3 .5-1.3 0-2.4-.5-3.6-.9C11.1 13.5 9.7 13 8 13c-1.3 0-2.3.2-3 .4V3.5c.4-.2 1.4-.5 3-.5 1.3 0 2.4.5 3.6.9C12.9 4.5 14.3 5 16 5c1.3 0 2.3-.2 3-.4v9.9z"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="flag-b" fill="#fff">
          <use xlinkHref="#flag-a" />
        </mask>
        <use fill="#000" fillRule="nonzero" xlinkHref="#flag-a" />
        <g fill="#4A4A4A" mask="url(#flag-b)">
          <path d="M0 0h24v24H0z" />
        </g>
      </g>
    </svg>

    <Localized id="report">
      <span />
    </Localized>
  </Button>
);
