export interface BsCommentMetadata {
  repo: string;
  filepath: string;
  generated: string;
  generator: string;
}

export interface ParsedMetadata {
  repoUrl: string;
  owner: string;
  repoName: string;
  filePath: string;
  generated: string;
  generator: string;
}

export interface GitHubAuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: GitHubUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
}

export interface DeviceFlowResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

export interface DeviceFlowTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export interface GitHubCommitResponse {
  sha: string;
  url: string;
  html_url: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  committer: {
    name: string;
    email: string;
    date: string;
  };
  message: string;
}

export type AppScreen = 
  | 'url-input'
  | 'metadata-review'
  | 'permission-selection'
  | 'github-auth'
  | 'edit-confirmation'
  | 'success'
  | 'error';

export interface AppState {
  currentScreen: AppScreen;
  url: string;
  htmlContent: string;
  metadata: ParsedMetadata | null;
  editedContent: string;
  commitUrl: string;
  error: string | null;
  isLoading: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface GitHubAPIError {
  message: string;
  status: number;
  documentation_url?: string;
}