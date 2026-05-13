"use client";

import { useState } from "react";
import { useProgress } from "@/context/ProgressContext";

export default function ImportProgressModal() {
  const { hasLocalProgress, importLocalProgress } = useProgress();
  const [importing, setImporting] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!hasLocalProgress || dismissed) return null;

  async function handleImport() {
    setImporting(true);
    await importLocalProgress();
    setImporting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-card p-8 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-white mb-2">
          Import Your Progress
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          We found progress saved in your browser from before you registered.
          Would you like to import it to your account so it&apos;s saved permanently?
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleImport}
            disabled={importing}
            className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--orange)] to-[var(--pink)] hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {importing ? "Importing..." : "Import Progress"}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="px-4 py-2.5 rounded-xl font-semibold text-[var(--text-secondary)] bg-white/5 hover:bg-white/10 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
