# GitHub DeepWiki Sidebar Extension - Installation Guide

## Installation Steps

### Developer Mode Installation

1. **Prepare the extension files**
   - Ensure all files are in place:
     - manifest.json
     - background.js
     - content.js
     - sidepanel.html
     - sidepanel.js
     - images/icon16.png
     - images/icon48.png
     - images/icon128.png

2. **Replace placeholder icons**
   - Replace the placeholder icon files in the `images` directory with your custom icons
   - Icons should be in PNG format with sizes 16x16, 48x48, and 128x128 pixels

3. **Load the extension in Chrome**
   - Open Chrome browser
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" by toggling the switch in the top-right corner
   - Click "Load unpacked"
   - Select the extension directory containing all the files

4. **Verify installation**
   - The extension should appear in your extensions list
   - The extension icon should appear in your Chrome toolbar

## Testing the Extension

1. **Navigate to a GitHub repository**
   - Go to any GitHub repository page (e.g., `https://github.com/traefik/traefik`)
   - Make sure you're on the main repository page, not in a subdirectory or specific file

2. **Use the extension**
   - Click the extension icon in the Chrome toolbar
   - The side panel should open on the right side of the browser
   - The side panel should load the corresponding DeepWiki page (`https://deepwiki.com/traefik/traefik`)

3. **Troubleshooting**
   - If the side panel doesn't open, check the Chrome console for errors
   - Ensure you're on a valid GitHub repository main page
   - Verify that all permissions are correctly set in the manifest.json file

## Debugging

1. **View extension logs**
   - Right-click on the extension icon
   - Select "Inspect popup"
   - Switch to the "Console" tab to view logs

2. **Debug background script**
   - Go to `chrome://extensions/`
   - Find your extension and click on "Service Worker" under "Inspect views"
   - Use the Chrome DevTools to debug the background script

3. **Debug content script**
   - While on a GitHub page, right-click and select "Inspect"
   - Go to the "Console" tab
   - Content script logs will appear here

## Known Limitations

- The extension only works on the main page of GitHub repositories
- DeepWiki must have documentation available for the repository
- Cross-origin restrictions may apply when loading DeepWiki content
