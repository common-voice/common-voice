import { WithLocalizationProps, withLocalization } from '@fluent/react';
import * as React from 'react';
import Modal, { ModalProps } from '../../../modal/modal';
import { Button } from '../../../ui/ui';
import './listen-instructions.css';

export interface ListenInstructionsModalProps extends ModalProps, WithLocalizationProps {
  kind: 'clip' | 'sentence';
  id: string;
  reasons: string[];
  onSubmitted: () => any;
}

export const ListenInstructionsModal = withLocalization(
  ({ kind, id, reasons, ...props }: ListenInstructionsModalProps) => {
    return (
      <Modal {...props} innerClassName="listen-instructions-modal">
        <h4 className="text-[#219F8A]">تعليمات الاستخدام</h4>
        <ul>
          <li>انقر علي زر تشغيل الصوت للبدء </li>
          <li>اذا كنت توافق علي ان التسجيل مطابق للهجة المذكورة انقر "نعم"</li>
          <li>اذا كنت لا توافق علي ان التسجيل مطابق للهجة المذكورة انقر "لا"</li>
        </ul>
      </Modal>
    );
  }
);

export const ListenInstructionsButton = (props: React.HTMLProps<HTMLButtonElement>) => (
  <Button
    rounded
    className="open-speak-instructions-button bg-white text-black speak-button-control"
    {...props}
  >
    تعليمات الاستخدام
  </Button>
);
