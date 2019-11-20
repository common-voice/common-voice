import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BalanceText from 'react-balance-text';
import Modal, { ModalProps } from '../modal/modal';
import { Button, Checkbox } from '../ui/ui';
import { trackChallenge } from '../../services/tracker';
import { useAccount, useAction } from '../../hooks/store-hooks';
import { User } from '../../stores/user';
import { Enrollment } from '../../../../common/challenge';
import {
  ChallengeTeamToken,
  challengeTeams,
  ChallengeToken,
} from 'common/challenge';
import URLS from '../../urls';

import './welcome-modal.css';

export interface WelcomeModalProps extends ModalProps {
  challengeToken: ChallengeToken;
  teamToken: ChallengeTeamToken;
}

export default ({ challengeToken, teamToken, ...props }: WelcomeModalProps) => {
  const readableTeamName = challengeTeams[teamToken].readableName;
  const [hasAgreed, setHasAgreed] = useState<boolean>(false);
  const account = useAccount();
  const saveAccount = useAction(User.actions.saveAccount);

  useEffect(() => trackChallenge('modal-welcome'), []);

  const parseEnrollment = (queryString: string): Enrollment => {
    const regex = new RegExp(/([a-z]+)=([a-z]+)/, 'gm');
    const queries = {} as { [key: string]: string };
    let pair: Array<string> = [];

    while ((pair = regex.exec(queryString)) !== null) {
      queries[pair[1]] = pair[2];
    }

    return {
      challenge: queries.challenge,
      team: queries.team,
      referer: queries.referer,
      invite: queries.invite,
    } as Enrollment;
  };

  return (
    <Modal {...props} innerClassName="welcome-modal">
      <h1>
        <BalanceText>Welcome to the Open Voice Challenge</BalanceText>
      </h1>
      <BalanceText className="subheading">
        Ready to join the {readableTeamName} challenge team? Read and agree to
        the{' '}
        <Link
          to={URLS.CHALLENGE_TERMS}
          target="_blank"
          rel="noopener noreferrer">
          challenge terms
        </Link>{' '}
        and you're set to go!
      </BalanceText>

      <div className="checkbox-row">
        <label>
          <Checkbox onChange={(e: any) => setHasAgreed(e.target.checked)} />
          <BalanceText className="terms-agree">
            I've read and agree to the Open Voice Challenge{' '}
            <Link
              to={URLS.CHALLENGE_TERMS}
              target="_blank"
              rel="noopener noreferrer">
              Terms & Conditions
            </Link>
          </BalanceText>
        </label>
      </div>

      <Button
        rounded
        disabled={!hasAgreed}
        onClick={() => {
          const enrollmentDetails = window.location.search;
          // `enrollmentDetails` should always exist here, but in case it
          // doesn't we abort the login flow.

          if (enrollmentDetails) {
            if (account) {
              const enrollObject = parseEnrollment(enrollmentDetails);
              saveAccount({ enrollment: enrollObject }).then(() => {
                window.location.href = `/dashboard/challenge?challenge=${enrollObject.challenge}&achievement=1`;
              });
            } else {
              const { referrer } = document;
              window.location.href = `/login${enrollmentDetails}${
                referrer ? `&referer=${referrer}` : ''
              }`;
            }
          } else {
            window.location.reload();
          }
        }}>
        Join the {readableTeamName} team
      </Button>
    </Modal>
  );
};
