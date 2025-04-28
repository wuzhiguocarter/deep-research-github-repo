/**
 * Background Service Worker for GitHub DeepWiki Sidebar Extension
 * 
 * This service worker handles the core extension functionality:
 * 1. Listens for extension icon clicks
 * 2. Communicates with content scripts
 * 3. Controls the side panel
 */

// Initialize side panel settings when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  // Set up the side panel configuration
  chrome.sidePanel.setOptions({
    enabled: true,
    path: 'sidepanel.html'
  });
});

// Listen for clicks on the extension icon
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Verify we're on a GitHub repository page
    if (!tab.url.match(/^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/)) {
      console.log('Not a GitHub repository page');
      // Show notification or handle non-GitHub pages
      return;
    }

    // Extract repository owner and name from URL
    const urlParts = tab.url.replace('https://github.com/', '').split('/');
    const repoOwner = urlParts[0];
    const repoName = urlParts[1];

    // Construct DeepWiki URL
    const deepWikiUrl = `https://deepwiki.com/${repoOwner}/${repoName}`;
    
    // Store the URL in local storage for the side panel to access
    chrome.storage.local.set({ deepWikiUrl: deepWikiUrl });
    
    // Open the side panel
    await chrome.sidePanel.open({ tabId: tab.id });
    
    // Send message to the side panel to load the URL
    chrome.runtime.sendMessage({
      action: 'loadDeepWikiUrl',
      url: deepWikiUrl
    });
    
    console.log(`Opening DeepWiki sidebar for ${repoOwner}/${repoName}`);
  } catch (error) {
    console.error('Error in extension action:', error);
  }
});

// Listen for messages from content script or side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getDeepWikiUrl') {
    chrome.storage.local.get(['deepWikiUrl'], (result) => {
      sendResponse({ url: result.deepWikiUrl });
    });
    return true; // Required for async sendResponse
  }
});
