"use client";

import { useProgress } from "@/context/ProgressContext";
import { Step } from "@/types/module";

interface ProgressBarProps {
  steps: Step[];
}

export default function ProgressBar({ steps }: ProgressBarProps) {
  const { isStepCompleted } = useProgress();
  const completed = steps.filter((s) => isStepCompleted(s.id)).length;
  const percentage = steps.length > 0 ? (completed / steps.length) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-[var(--text-secondary)]">
          {completed} of {steps.length} steps
        </span>
        <span className="font-mono font-bold text-[var(--text-primary)]">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(90deg, var(--orange), var(--pink), var(--purple), var(--cyan))",
          }}
        />
      </div>
    </div>
  );
}
