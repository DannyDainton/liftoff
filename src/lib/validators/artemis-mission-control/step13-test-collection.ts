import { ValidatorFn } from "@/types/validation";
import { getWorkspace } from "@/lib/postman-api";

export const validateTestCollection: ValidatorFn = async (
  apiKey,
  context
) => {
  if (!context.workspaceId) {
    return {
      success: false,
      message: "Please complete Step 1 first (create the workspace).",
      pointsAwarded: 0,
    };
  }

  const workspace = await getWorkspace(apiKey, context.workspaceId);
  const collections = workspace.collections || [];

  // Look for a test/integration collection (separate from the main API collection)
  const testCollection = collections.find(
    (c: { name: string }) =>
      c.name.toLowerCase().includes("test") ||
      c.name.toLowerCase().includes("integration")
  );

  if (testCollection) {
    return {
      success: true,
      message: `Test collection "${testCollection.name}" found in your workspace!`,
      pointsAwarded: 10,
      context,
    };
  }

  if (collections.length >= 2) {
    return {
      success: true,
      message: `Found ${collections.length} collections in your workspace — looks like you've created your test suite!`,
      pointsAwarded: 10,
      context,
    };
  }

  return {
    success: false,
    message:
      "No integration test collection found. Use Agent Mode to generate an end-to-end test collection.",
    pointsAwarded: 0,
  };
};
