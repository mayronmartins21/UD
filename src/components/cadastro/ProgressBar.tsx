import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 border-green-600';
      case 'current':
        return 'bg-blue-600 border-blue-600';
      case 'upcoming':
        return 'bg-gray-200 border-gray-200';
      default:
        return 'bg-gray-200 border-gray-200';
    }
  };

  const getTextColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'current':
        return 'text-blue-600';
      case 'upcoming':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.number);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div className={`
                  w-10 h-10 rounded-full border-2 flex items-center justify-center
                  ${getStepColor(status)}
                  transition-all duration-300
                `}>
                  {status === 'completed' ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className={`font-semibold ${
                      status === 'current' ? 'text-white' : 'text-gray-500'
                    }`}>
                      {step.number}
                    </span>
                  )}
                </div>

                {/* Step Info */}
                <div className="mt-3 text-center">
                  <p className={`text-sm font-medium ${getTextColor(status)}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 max-w-32">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className={`
                  flex-1 h-0.5 mx-4 mt-[-2rem]
                  ${status === 'completed' ? 'bg-green-600' : 'bg-gray-200'}
                  transition-all duration-300
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};