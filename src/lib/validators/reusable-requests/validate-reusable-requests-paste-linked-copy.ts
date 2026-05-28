import { ValidatorFn } from "@/types/validation";
import { resolveWorkspace } from "@/lib/validators/resolve-workspace";
import { getCollection } from "@/lib/postman-api";

type CollectionItem = {
  name?: string;
  request?: unknown;
  item?: CollectionItem[];
};

function collectRequestNames(items: CollectionItem[]): string[] {
  const names: string[] = [];
  for (const item of items) {
    if (item.request && item.name) names.push(item.name);
    if (item.item) names.push(...collectRequestNames(item.item));
  }
  return names;
}

export const validateReusableRequestsPasteLinkedCopy: ValidatorFn = async (apiKey, context) => {
  const ws = await resolveWorkspace(
    apiKey,
    context,
    context.reusableRequestsWorkspaceId,
    /^Reusable\s+Requests\s*-\s*.+$/i,
    "Reusable Requests - [your name]"
  );
  if ("error" in ws) return ws.error;

  const workspace = ws.detail as Record<string, unknown>;
  const collections = (workspace.collections as { name: string; uid: string }[]) || [];

  const regressionSuite = collections.find((c) => c.name.toLowerCase() === "regression suite");

  if (!regressionSuite) {
    return {
      success: false,
      message: 'No "Regression Suite" collection found. Complete Step 1 first.',
      pointsAwarded: 0,
    };
  }

  const detail = await getCollection(apiKey, regressionSuite.uid);
  const requestNames = collectRequestNames(detail.item || []);
  const hasCoffees = requestNames.some((name) => /get\s+coffees/i.test(name));

  if (!hasCoffees) {
    return {
      success: false,
      message: 'The "Regression Suite" collection exists but doesn\'t contain a "Get Coffees" request. Paste a linked copy from the "Core Requests" collection.',
      pointsAwarded: 0,
    };
  }

  return {
    success: true,
    message: '"Get Coffees" is linked into "Regression Suite"!',
    pointsAwarded: 10,
    context,
  };
};
