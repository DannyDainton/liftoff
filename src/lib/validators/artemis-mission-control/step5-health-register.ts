import { ValidatorFn } from "@/types/validation";
import { resolveEnvVar } from "@/lib/validators/env-helpers";
import { resolveArtemisEnvironment } from "./resolve-environment";

const ARTEMIS_API = "https://artemis.up.railway.app";

export const validateHealthAndRegister: ValidatorFn = async (
  apiKey,
  context
) => {
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
  const envResult = await resolveArtemisEnvironment(apiKey, context);
  if ("success" in envResult) return envResult;

  const apiKeyValue = resolveEnvVar(
    envResult.values,
    "apiKey",
    "API is running but no `apiKey` variable found. Register with POST /register using your name and email, then save the returned API key."
  );
  if (typeof apiKeyValue !== "string") return apiKeyValue;

  return {
    success: true,
    message: "Health check passed and API key is saved from registration!",
    pointsAwarded: 10,
    context,
  };
};
