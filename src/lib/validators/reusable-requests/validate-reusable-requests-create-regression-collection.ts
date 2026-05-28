import { ValidatorFn } from "@/types/validation";
import { resolveWorkspace } from "@/lib/validators/resolve-workspace";

export const validateReusableRequestsCreateRegressionCollection: ValidatorFn = async (apiKey, context) => {
  const ws = await resolveWorkspace(
    apiKey,
    context,
    context.reusableRequestsWorkspaceId,
    /^Reusable\s+Requests\s*-\s*.+$/i,
    "Reusable Requests - [your name]"
  );
  if ("error" in ws) return ws.error;

  const workspace = ws.detail as Record<string, unknown>;
  const collections = (workspace.collections as { name: string; uid: string }[]) || [];

  const regressionSuite = collections.find((c) => c.name.toLowerCase() === "regression suite");

  if (!regressionSuite) {
    if (collections.length > 0) {
      const names = collections.map((c) => c.name).join(", ");
      return {
        success: false,
        message: `Found collections (${names}) but none named "Regression Suite". Create a collection with that exact name.`,
        pointsAwarded: 0,
      };
    }
    return {
      success: false,
      message: 'No "Regression Suite" collection found. Create a new collection with that name.',
      pointsAwarded: 0,
    };
  }

  return {
    success: true,
    message: 'Collection "Regression Suite" found in your workspace!',
    pointsAwarded: 10,
    context,
  };
};
