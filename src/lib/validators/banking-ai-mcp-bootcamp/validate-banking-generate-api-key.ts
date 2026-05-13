import { ValidatorFn } from "@/types/validation";

export const validateBankingGenerateApiKey: ValidatorFn = async (_apiKey, context) => {
  return {
    success: true,
    message: "Self-verified: You confirmed you have generated and saved a Postman API key.",
    pointsAwarded: 10,
    context,
  };
};
