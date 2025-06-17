import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

interface PermissionSelectionScreenProps {
  onPermissionSelected: (scope: 'public' | 'full') => void;
  onBack: () => void;
  targetRepo?: string;
  isPrivateRepo?: boolean;
}

export function PermissionSelectionScreen({ onPermissionSelected, onBack, targetRepo, isPrivateRepo }: PermissionSelectionScreenProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-gray-900">
          Choose Repository Access Level
        </h2>
        <p className="text-gray-600 mt-2">
          Select the level of access you want to grant to bsComment Editor.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {targetRepo && (
          <Alert variant="info">
            <p className="mb-2">
              <strong>Target Repository:</strong> {targetRepo}
            </p>
            <p>
              Unfortunately, GitHub OAuth cannot restrict access to just this repository. 
              You can choose the minimum permissions needed below.
            </p>
          </Alert>
        )}

        {isPrivateRepo && (
          <Alert variant="warning">
            <p>
              <strong>Private Repository Detected:</strong> This repository appears to be private. 
              You'll need "All Repositories" access to edit private repositories.
            </p>
          </Alert>
        )}

        {/* Public Repositories Option */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Public Repositories Only
              </h3>
              <p className="text-gray-600 mb-4">
                Access only your public repositories. This is the most privacy-friendly option.
              </p>
              <div className="text-sm text-gray-500">
                <p className="mb-2"><strong>Permissions granted:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Read and write access to public repositories</li>
                  <li>Your email address (for commit attribution)</li>
                </ul>
              </div>
              <Button 
                onClick={() => onPermissionSelected('public')} 
                className="mt-4"
                variant="primary"
                disabled={isPrivateRepo}
              >
                Use Public Access Only
              </Button>
              {isPrivateRepo && (
                <p className="text-sm text-gray-500 mt-2">
                  Not available for private repositories
                </p>
              )}
            </div>
          </div>
        </div>

        {/* All Repositories Option */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                All Repositories
              </h3>
              <p className="text-gray-600 mb-4">
                Access both public and private repositories. Choose this if you need to edit private repository files.
              </p>
              <div className="text-sm text-gray-500">
                <p className="mb-2"><strong>Permissions granted:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Read and write access to all repositories</li>
                  <li>Your email address (for commit attribution)</li>
                </ul>
              </div>
              <Button 
                onClick={() => onPermissionSelected('full')} 
                className="mt-4"
                variant="secondary"
              >
                Use Full Access
              </Button>
            </div>
          </div>
        </div>

        <Alert variant="warning">
          <p>
            <strong>Note:</strong> You can revoke these permissions anytime in your GitHub settings under 
            "Applications" → "Authorized OAuth Apps".
          </p>
        </Alert>
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