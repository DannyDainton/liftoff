import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const GEMINI_MODEL = "gemini-2.5-flash-image";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function loadApiKey(): string {
  const envPath = join(process.cwd(), ".env.local");
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf-8");
    const match = content.match(/^GEMINI_API_KEY=(.+)$/m);
    if (match && match[1].trim()) return match[1].trim();
  }
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  throw new Error("GEMINI_API_KEY not found. Add it to .env.local or set as environment variable.");
}

async function generateImage(apiKey: string, prompt: string): Promise<Buffer> {
  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(
    (p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData
  );

  if (!imagePart?.inlineData?.data) {
    throw new Error("No image returned from Gemini API.");
  }

  return Buffer.from(imagePart.inlineData.data, "base64");
}

const ICON_STYLE = "Flat vector style with clean edges and subtle glow effects. Vibrant gradient background filling the entire image. No text. No 3D. No photorealism.";

const FULL_STYLE = "Flat vector style with clean edges and subtle glow effects. Vibrant gradient background filling the entire image. No 3D. No photorealism.";

const ranks = [
  {
    id: "cadet",
    title: "Space Cadet",
    iconPrompt: `A digital achievement badge emblem for the Space Cadet rank. Hexagonal shield design with silver metallic edges and a stylized astronaut helmet visor with a twinkling star. Vibrant indigo-to-deep-navy gradient background. ${ICON_STYLE}`,
    fullPrompt: `A digital achievement badge emblem for the Space Cadet rank. Hexagonal shield design with silver metallic edges and a stylized astronaut helmet visor with a twinkling star. Below the hexagon is an ornate unfurling parchment scroll ribbon with the text "SPACE CADET" in bold serif capitals. Vibrant indigo-to-deep-navy gradient background with scattered stars. ${FULL_STYLE}`,
  },
  {
    id: "specialist",
    title: "Mission Specialist",
    iconPrompt: `A digital achievement badge emblem for the Mission Specialist rank. Hexagonal shield design with bronze metallic edges and a satellite orbiting a small planet with ring trails. Vibrant teal-to-deep-blue gradient background. ${ICON_STYLE}`,
    fullPrompt: `A digital achievement badge emblem for the Mission Specialist rank. Hexagonal shield design with bronze metallic edges and a satellite orbiting a small planet with ring trails. Below the hexagon is an ornate unfurling parchment scroll ribbon with the text "MISSION SPECIALIST" in bold serif capitals. Vibrant teal-to-deep-blue gradient background with orbital rings. ${FULL_STYLE}`,
  },
  {
    id: "commander",
    title: "Commander",
    iconPrompt: `A digital achievement badge emblem for the Commander rank. Hexagonal shield design with polished gold edges, laurel wreath border, and a bold golden star over a chevron insignia. Vibrant amber-to-deep-gold gradient background. ${ICON_STYLE}`,
    fullPrompt: `A digital achievement badge emblem for the Commander rank. Hexagonal shield design with polished gold edges, laurel wreath border, and a bold golden star over a chevron insignia. Below the hexagon is an ornate unfurling parchment scroll ribbon with the text "COMMANDER" in bold serif capitals. Vibrant amber-to-deep-gold gradient background with radiating light. ${FULL_STYLE}`,
  },
  {
    id: "flight-director",
    title: "Flight Director",
    iconPrompt: `A digital achievement badge emblem for the Flight Director rank. Hexagonal shield design with copper-red metallic edges, wing insignia, and a rocket launching through radar arcs. Vibrant orange-to-deep-red gradient background. ${ICON_STYLE}`,
    fullPrompt: `A digital achievement badge emblem for the Flight Director rank. Hexagonal shield design with copper-red metallic edges, wing insignia, and a rocket launching through radar arcs. Below the hexagon is an ornate unfurling parchment scroll ribbon with the text "FLIGHT DIRECTOR" in bold serif capitals. Vibrant orange-to-deep-red gradient background. ${FULL_STYLE}`,
  },
  {
    id: "galaxy-brain",
    title: "Galaxy Brain",
    iconPrompt: `A digital achievement badge emblem for the Galaxy Brain rank. Hexagonal shield design with iridescent purple edges and a glowing brain made of interconnected constellation stars and neural pathways. Vibrant purple-to-deep-magenta gradient background with nebula wisps. ${ICON_STYLE}`,
    fullPrompt: `A digital achievement badge emblem for the Galaxy Brain rank. Hexagonal shield design with iridescent purple edges and a glowing brain made of interconnected constellation stars and neural pathways. Below the hexagon is an ornate unfurling parchment scroll ribbon with the text "GALAXY BRAIN" in bold serif capitals. Vibrant purple-to-deep-magenta gradient background with nebula wisps. ${FULL_STYLE}`,
  },
  {
    id: "supernova",
    title: "Supernova",
    iconPrompt: `A digital achievement badge emblem for the Supernova rank. Hexagonal shield design with blazing crimson-gold edges and an exploding star with energy shockwaves and plasma tendrils. Vibrant hot-pink-to-deep-crimson gradient background with ember particles. ${ICON_STYLE}`,
    fullPrompt: `A digital achievement badge emblem for the Supernova rank. Hexagonal shield design with blazing crimson-gold edges and an exploding star with energy shockwaves and plasma tendrils. Below the hexagon is an ornate unfurling parchment scroll ribbon with the text "SUPERNOVA" in bold serif capitals. Vibrant hot-pink-to-deep-crimson gradient background with ember particles. ${FULL_STYLE}`,
  },
  {
    id: "mass-relay",
    title: "Mass Relay",
    iconPrompt: `A digital achievement badge emblem for the Mass Relay transcendent rank. Hexagonal shield design with luminous platinum-cyan edges and a swirling galaxy portal with converging energy beams surrounded by cosmic rings. Vibrant cyan-to-deep-violet gradient background with aurora light streams. ${ICON_STYLE}`,
    fullPrompt: `A digital achievement badge emblem for the Mass Relay transcendent rank. Hexagonal shield design with luminous platinum-cyan edges and a swirling galaxy portal with converging energy beams surrounded by cosmic rings. Below the hexagon is an ornate unfurling parchment scroll ribbon with the text "MASS RELAY" in bold serif capitals. Vibrant cyan-to-deep-violet gradient background with aurora light streams. ${FULL_STYLE}`,
  },
];

async function main() {
  const apiKey = loadApiKey();
  const outDir = join(process.cwd(), "public/ranks");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const target = process.argv[2];
  const variant = process.argv[3]; // "icon", "full", or undefined for both

  const toGenerate = target && target !== "all"
    ? ranks.filter((r) => r.id === target)
    : ranks;

  if (toGenerate.length === 0) {
    console.error(`Unknown rank: ${target}`);
    process.exit(1);
  }

  for (const rank of toGenerate) {
    if (!variant || variant === "icon") {
      const outPath = join(outDir, `${rank.id}.png`);
      console.log(`Generating ${rank.id} (icon)...`);
      try {
        const buf = await generateImage(apiKey, rank.iconPrompt);
        writeFileSync(outPath, buf);
        console.log(`  Saved ${outPath} (${buf.length} bytes)`);
      } catch (err) {
        console.error(`  Failed: ${(err as Error).message}`);
      }
    }

    if (!variant || variant === "full") {
      const outPath = join(outDir, `${rank.id}-full.png`);
      console.log(`Generating ${rank.id} (full with scroll)...`);
      try {
        const buf = await generateImage(apiKey, rank.fullPrompt);
        writeFileSync(outPath, buf);
        console.log(`  Saved ${outPath} (${buf.length} bytes)`);
      } catch (err) {
        console.error(`  Failed: ${(err as Error).message}`);
      }
    }
  }
}

main();
