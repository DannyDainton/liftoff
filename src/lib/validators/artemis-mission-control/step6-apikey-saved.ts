import { ValidatorFn } from "@/types/validation";
import { getEnvironment } from "@/lib/postman-api";

const ARTEMIS_API = "https://artemis.up.railway.app";

export const validateApiKeySaved: ValidatorFn = async (apiKey, context) => {
  if (!context.environmentId) {
    return {
      success: false,
      message: "Please complete the environment steps first (Lesson 1).",
      pointsAwarded: 0,
    };
  }

  const envDetail = await getEnvironment(apiKey, context.environmentId);
  const values: { key: string; value: string; current_value?: string }[] =
    envDetail.values || [];

  const apiKeyVar = values.find(
    (v) => v.key.toLowerCase() === "apikey"
  );

  const apiKeyValue = apiKeyVar?.current_value || apiKeyVar?.value;
  if (!apiKeyVar || !apiKeyValue) {
    return {
      success: false,
      message:
        "apiKey environment variable is empty. Register first, then save the key.",
      pointsAwarded: 0,
    };
  }

  // Verify the key works by calling GET /mission
  try {
    const res = await fetch(`${ARTEMIS_API}/mission`, {
      headers: { "x-api-key": apiKeyValue },
    });
    if (res.ok) {
      return {
        success: true,
        message:
          "API key is saved and working — GET /mission returned 200 OK!",
        pointsAwarded: 10,
        context,
      };
    }
    return {
      success: false,
      message: `GET /mission returned ${res.status}. Check that your apiKey is correct and the environment is selected.`,
      pointsAwarded: 0,
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the Artemis API to verify your key.",
      pointsAwarded: 0,
    };
  }
};
