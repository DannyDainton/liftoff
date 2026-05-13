import { ValidatorFn } from "@/types/validation";
import { getWorkspace } from "@/lib/postman-api";

export const validateTestEnvironment: ValidatorFn = async (
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
  const environments = workspace.environments || [];

  const testEnv = environments.find(
    (e: { name: string }) =>
      e.name.trim().toLowerCase() === "artemis.test"
  );

  if (!testEnv) {
    return {
      success: false,
      message:
        'No "artemis.test" environment found. Create it with baseUrl set to https://artemis.up.railway.app.',
      pointsAwarded: 0,
    };
  }

  return {
    success: true,
    message:
      'Test environment "artemis.test" found! Run your collection with the Collection Runner to verify.',
    pointsAwarded: 10,
    context,
  };
};
