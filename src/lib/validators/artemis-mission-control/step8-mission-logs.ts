import { ValidatorFn } from "@/types/validation";
import { resolveEnvVar } from "@/lib/validators/env-helpers";
import { resolveArtemisEnvironment } from "./resolve-environment";

const ARTEMIS_API = "https://artemis.up.railway.app";

const REQUIRED_CATEGORIES = ["navigation", "life-support", "communication"];

export const validateMissionLogs: ValidatorFn = async (apiKey, context) => {
  const envResult = await resolveArtemisEnvironment(apiKey, context);
  if ("success" in envResult) return envResult;

  const apiKeyValue = resolveEnvVar(envResult.values, "apiKey");
  if (typeof apiKeyValue !== "string") return apiKeyValue;

  try {
    const res = await fetch(`${ARTEMIS_API}/logs`, {
      headers: { "x-api-key": apiKeyValue },
    });

    if (!res.ok) {
      return {
        success: false,
        message: `GET /logs returned ${res.status}.`,
        pointsAwarded: 0,
      };
    }

    const data = await res.json();
    const logs: { category?: string }[] = data.logs || [];

    if (logs.length < 3) {
      return {
        success: false,
        message: `Found ${logs.length} log(s) — you need at least 3. Create logs using POST /logs.`,
        pointsAwarded: 0,
      };
    }

    const categories = new Set(logs.map((l) => l.category?.toLowerCase()));
    const missing = REQUIRED_CATEGORIES.filter((c) => !categories.has(c));

    if (missing.length > 0) {
      return {
        success: false,
        message: `Found ${logs.length} logs but missing required categories: ${missing.join(", ")}. Create logs covering navigation, life-support, and communication to advance the mission.`,
        pointsAwarded: 0,
      };
    }

    return {
      success: true,
      message: `Found ${logs.length} mission logs across ${categories.size} categories — nice work!`,
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
