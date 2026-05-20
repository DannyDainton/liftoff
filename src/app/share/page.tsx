import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAllModules } from "@/lib/content-loader";
import { ranks } from "@/lib/scoring";

const APP_URL = "https://quickstarts.postman.com";

interface Props {
  searchParams: Promise<{ type?: string; id?: string; points?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const type = params.type ?? "results";
  const id = params.id ?? "";
  const points = params.points ?? "";

  let title = "LiftOff — Learn APIs by Doing";
  let description = "Interactive learning modules with real-time Postman API validation.";
  let ogTitle = "LiftOff";
  let ogSubtitle = "";
  let badgeUrl = "";

  if (type === "module" && id) {
    const modules = getAllModules();
    const mod = modules.find((m) => m.id === id);
    if (mod) {
      ogTitle = `Module Complete: ${mod.title}`;
      ogSubtitle = `Completed all steps in the ${mod.title} module`;
      title = `I completed ${mod.title} on LiftOff!`;
      description = ogSubtitle;
      badgeUrl = `${APP_URL}/api/modules/${mod.id}/badge`;
    }
  } else if (type === "rank" && id) {
    const rank = ranks.find((r) => r.id === id);
    if (rank) {
      ogTitle = `Rank Up: ${rank.title}`;
      ogSubtitle = rank.description;
      title = `I reached ${rank.title} on LiftOff!`;
      description = `${rank.description} — ${points ? `${points} points earned` : ""}`;
      badgeUrl = rank.badgeImgFull
        ? `${APP_URL}${rank.badgeImgFull.split("?")[0]}`
        : "";
    }
  } else if (type === "results") {
    ogTitle = points ? `${points} Points Earned` : "My Progress";
    ogSubtitle = "Interactive hands-on API learning with real-time validation";
    title = `My LiftOff Progress${points ? ` — ${points} points` : ""}`;
    description = ogSubtitle;
  }

  const ogParams = new URLSearchParams({ type, title: ogTitle, subtitle: ogSubtitle });
  if (badgeUrl) ogParams.set("badge", badgeUrl);
  const ogImage = `${APP_URL}/api/og?${ogParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
      siteName: "LiftOff by Postman",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function SharePage({ searchParams }: Props) {
  const params = await searchParams;
  const type = params.type;
  const id = params.id;

  if (type === "module" && id) {
    redirect(`/modules/${id}`);
  }
  redirect("/results");
}
