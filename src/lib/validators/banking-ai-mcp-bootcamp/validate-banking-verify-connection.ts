import { ValidatorFn } from "@/types/validation";

export const validateBankingVerifyConnection: ValidatorFn = async (_apiKey, context) => {
  return {
    success: true,
    message: "Self-verified: You confirmed you can see a list of your Postman workspaces via Claude.",
    pointsAwarded: 10,
    context,
  };
};
