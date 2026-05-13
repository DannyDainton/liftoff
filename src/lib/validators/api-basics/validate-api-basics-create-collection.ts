import { ValidatorFn } from "@/types/validation";
import { getWorkspace } from "@/lib/postman-api";

export const validateApiBasicsCreateCollection: ValidatorFn = async (apiKey, context) => {
  if (!context.workspaceId) {
    return {
      success: false,
      message: "Please complete Step 1 first (create the workspace).",
      pointsAwarded: 0,
    };
  }

  const workspace = await getWorkspace(apiKey, context.workspaceId);
  const collections = workspace.collections || [];

  const myCollection = collections.find(
    (c: { name: string }) => c.name.toLowerCase() === "my first collection"
  );

  if (!myCollection) {
    if (collections.length > 0) {
      const names = collections.map((c: { name: string }) => c.name).join(", ");
      return {
        success: false,
        message: `Found collections (${names}) but none named "My First Collection". Create a collection with that exact name.`,
        pointsAwarded: 0,
      };
    }
    return {
      success: false,
      message:
        'No collections found in your workspace. Create a new collection named "My First Collection".',
      pointsAwarded: 0,
    };
  }

  return {
    success: true,
    message: `Collection "${myCollection.name}" found in your workspace!`,
    pointsAwarded: 10,
    context,
  };
};
