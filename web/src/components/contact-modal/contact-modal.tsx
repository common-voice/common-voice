import { Localized } from '@fluent/react';
import * as React from 'react';
import { useState } from 'react';
import Modal from '../modal/modal';
import { Button, LabeledInput, LabeledTextArea } from '../ui/ui';
import { useAPI } from '../../hooks/store-hooks';

interface Props {
  onRequestClose: () => void;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactModal({ onRequestClose }: Props) {
  const api = useAPI();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    try {
      await api.sendContact({ email, name: name || undefined, message });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Modal innerClassName="contact-modal" onRequestClose={onRequestClose}>
      {status === 'success' ? (
        <div className="title-and-action">
          <Localized id="contact-title">
            <h1 />
          </Localized>
          <Localized id="contact-form-success">
            <p />
          </Localized>
          <Button onClick={onRequestClose}>
            <Localized id="close" />
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="title-and-action">
            <Localized id="contact-title">
              <h1 />
            </Localized>
          </div>

          <br />

          <Localized id="email-input" attrs={{ label: true }}>
            <LabeledInput
              label="Email"
              name="email"
              required
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </Localized>

          <Localized id="contact-form-name" attrs={{ label: true }}>
            <LabeledInput
              label="Name"
              name="name"
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
          </Localized>

          <Localized id="contact-form-message" attrs={{ label: true }}>
            <LabeledTextArea
              label="Message"
              name="message"
              required
              rows={6}
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            />
          </Localized>

          {status === 'error' && (
            <Localized id="contact-form-error">
              <p className="error" data-testid="contact-form-error" />
            </Localized>
          )}

          <div className="actions">
            <Localized id="contact-required">
              <div />
            </Localized>
            <Localized id="submit-form-action">
              <Button
                type="submit"
                disabled={status === 'submitting'}
                data-testid="contact-submit-btn"
              />
            </Localized>
            <div />
          </div>
        </form>
      )}
    </Modal>
  );
}
