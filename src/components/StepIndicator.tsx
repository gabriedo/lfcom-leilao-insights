
import React from "react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div
            className={cn(
              "flex flex-col items-center relative group",
              onStepClick ? "cursor-pointer" : ""
            )}
            onClick={() => onStepClick && onStepClick(index)}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                currentStep === index
                  ? "bg-primary text-primary-foreground"
                  : index < currentStep
                  ? "bg-primary/80 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                currentStep === index
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-2",
                index < currentStep
                  ? "bg-primary"
                  : "bg-muted"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
