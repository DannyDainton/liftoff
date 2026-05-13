import { ValidatorFn } from "@/types/validation";
import { getEnvironment } from "@/lib/postman-api";

const ARTEMIS_API = "https://artemis.up.railway.app";

export const validateHealthAndRegister: ValidatorFn = async (
  apiKey,
  context
) => {
  if (!context.environmentId) {
    return {
      success: false,
      message: "Please complete the environment steps first (Lesson 1).",
      pointsAwarded: 0,
    };
  }

  // Check that the Artemis API is alive
  try {
    const healthRes = await fetch(`${ARTEMIS_API}/health`);
    if (!healthRes.ok) {
      return {
        success: false,
        message: "Artemis API health check failed. The API may be down.",
        pointsAwarded: 0,
      };
    }
  } catch {
    return {
      success: false,
      message: "Could not reach the Artemis API at " + ARTEMIS_API,
      pointsAwarded: 0,
    };
  }

  // Check that apiKey env variable now has a value (from registration)
  const envDetail = await getEnvironment(apiKey, context.environmentId);
  const values: { key: string; value: string; current_value?: string; type: string }[] =
    envDetail.values || [];

  const apiKeyVar = values.find(
    (v) => v.key.toLowerCase() === "apikey"
  );

  const apiKeyValue = apiKeyVar?.current_value || apiKeyVar?.value;
  if (!apiKeyVar || !apiKeyValue) {
    return {
      success: false,
      message:
        "API is running but your apiKey environment variable is empty. Register with POST /register using your name and email, then save the returned API key.",
      pointsAwarded: 0,
    };
  }

  return {
    success: true,
    message: "Health check passed and API key is saved from registration!",
    pointsAwarded: 10,
    context,
  };
};
