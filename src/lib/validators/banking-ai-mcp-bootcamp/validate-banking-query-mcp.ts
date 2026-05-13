import { ValidatorFn } from "@/types/validation";

export const validateBankingQueryMcp: ValidatorFn = async (_apiKey, context) => {
  return {
    success: true,
    message: "Self-verified: You confirmed a successful response from the MCP server containing your collection data.",
    pointsAwarded: 10,
    context,
  };
};
