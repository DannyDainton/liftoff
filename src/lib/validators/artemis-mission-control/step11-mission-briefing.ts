import { ValidatorFn } from "@/types/validation";
import { getEnvironment } from "@/lib/postman-api";

const ARTEMIS_API = "https://artemis.up.railway.app";

export const validateMissionBriefing: ValidatorFn = async (
  apiKey,
  context
) => {
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
    const steps = data.steps || data.mission_steps || [];
    const briefingStep = steps.find(
      (s: { name: string; completed: boolean }) =>
        s.name?.toLowerCase().includes("brief") && s.completed
    );

    if (briefingStep) {
      return {
        success: true,
        message: "Mission briefing completed!",
        pointsAwarded: 10,
        context,
      };
    }

    return {
      success: false,
      message:
        'No mission briefing detected. Send POST /mission/brief with body `{}`.',
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
