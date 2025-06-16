import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ParsedMetadata } from '../../types';
import { useGitHubAPI } from '../../hooks/useGitHubAPI';
import { useGitHubAuth } from '../../hooks/useGitHubAuth';
import { addTimestampComment } from '../../utils/metadata';

interface EditConfirmationScreenProps {
  metadata: ParsedMetadata;
  onEditComplete: (commitUrl: string) => void;
  onBack: () => void;
}

export function EditConfirmationScreen({ metadata, onEditComplete, onBack }: EditConfirmationScreenProps) {
  const { token, user } = useGitHubAuth();
  const { isLoading, error, fetchFile, updateFileContent, clearError } = useGitHubAPI(token);
  const [originalContent, setOriginalContent] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');
  const [fileSha, setFileSha] = useState<string>('');
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadFile = async () => {
      if (!token || isFileLoaded) return;

      const file = await fetchFile(metadata.owner, metadata.repoName, metadata.filePath);
      if (file) {
        const content = atob(file.content);
        setOriginalContent(content);
        setEditedContent(addTimestampComment(content));
        setFileSha(file.sha);
        setIsFileLoaded(true);
      }
    };

    loadFile();
  }, [token, metadata, fetchFile, isFileLoaded]);

  const handleConfirmEdit = async () => {
    if (!token || !user) return;

    setIsEditing(true);
    clearError();

    const commitMessage = `bsComment Editor: Updated ${metadata.filePath}

Updated by ${user.name || user.login} via bsComment Editor`;

    const commit = await updateFileContent(
      metadata.owner,
      metadata.repoName,
      metadata.filePath,
      editedContent,
      fileSha,
      commitMessage
    );

    if (commit) {
      onEditComplete(commit.html_url);
    }
    setIsEditing(false);
  };

  const previewLines = editedContent.split('\n');
  const commentIndex = previewLines.findIndex(line => line.includes('bsComment Editor: Updated'));
  const previewStart = Math.max(0, commentIndex - 3);
  const previewEnd = Math.min(previewLines.length, commentIndex + 4);
  const preview = previewLines.slice(previewStart, previewEnd);

  if (isLoading && !isFileLoaded) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading file from GitHub...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-gray-900">
          Confirm Edit
        </h2>
        <p className="text-gray-600 mt-2">
          Review the changes that will be made to your file.
        </p>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              File Information
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
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Changes to be Made
            </h3>
            
            <Alert variant="info" className="mb-4">
              <p>
                A timestamp comment will be added before the closing <code>&lt;/body&gt;</code> tag.
              </p>
            </Alert>

            <div className="bg-white rounded border p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Preview (showing lines around the change):
              </h4>
              <pre className="text-xs text-gray-900 overflow-x-auto">
                {preview.map((line, index) => (
                  <div 
                    key={index} 
                    className={`${line.includes('bsComment Editor: Updated') ? 'bg-green-100 text-green-800' : ''}`}
                  >
                    {line.includes('bsComment Editor: Updated') && (
                      <span className="text-green-600 font-medium">+ </span>
                    )}
                    {line}
                  </div>
                ))}
              </pre>
            </div>
          </div>

          <Alert variant="warning">
            <p className="mb-2">
              <strong>Important:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>This will create a new commit in your repository</li>
              <li>The change will be immediately visible on GitHub</li>
              <li>Make sure you have the necessary permissions to edit this repository</li>
            </ul>
          </Alert>
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="flex justify-between">
          <Button variant="secondary" onClick={onBack} disabled={isEditing}>
            Back
          </Button>
          <Button 
            onClick={handleConfirmEdit}
            isLoading={isEditing}
            disabled={!originalContent || isEditing}
          >
            {isEditing ? 'Updating File...' : 'Confirm & Update File'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}