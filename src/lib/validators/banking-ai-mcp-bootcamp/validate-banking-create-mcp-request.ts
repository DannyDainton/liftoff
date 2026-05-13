import { ValidatorFn } from "@/types/validation";

export const validateBankingCreateMcpRequest: ValidatorFn = async (_apiKey, context) => {
  return {
    success: true,
    message: "Self-verified: You confirmed an MCP Request exists in the workspace with the correct URL and Bearer Token authentication.",
    pointsAwarded: 10,
    context,
  };
};
