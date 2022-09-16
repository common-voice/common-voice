import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/ui';
import { PlayOutlineGreenIcon, MicIcon, SkipIcon } from '../ui/icons';
import Modal from '../modal/modal';
import URLS from '../../urls';
import { LocaleLink } from '../locale-helpers';
import { trackChallenge } from '../../services/tracker';
import './onboarding-modal.css';

interface Step {
  title: string;
  alt?: string;
  img?: string;
}
interface Props {
  onRequestClose: () => void;
}

type StepType = Step;

const STEPS: Array<StepType> = [
  {
    title: 'Track your team and indvidual progress on the challenge dashboard',
    img: require('./images/dashboard.png'),
    alt: 'dashboard',
  },
  {
    title: 'Invite friends and colleagues to join your challenge team',
    img: require('./images/invite.jpg'),
    alt: 'invite',
  },
  {
    title:
      'Earn points by contributing your voice and validating recorded clips',
    img: require('./images/contribute.png'),
    alt: 'contribute',
  },
  {
    title: 'Ready to get started?',
  },
];
const OperationButtons = () => {
  return (
    <div className="operation-buttons">
      <div className="speak-btn">
        <LocaleLink to={URLS.SPEAK}>
          Speak
          <MicIcon />
        </LocaleLink>
      </div>
      <div className="listen-btn">
        <LocaleLink to={URLS.LISTEN}>
          Listen
          <PlayOutlineGreenIcon />
        </LocaleLink>
      </div>
    </div>
  );
};
const OnboardingModal = ({ onRequestClose }: Props) => {
  let [step, setStep] = useState<number>(0);
  const stepData = STEPS[step];
  const isLastStep = step === STEPS.length - 1;
  useEffect(() => trackChallenge('modal-onboarding'), []);

  return (
    <Modal innerClassName="onboarding-modal" onRequestClose={onRequestClose}>
      <div className="step-container">
        {++step} of {STEPS.length}
      </div>
      <p className="onboarding-modal-title">{stepData.title}</p>
      {isLastStep ? (
        <div className="wave">
          <img
            src={require('./images/1-red-copy.svg')}
            className="red-copy"
            alt="robot"
          />
        </div>
      ) : (
        <div className="image-container">
          <img src={stepData.img} alt={stepData.alt} />
        </div>
      )}
      {isLastStep ? (
        <OperationButtons />
      ) : (
        <div className="onboarding-buttons">
          <Button
            rounded
            outline
            onClick={() => {
              setStep(prevStep => prevStep + 1);
            }}>
            Next
            <SkipIcon />
          </Button>
        </div>
      )}
    </Modal>
  );
};
export default OnboardingModal;
