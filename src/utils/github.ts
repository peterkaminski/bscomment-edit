import { 
  DeviceFlowResponse, 
  DeviceFlowTokenResponse, 
  GitHubFile, 
  GitHubUser, 
  GitHubCommitResponse,
  GitHubAPIError 
} from '../types';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

export async function initiateDeviceFlow(): Promise<DeviceFlowResponse> {
  const response = await fetch(`${GITHUB_API_BASE}/login/device/code`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      scope: 'repo user:email'
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to initiate device flow: ${response.statusText}`);
  }

  return response.json();
}

export async function pollForToken(deviceCode: string): Promise<DeviceFlowTokenResponse> {
  const response = await fetch(`${GITHUB_API_BASE}/login/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      device_code: deviceCode,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
    })
  });

  const data = await response.json();

  if (data.error) {
    if (data.error === 'authorization_pending') {
      throw new Error('AUTHORIZATION_PENDING');
    }
    if (data.error === 'slow_down') {
      throw new Error('SLOW_DOWN');
    }
    if (data.error === 'expired_token') {
      throw new Error('EXPIRED_TOKEN');
    }
    if (data.error === 'access_denied') {
      throw new Error('ACCESS_DENIED');
    }
    throw new Error(`Authentication failed: ${data.error_description || data.error}`);
  }

  return data;
}

export async function getCurrentUser(token: string): Promise<GitHubUser> {
  const response = await fetch(`${GITHUB_API_BASE}/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    }
  });

  if (!response.ok) {
    const error: GitHubAPIError = await response.json();
    throw new Error(`Failed to get user info: ${error.message}`);
  }

  return response.json();
}

export async function getFile(token: string, owner: string, repo: string, path: string): Promise<GitHubFile> {
  const encodedPath = encodeURIComponent(path.startsWith('/') ? path.slice(1) : path);
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodedPath}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    }
  });

  if (!response.ok) {
    const error: GitHubAPIError = await response.json();
    if (response.status === 404) {
      throw new Error(`File not found: ${path}`);
    }
    if (response.status === 403) {
      throw new Error('Access denied. Please check repository permissions.');
    }
    throw new Error(`Failed to get file: ${error.message}`);
  }

  return response.json();
}

export async function updateFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  content: string,
  sha: string,
  commitMessage: string
): Promise<GitHubCommitResponse> {
  const encodedPath = encodeURIComponent(path.startsWith('/') ? path.slice(1) : path);
  const encodedContent = btoa(unescape(encodeURIComponent(content)));

  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodedPath}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: commitMessage,
      content: encodedContent,
      sha: sha,
    })
  });

  if (!response.ok) {
    const error: GitHubAPIError = await response.json();
    if (response.status === 403) {
      throw new Error('Access denied. Please check repository permissions.');
    }
    if (response.status === 409) {
      throw new Error('File has been modified by someone else. Please refresh and try again.');
    }
    throw new Error(`Failed to update file: ${error.message}`);
  }

  const result = await response.json();
  return result.commit;
}

export function isRateLimited(error: GitHubAPIError): boolean {
  return error.status === 403 && error.message.includes('rate limit');
}