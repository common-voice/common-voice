import * as React from 'react';
import { LocaleLink } from '../locale-helpers';

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

export const LabeledCheckbox = ({ label, ...props }: any) => (
  <label className="labeled-checkbox">
    <input type="checkbox" {...props} />
    <span className="label">{label}</span>
  </label>
);

const LabeledFormControl = ({
  className = '',
  component: Component,
  label,
  required,
  ...props
}: any) => {
  const child = <Component {...{ required, ...props }} />;
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
};

export const LabeledInput = ({ type, ...props }: any) => (
  <LabeledFormControl component="input" type={type || 'text'} {...props} />
);

export const LabeledSelect = (props: any) => (
  <LabeledFormControl component="select" {...props} />
);

export const LabeledTextArea = (props: any) => (
  <LabeledFormControl component="textarea" {...props} />
);

export const LinkButton = ({
  className = '',
  outline = false,
  rounded = false,
  ...props
}: any) => {
  const Component = props.to ? LocaleLink : 'a';
  return (
    <Component
      className={[
        'button',
        outline ? 'outline' : '',
        rounded ? 'rounded' : '',
        className,
      ].join(' ')}
      {...props}
    />
  );
};

export const TextButton = ({ className = '', ...props }: any) => (
  <button type="button" className={'text-button ' + className} {...props} />
);
