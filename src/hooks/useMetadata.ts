import { useState, useCallback } from 'react';
import { ParsedMetadata } from '../types';
import { extractMetadataFromHtml, parseMetadata } from '../utils/metadata';
import { validateUrl } from '../utils/validation';

export function useMetadata() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAndParseMetadata = useCallback(async (url: string): Promise<ParsedMetadata | null> => {
    const urlValidation = validateUrl(url);
    if (!urlValidation.isValid) {
      setError(urlValidation.error || 'Invalid URL');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch HTML: ${response.status} ${response.statusText}`);
      }

      const htmlContent = await response.text();
      
      const metadata = extractMetadataFromHtml(htmlContent);
      if (!metadata) {
        throw new Error('No bsComment metadata found in the HTML file. Please ensure the file contains the required meta tags.');
      }

      const parsedMetadata = parseMetadata(metadata);
      if (!parsedMetadata) {
        throw new Error('Failed to parse metadata');
      }

      setIsLoading(false);
      return parsedMetadata;
    } catch (error) {
      let errorMessage = 'Failed to fetch or parse metadata';
      
      if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorMessage = 'Unable to access the URL. Please check if the URL is correct and accessible.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    fetchAndParseMetadata,
    clearError
  };
}