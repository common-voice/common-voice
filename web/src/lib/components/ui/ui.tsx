import * as React from 'react';

const Label = ({ className = '', ...props }) => (
  <label className={'labeled-form-control ' + className} {...props} />
);

export const LabeledInput = ({ className, label, ...props }: any) => (
  <Label className={className}>
    {label}
    <input {...props} />
  </Label>
);

export const LabeledSelect = ({
  children: options,
  className,
  label,
  ...props,
}: any) => (
  <Label className={className}>
    {label}
    <select {...props}>{options}</select>
  </Label>
);
