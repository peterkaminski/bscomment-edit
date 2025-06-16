import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { ParsedMetadata } from '../../types';

interface MetadataReviewScreenProps {
  metadata: ParsedMetadata;
  onContinue: () => void;
  onBack: () => void;
}

export function MetadataReviewScreen({ metadata, onContinue, onBack }: MetadataReviewScreenProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-gray-900">
          Review Metadata
        </h2>
        <p className="text-gray-600 mt-2">
          Verify the extracted metadata before proceeding with authentication.
        </p>
      </CardHeader>
      
      <CardContent>
        <Alert variant="success" className="mb-6">
          Successfully extracted bsComment metadata from the HTML file.
        </Alert>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Repository Information
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repository URL
                </label>
                <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                  {metadata.repoUrl}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Owner
                  </label>
                  <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                    {metadata.owner}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repository
                  </label>
                  <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                    {metadata.repoName}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Path
                </label>
                <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                  {metadata.filePath}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Generation Information
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Generated Date
                </label>
                <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                  {new Date(metadata.generated).toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Generator
                </label>
                <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                  {metadata.generator}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Alert variant="info" className="mt-6">
          <p>
            <strong>Next Step:</strong> You will be prompted to authenticate with GitHub 
            to access the repository and edit the file.
          </p>
        </Alert>
      </CardContent>
      
      <CardFooter>
        <div className="flex justify-between">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onContinue}>
            Continue to Authentication
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}