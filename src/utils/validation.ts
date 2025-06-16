import { ValidationResult } from '../types';

export function validateUrl(url: string): ValidationResult {
  if (!url.trim()) {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
}

export function validateGitHubRepo(repoUrl: string): ValidationResult {
  if (!repoUrl.includes('github.com')) {
    return { isValid: false, error: 'Repository must be hosted on GitHub' };
  }

  const githubRepoPattern = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/?$/;
  if (!githubRepoPattern.test(repoUrl.replace(/\/$/, ''))) {
    return { isValid: false, error: 'Invalid GitHub repository URL format' };
  }

  return { isValid: true };
}

export function validateFilePath(filePath: string): ValidationResult {
  if (!filePath.trim()) {
    return { isValid: false, error: 'File path is required' };
  }

  if (!filePath.startsWith('/')) {
    return { isValid: false, error: 'File path must start with /' };
  }

  if (!filePath.toLowerCase().endsWith('.html')) {
    return { isValid: false, error: 'File must be an HTML file (.html)' };
  }

  return { isValid: true };
}