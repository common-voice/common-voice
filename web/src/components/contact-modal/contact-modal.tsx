import * as React from 'react';
import Modal from '../modal/modal';
import { LabeledInput, LabeledTextArea } from '../ui/ui';

interface Props {
  onRequestClose: () => void;
}

export default ({ onRequestClose }: Props) => (
  <Modal innerClassName="contact-modal">
    <form
      action="mailto:someone@example.com"
      method="post"
      encType="text/plain">
      <div className="title-and-action">
        <h1>Contact Form</h1>
        <a onClick={onRequestClose}>Cancel</a>
      </div>

      <br />

      <LabeledInput label="Email" name="email" required type="text" />

      <LabeledInput label="Name" name="name" type="text" />

      <LabeledTextArea label="Message" name="message" required rows={6} />

      <div className="actions">
        <div>*required</div>
        <button type="submit">Submit</button>
        <div />
      </div>
    </form>
  </Modal>
);
