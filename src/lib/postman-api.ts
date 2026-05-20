const BASE_URL = "https://api.getpostman.com";

async function postmanFetch(path: string, apiKey: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-api-key": apiKey, "User-Agent": "LiftOff/1.0 (quickstarts.postman.com)" },
  });
  if (!res.ok) {
    throw new Error(`Postman API ${path} returned ${res.status}`);
  }
  return res.json();
}

export interface PostmanUser {
  id: number;
  username: string;
}

export interface PostmanWorkspace {
  id: string;
  name: string;
  type: string;
  createdBy?: string;
}

export interface PostmanCollection {
  id: string;
  name: string;
  uid: string;
}

export interface PostmanEnvironment {
  id: string;
  name: string;
  uid: string;
  owner?: string;
}

export interface PostmanEnvironmentVariable {
  key: string;
  value: string;
  type: string;
  enabled: boolean;
}

export async function getMe(apiKey: string): Promise<PostmanUser> {
  const data = await postmanFetch("/me", apiKey);
  return data.user;
}

export async function listWorkspaces(
  apiKey: string
): Promise<PostmanWorkspace[]> {
  const data = await postmanFetch("/workspaces", apiKey);
  return data.workspaces || [];
}

export async function getWorkspace(apiKey: string, workspaceId: string) {
  const data = await postmanFetch(`/workspaces/${workspaceId}`, apiKey);
  return data.workspace;
}

export async function listEnvironments(
  apiKey: string
): Promise<PostmanEnvironment[]> {
  const data = await postmanFetch("/environments", apiKey);
  return data.environments || [];
}

export async function getEnvironment(apiKey: string, environmentId: string) {
  const data = await postmanFetch(`/environments/${environmentId}`, apiKey);
  return data.environment;
}

export async function getCollection(apiKey: string, collectionUid: string) {
  const data = await postmanFetch(`/collections/${collectionUid}`, apiKey);
  return data.collection;
}