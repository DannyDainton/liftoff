import { Rank } from "@/types/scoring";

export const ranks: Rank[] = [
  {
    id: "mass-relay",
    title: "Mass Relay",
    minPoints: 10000,
    badge: "\u{1F30C}",
    badgeImg: "/ranks/mass-relay.png?v=6",
    badgeImgFull: "/ranks/mass-relay-full.png?v=6",
    description: "Transcended all known systems",
  },
  {
    id: "supernova",
    title: "Supernova",
    minPoints: 5000,
    badge: "\u{1F4A5}",
    badgeImg: "/ranks/supernova.png?v=6",
    badgeImgFull: "/ranks/supernova-full.png?v=6",
    description: "Unstoppable force of knowledge",
  },
  {
    id: "galaxy-brain",
    title: "Galaxy Brain",
    minPoints: 1000,
    badge: "\u{1F9E0}",
    badgeImg: "/ranks/galaxy-brain.png?v=6",
    badgeImgFull: "/ranks/galaxy-brain-full.png?v=6",
    description: "Deep mastery achieved",
  },
  {
    id: "flight-director",
    title: "Flight Director",
    minPoints: 500,
    badge: "\u{1F680}",
    badgeImg: "/ranks/flight-director.png?v=6",
    badgeImgFull: "/ranks/flight-director-full.png?v=6",
    description: "Commanding the mission",
  },
  {
    id: "commander",
    title: "Commander",
    minPoints: 100,
    badge: "⭐",
    badgeImg: "/ranks/commander.png?v=6",
    badgeImgFull: "/ranks/commander-full.png?v=6",
    description: "Proven mission leader",
  },
  {
    id: "specialist",
    title: "Mission Specialist",
    minPoints: 50,
    badge: "\u{1F6F0}️",
    badgeImg: "/ranks/specialist.png?v=6",
    badgeImgFull: "/ranks/specialist-full.png?v=6",
    description: "Core skills mastered",
  },
  {
    id: "cadet",
    title: "Space Cadet",
    minPoints: 0,
    badge: "\u{1F31F}",
    badgeImg: "/ranks/cadet.png?v=6",
    badgeImgFull: "/ranks/cadet-full.png?v=6",
    description: "Just getting started",
  },
];

export function calculateRank(points: number): Rank {
  return ranks.find((r) => points >= r.minPoints) || ranks[ranks.length - 1];
}

export function getNextRank(points: number): Rank | null {
  const sorted = [...ranks].sort((a, b) => a.minPoints - b.minPoints);
  return sorted.find((r) => r.minPoints > points) || null;
}
