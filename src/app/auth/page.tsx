import ApiKeyForm from "@/components/auth/ApiKeyForm";
import DiscordSignInButton from "@/components/auth/DiscordSignInButton";
import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-lg">
        <Link href="/" className="inline-block mb-8 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] text-sm transition-colors">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">
          Connect to Postman
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Enter your Postman API key to validate your workshop progress and
          track your learning.
        </p>

        <div className="glass-card p-6 mb-8">
          <h2 className="text-sm font-mono uppercase tracking-widest text-[var(--orange)] mb-4">
            How to get your API key
          </h2>
          <ol className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono text-[var(--text-tertiary)]">1</span>
              <span>
                Go to your{" "}
                <a
                  href="https://go.postman.co/settings/me/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--orange)] hover:underline"
                >
                  Postman API Keys settings
                </a>
                {" "}(sign in if prompted).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono text-[var(--text-tertiary)]">2</span>
              <span>Click <strong className="text-white">Generate API Key</strong>.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono text-[var(--text-tertiary)]">3</span>
              <span>Give it a name (e.g. &quot;LiftOff&quot;) and confirm.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono text-[var(--text-tertiary)]">4</span>
              <span><strong className="text-white">Copy the key immediately</strong> — you won&apos;t be able to see it again.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono text-[var(--text-tertiary)]">5</span>
              <span>Paste it below and click Connect.</span>
            </li>
          </ol>
          <p className="mt-4 text-xs text-[var(--text-tertiary)]">
            Your API key is tied to your Postman account and lets LiftOff verify your workspace, collections, and environments.{" "}
            <a
              href="https://learning.postman.com/docs/developer/postman-api/authentication/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] underline"
            >
              Learn more
            </a>
          </p>
        </div>

        <ApiKeyForm />

        <div className="mt-10 pt-8 border-t border-white/5">
          <h2 className="text-lg font-bold text-white mb-2">
            Save Your Progress
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Sign in with Discord to save your progress permanently. Your points,
            completed steps, and rank will persist across sessions and devices.
          </p>
          <DiscordSignInButton />
        </div>
      </div>
    </div>
  );
}
