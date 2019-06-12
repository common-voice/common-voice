import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useState } from 'react';
import { useAPI } from '../../hooks/store-hooks';
import { trackGlobal } from '../../services/tracker';
import URLS from '../../urls';
import CustomGoalLock from '../custom-goal-lock';
import {
  LocaleLink,
  LocalizedGetAttribute,
  useLocale,
} from '../locale-helpers';
import { CautionIcon, CheckIcon, OldPlayIcon } from '../ui/icons';
import { LabeledCheckbox } from '../ui/ui';

import './subscribe-newsletter.css';

export default function SubscribeNewsletter() {
  const api = useAPI();
  const [locale] = useLocale();
  const [email, setEmail] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [status, setStatus] = useState<
    null | 'submitting' | 'submitted' | 'error'
  >(null);

  return (
    <form
      className="subscribe-newsletter"
      onSubmit={async e => {
        e.preventDefault();

        if (!privacyAgreed) {
          setStatus('error');
          return;
        }

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
      <CustomGoalLock
        currentLocale={locale}
        render={({ hasCustomGoal }) =>
          hasCustomGoal ? (
            <div className="goal-title">
              Sign up for Common Voice newsletters, goal reminders and progress
              updates
            </div>
          ) : (
            <Localized id="email-subscription-title">
              <div className="title" />
            </Localized>
          )
        }
      />
      <div className="submittable-field">
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
      </div>
      <LabeledCheckbox
        label={
          <Localized
            id="accept-privacy"
            privacyLink={<LocaleLink to={URLS.PRIVACY} blank />}>
            <span />
          </Localized>
        }
        checked={privacyAgreed}
        onChange={(event: any) => {
          setStatus(null);
          setPrivacyAgreed(event.target.checked);
        }}
      />
    </form>
  );
}
