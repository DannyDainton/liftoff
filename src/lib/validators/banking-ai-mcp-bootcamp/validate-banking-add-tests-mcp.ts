import { ValidatorFn } from "@/types/validation";

export const validateBankingAddTestsMcp: ValidatorFn = async (_apiKey, context) => {
  return {
    success: true,
    message: "Self-verified: You confirmed that tests were added and executed successfully via Claude and the MCP server.",
    pointsAwarded: 10,
    context,
  };
};
