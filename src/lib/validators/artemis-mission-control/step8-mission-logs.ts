import { ValidatorFn } from "@/types/validation";
import { getEnvironment } from "@/lib/postman-api";

const ARTEMIS_API = "https://artemis.up.railway.app";

export const validateMissionLogs: ValidatorFn = async (apiKey, context) => {
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

  if (!apiKeyVar || !apiKeyValue) {
    return {
      success: false,
      message: "apiKey not found in your environment.",
      pointsAwarded: 0,
    };
  }

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
    const logs = data.logs || data || [];

    if (!Array.isArray(logs) || logs.length < 3) {
      return {
        success: false,
        message: `Found ${Array.isArray(logs) ? logs.length : 0} logs — you need at least 3. Create logs using POST /logs.`,
        pointsAwarded: 0,
      };
    }

    return {
      success: true,
      message: `Found ${logs.length} mission logs — nice work!`,
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
