"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { ValidationResult } from "@/types/validation";

const DISCORD_INVITE = "https://discord.gg/XJbdvQJQqU";

interface ValidateButtonProps {
  stepId: string;
  stepTitle: string;
  validatorId: string;
  points: number;
  moduleColor?: string;
}

function DiscordHelpButton({
  stepId,
  stepTitle,
  errorMessage,
}: {
  stepId: string;
  stepTitle: string;
  errorMessage?: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleAskForHelp() {
    const lines = [
      `**Step:** ${stepTitle}`,
      `**Step ID:** ${stepId}`,
    ];
    if (errorMessage) {
      lines.push(`**Error:** ${errorMessage}`);
    }
    lines.push("", "**Additional context:**", "_(add any details here)_");

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });

    window.open(DISCORD_INVITE, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      onClick={handleAskForHelp}
      className="inline-flex items-center gap-1.5 text-xs text-[#5865F2] hover:text-[#7289DA] transition-colors"
    >
      <svg width="14" height="11" viewBox="0 0 71 55" fill="currentColor">
        <path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.7 40.7 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.3a.2.2 0 00-.2-.1 58.4 58.4 0 00-14.7 4.6.2.2 0 00-.1 0A60.4 60.4 0 00.4 45.1a.3.3 0 000 .2A58.8 58.8 0 0018.1 55a.2.2 0 00.2-.1 42.1 42.1 0 003.6-5.9.2.2 0 00-.1-.3 38.8 38.8 0 01-5.5-2.6.2.2 0 01 0-.4c.4-.3.7-.6 1.1-.9a.2.2 0 01.2 0 42 42 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.4 36.4 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1A58.6 58.6 0 0070.6 45.3a.2.2 0 000-.2A60 60 0 0060.2 5a.2.2 0 00-.1 0zM23.7 37a6.9 6.9 0 01-6.4-7.1 6.8 6.8 0 016.4-7.1 6.8 6.8 0 016.4 7.1 6.9 6.9 0 01-6.4 7.1zm23.6 0a6.9 6.9 0 01-6.4-7.1 6.8 6.8 0 016.4-7.1 6.8 6.8 0 016.4 7.1 6.9 6.9 0 01-6.4 7.1z" />
      </svg>
      {copied ? "Copied! Paste in #liftoff-feedback" : "Ask for help on Discord"}
    </button>
  );
}

export default function ValidateButton({
  stepId,
  stepTitle,
  validatorId,
  points,
  moduleColor = "#FF6C37",
}: ValidateButtonProps) {
  const { apiKey, isAuthenticated } = useAuth();
  const { isStepCompleted, completeStep, validationContext } = useProgress();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const completed = isStepCompleted(stepId);

  async function handleValidate() {
    if (!apiKey || completed) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/postman/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepId,
          validatorId,
          apiKey,
          context: validationContext,
        }),
      });
      const data: ValidationResult = await res.json();
      setResult(data);

      if (data.success) {
        completeStep(stepId, points, data.context);
      }
    } catch {
      setResult({
        success: false,
        message: "Failed to validate. Please try again.",
        pointsAwarded: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  if (completed) {
    return (
      <div className="flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-[var(--green)]/10 border border-[var(--green)]/25">
        <span className="text-[var(--green)]">✓</span>
        <span className="text-[var(--green)] font-medium text-sm">
          Completed · +{points} pts
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mt-4">
        <Link
          href="/settings"
          className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
          style={{
            background: moduleColor,
            boxShadow: `0 4px 16px ${moduleColor}30`,
          }}
        >
          Connect Postman to Validate →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4">
        <button
          onClick={handleValidate}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40 hover:opacity-90"
          style={{
            background: moduleColor,
            boxShadow: `0 4px 16px ${moduleColor}30`,
          }}
        >
          {loading ? "Validating..." : "Validate"}
        </button>
        <DiscordHelpButton stepId={stepId} stepTitle={stepTitle} />
      </div>
      {result && !result.success && (
        <div className="mt-3 px-4 py-3 rounded-xl bg-[var(--pink)]/8 border border-[var(--pink)]/20">
          <p className="text-[var(--pink)] text-sm">{result.message}</p>
          <div className="mt-2">
            <DiscordHelpButton
              stepId={stepId}
              stepTitle={stepTitle}
              errorMessage={result.message}
            />
          </div>
        </div>
      )}
      {result && result.success && !completed && (
        <div className="mt-3 px-4 py-3 rounded-xl bg-[var(--green)]/8 border border-[var(--green)]/20">
          <p className="text-[var(--green)] text-sm">{result.message}</p>
        </div>
      )}
    </div>
  );
}
