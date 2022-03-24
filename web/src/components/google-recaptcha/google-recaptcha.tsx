import * as React from 'react';
import { useEffect, useState, createRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Localized } from '@fluent/react';

import './google-recaptcha.css';

interface Props {
  onChange: (token: string) => unknown;
  message?: string;
}

/**
 * See docs/google-recaptcha.md for more info
 */
const GoogleReCAPTCHA = ({ onChange, message }: Props) => {
  const ref: React.RefObject<any> = createRef(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [isChecked, setIsChecked] = useState(false);

  const handleOnChange = (value: string) => {
    setIsChecked(!!value);
    onChange(value);
  };

  useEffect(() => {
    // if info message changes reset the recaptcha
    if (message && isChecked) {
      ref.current.reset();
    }
  }, [message]);

  return (
    <div className="google-recaptcha">
      <ReCAPTCHA
        ref={ref}
        sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY}
        onChange={handleOnChange}
      />

      {message && (
        <p className="google-recaptcha__message">
          <Localized id={message} />
        </p>
      )}
    </div>
  );
};

export default GoogleReCAPTCHA;
