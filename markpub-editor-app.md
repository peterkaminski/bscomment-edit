# bsComment Editor

## Overview

bsComment Editor is a web application that enables automated editing of HTML files hosted on GitHub repositories through metadata-driven identification and OAuth authentication.

## How It Works

The application follows a simple four-step process to locate and edit HTML files on GitHub:

### 1. URL Input & HTML Loading
The user provides a URL pointing to an HTML file. The application fetches and loads the HTML content from the specified URL.

### 2. Metadata Extraction
The app scans the HTML document for specific metadata tags that identify the corresponding GitHub repository and file path:

```html
<meta name="bscomment:repo" content="https://github.com/peterkaminski/">
<meta name="markpub:filepath" content="/touch-me/touch-me.html">
<meta name="markpub:generated" content="2025-06-16T15:54:05-07:00">
<meta name="markpub:generator" content="bsComment v1.2.8">
```

The application specifically uses:
- `markpub:repo` - The GitHub repository URL
- `markpub:filepath` - The relative path to the file within the repository

### 3. GitHub Authentication
Using OAuth, the application provides a user-friendly "Login with GitHub" experience that's familiar to non-technical users. This eliminates the need for users to manually create or manage Personal Access Tokens, making the app accessible to general bloggers and content creators without technical expertise.

### 4. File Modification
Once authenticated, the app performs a proof-of-concept edit by:
- Locating the target file using the extracted metadata
- Adding an HTML comment with the current date and timestamp
- Inserting the comment immediately before the closing `</body>` tag
- Committing the changes to the repository

### 5. Confirmation
The application displays a confirmation message indicating that the task has been completed successfully.

## Key Features

- **Metadata-Driven**: Automatically identifies target files through embedded HTML metadata
- **OAuth Integration**: Secure authentication with GitHub
- **Minimal Editing**: Non-intrusive proof-of-concept modifications
- **Real-Time Feedback**: Clear confirmation of successful operations

## Use Cases

bsComment Editor is ideal for:
- Content management systems that need to update generated HTML files
- Automated publishing workflows
- Batch processing of HTML documents with embedded metadata
- Integration testing of GitHub API functionality

## Code Examples

### Retrieving Metadata
The application uses JavaScript to extract metadata from the HTML document:

```javascript
const repo = document.querySelector('meta[name="markpub:repo"]').content;
const filepath = document.querySelector('meta[name="markpub:filepath"]').content;
const generated = document.querySelector('meta[name="markpub:generated"]').content;
const generator = document.querySelector('meta[name="markpub:generator"]').content;
```

### Error Handling
For more robust metadata retrieval:

```javascript
const repoMeta = document.querySelector('meta[name="markpub:repo"]');
const repo = repoMeta ? repoMeta.content : null;

if (!repo) {
    console.error('bsComment repository metadata not found');
}
```

## Technical Requirements

- Web browser with OAuth support
- GitHub account with repository access
- HTML files containing valid bsComment metadata tags
- Network connectivity to both the source URL and GitHub

## Application Screens

### 1. URL Input Screen
- Input field for entering the HTML file URL
- "Load URL" button to fetch and analyze the HTML
- Basic validation to ensure URL format is correct
- Loading indicator while fetching content

### 2. Metadata Review Screen
- Display extracted metadata in a readable format:
  - Repository URL
  - File path
  - Generation timestamp
  - Generator version
- Error message if required metadata is missing
- "Continue" button to proceed with authentication
- "Back" button to return to URL input

### 3. GitHub Authentication Screen
- **Device Flow login** explanation for users
- "Start GitHub Login" button to initiate device flow
- Display of the device code that GitHub provides
- Instructions to visit GitHub's device authorization page
- "Open GitHub" button/link to device authorization URL
- Polling indicator showing "Waiting for authorization..."
- Automatic progression once user completes authorization on GitHub

