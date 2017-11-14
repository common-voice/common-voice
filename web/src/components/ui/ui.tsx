import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';

export const CardAction = (props: any) =>
  props.to ? (
    <Link className="card-action" {...props} />
  ) : (
    <button type="button" className="card-action" {...props} />
  );

export const Hr = (props: any) => <hr className="hr" {...props} />;

const LabeledFormControl = ({
  className = '',
  component: Component,
  label,
  required,
  ...props,
}: any) => (
  <label className={'labeled-form-control ' + className} {...props}>
    {label}
    {required && '*'}
    <Component {...{ required, ...props }} />
  </label>
);

export const LabeledInput = (props: any) => (
  <LabeledFormControl component="input" {...props} />
);

export const LabeledSelect = (props: any) => (
  <LabeledFormControl component="select" {...props} />
);

export const LabeledTextArea = (props: any) => (
  <LabeledFormControl component="textarea" {...props} />
);
