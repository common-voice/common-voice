import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import BalanceText from 'react-balance-text';
import Modal, { ModalProps } from '../modal/modal';
import { FontIcon } from '../ui/icons';
import { Button, LabeledInput, LabeledTextArea } from '../ui/ui';
import { useAPI } from '../../hooks/store-hooks';
import { trackChallenge } from '../../services/tracker';
import { Enrollment, challengeTeams } from 'common/challenge';

import './invite-modal.css';

export interface InviteModalProps extends ModalProps {
  enrollment: Enrollment;
}

// Check whether or not it is the first invite, for achievements.
function handleInvite() {
  useAPI()
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
}

export default ({
  enrollment: { challenge, team, invite },
  ...props
}: InviteModalProps) => {
  const inviteLink = `${window.location.origin}/?challenge=${challenge}&team=${team}&invite=${invite}`;
  const [copiedRecently, setCopiedRecently] = useState<boolean>(false);
  const [emailRecipients, setEmailRecipients] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>(
    `Join the ${challengeTeams[team].readableName} team in the Open Voice Challenge! We're helping Mozilla's Common Voice project build an open, public voice dataset and earn prizes for charity.

Go to ${inviteLink} in your browser to get started.`
  );
  const inputRef = useRef();
  // Reset the button's copied state after a brief timeout.
  useEffect(() => {
    if (copiedRecently) {
      const timer = setTimeout(() => {
        setCopiedRecently(false);
      }, 2000);
      handleInvite();
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
        value={inviteLink}
        className="visuallyhidden"
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
      <div className="or">or</div>
      {/* TODO: If the client's default mailto handler is a web interface (eg.
                Gmail), the current tab location will change before any
                achievements are awarded. target="_blank" is not reliable for
                mailto links.

                Investigate adding a delay between triggering the submission
                and actually submitting the form.  */}
      <form
        action={`mailto:${emailRecipients.replace(/ /g, '')}`}
        onSubmit={handleInvite}
        method="GET"
        target="_blank"
        className="email-form">
        <input type="hidden" name="subject" value="Open Voice Challenge" />
        <LabeledInput
          required
          name="email"
          type="text"
          label="Email address"
          placeholder="address@email.com"
          value={emailRecipients}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmailRecipients(e.target.value)
          }
        />
        <LabeledTextArea
          required
          name="body"
          label="Message"
          value={emailBody}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setEmailBody(e.target.value)
          }
          rows={6}
        />
        <Button rounded type="submit">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
