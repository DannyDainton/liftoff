import { ValidatorFn } from "@/types/validation";
import { getWorkspace, getCollection } from "@/lib/postman-api";

export const validateBankingGenerateTests: ValidatorFn = async (apiKey, context) => {
  if (!context.workspaceId) {
    return {
      success: false,
      message: "Please complete Step 1 first (create the workspace).",
      pointsAwarded: 0,
    };
  }

  const workspace = await getWorkspace(apiKey, context.workspaceId);
  const collections = workspace.collections || [];

  const bankingCollection = collections.find(
    (c: { name: string }) => /intergalactic\s+bank\s+api/i.test(c.name)
  );

  if (!bankingCollection) {
    return {
      success: false,
      message: "Banking API collection not found. Complete the earlier steps first.",
      pointsAwarded: 0,
    };
  }

  const collectionDetail = await getCollection(apiKey, bankingCollection.uid);
  const items = collectionDetail.item || [];

  let hasTests = false;

  function checkForTests(itemList: { event?: { listen: string; script?: { exec?: string[] } }[]; item?: unknown[] }[]) {
    for (const item of itemList) {
      if (item.event) {
        const testEvent = item.event.find((e) => e.listen === "test");
        if (testEvent?.script?.exec && testEvent.script.exec.length > 0) {
          const scriptContent = testEvent.script.exec.join("\n");
          if (/status/i.test(scriptContent) || /pm\.test/i.test(scriptContent)) {
            hasTests = true;
            return;
          }
        }
      }
      if (item.item) {
        checkForTests(item.item as typeof itemList);
      }
    }
  }

  checkForTests(items);

  if (!hasTests) {
    return {
      success: false,
      message:
        'No test scripts found in the collection. Use Agent Mode with the prompt: `Write tests for all the requests in this collection. Include only status code tests and response time tests.`',
      pointsAwarded: 0,
    };
  }

  return {
    success: true,
    message: "Test scripts found in the collection!",
    pointsAwarded: 10,
    context,
  };
};
