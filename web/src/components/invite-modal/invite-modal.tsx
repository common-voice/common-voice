import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import BalanceText from 'react-balance-text';
import Modal, { ModalProps } from '../modal/modal';
import { FontIcon } from '../ui/icons';
import { Button } from '../ui/ui';

import './invite-modal.css';

export interface InviteModalProps extends ModalProps {
  inviteId: string;
  teamId: string;
}

export default ({ inviteId, teamId, ...props }: InviteModalProps) => {
  const [copiedRecently, setCopiedRecently] = useState<boolean>(false);
  const inputRef = useRef();
  // Reset the button's copied state after a brief timeout.
  useEffect(() => {
    if (copiedRecently) {
      const timer = setTimeout(() => {
        setCopiedRecently(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedRecently]);

  return (
    <Modal {...props} innerClassName="invite-modal">
      <img alt="" src={require('./images/mail.svg')} role="presentation" />

      <h1>
        <BalanceText>
          Invite colleagues and friends to join your challenge team
        </BalanceText>
      </h1>

      <input
        readOnly
        ref={inputRef}
        type="text"
        value={`https://voice.mozilla.org/?challenge=pilot&team=${teamId}&invite=${inviteId}`}
      />

      <Button
        rounded
        onClick={() => {
          if (inputRef.current) {
            (inputRef.current as HTMLInputElement).select();
            document.execCommand('copy');
            setCopiedRecently(true);
          }
        }}>
        {copiedRecently ? 'Copied' : 'Copy link'}
        <FontIcon type="link" className="icon" />
      </Button>
    </Modal>
  );
};
