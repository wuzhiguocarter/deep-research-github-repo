# GitHub DeepWiki Sidebar Extension

This Chrome extension enhances GitHub repository browsing by providing quick access to DeepWiki documentation in a sidebar.

## Features

- Detects when a user is on a GitHub repository page
- Provides a browser action button that opens a sidebar
- Displays the corresponding DeepWiki documentation in the sidebar
- Automatically extracts the repository owner and name to form the DeepWiki URL

## Technical Implementation

The extension uses Chrome's Manifest V3 and consists of:

1. **Service Worker**: Handles background logic and messaging
2. **Content Script**: Interacts with GitHub pages to extract repository information
3. **Side Panel**: Displays DeepWiki documentation in a sidebar

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select this directory

## Usage

1. Navigate to any GitHub repository (e.g., `https://github.com/traefik/traefik`)
2. Click the extension icon in the toolbar
3. The sidebar will open with the corresponding DeepWiki documentation

## Development

This project follows Chrome Extension best practices:
- Uses Manifest V3
- Implements service workers
- Applies the principle of least privilege
- Includes proper error handling and logging