### 4. Edit Confirmation Screen
- Summary of the action to be performed:
  - Target repository and file
  - Description of the edit (timestamp comment)
  - Preview of the comment to be added
- "Execute Edit" button to perform the modification
- "Cancel" button to abort the operation

### 5. Success/Results Screen
- Confirmation that the edit was completed successfully
- Link to view the modified file on GitHub
- Timestamp of when the edit was made
- "Edit Another File" button to start over
- Option to view the commit details

### 6. Error Screen
- Clear error messages for various failure scenarios:
  - URL not accessible
  - Missing or invalid metadata
  - Authentication failures
  - GitHub API errors
- Suggested next steps for resolution
- "Try Again" button to retry the operation

## Architecture & Technology Stack

bsComment Editor is built as a **React single-page application (SPA)** served from a static website with no server-side components.

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Deployment**: Netlify
- **State Management**: React Context API or Zustand
- **HTTP Client**: Fetch API with custom hooks
- **GitHub Integration**: GitHub REST API v4

### Architecture Benefits
- **Simple deployment** - Static hosting with automatic builds
- **No server maintenance** - Pure client-side application
- **Fast loading** - Static assets served via CDN
- **Easy development** - Hot module replacement with Vite
- **Type safety** - TypeScript for better developer experience

## Developer Setup - GitHub OAuth Configuration (Static App)

Since this is a static React app with no server-side code, GitHub OAuth implementation requires special consideration for the client secret. We have chosen the **GitHub Device Flow** approach, though a **Serverless Function Proxy** could be used as an alternative.

### GitHub Device Flow (Selected Approach)
GitHub's Device Flow allows OAuth without exposing client secrets:
- User initiates login and receives a device code
- User enters code on GitHub's device activation page
- App polls GitHub API until user completes authorization
- **Pros**: No client secret needed, fully secure, keeps app purely static
- **Cons**: Slightly more complex UX (user visits separate page)

### Alternative: Serverless Function Proxy
If a more traditional OAuth flow is preferred:
- Deploy a single serverless function (Netlify/Vercel) to exchange codes for tokens
- React app calls your function instead of GitHub directly
- **Pros**: Traditional OAuth flow, familiar UX
- **Cons**: Adds minimal server-side component

### Implementation (Device Flow)

#### 1. Register GitHub OAuth App
1. Navigate to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: "bsComment Editor"
   - **Homepage URL**: Your static site URL (e.g., `https://markpub-editor.netlify.app`)
   - **Application description**: "Automated HTML file editor for bsComment-generated content"
   - **Authorization callback URL**: Not needed for Device Flow

#### 2. Environment Variables (Vite)
```bash
# .env
VITE_GITHUB_CLIENT_ID=your_public_client_id_here
```

Note: Vite uses `VITE_` prefix for environment variables exposed to the client.

#### 3. Complete Device Flow Implementation
```javascript
// hooks/useGitHubAuth.js
import { useState, useEffect } from 'react';

export const useGitHubAuth = () => {
  const [authState, setAuthState] = useState({
    isLoading: false,
    isAuthenticated: false,
    accessToken: null,
    error: null,
    deviceCode: null,
    userCode: null,
    verificationUri: null
  });

  const startDeviceFlow = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('https://github.com/login/device/code', {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
          scope: 'repo user:email'
        })
      });

      const data = await response.json();
      
      setAuthState(prev => ({
        ...prev,
        deviceCode: data.device_code,
        userCode: data.user_code,
        verificationUri: data.verification_uri,
        isLoading: false
      }));

      // Start polling for completion
      pollForCompletion(data.device_code, data.interval || 5);
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        error: 'Failed to start authentication', 
        isLoading: false 
      }));
    }
  };

  const pollForCompletion = async (deviceCode, interval) => {
    const poll = async () => {
      try {
        const response = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
            device_code: deviceCode,
            grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
          })
        });

        const data = await response.json();

        if (data.access_token) {
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: true,
            accessToken: data.access_token,
            isLoading: false
          }));
          return;
        }

        if (data.error === 'authorization_pending') {
          // Continue polling
          setTimeout(poll, interval * 1000);
        } else {
          setAuthState(prev => ({ 
            ...prev, 
            error: data.error_description || 'Authentication failed',
            isLoading: false
          }));
        }
      } catch (error) {
        setAuthState(prev => ({ 
          ...prev, 
          error: 'Network error during authentication',
          isLoading: false
        }));
      }
    };

    poll();
  };

  return { ...authState, startDeviceFlow };
};
```

