import { ValidatorFn } from "@/types/validation";
import { getEnvironment } from "@/lib/postman-api";

export const validateEnvironmentValues: ValidatorFn = async (
  apiKey,
  context
) => {
  if (!context.environmentId) {
    return {
      success: false,
      message: "Please complete Step 3 first (create the environment).",
      pointsAwarded: 0,
    };
  }

  const envDetail = await getEnvironment(apiKey, context.environmentId);
  const values: { key: string; value: string; current_value?: string; type: string }[] =
    envDetail.values || [];

  const baseUrl = values.find(
    (v) => v.key.toLowerCase() === "baseurl"
  );
  const apiKeyVar = values.find(
    (v) => v.key.toLowerCase() === "apikey"
  );

  const issues: string[] = [];

  if (!baseUrl) {
    issues.push("baseUrl variable not found");
  } else {
    const effectiveValue = baseUrl.current_value || baseUrl.value;
    if (effectiveValue !== "https://artemis.up.railway.app") {
      issues.push(
        `baseUrl is "${effectiveValue}" — should be exactly "https://artemis.up.railway.app"`
      );
    }
  }

  if (!apiKeyVar) {
    issues.push("apiKey variable not found");
  } else if (apiKeyVar.type !== "secret") {
    issues.push(
      `apiKey type is "${apiKeyVar.type}" — should be marked as "secret" in Postman`
    );
  }

  if (issues.length > 0) {
    return {
      success: false,
      message: `Not quite right: ${issues.join("; ")}`,
      pointsAwarded: 0,
    };
  }

  return {
    success: true,
    message:
      "Environment configured correctly! baseUrl is set to the Artemis API and apiKey is marked as secret.",
    pointsAwarded: 10,
    context,
  };
};
