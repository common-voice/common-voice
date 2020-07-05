import { Localized } from '@fluent/react/compat';
import * as React from 'react';
import { HTMLProps, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LocaleLink } from '../locale-helpers';
import { CheckIcon } from './icons';

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
      <img src={url} />
    ) : (
      <img
        className="mars-avatar"
        src={require('./icons/mars-avatar.svg')}
        alt="Robot Avatar"
      />
    )}
  </div>
);

export const Button = ({
  className = '',
  outline = false,
  rounded = false,
  ...props
}) => (
  <button
    type="button"
    className={[
      'button',
      outline ? 'outline' : '',
      rounded ? 'rounded' : '',
      className,
    ].join(' ')}
    {...props}
  />
);

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

export const LabeledCheckbox = React.forwardRef(
  ({ label, style, ...props }: any, ref) => (
    <label className="labeled-checkbox" style={style}>
      <Checkbox ref={ref} {...props} />
      <span className="label">{label}</span>
    </label>
  )
);

const LabeledFormControl = React.forwardRef(
  (
    { className = '', component: Component, label, required, ...props }: any,
    ref
  ) => {
    const child = <Component {...{ ref, required, ...props }} />;
    return (
      <label
        className={[
          'labeled-form-control',
          'for-' + Component,
          className,
          props.disabled ? 'disabled' : '',
        ].join(' ')}
        {...props}>
        <span className="label">
          {required && '*'}
          {label}
        </span>
        {Component == 'select' ? (
          <div className="wrapper with-down-arrow">{child}</div>
        ) : (
          child
        )}
      </label>
    );
  }
);

export const LabeledInput = React.forwardRef(({ type, ...props }: any, ref) => (
  <LabeledFormControl
    component="input"
    ref={ref}
    type={type || 'text'}
    name={type}
    {...props}
  />
));

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
      className={[
        'button',
        outline ? 'outline' : '',
        rounded ? 'rounded' : '',
        className,
      ].join(' ')}
      {...(blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  );
};

export const Spinner = ({ delayMs }: { delayMs?: number }) => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setShowSpinner(true), delayMs);
    return () => clearTimeout(timeoutId);
  }, []);

  return showSpinner ? (
    <div className="spinner">
      <span />
    </div>
  ) : null;
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
