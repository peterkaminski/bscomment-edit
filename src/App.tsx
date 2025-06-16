import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { UrlInputScreen } from './components/screens/UrlInputScreen';
import { MetadataReviewScreen } from './components/screens/MetadataReviewScreen';
import { GitHubAuthScreen } from './components/screens/GitHubAuthScreen';
import { EditConfirmationScreen } from './components/screens/EditConfirmationScreen';
import { SuccessScreen } from './components/screens/SuccessScreen';
import { ErrorScreen } from './components/screens/ErrorScreen';
import { useMetadata } from './hooks/useMetadata';
import { AppScreen, ParsedMetadata } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('url-input');
  const [url, setUrl] = useState('');
  const [metadata, setMetadata] = useState<ParsedMetadata | null>(null);
  const [commitUrl, setCommitUrl] = useState('');
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { 
    isLoading: isMetadataLoading, 
    error: metadataError, 
    fetchAndParseMetadata,
    clearError: clearMetadataError
  } = useMetadata();

  const handleUrlSubmit = async (submittedUrl: string) => {
    setUrl(submittedUrl);
    setGlobalError(null);
    clearMetadataError();

    const parsedMetadata = await fetchAndParseMetadata(submittedUrl);
    if (parsedMetadata) {
      setMetadata(parsedMetadata);
      setCurrentScreen('metadata-review');
    }
  };

  const handleMetadataContinue = () => {
    setCurrentScreen('github-auth');
  };

  const handleAuthenticationComplete = () => {
    setCurrentScreen('edit-confirmation');
  };

  const handleEditComplete = (newCommitUrl: string) => {
    setCommitUrl(newCommitUrl);
    setCurrentScreen('success');
  };

  const handleStartOver = () => {
    setCurrentScreen('url-input');
    setUrl('');
    setMetadata(null);
    setCommitUrl('');
    setGlobalError(null);
    clearMetadataError();
  };

  const handleBack = () => {
    switch (currentScreen) {
      case 'metadata-review':
        setCurrentScreen('url-input');
        break;
      case 'github-auth':
        setCurrentScreen('metadata-review');
        break;
      case 'edit-confirmation':
        setCurrentScreen('github-auth');
        break;
      default:
        break;
    }
  };

  const handleError = (error: string) => {
    setGlobalError(error);
    setCurrentScreen('error');
  };

  // Handle global errors
  if (metadataError && currentScreen === 'url-input') {
    return (
      <Layout>
        <ErrorScreen
          error={metadataError}
          onStartOver={handleStartOver}
          onRetry={() => {
            clearMetadataError();
            setCurrentScreen('url-input');
          }}
          showRetry={true}
        />
      </Layout>
    );
  }

  if (globalError || currentScreen === 'error') {
    return (
      <Layout>
        <ErrorScreen
          error={globalError || 'An unexpected error occurred'}
          onStartOver={handleStartOver}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      {currentScreen === 'url-input' && (
        <UrlInputScreen
          onUrlSubmit={handleUrlSubmit}
          isLoading={isMetadataLoading}
          error={metadataError}
        />
      )}

      {currentScreen === 'metadata-review' && metadata && (
        <MetadataReviewScreen
          metadata={metadata}
          onContinue={handleMetadataContinue}
          onBack={handleBack}
        />
      )}

      {currentScreen === 'github-auth' && (
        <GitHubAuthScreen
          onAuthenticated={handleAuthenticationComplete}
          onBack={handleBack}
        />
      )}

      {currentScreen === 'edit-confirmation' && metadata && (
        <EditConfirmationScreen
          metadata={metadata}
          onEditComplete={handleEditComplete}
          onBack={handleBack}
        />
      )}

      {currentScreen === 'success' && metadata && (
        <SuccessScreen
          metadata={metadata}
          commitUrl={commitUrl}
          onStartOver={handleStartOver}
        />
      )}
    </Layout>
  );
}

export default App;