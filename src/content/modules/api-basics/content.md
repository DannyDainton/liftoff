# API Basics

Learn the fundamentals of REST APIs using Postman.

## Part 1: Your First Request

Set up your workspace and make your first API call.

### Step 1: Create a Workspace

Sign in to Postman and create a new blank workspace.
Name it: **API Basics - [your name]**

**Validation:** Workspace named "API Basics - [name]" exists and was created by the current user.

### Step 2: Create a Collection

Create a new collection in your workspace called **My First Collection** and add a GET request to `https://api.sampleapis.com/coffee/hot`.

**Validation:** Collection named "My First Collection" exists in the workspace with at least one request.

### Step 3: Create an Environment

Create a new environment in your workspace called **Local** and add a variable called **baseURL** with the initial value `https://api.sampleapis.com`.

**Important:** After setting the value, click the **Share** button (or **Persist All**) in the environment editor to sync your values to the cloud. LiftOff validates via the Postman API, which can only see shared/initial values — not local current values.

**Validation:** Environment named "Local" exists in the workspace with a variable "baseURL" set to "https://api.sampleapis.com".

