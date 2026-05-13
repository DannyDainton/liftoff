import { ValidatorFn } from "@/types/validation";
import { getWorkspace, getEnvironment } from "@/lib/postman-api";

export const validateBankingSetBaseUrl: ValidatorFn = async (apiKey, context) => {
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
    return {
      success: false,
      message: 'Environment "Banking.local" not found. Complete the previous step first.',
      pointsAwarded: 0,
    };
  }

  const envDetail = await getEnvironment(apiKey, bankingEnv.uid);
  const values: { key: string; value: string; current_value?: string }[] =
    envDetail.values || [];

  const baseUrlVar = values.find(
    (v) => v.key.toLowerCase() === "baseurl"
  );

  if (!baseUrlVar) {
    return {
      success: false,
      message:
        'Variable "baseUrl" not found in Banking.local. Use Agent Mode to add it. Remember to click Share/Persist All after setting values.',
      pointsAwarded: 0,
    };
  }

  const effectiveValue = baseUrlVar.current_value || baseUrlVar.value;

  if (effectiveValue !== "https://ai-powered-bootcamp-production.up.railway.app") {
    return {
      success: false,
      message: `Variable "baseUrl" found but its value is "${effectiveValue}". Expected "https://ai-powered-bootcamp-production.up.railway.app". Remember to click Share/Persist All.`,
      pointsAwarded: 0,
    };
  }

  return {
    success: true,
    message: 'Variable "baseUrl" is correctly set!',
    pointsAwarded: 10,
    context: { ...context, environmentId: bankingEnv.uid },
  };
};
