import * as React from 'react';
import { useState } from 'react';
import { Button } from '../ui/ui';
import { PlayOutlineGreenIcon, MicIcon, SkipIcon } from '../ui/icons';
import Modal from '../modal/modal';
import URLS from '../../urls';
import { LocaleLink } from '../locale-helpers';
import './onboarding-modal.css';

const STEPS: Array<any> = [
  {
    title: 'Track your team and indvidual progress on the challenge dashboard',
    img: './images/dashboard.png',
    alt: 'dashboard',
  },
  {
    title: 'Invite friends and colleagues to join your challenge team',
    img: './images/invite.jpg',
    alt: 'invite',
  },
  {
    title:
      'Earn points by contributing your voice and validating recorded clips',
    img: './images/contribute.png',
    alt: 'contribute',
  },
  {
    title: 'Ready to get started?',
  },
];
const OperationButtons = () => {
  return (
    <div className="operation-buttons">
      <div className="speakBtn">
        <LocaleLink to={URLS.SPEAK}>
          Speak
          <MicIcon />
        </LocaleLink>
      </div>
      <div className="listenBtn">
        <LocaleLink to={URLS.LISTEN}>
          Listen
          <PlayOutlineGreenIcon />
        </LocaleLink>
      </div>
    </div>
  );
};
const OnboardingModal = ({ ...props }) => {
  const [step, setStep] = useState(1);
  let currentStep = step,
    stepData = STEPS[--currentStep],
    isLastStep = step === 4 ? true : false;
  return (
    <Modal innerClassName="onboarding-modal" {...props}>
      <div className="step-container">
        {step} of {STEPS.length}
      </div>
      <p className="title">{stepData.title}</p>
      {isLastStep ? (
        <div className="wave">
          <img src={require('./images/1-red-copy.svg')} className="red-copy" />
        </div>
      ) : (
        <div className="image-container">
          <img src={require(`${stepData.img}`)} alt={stepData.alt} />
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
              setStep(step + 1);
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
