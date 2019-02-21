import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import API from '../../services/api';
import { trackGlobal } from '../../services/tracker';
import StateTree from '../../stores/tree';
import { LocalizedGetAttribute } from '../locale-helpers';
import { CautionIcon, CheckIcon, OldPlayIcon } from '../ui/icons';

import './subscribe-newsletter.css';

interface PropsFromState {
  api: API;
  locale: string;
}

const SubscribeNewsletter = ({ api, locale }: PropsFromState) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    null | 'submitting' | 'submitted' | 'error'
  >(null);

  return (
    <form
      className="subscribe-newsletter"
      onSubmit={async e => {
        e.preventDefault();
        setStatus('submitting');
        try {
          await api.subscribeToNewsletter(email);
          trackGlobal('footer-newsletter', locale);
          setStatus('submitted');
        } catch (e) {
          setStatus('error');
          console.error(e);
        }
      }}>
      <label>
        <Localized id="email-subscription-title">
          <div className="title" />
        </Localized>
        <LocalizedGetAttribute id="download-form-email" attribute="label">
          {label => (
            <input
              className={email.length > 0 ? 'has-value' : ''}
              type="email"
              value={email}
              onChange={event => {
                setEmail(event.target.value);
                setStatus(null);
              }}
              placeholder={label}
              required
            />
          )}
        </LocalizedGetAttribute>
      </label>
      <button
        type="submit"
        disabled={status != null}
        {...(status == 'submitted'
          ? {
              className: 'success-button',
              children: <CheckIcon className="icon" />,
            }
          : status == 'error'
          ? {
              className: 'error-button',
              children: <CautionIcon className="icon" />,
            }
          : {
              className: 'submit-button',
              children: <OldPlayIcon className="icon" />,
            })}
      />
    </form>
  );
};

export default connect<PropsFromState>(({ api, locale }: StateTree) => ({
  api,
  locale,
}))(SubscribeNewsletter);
