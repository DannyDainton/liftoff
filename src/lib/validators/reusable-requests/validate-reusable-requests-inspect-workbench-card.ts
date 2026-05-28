import { ValidatorFn } from "@/types/validation";

export const validateReusableRequestsInspectWorkbenchCard: ValidatorFn = async (_apiKey, context) => {
  return {
    success: true,
    message: "Self-verified: You confirmed you observed the workbench card showing the link relationship between the source and linked copy.",
    pointsAwarded: 10,
    context,
  };
};
