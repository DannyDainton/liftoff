import { ValidatorFn } from "@/types/validation";
import { resolveEnvVar } from "@/lib/validators/env-helpers";
import { resolveArtemisEnvironment } from "./resolve-environment";

const ARTEMIS_API = "https://artemis.up.railway.app";

export const validateSplashdown: ValidatorFn = async (apiKey, context) => {
  const envResult = await resolveArtemisEnvironment(apiKey, context);
  if ("success" in envResult) return envResult;

  const apiKeyValue = resolveEnvVar(envResult.values, "apiKey");
  if (typeof apiKeyValue !== "string") return apiKeyValue;

  try {
    const [missionRes, briefRes] = await Promise.all([
      fetch(`${ARTEMIS_API}/mission`, {
        headers: { "x-api-key": apiKeyValue },
      }),
      fetch(`${ARTEMIS_API}/mission/brief`, {
        method: "POST",
        headers: {
          "x-api-key": apiKeyValue,
          "Content-Type": "application/json",
        },
        body: "{}",
      }),
    ]);

    if (!missionRes.ok) {
      return {
        success: false,
        message: `GET /mission returned ${missionRes.status}.`,
        pointsAwarded: 0,
      };
    }

    const mission = await missionRes.json();
    const completion =
      mission.mission_status?.completion_percentage ?? mission.completion_percentage;

    if (completion === 100) {
      return {
        success: true,
        message:
          "Splashdown confirmed! Mission completion at 100%. Outstanding work, crew member!",
        pointsAwarded: 10,
        context,
      };
    }

    const steps = mission.mission_status?.steps || [];
    const incomplete = steps
      .filter((s: { completed: boolean }) => !s.completed)
      .map((s: { label: string }) => s.label);

    let hint = `Mission at ${completion ?? "?"}% complete.`;

    if (briefRes.ok) {
      const briefData = await briefRes.json();
      const recs: string[] = briefData.briefing?.recommendations || [];
      if (recs.length > 0) {
        hint += " " + recs.join(" ");
      }
    }

    if (incomplete.length > 0) {
      hint += ` Remaining phases: ${incomplete.join(", ")}.`;
    }

    hint += " Create more logs across different categories (navigation, life-support, communication, science, crew-status) to advance the mission to 100%.";

    return {
      success: false,
      message: hint,
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
