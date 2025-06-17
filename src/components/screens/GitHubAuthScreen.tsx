import React, { useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useGitHubAuth } from '../../hooks/useGitHubAuth';

interface GitHubAuthScreenProps {
  onAuthenticated: () => void;
  onBack: () => void;
  scope?: string;
}

export function GitHubAuthScreen({ onAuthenticated, onBack, scope }: GitHubAuthScreenProps) {
  const {
    isAuthenticated,
    user,
    isLoading,
    error,
    deviceFlow,
    isPolling,
    startDeviceFlow,
    startPolling,
    clearError
  } = useGitHubAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      onAuthenticated();
    }
  }, [isAuthenticated, user, onAuthenticated]);

  const handleStartAuth = async () => {
    clearError();
    await startDeviceFlow(scope);
  };

  const handleStartPolling = () => {
    startPolling();
  };

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication status...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-gray-900">
          GitHub Authentication
        </h2>
        <p className="text-gray-600 mt-2">
          Authenticate with GitHub to access and edit your repository.
        </p>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {!deviceFlow && (
          <div className="text-center py-8">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Connect to GitHub
              </h3>
              <p className="text-gray-600 mb-6">
                You need to authenticate with GitHub to access and edit repository files.
              </p>
            </div>

            <Alert variant="info" className="mb-6">
              <p className="mb-2">
                <strong>Required Permissions:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Repository access (to read and write files)</li>
                <li>User email (for commit attribution)</li>
              </ul>
            </Alert>

            <Button onClick={handleStartAuth} size="lg">
              Authenticate with GitHub
            </Button>
          </div>
        )}

        {deviceFlow && !isPolling && (
          <div className="text-center py-8">
            <Alert variant="warning" className="mb-6">
              <p className="mb-4">
                <strong>Step 1:</strong> Go to GitHub and enter this code:
              </p>
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-yellow-300">
                <code className="text-2xl font-mono font-bold text-yellow-800">
                  {deviceFlow.user_code}
                </code>
              </div>
            </Alert>

            <div className="mb-6">
              <Button 
                onClick={() => window.open(deviceFlow.verification_uri, '_blank')}
                variant="primary"
                size="lg"
                className="mb-4"
              >
                Open GitHub Authentication
              </Button>
              <p className="text-sm text-gray-600">
                Or visit: <a href={deviceFlow.verification_uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {deviceFlow.verification_uri}
                </a>
              </p>
            </div>

            <Alert variant="info" className="mb-6">
              <p>
                After entering the code on GitHub, click the button below to complete authentication.
              </p>
            </Alert>

            <Button onClick={handleStartPolling} size="lg">
              I've Entered the Code
            </Button>
          </div>
        )}

        {isPolling && (
          <div className="text-center py-8">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Waiting for Authentication
            </h3>
            <p className="text-gray-600 mb-4">
              Please complete the authentication process on GitHub.
            </p>
            <Alert variant="info">
              <p>This will complete automatically once you authorize the application on GitHub.</p>
            </Alert>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <div className="flex justify-between">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}