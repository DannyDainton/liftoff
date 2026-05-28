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

export const validateReusableRequestsAddTokenRequest: ValidatorFn = async (apiKey, context) => {
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

  const coreCollection = collections.find((c) => c.name.toLowerCase() === "core requests");

  if (!coreCollection) {
    return {
      success: false,
      message: 'No "Core Requests" collection found. Complete Part 1, Step 2 first.',
      pointsAwarded: 0,
    };
  }

  const detail = await getCollection(apiKey, coreCollection.uid);
  const requestNames = collectRequestNames(detail.item || []);
  const hasAuthToken = requestNames.some((name) => /get\s+auth\s+token/i.test(name));

  if (!hasAuthToken) {
    return {
      success: false,
      message: 'The "Core Requests" collection doesn\'t contain a "Get Auth Token" request. Add a GET request named "Get Auth Token" to the collection.',
      pointsAwarded: 0,
    };
  }

  return {
    success: true,
    message: '"Get Auth Token" request found in "Core Requests"!',
    pointsAwarded: 10,
    context,
  };
};
