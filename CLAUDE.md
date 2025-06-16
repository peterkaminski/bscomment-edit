# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

bsComment Editor is a React single-page application that enables automated editing of HTML files hosted on GitHub repositories through metadata-driven identification and OAuth authentication. Users input a URL to an HTML file, the app extracts bsComment metadata tags to locate the corresponding GitHub repository and file path, authenticates via GitHub Device Flow, and performs proof-of-concept edits.

## Required Technology Stack

- **React 18** with TypeScript (strict mode - no `any` types)
- **Vite** as the build tool
- **Tailwind CSS** for styling  
- **GitHub Device Flow** for authentication (no server-side code)
- **Environment variables** using `VITE_` prefix
- **Fetch API** for HTTP requests

## Project Structure

```
src/
├── components/
│   ├── screens/          # Screen components (6 screens total)
│   ├── ui/              # Reusable UI components  
│   └── layout/          # Layout components
├── hooks/
│   ├── useGitHubAuth.ts # GitHub Device Flow authentication
│   ├── useGitHubAPI.ts  # GitHub API operations
│   └── useMetadata.ts   # HTML metadata extraction
├── utils/
│   ├── github.ts        # GitHub API helpers
│   ├── metadata.ts      # Metadata parsing utilities
│   └── validation.ts    # Input validation
├── types/
│   └── index.ts         # TypeScript definitions
├── App.tsx
└── main.tsx
```

## Core Application Flow

1. **URL Input Screen** - User provides HTML file URL
2. **Metadata Review Screen** - Display extracted bsComment metadata
3. **GitHub Authentication Screen** - Device Flow login with polling
4. **Edit Confirmation Screen** - Confirm timestamp comment addition
5. **Success/Results Screen** - Confirmation and GitHub link
6. **Error Screen** - Comprehensive error handling

## Critical Implementation Details

### Metadata Extraction
Parse these exact meta tags from HTML:
```html
<meta name="markpub:repo" content="https://github.com/peterkaminski/">
<meta name="markpub:filepath" content="/touch-me/touch-me.html">
<meta name="markpub:generated" content="2025-06-16T15:54:05-07:00">
<meta name="markpub:generator" content="bsComment v1.2.8">
```

### File Editing Specification
- Add HTML comment with current timestamp before `</body>` tag
- Format: `<!-- bsComment Editor: Updated YYYY-MM-DDTHH:mm:ss-TZ -->`
- Preserve all existing file content

### GitHub Device Flow Authentication
- Use polling pattern with 5-second intervals
- Store tokens in sessionStorage
- Handle authorization_pending, expired, and denied states
- Request `repo user:email` scopes

## Environment Variables
```bash
VITE_GITHUB_CLIENT_ID=your_client_id_here
```

## Error Handling Requirements
Handle these specific scenarios:
- Invalid or inaccessible URLs
- Missing or malformed bsComment metadata
- GitHub authentication failures  
- Repository access denied
- API rate limit exceeded
- Network connectivity issues

## Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Implementation Notes
- This is a static app with no server-side components
- Focus on production-ready, polished user experience
- Target non-technical users (bloggers)
- Implement proper loading states and visual feedback
- Use strict TypeScript throughout
- Mobile-responsive design with Tailwind CSS
- All GitHub API calls should include proper error handling and rate limiting