import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/util";

export interface StepperStep {
    id: string;
    label: string;
    description?: string;
}

export interface StepperProps {
    steps: StepperStep[];
    currentStep: number; 
    className?: string;
    orientation?: "horizontal" | "vertical";
}

export function Stepper({
    steps,
    currentStep,
    className,
    orientation = "horizontal",
}: StepperProps) {
    const isVertical = orientation === "vertical";

    return (
        <div
            className={cn(
                "flex",
                isVertical ? "flex-col gap-0" : "items-center gap-0",
                className,
            )}
        >
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;
                const isLast = index === steps.length - 1;

                return (
                    <div
                        key={step.id}
                        className={cn(
                            "flex relative",
                            isVertical ? "flex-row gap-3" : "flex-col items-center flex-1",
                        )}
                    >
                        <div
                            className={cn(
                                "flex items-center justify-center z-10",
                                isVertical ? "flex-col" : "flex-row w-full",
                            )}
                        >
                            
                            <div
                                className={cn(
                                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                                    "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                                    isCompleted
                                        ? "bg-(--color-accent) text-white scale-100 border-2 border-(--color-accent)"
                                        : isActive
                                          ? "border-2 border-(--color-accent) text-(--color-accent) bg-(--color-bg-secondary) scale-110"
                                          : "border-2 border-(--color-border) text-(--color-text-disabled) bg-(--color-bg-secondary) scale-100",
                                )}
                            >
                                {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
                            </div>

                            {!isLast && isVertical && (
                                <div
                                    className={cn(
                                        "w-0.5 flex-1 min-h-[24px] mx-auto my-1 transition-all duration-500 ease-out",
                                        index < currentStep
                                            ? "bg-(--color-accent)"
                                            : "bg-(--color-border)",
                                    )}
                                />
                            )}
                        </div>

                        {!isLast && !isVertical && (
                            <div
                                className={cn(
                                    "absolute top-3.5 left-[50%] w-full h-0.5 z-0 transition-all duration-500 ease-out",
                                    index < currentStep
                                        ? "bg-(--color-accent)"
                                        : "bg-(--color-border)",
                                )}
                            />
                        )}

                        <div className={cn("mt-2", isVertical && "mt-0 pb-6")}>
                            <p
                                className={cn(
                                    "text-xs font-medium transition-colors duration-400 ease-out",
                                    isVertical ? "text-left" : "text-center",
                                    isActive
                                        ? "text-(--color-text-primary)"
                                        : isCompleted
                                          ? "text-(--color-accent)"
                                          : "text-(--color-text-disabled)",
                                )}
                            >
                                {step.label}
                            </p>
                            {step.description && (
                                <p
                                    className={cn(
                                        "text-xs text-(--color-text-tertiary) mt-0.5",
                                        isVertical ? "text-left" : "text-center",
                                    )}
                                >
                                    {step.description}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
