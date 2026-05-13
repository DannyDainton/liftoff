"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isRegistered, signInWithDiscord } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[var(--text-tertiary)]">Redirecting to authentication...</p>
      </div>
    );
  }

  return (
    <>
      {!isRegistered && (
        <div className="bg-[#5865F2]/10 border-b border-[#5865F2]/20 px-4 py-2.5 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Your progress is saved locally.{" "}
            <button
              onClick={signInWithDiscord}
              className="text-[#5865F2] font-medium hover:underline"
            >
              Sign in with Discord
            </button>
            {" "}to save it permanently.
          </p>
        </div>
      )}
      {children}
    </>
  );
}
