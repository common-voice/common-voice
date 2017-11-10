import * as React from 'react';

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
