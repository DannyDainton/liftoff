import { ValidatorFn } from "@/types/validation";
import { resolveWorkspace } from "@/lib/validators/resolve-workspace";
import { getCollection } from "@/lib/postman-api";

type CollectionItem = {
  name?: string;
  request?: { method?: string; url?: { raw?: string } | string };
  item?: CollectionItem[];
};

function collectRequests(items: CollectionItem[]): { name: string; method: string; url: string }[] {
  const requests: { name: string; method: string; url: string }[] = [];
  for (const item of items) {
    if (item.request && item.name) {
      const method = item.request.method?.toUpperCase() || "";
      const url =
        typeof item.request.url === "string"
          ? item.request.url
          : item.request.url?.raw || "";
      requests.push({ name: item.name, method, url });
    }
    if (item.item) requests.push(...collectRequests(item.item));
  }
  return requests;
}

export const validateReusableRequestsCreateSourceCollection: ValidatorFn = async (apiKey, context) => {
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
    if (collections.length > 0) {
      const names = collections.map((c) => c.name).join(", ");
      return {
        success: false,
        message: `Found collections (${names}) but none named "Core Requests". Create a collection with that exact name.`,
        pointsAwarded: 0,
      };
    }
    return {
      success: false,
      message: 'No collections found in your workspace. Create a new collection named "Core Requests".',
      pointsAwarded: 0,
    };
  }

  const detail = await getCollection(apiKey, coreCollection.uid);
  const requests = collectRequests(detail.item || []);

  const getCoffees = requests.find((r) => /get\s+coffees/i.test(r.name));

  if (!getCoffees) {
    return {
      success: false,
      message: 'Found the "Core Requests" collection but no request named "Get Coffees". Add a GET request with that name.',
      pointsAwarded: 0,
    };
  }

  if (getCoffees.method !== "GET") {
    return {
      success: false,
      message: `Found "Get Coffees" but it uses ${getCoffees.method} instead of GET. Set the method to GET.`,
      pointsAwarded: 0,
    };
  }

  if (!getCoffees.url.includes("api.sampleapis.com/coffee/hot")) {
    return {
      success: false,
      message: `Found "Get Coffees" but the URL is "${getCoffees.url}" instead of "https://api.sampleapis.com/coffee/hot". Check the URL.`,
      pointsAwarded: 0,
    };
  }

  return {
    success: true,
    message: 'Collection "Core Requests" found with the "Get Coffees" GET request configured correctly!',
    pointsAwarded: 10,
    context: { ...context, reusableRequestsWorkspaceId: ws.id },
  };
};
