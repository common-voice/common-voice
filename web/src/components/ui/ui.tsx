import * as React from 'react';
import { HTMLProps } from 'react';
import { Link } from 'react-router-dom';
import { LocaleLink } from '../locale-helpers';
import { Localized } from 'fluent-react/compat';

export const Avatar = ({ url }: { url?: string }) => (
  <div className="avatar-wrap">
    {url ? (
      <img src={url} />
    ) : (
      <img
        className="mars-avatar"
        src="/img/mars-avatar.svg"
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

export const LabeledCheckbox = React.forwardRef(
  ({ label, style, ...props }: any, ref) => (
    <label className="labeled-checkbox" style={style}>
      <input ref={ref} type="checkbox" {...props} />
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
      {...props}
    />
  );
};

type SpinnerState = { showSpinner: boolean };

export class Spinner extends React.Component<
  { delayMs: number },
  SpinnerState
> {
  static defaultProps = { delayMs: 300 };

  state: SpinnerState = { showSpinner: false };

  delayTimeout: number;

  componentDidMount() {
    this.delayTimeout = setTimeout(() => {
      this.setState({ showSpinner: true });
    }, this.props.delayMs);
  }

  componentWillUnmount() {
    clearTimeout(this.delayTimeout);
  }

  render() {
    return this.state.showSpinner ? (
      <div className="spinner">
        <span />
      </div>
    ) : null;
  }
}

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
