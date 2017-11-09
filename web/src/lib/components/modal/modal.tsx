import * as React from 'react';
import * as Modal from 'react-modal';

interface ButtonConfig {
  [name: string]: () => any;
}

interface Props {
  buttons: ButtonConfig;
  onRequestClose?: (event: MouseEvent | KeyboardEvent) => any;
  children?: React.ReactNode;
}

export default ({ buttons, children, ...props }: Props) => (
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
    <div className="inner">
      {children}
      <div className="buttons">
        {Object.keys(buttons).map(label => (
          <button key={label} type="button" onClick={buttons[label]}>
            {label}
          </button>
        ))}
      </div>
    </div>
  </Modal>
);
