import React from 'react'
import { motion } from 'framer-motion'

const ProgressSteps = ({ currentStep, steps }: any) => {
  const stepsDone = currentStep === -1

  return (
    <div
      className=" my-5 w-full flex justify-center bg-white py-4 px-6 shadow-sm"
      style={{ border: '1px solid #D4D4D4', borderRadius: '15px' }}>
      <ul className="steps flex-1 overflow-auto">
        {steps.map((step: any, index: number) => {
          let imgSrc = ''

          if (stepsDone) {
            imgSrc = '/img/progress-check.svg'
          }

          if (!stepsDone) {
            if (index < currentStep) {
              imgSrc = '/img/progress-check.svg' // Successful step
            } else if (index === currentStep) {
              imgSrc = '/img/progress-check-active.svg'
            } else {
              imgSrc = '/img/progress-check-muted.svg'
            }
          }

          const isSuccess = imgSrc === '/img/progress-check.svg'

          return (

            <li
              key={index}
              className={`step ${
                index <= currentStep ? 'step-accent' : ''
              } relative z-1`}
              data-content="">

              <motion.img
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
                initial={{ opacity: 0, translateY: -100, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  translateY: 0,
                  scale: 1,
                  ...(isSuccess && {
                    scale: [1, 2, 1],
                    rotate: [0, 20, -20, 0],
                  }), //  Animation effect for success
                }}
                transition={{
                  delay: isSuccess ? 0.2 : 0.2 * index,
                  duration: isSuccess ? 0.6 : 0.5,
                  ease: 'easeInOut',
                }}
              />

              <span className="text-center text-sm text-gray-500 pt-2">
                {step}
              </span>

            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ProgressSteps
