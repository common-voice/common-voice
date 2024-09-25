import React from 'react';

const ProgressSteps = ({ currentStep, steps }: any) => {
  const stepsDone = currentStep === -1;
  
  return (
    <div
      className="w-full flex justify-center bg-white py-4 px-6 shadow-sm"
      style={{ border: '1px solid #D4D4D4', borderRadius: '15px' }}>

      <ul className="steps flex-1">
        {steps.map((step: any, index: number) => {
          let imgSrc = '';

          if (stepsDone) {
            imgSrc = '/img/progress-check.svg';
          }

          if (!stepsDone) {
          if (index < currentStep) {
            imgSrc = '/img/progress-check.svg'; 
          } else if (index === currentStep) {
            imgSrc = '/img/progress-check-active.svg'; 
          } else {
            imgSrc = '/img/progress-check-muted.svg'; 
          }
        }

          return (
            <li
              key={index}
              className={`step ${index <= currentStep ? 'step-accent' : ''} relative z-1`}
              data-content=""
            >
                <img
                  src={imgSrc}
                  alt={
                    index < currentStep
                      ? 'Completed step'
                      : index === currentStep
                      ? 'Current step'
                      : 'Upcoming step'
                  }
                  className="absolute inset-0 w-[48px] h-[48px] m-auto top-[-22px]"
                  style={{ zIndex: 4 }} 
                />
              <span className="text-center text-sm text-gray-500 pt-2">{step}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProgressSteps;
