import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { ParsedMetadata } from '../../types';

interface SuccessScreenProps {
  metadata: ParsedMetadata;
  commitUrl: string;
  onStartOver: () => void;
}

export function SuccessScreen({ metadata, commitUrl, onStartOver }: SuccessScreenProps) {
  const fileUrl = `https://github.com/${metadata.owner}/${metadata.repoName}/blob/main${metadata.filePath}`;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            File Successfully Updated!
          </h2>
          <p className="text-gray-600 mt-2">
            Your HTML file has been updated with a timestamp comment.
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <Alert variant="success" className="mb-6">
          <p>
            The file has been successfully updated and committed to your GitHub repository.
          </p>
        </Alert>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Updated File Details
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repository
                </label>
                <p className="text-sm text-gray-900">
                  {metadata.owner}/{metadata.repoName}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Path
                </label>
                <p className="text-sm text-gray-900 font-mono">
                  {metadata.filePath}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Updated At
                </label>
                <p className="text-sm text-gray-900">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => window.open(fileUrl, '_blank')}
              className="flex-1"
              variant="secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              View File on GitHub
            </Button>
            
            <Button 
              onClick={() => window.open(commitUrl, '_blank')}
              className="flex-1"
              variant="secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              View Commit
            </Button>
          </div>

          <Alert variant="info">
            <p className="mb-2">
              <strong>What happened:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>A timestamp comment was added to your HTML file</li>
              <li>The change was committed to your GitHub repository</li>
              <li>The file is now updated with the latest edit timestamp</li>
            </ul>
          </Alert>
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="flex justify-center">
          <Button onClick={onStartOver} size="lg">
            Edit Another File
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}