import * as React from 'react';
import * as Modal from 'react-modal';
import { Button } from '../ui/ui';

interface ButtonConfig {
  [name: string]: () => any;
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
  ...props
}: Props) => (
  <Modal
    isOpen={true}
    contentLabel="modal"
    {...props}
    style={{
      overlay: { background: 'rgba(0, 0, 0, 0.8)' },
      content: {
        padding: 0,
        background: 'transparent',
      },
    }}>
    <div className={'inner ' + innerClassName}>
      {children}
      <div className="buttons">
        {buttons &&
          Object.keys(buttons).map(label => (
            <Button key={label} outline onClick={buttons[label] as any}>
              {label}
            </Button>
          ))}
      </div>
    </div>
  </Modal>
);
