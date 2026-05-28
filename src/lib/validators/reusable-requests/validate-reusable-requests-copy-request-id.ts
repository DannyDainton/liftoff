import { ValidatorFn } from "@/types/validation";

export const validateReusableRequestsCopyRequestId: ValidatorFn = async (_apiKey, context) => {
  return {
    success: true,
    message: "Self-verified: You confirmed you copied the request ID of the \"Get Auth Token\" request.",
    pointsAwarded: 10,
    context,
  };
};
