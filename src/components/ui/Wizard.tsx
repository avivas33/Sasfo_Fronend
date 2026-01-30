import { ReactNode, createContext, useContext, useState } from "react";
import { Flex, Box, Text, Button } from "@radix-ui/themes";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import "@/styles/viabilidad-wizard.css";

interface WizardContextValue {
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  completedSteps: Set<number>;
  markStepComplete: (step: number) => void;
  markStepIncomplete: (step: number) => void;
}

const WizardContext = createContext<WizardContextValue | undefined>(undefined);

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a Wizard");
  }
  return context;
}

interface WizardProps {
  children: ReactNode;
  defaultStep?: number;
  totalSteps?: number;
  onStepChange?: (step: number) => void;
}

export function Wizard({ children, defaultStep = 0, totalSteps = 4, onStepChange }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(defaultStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
      onStepChange?.(step);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      markStepComplete(currentStep);
      goToStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const markStepComplete = (step: number) => {
    setCompletedSteps((prev) => new Set(prev).add(step));
  };

  const markStepIncomplete = (step: number) => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      newSet.delete(step);
      return newSet;
    });
  };

  const value: WizardContextValue = {
    currentStep,
    totalSteps,
    goToStep,
    nextStep,
    previousStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    completedSteps,
    markStepComplete,
    markStepIncomplete,
  };

  return (
    <WizardContext.Provider value={value}>
      <Box className="wizard-container">{children}</Box>
    </WizardContext.Provider>
  );
}

interface WizardStepProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function WizardStep({ children, title, description }: WizardStepProps) {
  return (
    <Box className="wizard-step-content">
      {(title || description) && (
        <Box mb="4">
          {title && (
            <Text as="div" size="6" weight="bold" mb="2">
              {title}
            </Text>
          )}
          {description && (
            <Text as="p" size="2" color="gray">
              {description}
            </Text>
          )}
        </Box>
      )}
      {children}
    </Box>
  );
}

interface WizardStepsProps {
  children: ReactNode;
}

export function WizardSteps({ children }: WizardStepsProps) {
  const { currentStep } = useWizard();
  const steps = Array.isArray(children) ? children : [children];

  return <Box className="wizard-steps-container">{steps[currentStep]}</Box>;
}

interface WizardNavigationStep {
  id: number;
  title: string;
  subtitle?: string;
}

interface WizardNavigationProps {
  steps: WizardNavigationStep[];
}

export function WizardNavigation({ steps }: WizardNavigationProps) {
  const { currentStep, completedSteps, goToStep } = useWizard();

  return (
    <nav className="wizard-nav">
      <ul className="wizard-steps">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = completedSteps.has(index);
          const isClickable = index <= currentStep || isCompleted;

          return (
            <li
              key={step.id}
              className={`wizard-step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""
                }`}
              style={{
                cursor: isClickable ? "pointer" : "not-allowed",
              }}
              onClick={() => isClickable && goToStep(index)}
            >
              <a href={`#step-${step.id}`} onClick={(e) => e.preventDefault()}>
                {step.title}
                <br />
                <small>{step.subtitle}</small>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface WizardActionsProps {
  onPrevious?: () => void;
  onNext?: () => void | Promise<void>;
  onSubmit?: () => void | Promise<void>;
  previousLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  isNextDisabled?: boolean;
  isSubmitDisabled?: boolean;
  isLoading?: boolean;
}

export function WizardActions({
  onPrevious,
  onNext,
  onSubmit,
  previousLabel = "Anterior",
  nextLabel = "Siguiente",
  submitLabel = "Finalizar",
  isNextDisabled = false,
  isSubmitDisabled = false,
  isLoading = false,
}: WizardActionsProps) {
  const { previousStep, nextStep, isFirstStep, isLastStep } = useWizard();

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      previousStep();
    }
  };

  const handleNext = async () => {
    if (onNext) {
      await onNext();
    } else {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit();
    }
  };

  return (
    <Flex
      className="wizard-actions"
      gap="3"
      justify="between"
      mt="6"
    >

      <Button
        variant="soft"
        color="gray"
        onClick={handlePrevious}
        disabled={isFirstStep || isLoading}
      >
        <ChevronLeft size={16} />
        {previousLabel}
      </Button>

      {
        !isLastStep ? (
          <Button
            onClick={handleNext}
            disabled={isNextDisabled || isLoading}
          >
            {nextLabel}
            <ChevronRight size={16} />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitDisabled || isLoading}
            color="green"
          >
            <Check size={16} />
            {submitLabel}
          </Button>
        )
      }
    </Flex >
  );
}
