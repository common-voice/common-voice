import { WithLocalizationProps, withLocalization } from '@fluent/react';
import * as React from 'react';
import Modal, { ModalProps } from '../../../modal/modal';
import { Button } from '../../../ui/ui';
import './speak-instructions.css';

export interface SpeakInstructionsModalProps extends ModalProps, WithLocalizationProps {
  kind: 'clip' | 'sentence';
  id: string;
  reasons: string[];
  onSubmitted: () => any;
}

export const SpeakInstructionsModal = withLocalization(
  ({ kind, id, reasons, ...props }: SpeakInstructionsModalProps) => {
    return (
      <Modal {...props} innerClassName="speak-instructions-modal">
        <h4 className="text-[#219F8A]">تعليمات الاستخدام</h4>
        <ul>
          <li>انقر علي زر تشغيل الصوت للبدء التسجيل</li>
          <li>انقر علي زر ايقاف الصوت للانهاء</li>
          <li>تحدث للبدء التسجيل</li>
        </ul>
      </Modal>
    );
  }
);

export const SpeakInstructionsButton = (props: React.HTMLProps<HTMLButtonElement>) => (
  <Button
    rounded
    className="open-speak-instructions-button bg-white text-black speak-button-control"
    {...props}
  >
    تعليمات الاستخدام
  </Button>
);
