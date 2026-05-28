import { ValidatorFn } from "@/types/validation";
import { listWorkspaces, getWorkspace } from "@/lib/postman-api";

export const validateReusableRequestsCreateWorkspace: ValidatorFn = async (apiKey, context) => {
  const workspaces = await listWorkspaces(apiKey);

  const candidates = workspaces.filter((ws) => {
    const match = ws.name.match(/^Reusable\s+Requests\s*-\s*(.+)$/i);
    return match && match[1].trim().length > 0;
  });

  if (candidates.length === 0) {
    return {
      success: false,
      message: 'No workspace found matching "Reusable Requests - [your name]". Make sure the name starts with "Reusable Requests - " followed by your name.',
      pointsAwarded: 0,
    };
  }

  for (const ws of candidates) {
    const detail = await getWorkspace(apiKey, ws.id);
    if (context.userId && detail.createdBy === context.userId) {
      return {
        success: true,
        message: `Workspace "${ws.name}" found and verified as yours!`,
        pointsAwarded: 10,
        context: { ...context, workspaceId: ws.id, reusableRequestsWorkspaceId: ws.id },
      };
    }
  }

  return {
    success: false,
    message: 'Found "Reusable Requests" workspace(s) but none were created by you. Create your own blank workspace named "Reusable Requests - [your name]".',
    pointsAwarded: 0,
  };
};
