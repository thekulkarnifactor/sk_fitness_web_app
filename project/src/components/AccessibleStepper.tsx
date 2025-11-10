import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface AccessibleStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  allowStepNavigation?: boolean;
}

export function AccessibleStepper({
  steps,
  currentStep,
  onStepClick,
  allowStepNavigation = false
}: AccessibleStepperProps) {
  const announceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announceRef.current) {
      const currentStepInfo = steps[currentStep - 1];
      announceRef.current.textContent = `Step ${currentStep} of ${steps.length}: ${currentStepInfo.title}`;
    }
  }, [currentStep, steps]);

  return (
    <>
      <div
        ref={announceRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <nav aria-label="Progress">
        <ol className="flex items-center justify-center space-x-2" role="list">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isComplete = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isClickable = allowStepNavigation && onStepClick && stepNumber <= currentStep;

            const StepElement = isClickable ? 'button' : 'div';

            return (
              <li key={step.id} className="flex items-center">
                <StepElement
                  onClick={isClickable ? () => onStepClick(stepNumber) : undefined}
                  disabled={!isClickable}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`${step.title}${isComplete ? ' completed' : ''}${isCurrent ? ' current' : ''}`}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full font-bold
                    transition-all focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-amber-500
                    ${isCurrent
                      ? 'bg-gradient-to-br from-amber-500 to-yellow-600 text-black ring-4 ring-amber-500/30'
                      : isComplete
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-white/5 text-gray-500'
                    }
                    ${isClickable ? 'hover:scale-110 cursor-pointer' : ''}
                  `}
                >
                  {isComplete ? (
                    <Check className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </StepElement>

                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      isComplete ? 'bg-amber-500' : 'bg-white/10'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-4 text-center">
          {/* <p className="text-sm text-gray-400" aria-hidden="true">
            Step {currentStep} of {steps.length}
          </p> */}
          {/* <p className="text-lg font-semibold text-white mt-1">
            {steps[currentStep - 1].title}
          </p> */}
          {/* {steps[currentStep - 1].description && (
            <p className="text-sm text-gray-400 mt-1">
              {steps[currentStep - 1].description}
            </p>
          )} */}
        </div>
      </nav>
    </>
  );
}
