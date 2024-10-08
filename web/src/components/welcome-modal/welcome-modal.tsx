import * as React from 'react'
import { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import BalanceText from 'react-balance-text'
import { pick } from 'common'

import Modal, { ModalProps } from '../modal/modal'
import { Button, Checkbox } from '../ui/ui'
import { trackChallenge } from '../../services/tracker'
import { useAccount, useAction } from '../../hooks/store-hooks'
import { User } from '../../stores/user'
import { Enrollment } from '../../../../common/challenge'
import { useLocale } from '../locale-helpers'
import {
  ChallengeTeamToken,
  challengeTeams,
  ChallengeToken,
  challengeTokens,
  challengeTeamTokens,
} from 'common'
import URLS from '../../urls'

import './welcome-modal.css'

export interface WelcomeModalProps extends ModalProps {
  challengeToken: ChallengeToken
  teamToken: ChallengeTeamToken
}

export default ({ challengeToken, teamToken, ...props }: WelcomeModalProps) => {
  const readableTeamName = challengeTeams[teamToken].readableName
  const [hasAgreed, setHasAgreed] = useState<boolean>(false)
  const account = useAccount()
  const saveAccount = useAction(User.actions.saveAccount)
  const [locale, toLocaleRoute] = useLocale()
  const [redirectChallenge, setRedirectChallenge] = useState(null)

  useEffect(() => trackChallenge('modal-welcome'), [])

  const parseEnrollment = (
    queryString: string,
    referer?: string
  ): Enrollment => {
    const regex = new RegExp(/([\w\-]+)=([\w\-]+)/, 'g')
    const queries = {} as { [key: string]: string }
    let pair: Array<string> = []

    while ((pair = regex.exec(queryString)) !== null) {
      queries[pair[1]] = pair[2]
    }

    queries.referer = referer

    if (
      challengeTokens.includes(queries.challenge as ChallengeToken) &&
      challengeTeamTokens.includes(queries.team as ChallengeTeamToken)
    ) {
      return pick(queries, ['challenge', 'team', 'invite']) as Enrollment
    } else return null
  }

  const redirectEnrollment = async (
    enrollmentDetails: string,
    referrer?: string
  ) => {
    const referrerString = referrer ? `&referer=${referrer}` : ''

    if (enrollmentDetails) {
      if (account) {
        const enrollObject = parseEnrollment(enrollmentDetails, referrer)
        await saveAccount({ enrollment: enrollObject })

        setRedirectChallenge({
          pathname: toLocaleRoute(URLS.DASHBOARD + URLS.CHALLENGE),
          search: `?challenge=${enrollObject.challenge}&achievement=1${referrerString}`,
          state: {
            showOnboardingModal: true,
          },
        })
      } else {
        window.location.href = `/login${enrollmentDetails}${referrerString}`
      }
    } else {
      window.location.reload()
    }
  }

  return redirectChallenge ? (
    <Redirect push to={redirectChallenge} />
  ) : (
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
          const { referrer } = document
          return redirectEnrollment(window.location.search, referrer)
        }}>
        Join the {readableTeamName} team
      </Button>
    </Modal>
  )
}
