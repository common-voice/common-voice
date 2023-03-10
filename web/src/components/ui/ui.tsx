import { Localized } from '@fluent/react';
import * as React from 'react';
import { HTMLProps, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { LocaleLink } from '../locale-helpers';
import { CheckIcon } from './icons';
import VisuallyHidden from '../visually-hidden/visually-hidden';

export const Avatar = ({
  className,
  url,
  style,
}: {
  url?: string;
  className?: string;
  style?: object;
}) => (
  <div className={`avatar-wrap ${className ? className : ''}`} style={style}>
    {url ? (
      <img src={url} alt="" role="presentation" />
    ) : (
      <img
        className="mars-avatar"
        src={require('./icons/mars-avatar.svg')}
        alt="Robot Avatar"
      />
    )}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Button = (allProps: any) => {
  const {
    className = '',
    outline = false,
    rounded = false,
    isBig = false,
    ...props
  } = allProps;

  return (
    <button
      type="button"
      className={cx('button', { outline, rounded, isBig }, className)}
      {...props}
    />
  );
};

export const CardAction = ({ className, ...props }: any) =>
  props.to ? (
    <LocaleLink className={'card-action ' + className} {...props} />
  ) : (
    <Button outline className={'card-action ' + className} {...props} />
  );

export const Hr = (props: any) => <hr className="hr" {...props} />;

export const Checkbox = React.forwardRef(
  (
    props: HTMLProps<HTMLInputElement>,
    ref: React.RefObject<HTMLInputElement>
  ) => (
    <span className="checkbox-container">
      <input ref={ref} type="checkbox" {...props} />
      <CheckIcon className="checkmark" />
    </span>
  )
);
Checkbox.displayName = 'Checkbox';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LabeledCheckbox = React.forwardRef((allProps: any, ref) => {
  const { label, required, style, ...props } = allProps;

  return (
    <label className="labeled-checkbox" style={style}>
      <Checkbox
        ref={ref}
        aria-required={required}
        required={required}
        {...props}
      />
      <span className="label">
        {required && <span aria-hidden="true">* </span>}
        {label}
      </span>
    </label>
  );
});
LabeledCheckbox.displayName = 'LabeledCheckbox';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LabeledFormControl = React.forwardRef((allProps: any, ref) => {
  const {
    className = '',
    component: Component,
    label,
    required,
    disabled,
    isLabelVisuallyHidden,
    ...props
  } = allProps;

  const child = (
    <Component
      ref={ref}
      aria-required={required}
      required={required}
      disabled={disabled}
      {...props}
    />
  );

  const labelClassName = cx(
    'labeled-form-control',
    'for-' + Component,
    className,
    { disabled }
  );

  return (
    <label className={labelClassName} {...props}>
      {isLabelVisuallyHidden ? (
        <VisuallyHidden>{label}</VisuallyHidden>
      ) : (
        <span className="label">
          {required && <span aria-hidden="true">* </span>}
          {label}
        </span>
      )}
      {Component == 'select' ? (
        <div className="wrapper with-down-arrow">{child}</div>
      ) : (
        child
      )}
    </label>
  );
});
LabeledFormControl.displayName = 'LabeledFormControl';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LabeledInput = React.forwardRef(
  ({ type, component, ...props }: any, ref) => (
    <LabeledFormControl
      component={component || 'input'}
      ref={ref}
      type={type || 'text'}
      name={type}
      {...props}
    />
  )
);
LabeledInput.displayName = 'LabeledInput';

export const LabeledSelect = (props: any) => (
  <LabeledFormControl component="select" {...props} />
);

export const LabeledTextArea = (props: any) => (
  <LabeledFormControl component="textarea" {...props} />
);

export const LinkButton = ({
  className = '',
  blank = false,
  outline = false,
  rounded = false,
  absolute = false,
  ...props
}: any) => {
  const Component = props.to ? (absolute ? Link : LocaleLink) : 'a';
  return (
    <Component
      className={cx('button', { outline, rounded }, className)}
      {...(blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  );
};

interface SpinnerProps {
  delayMs?: number;
  isLight?: boolean;
  isFloating?: boolean;
}
export const Spinner = ({
  delayMs,
  isLight,
  isFloating = true,
}: SpinnerProps) => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setShowSpinner(true), delayMs);
    return () => clearTimeout(timeoutId);
  }, []);

  if (!showSpinner) {
    return null;
  }

  const spinnerClassName = cx('spinner', {
    'spinner--light': isLight,
    'spinner--floating': isFloating,
  });

  return (
    <div className={spinnerClassName}>
      <VisuallyHidden>
        {/* Issues with localizing here when used on app load, package changes throw error */}
        <p> Loading... </p>
      </VisuallyHidden>
      <span className="spinner__shape" />
    </div>
  );
};
Spinner.defaultProps = { delayMs: 300 };

export const StyledLink = ({
  blank = false,
  className,
  ...props
}: (
  | React.HTMLProps<HTMLAnchorElement>
  | React.ComponentProps<typeof LocaleLink>
) & { blank?: boolean }) => {
  const Component = props.href ? 'a' : LocaleLink;
  return (
    <Component
      className={'link ' + (className || '')}
      {...(blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  );
};

export const TextButton = ({ className = '', ...props }: any) => (
  <button type="button" className={'text-button ' + className} {...props} />
);

export const Toggle = ({
  offText,
  onText,
  ...props
}: { offText: string; onText: string } & HTMLProps<HTMLInputElement>) => (
  <div className="toggle-input">
    <input type="checkbox" {...props} />
    <Localized id={offText}>
      <div />
    </Localized>
    <Localized id={onText}>
      <div />
    </Localized>
  </div>
);
