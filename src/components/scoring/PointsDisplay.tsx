"use client";

import { useProgress } from "@/context/ProgressContext";

export default function PointsDisplay() {
  const { points } = useProgress();

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--orange)]/10 border border-[var(--orange)]/20">
      <span className="font-mono font-bold text-[var(--orange)]">{points}</span>
      <span className="text-[var(--orange)]/60 text-xs">pts</span>
    </div>
  );
}
