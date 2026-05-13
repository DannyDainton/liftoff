import { ValidatorFn } from "@/types/validation";
import { getWorkspace } from "@/lib/postman-api";

export const validateBankingCreateEnvironment: ValidatorFn = async (apiKey, context) => {
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

  const bankingEnv = wsEnvironments.find(
    (env) => env.name.trim().toLowerCase() === "banking.local"
  );

  if (!bankingEnv) {
    const envNames = wsEnvironments.map((e) => e.name).join(", ");
    return {
      success: false,
      message: envNames
        ? `Found environments (${envNames}) but none named "Banking.local". Use Agent Mode to create it.`
        : 'No environments found. Use Agent Mode with the prompt: `Create an Environment Variable file called Banking.local`',
      pointsAwarded: 0,
    };
  }

  return {
    success: true,
    message: `Environment "Banking.local" found in your workspace!`,
    pointsAwarded: 10,
    context: { ...context, environmentId: bankingEnv.uid },
  };
};
