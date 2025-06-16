# Instructions for Claude: Building bsComment Editor React App

## Context
You are being asked to build the bsComment Editor application based on the detailed specification document that was provided. This is a React application that allows users to edit HTML files on GitHub through metadata-driven identification.

## Your Task
Create a complete, functional React application that implements all the features described in the bsComment Editor documentation. The app should be production-ready and follow modern React best practices.

## Key Requirements

### Technical Stack (Must Use)
- **React 18** with TypeScript
- **Vite** as the build tool
- **Tailwind CSS** for styling
- **GitHub Device Flow** for authentication (no server-side code)
- Environment variables using `VITE_` prefix
- Fetch API for HTTP requests

### Core Functionality to Implement
1. **URL Input & HTML Loading** - Fetch HTML from user-provided URL
2. **Metadata Extraction** - Parse bsComment meta tags from HTML
3. **GitHub Device Flow Authentication** - Complete OAuth flow
4. **File Editing** - Add timestamp comment before `</body>` tag
5. **Error Handling** - Comprehensive error states and user feedback

### Required Screens/Components
1. URL Input Screen
2. Metadata Review Screen  
3. GitHub Authentication Screen (Device Flow)
4. Edit Confirmation Screen
5. Success/Results Screen
6. Error Screen

### Authentication Implementation
- Use the `useGitHubAuth` hook pattern shown in the documentation
- Implement complete Device Flow with polling
- Handle all error states (pending, expired, denied, etc.)
- Store tokens in sessionStorage

### GitHub API Integration
- Read files from repositories using GitHub REST API
- Write files back with timestamp comments
- Handle rate limits and API errors gracefully
- Use proper commit messages and attribution

## File Structure to Create
```
src/
├── components/
│   ├── screens/          # Screen components
│   ├── ui/              # Reusable UI components  
│   └── layout/          # Layout components
├── hooks/
│   ├── useGitHubAuth.ts # GitHub authentication
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

## Important Implementation Notes

### Metadata Extraction
Parse these exact meta tags from HTML:
```html
<meta name="markpub:repo" content="https://github.com/peterkaminski/">
<meta name="markpub:filepath" content="/touch-me/touch-me.html">
<meta name="markpub:generated" content="2025-06-16T15:54:05-07:00">
<meta name="markpub:generator" content="bsComment v1.2.8">
```

### File Editing Specification
- Add HTML comment with current timestamp
- Insert comment immediately before `</body>` tag
- Format: `<!-- bsComment Editor: Updated YYYY-MM-DDTHH:mm:ss-TZ -->`
- Preserve all existing file content

### User Experience Requirements
- Loading states for all async operations
- Clear error messages with actionable guidance
- Responsive design using Tailwind CSS
- Accessible components with proper ARIA labels
- Smooth transitions between screens

### Environment Variables
Set up for these variables:
```bash
VITE_GITHUB_CLIENT_ID=your_client_id_here
```

## Styling Guidelines
- Use Tailwind CSS utility classes
- Implement a clean, modern design
- Ensure mobile responsiveness
- Use consistent spacing and typography
- Include loading spinners and visual feedback

## Error Handling Requirements
Handle these specific error scenarios:
- Invalid or inaccessible URLs
- Missing or malformed metadata
- GitHub authentication failures
- Repository access denied
- API rate limit exceeded
- Network connectivity issues

## Testing Considerations
- Include basic input validation
- Test with various URL formats
- Handle edge cases in metadata parsing
- Verify GitHub API error responses
- Test Device Flow timeout scenarios

## Deliverables
1. Complete React application with all components
2. Proper TypeScript definitions
3. Tailwind CSS configuration
4. Vite configuration
5. Package.json with all dependencies
6. README with setup instructions
7. Example .env file

## Success Criteria
- User can input a URL and load HTML content
- App correctly extracts bsComment metadata
- GitHub Device Flow authentication works end-to-end
- App successfully edits files on GitHub
- All error states are handled gracefully
- UI is responsive and accessible
- Code follows React best practices

## Notes for Implementation
- Focus on creating a polished, production-ready application
- Prioritize user experience and clear error messaging
- Implement proper loading states and feedback
- Use TypeScript strictly (no `any` types)
- Follow the architectural decisions in the specification
- Make the UI intuitive for non-technical users (bloggers)

Read the provided bsComment Editor documentation thoroughly before starting, and implement all features as specified. Ask for clarification if any requirements are unclear.