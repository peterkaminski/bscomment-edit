import { useState, useCallback } from 'react';
import { GitHubFile, GitHubCommitResponse } from '../types';
import { getFile, updateFile } from '../utils/github';

export function useGitHubAPI(token: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFile = useCallback(async (
    owner: string, 
    repo: string, 
    path: string
  ): Promise<GitHubFile | null> => {
    if (!token) {
      setError('No authentication token available');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const file = await getFile(token, owner, repo, path);
      setIsLoading(false);
      return file;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch file';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, [token]);

  const updateFileContent = useCallback(async (
    owner: string,
    repo: string,
    path: string,
    content: string,
    sha: string,
    commitMessage: string
  ): Promise<GitHubCommitResponse | null> => {
    if (!token) {
      setError('No authentication token available');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const commit = await updateFile(token, owner, repo, path, content, sha, commitMessage);
      setIsLoading(false);
      return commit;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update file';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, [token]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    fetchFile,
    updateFileContent,
    clearError
  };
}