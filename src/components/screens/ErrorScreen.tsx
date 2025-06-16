import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

interface ErrorScreenProps {
  error: string;
  onRetry?: () => void;
  onStartOver: () => void;
  showRetry?: boolean;
}

export function ErrorScreen({ error, onRetry, onStartOver, showRetry = false }: ErrorScreenProps) {
  const getErrorSuggestions = (errorMessage: string): string[] => {
    const suggestions: string[] = [];
    
    if (errorMessage.toLowerCase().includes('fetch')) {
      suggestions.push('Verify the URL is correct and accessible');
      suggestions.push('Check if the website allows cross-origin requests');
      suggestions.push('Try accessing the URL directly in your browser');
    }
    
    if (errorMessage.toLowerCase().includes('metadata')) {
      suggestions.push('Ensure the HTML file contains the required bsComment meta tags');
      suggestions.push('Check that all required metadata fields are present');
      suggestions.push('Verify the repository URL format in the metadata');
    }
    
    if (errorMessage.toLowerCase().includes('authentication') || errorMessage.toLowerCase().includes('denied')) {
      suggestions.push('Try authenticating with GitHub again');
      suggestions.push('Check that you have access to the repository');
      suggestions.push('Verify your GitHub permissions');
    }
    
    if (errorMessage.toLowerCase().includes('rate limit')) {
      suggestions.push('Wait a few minutes before trying again');
      suggestions.push('GitHub API rate limits reset hourly');
    }
    
    if (errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('404')) {
      suggestions.push('Check that the repository and file path are correct');
      suggestions.push('Verify the file exists in the repository');
      suggestions.push('Ensure the repository is not private (unless you have access)');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('Check your internet connection');
      suggestions.push('Try refreshing the page');
      suggestions.push('Contact support if the problem persists');
    }
    
    return suggestions;
  };

  const suggestions = getErrorSuggestions(error);
  const isTemporaryError = error.toLowerCase().includes('rate limit') || 
                           error.toLowerCase().includes('network') ||
                           error.toLowerCase().includes('timeout');

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Something Went Wrong
          </h2>
          <p className="text-gray-600 mt-2">
            We encountered an error while processing your request.
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <Alert variant="error" className="mb-6">
          <p className="font-medium mb-2">Error Details:</p>
          <p className="text-sm">{error}</p>
        </Alert>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Troubleshooting Steps
          </h3>
          
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        {isTemporaryError && (
          <Alert variant="warning" className="mt-6">
            <p>
              <strong>This appears to be a temporary issue.</strong> 
              Please wait a few minutes and try again.
            </p>
          </Alert>
        )}

        <Alert variant="info" className="mt-6">
          <p className="mb-2">
            <strong>Need Help?</strong>
          </p>
          <p className="text-sm">
            If you continue to experience issues, please check the project documentation 
            or contact support with the error details above.
          </p>
        </Alert>
      </CardContent>
      
      <CardFooter>
        <div className="flex justify-center gap-4">
          {showRetry && onRetry && (
            <Button onClick={onRetry} variant="secondary">
              Try Again
            </Button>
          )}
          <Button onClick={onStartOver}>
            Start Over
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}