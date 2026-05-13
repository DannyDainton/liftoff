import { ValidatorFn } from "@/types/validation";
import { getEnvironment } from "@/lib/postman-api";

const ARTEMIS_API = "https://artemis.up.railway.app";

export const validateSplashdown: ValidatorFn = async (apiKey, context) => {
  if (!context.environmentId) {
    return {
      success: false,
      message: "Please complete the environment steps first.",
      pointsAwarded: 0,
    };
  }

  const envDetail = await getEnvironment(apiKey, context.environmentId);
  const values: { key: string; value: string; current_value?: string }[] =
    envDetail.values || [];
  const apiKeyVar = values.find((v) => v.key.toLowerCase() === "apikey");
  const apiKeyValue = apiKeyVar?.current_value || apiKeyVar?.value;

  if (!apiKeyValue) {
    return { success: false, message: "apiKey not found.", pointsAwarded: 0 };
  }

  try {
    const res = await fetch(`${ARTEMIS_API}/mission`, {
      headers: { "x-api-key": apiKeyValue },
    });
    if (!res.ok) {
      return {
        success: false,
        message: `GET /mission returned ${res.status}.`,
        pointsAwarded: 0,
      };
    }

    const data = await res.json();
    const completion = data.completion_percentage ?? data.completionPercentage;

    if (completion === 100) {
      return {
        success: true,
        message:
          "Splashdown confirmed! Mission completion at 100%. Outstanding work, crew member!",
        pointsAwarded: 10,
        context,
      };
    }

    const steps = data.steps || data.mission_steps || [];
    const incomplete = steps.filter(
      (s: { completed: boolean }) => !s.completed
    );

    return {
      success: false,
      message: `Mission at ${completion ?? "?"}% complete. ${incomplete.length} step(s) remaining. Complete all mission steps and try again.`,
      pointsAwarded: 0,
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the Artemis API.",
      pointsAwarded: 0,
    };
  }
};
