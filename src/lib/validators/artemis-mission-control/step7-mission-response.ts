import { ValidatorFn } from "@/types/validation";
import { resolveEnvVar } from "@/lib/validators/env-helpers";
import { resolveArtemisEnvironment } from "./resolve-environment";

const ARTEMIS_API = "https://artemis.up.railway.app";

export const validateMissionResponse: ValidatorFn = async (
  apiKey,
  context
) => {
  const envResult = await resolveArtemisEnvironment(apiKey, context);
  if ("success" in envResult) return envResult;

  const apiKeyValue = resolveEnvVar(
    envResult.values,
    "apiKey",
    "No `apiKey` found in your environment. Complete registration first."
  );
  if (typeof apiKeyValue !== "string") return apiKeyValue;

  try {
    const res = await fetch(`${ARTEMIS_API}/mission`, {
      headers: { "x-api-key": apiKeyValue },
    });

    if (!res.ok) {
      return {
        success: false,
        message: `GET /mission returned ${res.status}. Make sure your API key is valid.`,
        pointsAwarded: 0,
      };
    }

    const data = await res.json();
    if (data.callsign) {
      return {
        success: true,
        message: `Mission data retrieved! Callsign: ${data.callsign}. Now build your visualization in Agent Mode.`,
        pointsAwarded: 10,
        context,
      };
    }

    return {
      success: true,
      message: "GET /mission returned successfully!",
      pointsAwarded: 10,
      context,
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the Artemis API.",
      pointsAwarded: 0,
    };
  }
};
