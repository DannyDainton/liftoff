import { ValidatorFn } from "@/types/validation";
import { resolveWorkspace } from "@/lib/validators/resolve-workspace";
import { getCollection } from "@/lib/postman-api";

type CollectionEvent = {
  listen?: string;
  script?: { exec?: string[] };
};

type CollectionItem = {
  name?: string;
  request?: unknown;
  event?: CollectionEvent[];
  item?: CollectionItem[];
};

function findRequest(items: CollectionItem[], namePat: RegExp): CollectionItem | undefined {
  for (const item of items) {
    if (item.request && item.name && namePat.test(item.name)) return item;
    if (item.item) {
      const found = findRequest(item.item, namePat);
      if (found) return found;
    }
  }
  return undefined;
}

export const validateReusableRequestsCallRunRequest: ValidatorFn = async (apiKey, context) => {
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
      message: 'No "Core Requests" collection found. Complete Part 1 first.',
      pointsAwarded: 0,
    };
  }

  const detail = await getCollection(apiKey, coreCollection.uid);
  const getCoffees = findRequest(detail.item || [], /get\s+coffees/i);

  if (!getCoffees) {
    return {
      success: false,
      message: '"Get Coffees" request not found in "Core Requests". Complete Part 1, Step 2 first.',
      pointsAwarded: 0,
    };
  }

  const events: CollectionEvent[] = getCoffees.event || [];
  const testEvent = events.find((e) => e.listen === "test");

  if (!testEvent?.script?.exec) {
    return {
      success: false,
      message: '"Get Coffees" has no post-response (test) script. Add the script from the Step 3 instructions.',
      pointsAwarded: 0,
    };
  }

  const scriptText = testEvent.script.exec.join("\n");

  if (!scriptText.includes("pm.execution.runRequest")) {
    return {
      success: false,
      message: "The post-response script on \"Get Coffees\" doesn't call `pm.execution.runRequest`. Make sure you added the script from the Step 3 instructions.",
      pointsAwarded: 0,
    };
  }

  if (!scriptText.includes("pm.environment.set")) {
    return {
      success: false,
      message: "The script calls `pm.execution.runRequest` but doesn't call `pm.environment.set` to save the token. Add the full script from the Step 3 instructions.",
      pointsAwarded: 0,
    };
  }

  return {
    success: true,
    message: '"Get Coffees" has a post-response script that calls `pm.execution.runRequest` and saves the token to the environment!',
    pointsAwarded: 10,
    context,
  };
};
