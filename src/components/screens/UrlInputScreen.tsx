import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

interface UrlInputScreenProps {
  onUrlSubmit: (url: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function UrlInputScreen({ onUrlSubmit, isLoading = false, error }: UrlInputScreenProps) {
  const [url, setUrl] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setInputError('Please enter a URL');
      return;
    }

    try {
      new URL(url);
      setInputError(null);
      onUrlSubmit(url.trim());
    } catch {
      setInputError('Please enter a valid URL');
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (inputError) {
      setInputError(null);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-gray-900">
          Enter HTML File URL
        </h2>
        <p className="text-gray-600 mt-2">
          Provide the URL to an HTML file that contains bsComment metadata tags.
        </p>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}
        
        <Alert variant="info" className="mb-6">
          <p className="mb-2">
            <strong>Requirements:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>HTML file must be publicly accessible</li>
            <li>File must contain bsComment metadata tags</li>
            <li>Repository must be hosted on GitHub</li>
          </ul>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="url"
            label="HTML File URL"
            placeholder="https://example.com/path/to/file.html"
            value={url}
            onChange={handleUrlChange}
            error={inputError || undefined}
            isLoading={isLoading}
            autoFocus
          />
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              isLoading={isLoading}
              disabled={!url.trim()}
            >
              {isLoading ? 'Loading...' : 'Continue'}
            </Button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Expected Metadata Format:
          </h3>
          <pre className="text-xs text-gray-700 bg-white p-3 rounded border overflow-x-auto">
{`<meta name="bscomment:repo" content="https://github.com/owner/repo">
<meta name="bscomment:filepath" content="/path/to/file.html">
<meta name="bscomment:generated" content="2025-06-16T15:54:05-07:00">
<meta name="bscomment:generator" content="bsComment v1.2.8">`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}