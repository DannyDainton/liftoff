# LiftOff Rank Manager

Manage the rank progression system for the LiftOff platform. Accepts one subcommand: `list`, `update`, or `badge`.

**Usage:** `/liftoff-rank <list|update|badge>`

Parse the user's argument to determine which subcommand to run. If no argument is provided, ask which action they'd like to take.

---

## Subcommand: `list`

Display all ranks in a table, ordered from lowest to highest.

### Steps:

1. Read `src/lib/scoring.ts` to get the current ranks array.
2. Display them in a markdown table:

```
| Rank | Title | Min Points | Badge Image | Description |
|------|-------|------------|-------------|-------------|
| 1    | Space Cadet | 0 | cadet.png | Just getting started |
| ...  | ... | ... | ... | ... |
```

3. Sort by `minPoints` ascending so the progression is clear.

---

## Subcommand: `update`

Change the point thresholds or metadata for one or more ranks.

### Steps:

1. Read `src/lib/scoring.ts` to show the current ranks.
2. Ask the user what they want to change. Options:
   - **Point thresholds**: Change the `minPoints` for one or more ranks
   - **Title**: Rename a rank
   - **Description**: Update a rank's description
   - **Add a rank**: Insert a new rank at a specific point threshold
   - **Remove a rank**: Delete a rank (must have at least 1 rank with minPoints: 0)
3. Apply the changes to `src/lib/scoring.ts`.
4. If adding a new rank:
   - Add the entry to the `ranks` array in the correct position (sorted by `minPoints` descending)
   - Set `badgeImg` to `/ranks/<rank-id>.png`
   - Offer to generate a badge image for it (run the **badge** subcommand)
5. Run `npx next build` to verify no errors.

### Rules:
- The ranks array must stay sorted by `minPoints` descending
- There must always be at least one rank with `minPoints: 0` (the starter rank)
- Rank IDs must be unique kebab-case strings
- Keep the `badge` emoji field as a fallback even though images are the primary display

---

## Subcommand: `badge`

Generate or regenerate rank badge images using the Gemini API.

### Steps:

1. Read `src/lib/scoring.ts` to list all ranks.
2. Ask the user which rank(s) to generate badges for:
   - A specific rank by name/ID
   - `all` to regenerate every rank badge
3. For each rank to generate:
   - Check if `public/ranks/<rank-id>.png` already exists
   - If it exists, ask for confirmation before overwriting (unless generating `all`)
   - Run the generation script:
     ```bash
     npx tsx scripts/generate-rank-badges.ts <rank-id>
     ```
   - If no argument is passed, the script generates all ranks
4. Show the generated images to the user for review.

### Prompt customization:

If the user wants to customize the prompt for a specific rank, they can provide it. Otherwise the script uses built-in prompts defined in `scripts/generate-rank-badges.ts`.

To update a rank's generation prompt, edit the `ranks` array in `scripts/generate-rank-badges.ts`.

### Badge requirements:
- **Dimensions:** 512x512 pixels (1:1 aspect ratio)
- **Format:** PNG
- **Output path:** `public/ranks/<rank-id>.png`
- **Shape:** Hexagonal — all rank badges MUST use a hexagon shape to distinguish them from circular module badges
- **Background:** Vibrant full-bleed gradient filling the entire image (same approach as module badges). Each rank uses its own color palette. This ensures badges look great both in the dark UI and when shared standalone.
- **Style:** Flat vector with premium ornate details — beveled metallic edges, filigree/decorative border patterns, inner glow effects. No photorealism, no 3D rendering
- Vibrant gradient fills inside the hexagon that stand out against a dark UI
- Each rank should feel progressively more prestigious (silver edges for low ranks, gold/platinum for high ranks)
- **API key:** `GEMINI_API_KEY` must be set in `.env.local`

If the script fails or the key is missing, tell the user to set `GEMINI_API_KEY` in `.env.local` (get one free at https://aistudio.google.com/app/apikey).

### Fallback:

The user can also manually place a 512x512 PNG at `public/ranks/<rank-id>.png`.

---

## Image Variants

Each rank has **two** generated image files:

- **Icon** (`<rank-id>.png`): Hexagonal badge only, no text. Used for small displays like the milestone progress row.
- **Full** (`<rank-id>-full.png`): Hexagonal badge with a decorative parchment scroll banner beneath it displaying the rank name in serif capitals. Used for larger displays (profile section, results page, celebration overlay) and is shareable as a standalone image.

Both variants have transparent backgrounds. The generation script (`scripts/generate-rank-badges.ts`) produces both by default. You can generate just one variant: `npx tsx scripts/generate-rank-badges.ts <rank-id> icon` or `npx tsx scripts/generate-rank-badges.ts <rank-id> full`.

The `RankBadge` component (`src/components/scoring/RankBadge.tsx`) accepts a `variant` prop (`"icon"` or `"full"`) to switch between them. Always use this component rather than a raw `<img>` tag.

The Rank type has two image fields:
- `badgeImg` — path to the icon variant
- `badgeImgFull` — path to the full variant with scroll

---

## Reference Files

- Rank definitions: `src/lib/scoring.ts`
- Rank type: `src/types/scoring.ts`
- RankBadge component: `src/components/scoring/RankBadge.tsx`
- Badge generation script: `scripts/generate-rank-badges.ts`
- Badge images: `public/ranks/`
- Places ranks are rendered:
  - Homepage profile section: `src/app/page.tsx` (RankBadge full variant + emoji rocket progression in BadgeRow)
  - Results page: `src/app/results/page.tsx` (RankBadge full variant)
  - Celebration overlay: `src/components/scoring/CelebrationOverlay.tsx` (RankBadge full variant for rank-ups)
- The BadgeRow progress milestones use a rocket journey emoji sequence (🚀🌍🌙☄️⭐🌌) with connecting trail lines, not rank badge images
