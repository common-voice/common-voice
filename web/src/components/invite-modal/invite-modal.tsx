/**
 * NOTE: Want to add a mailto form to this component? Start here:
 *       https://github.com/mozilla/voice-web/pull/2440
 */
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import BalanceText from 'react-balance-text';
import Modal, { ModalProps } from '../modal/modal';
import { FontIcon } from '../ui/icons';
import { Button } from '../ui/ui';
import { useAPI } from '../../hooks/store-hooks';
import { trackChallenge } from '../../services/tracker';
import { Enrollment } from 'common';

import './invite-modal.css';

export interface InviteModalProps extends ModalProps {
  enrollment: Enrollment;
}

export default ({
  enrollment: { challenge, team, invite },
  ...props
}: InviteModalProps) => {
  const [copiedRecently, setCopiedRecently] = useState<boolean>(false);
  const inputRef = useRef();
  const api = useAPI();
  // Reset the button's copied state after a brief timeout.
  useEffect(() => {
    if (copiedRecently) {
      const timer = setTimeout(() => {
        setCopiedRecently(false);
      }, 2000);
      // To check whether or not it is the first invite.
      api
        .fetchInviteStatus()
        .then(
          ({
            showInviteSendToast = false,
            hasEarnedSessionToast = false,
            challengeEnded = true,
          }) => {
            sessionStorage.setItem(
              'showInviteSendToast',
              JSON.stringify(showInviteSendToast)
            );
            sessionStorage.setItem(
              'hasEarnedSessionToast',
              JSON.stringify(hasEarnedSessionToast)
            );
            sessionStorage.setItem(
              'challengeEnded',
              JSON.stringify(challengeEnded)
            );
          }
        );
      sessionStorage.setItem('hasShared', 'true');

      return () => clearTimeout(timer);
    }
  }, [copiedRecently]);
  useEffect(() => trackChallenge('modal-invite'), []);

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
        value={`${window.location.origin}/?challenge=${challenge}&team=${team}&invite=${invite}`}
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