### Development Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- GitHub account for OAuth app registration
- Netlify account for deployment

### Local Development
```bash
# Clone and setup
git clone <repository-url>
cd markpub-editor
npm install

# Environment setup
cp .env.example .env
# Add your GitHub Client ID to .env

# Start development server
npm run dev
```

### Project Structure
```
src/
├── components/        # React components
├── hooks/            # Custom hooks (useGitHubAuth, etc.)
├── utils/            # Helper functions
├── types/            # TypeScript type definitions
└── App.tsx           # Main application component
```

## Deployment to Netlify

### Automatic Deployment
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Add environment variables in Netlify dashboard:
   - `VITE_GITHUB_CLIENT_ID`: Your GitHub OAuth app client ID
4. Enable automatic deployments from main branch

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy to Netlify (with Netlify CLI)
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Netlify Configuration
Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Rate Limits & Performance

### GitHub API Considerations
- **Device Flow Polling**: Respect the interval returned by GitHub (usually 5 seconds)
- **API Rate Limits**: 5,000 requests per hour for authenticated users
- **Error Handling**: Implement exponential backoff for API failures
- **Token Storage**: Store access tokens securely in browser storage with appropriate expiration

### Performance Optimizations
- **Code Splitting**: Use React.lazy() for route-based splitting
- **Caching**: Cache GitHub API responses where appropriate
- **Bundle Size**: Tree-shake unused dependencies, especially Tailwind CSS

- Never expose the client secret in frontend JavaScript
- Store access tokens securely (encrypted, server-side)
- Implement proper token refresh logic
- Use HTTPS for all OAuth redirect URLs
- Validate the `state` parameter to prevent CSRF attacks

## Permissions & User Experience

### Why Repository Access is Needed
The app requests `repo` scope to:
- **Read HTML files** from public and private repositories
- **Write timestamp comments** to demonstrate editing capability
- **Commit changes** with proper attribution

Users will see a GitHub authorization screen explaining these permissions before granting access.

### User-Friendly Error Messages
- **"Metadata not found"**: Clear instructions on required meta tags
- **"Repository not accessible"**: Guidance on repository permissions
- **"Authentication expired"**: Simple re-authentication flow
- **"GitHub API unavailable"**: Helpful retry suggestions

## Security Considerations

### Static App Security
- **No client secret exposure** - Device Flow eliminates this risk
- **Token storage** - Access tokens stored in sessionStorage (cleared on browser close)
- **HTTPS enforcement** - All GitHub API calls use secure connections
- **Input validation** - Sanitize all user inputs and URLs
- **Rate limit handling** - Prevent abuse through proper throttling

### GitHub Integration Security
- **Minimal permissions** - Only request necessary scopes
- **Token expiration** - Handle token refresh gracefully
- **Audit trail** - All edits include timestamp and attribution
- **Repository validation** - Verify repository access before attempting edits

## Troubleshooting

### Common Issues

**Authentication Problems**
- Ensure GitHub Client ID is correctly set in environment variables
- Check that users complete the device flow within the time limit
- Verify repository permissions if file editing fails

**Metadata Extraction**
- Confirm HTML contains all required bsComment meta tags
- Check for typos in meta tag names or content
- Validate that repository URLs are accessible

**Build/Deployment Issues**
- Ensure all environment variables are set in Netlify
- Check that build command matches package.json scripts
- Verify Tailwind CSS is properly configured for production builds