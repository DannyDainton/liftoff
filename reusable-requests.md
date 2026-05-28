# Reusable Requests in Postman

Stop copying and pasting the same request across collections. Learn how to define a request once and reference it anywhere — both visually with **linked copies** and programmatically with **`pm.execution.runRequest()`** — turning your collections from isolated request lists into a connected, maintainable API toolkit.

## Part 1: Set Up Your Workspace

Before you can reuse requests, you need a workspace and a source request that other collections and scripts can reference.

### Step 1: Create a Workspace

1. Open Postman and click **Workspaces** in the top nav, then **Create Workspace**.
2. Choose **Blank workspace**.
3. Name it: **Reusable Requests - [your name]** (for example, *Reusable Requests - Alex*).
4. Set visibility to **Personal** and click **Create**.

This workspace will hold your source collection and the collections that reuse its requests.

**Validation:** A workspace whose name starts with "Reusable Requests -" exists and was created by the current user.

### Step 2: Create the Source Collection and Request

1. Inside your workspace, click **New** → **Collection**.
2. Name the collection: **Core Requests**.
3. Click **Add a request** and configure it as follows:
   - Name: **Get Coffees**
   - Method: **GET**
   - URL: `https://api.sampleapis.com/coffee/hot`
4. Click **Save**, then **Send** to verify you receive a `200 OK` response with an array of coffee objects.

This is the source of truth. Everything else in this module references this request rather than duplicating it.

**Validation:** A collection named "Core Requests" exists in the workspace and contains a GET request named "Get Coffees" with the URL `https://api.sampleapis.com/coffee/hot`.

## Part 2: Reuse Requests with Linked Copies

Linked copies let you reference a single source request from multiple collections. Updates to the source automatically propagate to every linked copy, so you maintain one request instead of many — perfect for regression suites, scenario collections, and team-specific variants.

### Step 1: Create a Regression Collection

1. In your workspace, click **New** → **Collection**.
2. Name it: **Regression Suite**.
3. Optionally add a description like "Linked copies of core requests for regression testing."

In the next step you'll add a linked copy of **Get Coffees** here, instead of duplicating it.

**Validation:** A collection named "Regression Suite" exists in the workspace.

### Step 2: Paste a Linked Copy

1. In the **Core Requests** collection, click the **⋯ View more actions** icon next to **Get Coffees**.
2. Select **Copy**.
3. In the **Regression Suite** collection, click the **⋯ View more actions** icon.
4. Select **Paste** → **Paste linked copy**.
5. The **Get Coffees** request should now appear inside **Regression Suite**.

> **Alternative:** hold **⌘+Drag** (Mac) or **Ctrl+Drag** (Windows/Linux) to drag the request directly from Core Requests into Regression Suite to create a linked copy in place.

**Validation:** The "Regression Suite" collection contains a request named "Get Coffees".

### Step 3: Inspect the Workbench Card

1. Open the linked **Get Coffees** request inside **Regression Suite**.
2. Locate the **workbench card** next to the request name — it shows the source request and any other linked copies.
3. Open the original **Get Coffees** in **Core Requests** and confirm its workbench card shows the total count of linked copies.

> **Note:** Linked copies stay in sync with their source by design. On a Postman Enterprise plan, you can override the name, query parameters, body, and scripts on the linked copy without losing the link — and reset overrides from the workbench card if you want to go back to the source's defaults.

**Validation:** [MANUAL] Learner has opened both the source and linked copy and observed the workbench card showing the link relationship.

## Part 3: Reuse Requests in Scripts with runRequest

`pm.execution.runRequest()` lets you invoke any request in your workspace from inside a pre-request or post-response script. Use it for auth token generation, setup/teardown tasks, and dynamic workflows — without creating hard dependencies between collections.

### Step 1: Add a Token-Fetching Request

1. In the **Core Requests** collection, click **Add a request**.
2. Configure the request:
   - Name: **Get Auth Token**
   - Method: **GET**
   - URL: `https://postman-echo.com/get?token=demo-token-123`
3. Click **Save**, then **Send** and confirm a `200 OK` response. The response body should include `"token": "demo-token-123"` inside the `args` object.

This stands in as a reusable auth request you'll invoke from another request's script.

**Validation:** The "Core Requests" collection contains a GET request named "Get Auth Token".

### Step 2: Copy the Request ID

1. Open **Get Auth Token**.
2. In the right sidebar, click the **ⓘ Info** icon.
3. Click **Copy request ID** and paste it somewhere temporary — you'll need it in the next step.

> **Heads up:** Postman doesn't preserve request IDs when you export a collection. If you import a collection that uses `runRequest`, you'll need to update the IDs.

**Validation:** [MANUAL] Learner has copied the request ID of the "Get Auth Token" request.

### Step 3: Call runRequest From a Post-Response Script

1. Open the **Get Coffees** request in **Core Requests**.
2. Click the **Scripts** tab, then select **Post-response**.
3. Add the following script, replacing `YOUR_REQUEST_ID` with the ID you copied in Step 2:

       try {
           const response = await pm.execution.runRequest("YOUR_REQUEST_ID");
           const body = response.json();
           const token = body.args.token;

           pm.environment.set("authToken", token);
           console.log("Token captured:", token);
       } catch (error) {
           console.error("Failed to run referenced request:", error);
       }

4. Click **Save**.
5. Make sure you have an active environment selected (top right). If you don't, create one called **Reusable Requests Env** and select it.
6. Click **Send** on **Get Coffees**.
7. Open the **Postman Console** (bottom left) and confirm you see `Token captured: demo-token-123`.
8. Open your environment and confirm an `authToken` variable now holds `demo-token-123`.

> **Things to know:** `pm.execution.runRequest()` is only supported in the Postman app and the Postman CLI — **not** in Newman or the VS Code extension. Also, `pm.execution.setNextRequest()` and `pm.visualizer` do not run inside the referenced request.

**Validation:** The "Get Coffees" request in "Core Requests" has a post-response script that calls `pm.execution.runRequest` and sets an environment variable.

### Step 4: Override Variables at Runtime

You can override variables on the referenced request at the point of invocation, without modifying the source.

1. Edit the **Get Auth Token** request URL to use a variable: `https://postman-echo.com/get?token={{token}}`. Click **Save**.
2. Back in **Get Coffees**, update the post-response script to pass an override:

       try {
           const response = await pm.execution.runRequest("YOUR_REQUEST_ID", {
               variables: {
                   token: "override-token-456"
               }
           });
           const body = response.json();
           console.log("Token used:", body.args.token);
       } catch (error) {
           console.error("Failed to run referenced request:", error);
       }

3. Save and **Send** **Get Coffees** again.
4. In the Postman Console, you should now see `Token used: override-token-456`, proving the override worked at runtime without touching the source request.

> **Variable priority:** override values > local > data > environment > referenced request's collection > root request's collection > global.

**Validation:** [MANUAL] Learner has run the request and observed the override token value in the Postman Console.
