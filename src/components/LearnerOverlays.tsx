"use client";

import { usePathname } from "next/navigation";
import CelebrationOverlay from "@/components/scoring/CelebrationOverlay";
import ImportProgressModal from "@/components/auth/ImportProgressModal";
import DiscordCommunityModal from "@/components/auth/DiscordCommunityModal";

export default function LearnerOverlays() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <CelebrationOverlay />
      <ImportProgressModal />
      <DiscordCommunityModal />
    </>
  );
}
