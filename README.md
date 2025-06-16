# bsComment Editor

A React single-page application that enables automated editing of HTML files hosted on GitHub repositories through metadata-driven identification and OAuth authentication.

## Features

- **Metadata-Driven Identification**: Automatically extracts repository and file information from bsComment metadata tags in HTML files
- **GitHub OAuth Authentication**: Secure authentication using GitHub Device Flow (no server required)
- **Automated File Editing**: Adds timestamp comments to HTML files before the `</body>` tag
- **Error Handling**: Comprehensive error states with helpful troubleshooting guidance
- **Responsive Design**: Clean, modern UI built with Tailwind CSS

## How It Works

1. **URL Input**: User provides URL to an HTML file containing bsComment metadata
2. **Metadata Extraction**: App parses the HTML to extract GitHub repository information
3. **GitHub Authentication**: User authenticates via GitHub Device Flow
4. **File Editing**: App reads the file from GitHub, adds a timestamp comment, and commits the change
5. **Success Confirmation**: User receives confirmation with links to view the updated file and commit

## Prerequisites

- Node.js 18+ and npm
- GitHub OAuth App (for authentication)

## Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd bscomment-editor
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create GitHub OAuth App**:
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App with:
     - Homepage URL: `http://localhost:5173` (for development)
     - Authorization callback URL: Not required for Device Flow
   - Copy the Client ID

4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your GitHub Client ID:
   ```
   VITE_GITHUB_CLIENT_ID=your_client_id_here
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to `http://localhost:5173`

## Required HTML Metadata Format

The HTML files must contain the following metadata tags:

```html
<meta name="bscomment:repo" content="https://github.com/owner/repo">
<meta name="bscomment:filepath" content="/path/to/file.html">
<meta name="bscomment:generated" content="2025-06-16T15:54:05-07:00">
<meta name="bscomment:generator" content="bsComment v1.2.8">
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **GitHub Device Flow** for authentication
- **GitHub REST API** for file operations

## Project Structure

```
src/
├── components/
│   ├── screens/          # Main screen components
│   ├── ui/              # Reusable UI components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── types/               # TypeScript type definitions
```

## License

This project is licensed under the MIT License.