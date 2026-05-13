import { ValidatorFn } from "@/types/validation";
import { getWorkspace, getEnvironment } from "@/lib/postman-api";

export const validateBankingToAccount: ValidatorFn = async (apiKey, context) => {
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

  const toAccountVar = values.find(
    (v) => v.key.toLowerCase() === "toaccount"
  );

  if (!toAccountVar) {
    return {
      success: false,
      message:
        'Variable "toAccount" not found in Banking.local. Add the post-response script and send the toAccount request. Remember to click Share/Persist All.',
      pointsAwarded: 0,
    };
  }

  const effectiveValue = toAccountVar.current_value || toAccountVar.value;

  if (!effectiveValue || effectiveValue.trim() === "") {
    return {
      success: false,
      message:
        'Variable "toAccount" exists but is empty. Send the toAccount request to populate it, then click Share/Persist All.',
      pointsAwarded: 0,
    };
  }

  return {
    success: true,
    message: `Variable "toAccount" is set to "${effectiveValue}"!`,
    pointsAwarded: 10,
    context: { ...context, environmentId: bankingEnv.uid },
  };
};
