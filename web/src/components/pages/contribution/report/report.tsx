import { Localized, withLocalization, WithLocalizationProps } from '@fluent/react';
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

export const ReportModal = withLocalization(({
  kind,
  id,
  reasons,
  onSubmitted,
  ...props
}: ReportModalProps) => {
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
        <img className="check" src={require('./success.svg')} alt={getString('img-alt-success-checkmark')} />
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
      {/* <Localized id="report-title"> */}
        <h1><span className='text-[#219F8A]'>أرسل</span> تقريراً </h1>
      {/* </Localized> */}
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
      </Button>
    </Modal>
  );
});

export const ReportButton = (props: React.HTMLProps<HTMLButtonElement>) => (
  <Button rounded className="open-report-button bg-white text-black speak-button-control" {...props}>
<img src="/img/flag-report.svg" alt="flag-report" height={16} width={16}  className='mx-2'/>
    <Localized id="report">
      <span />
    </Localized>
  </Button>
);
