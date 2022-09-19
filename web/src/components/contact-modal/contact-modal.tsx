import { Localized } from '@fluent/react';
import * as React from 'react';
import Modal from '../modal/modal';
import { Button, LabeledInput, LabeledTextArea } from '../ui/ui';

interface Props {
  onRequestClose: () => void;
}

export default function ContactModal({ onRequestClose }: Props) {
  return (
    <Modal innerClassName="contact-modal" onRequestClose={onRequestClose}>
      <form
        action="mailto:commonvoice@mozilla.com"
        method="post"
        encType="text/plain">
        <div className="title-and-action">
          <Localized id="contact-title">
            <h1 />
          </Localized>
        </div>

        <br />

        <Localized id="email-input" attrs={{ label: true }}>
          <LabeledInput label="Email" name="email" required type="email" />
        </Localized>

        <Localized id="contact-form-name" attrs={{ label: true }}>
          <LabeledInput label="Name" name="name" type="text" />
        </Localized>

        <Localized id="contact-form-message" attrs={{ label: true }}>
          <LabeledTextArea label="Message" name="message" required rows={6} />
        </Localized>

        <div className="actions">
          <Localized id="contact-required">
            <div />
          </Localized>
          <Localized id="submit-form-action">
            <Button type="submit" />
          </Localized>
          <div />
        </div>
      </form>
    </Modal>
  );
}
