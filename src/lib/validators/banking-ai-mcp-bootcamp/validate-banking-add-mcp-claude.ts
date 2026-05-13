import { ValidatorFn } from "@/types/validation";

export const validateBankingAddMcpClaude: ValidatorFn = async (_apiKey, context) => {
  return {
    success: true,
    message: "Self-verified: You confirmed the Postman MCP server appears when running `claude mcp list`.",
    pointsAwarded: 10,
    context,
  };
};
