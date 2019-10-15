import * as React from 'react';
import { useState } from 'react';
import BalanceText from 'react-balance-text';
import Modal, { ModalProps } from '../modal/modal';
import { ArrowLeft } from '../ui/icons';
import { Button, Checkbox } from '../ui/ui';

import './welcome-modal.css';

export interface WelcomeModalProps extends ModalProps {
  onClick(): void;
  team: string;
}

export default ({ onClick, team, ...props }: WelcomeModalProps) => {
  const [hasAgreed, setHasAgreed] = useState<boolean>(false);

  return (
    <Modal {...props} innerClassName="welcome-modal">
      <h1>
        <BalanceText>Welcome to the Open Voice Challenge</BalanceText>
      </h1>
      <BalanceText className="subheading">
        Ready to join the {team} challenge team? Read and agree to the challenge
        terms and you're set to go!
      </BalanceText>

      <div className="checkbox-row">
        <label>
          <Checkbox onChange={(e: any) => setHasAgreed(e.target.checked)} />
          <BalanceText className="terms-agree">
            I've read and agree to the Open Voice Challenge Terms & Conditions
          </BalanceText>
        </label>
      </div>

      <Button rounded disabled={!hasAgreed} onClick={onClick}>
        Join the {team} team
        <ArrowLeft />
      </Button>
    </Modal>
  );
};
