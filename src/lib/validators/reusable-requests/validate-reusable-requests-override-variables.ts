import { ValidatorFn } from "@/types/validation";

export const validateReusableRequestsOverrideVariables: ValidatorFn = async (_apiKey, context) => {
  return {
    success: true,
    message: "Self-verified: You confirmed you observed the override token value (`override-token-456`) in the Postman Console.",
    pointsAwarded: 10,
    context,
  };
};
