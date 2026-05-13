import { ValidatorFn } from "@/types/validation";
import { getWorkspace, getEnvironment } from "@/lib/postman-api";

export const validateBankingFromAccount: ValidatorFn = async (apiKey, context) => {
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

  const fromAccountVar = values.find(
    (v) => v.key.toLowerCase() === "fromaccount"
  );

  if (!fromAccountVar) {
    return {
      success: false,
      message:
        'Variable "fromAccount" not found in Banking.local. Add the post-response script and send the fromAccount request. Remember to click Share/Persist All.',
      pointsAwarded: 0,
    };
  }

  const effectiveValue = fromAccountVar.current_value || fromAccountVar.value;

  if (!effectiveValue || effectiveValue.trim() === "") {
    return {
      success: false,
      message:
        'Variable "fromAccount" exists but is empty. Send the fromAccount request to populate it, then click Share/Persist All.',
      pointsAwarded: 0,
    };
  }

  return {
    success: true,
    message: `Variable "fromAccount" is set to "${effectiveValue}"!`,
    pointsAwarded: 10,
    context: { ...context, environmentId: bankingEnv.uid },
  };
};
