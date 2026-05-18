import { getWorkspace, getEnvironment } from "@/lib/postman-api";
import { ValidationContext, ValidationResult } from "@/types/validation";

export async function resolveArtemisEnvironment(
  apiKey: string,
  context: ValidationContext
): Promise<
  | { envId: string; values: { key: string; value: string; type?: string }[] }
  | ValidationResult
> {
  if (!context.workspaceId) {
    return {
      success: false,
      message: "Please complete Step 1 first (create the workspace).",
      pointsAwarded: 0,
    };
  }

  const workspace = await getWorkspace(apiKey, context.workspaceId);
  const wsEnvironments: { id: string; name: string; uid: string }[] =
    workspace.environments || [];

  const artemisEnv = wsEnvironments.find(
    (env) => env.name.trim().toLowerCase() === "artemis.local"
  );

  if (!artemisEnv) {
    return {
      success: false,
      message:
        'Environment "artemis.local" not found in your workspace. Please complete the environment step (Lesson 1, Step 3) first.',
      pointsAwarded: 0,
    };
  }

  const envDetail = await getEnvironment(apiKey, artemisEnv.uid);
  return { envId: artemisEnv.uid, values: envDetail.values || [] };
}
