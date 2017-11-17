import * as React from 'react';
import * as Modal from 'react-modal';

interface ButtonConfig {
  [name: string]: (() => any) | string | { url: string; onClick: () => void };
}

interface Props {
  buttons?: ButtonConfig;
  children?: React.ReactNode;
  innerClassName?: string;
  onRequestClose?: (event?: MouseEvent | KeyboardEvent) => any;
}

export default ({
  buttons,
  children,
  innerClassName = '',
  ...props,
}: Props) => (
  <Modal
    isOpen={true}
    contentLabel="modal"
    {...props}
    style={{
      overlay: { background: 'rgba(0, 0, 0, 0.8)' },
      content: {
        position: 'static',
        padding: 0,
        background: 'transparent',
      },
    }}>
    <div className={'inner ' + innerClassName}>
      {children}
      <div className="buttons">
        {buttons &&
          Object.keys(buttons).map(label => {
            const action = buttons[label];
            const isString = typeof action == 'string';
            const isObject = typeof action == 'object';
            return isString || isObject ? (
              <a
                key={label}
                href={isString ? action : (action as any).url}
                target="__blank"
                rel="noopener noreferrer"
                onClick={() =>
                  isObject
                    ? (action as any).onClick()
                    : props.onRequestClose && props.onRequestClose()}>
                {label}
              </a>
            ) : (
              <button key={label} type="button" onClick={action as any}>
                {label}
              </button>
            );
          })}
      </div>
    </div>
  </Modal>
);
