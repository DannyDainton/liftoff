import { ValidatorFn } from "@/types/validation";
import { getWorkspace, getEnvironment } from "@/lib/postman-api";

export const validateBankingSetApiKey: ValidatorFn = async (apiKey, context) => {
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
      message: 'Environment "Banking.local" not found. Complete the previous steps first.',
      pointsAwarded: 0,
    };
  }

  const envDetail = await getEnvironment(apiKey, bankingEnv.uid);
  const values: { key: string; value: string; current_value?: string }[] =
    envDetail.values || [];

  const apiKeyVar = values.find(
    (v) => v.key.toLowerCase() === "apikey"
  );

  if (!apiKeyVar) {
    return {
      success: false,
      message:
        'Variable "apiKey" not found in Banking.local. Send the Generate API Key request and ensure the value is saved. Remember to click Share/Persist All.',
      pointsAwarded: 0,
    };
  }

  const effectiveValue = apiKeyVar.current_value || apiKeyVar.value;

  if (!effectiveValue || effectiveValue.trim() === "") {
    return {
      success: false,
      message:
        'Variable "apiKey" exists but is empty. Send the Generate API Key request and click Share/Persist All to sync the value.',
      pointsAwarded: 0,
    };
  }

  return {
    success: true,
    message: 'Variable "apiKey" is set in Banking.local!',
    pointsAwarded: 10,
    context: { ...context, environmentId: bankingEnv.uid },
  };
};
