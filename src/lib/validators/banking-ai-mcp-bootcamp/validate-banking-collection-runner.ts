import { ValidatorFn } from "@/types/validation";

export const validateBankingCollectionRunner: ValidatorFn = async (_apiKey, context) => {
  return {
    success: true,
    message: "Self-verified: You confirmed the Collection Runner executed successfully and all tests passed.",
    pointsAwarded: 10,
    context,
  };
};
