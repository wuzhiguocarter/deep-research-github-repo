/**
 * Background Service Worker for GitHub DeepWiki Sidebar Extension
 * 
 * This service worker handles the core extension functionality:
 * 1. Listens for extension icon clicks
 * 2. Communicates with content scripts
 * 3. Controls the side panel
 * 4. Updates the side panel when navigating to new GitHub repositories
 */

// Track the current active tab and its state
let currentState = {
  tabId: null,
  isGitHubRepo: false,
  deepWikiUrl: null,
  sidebarOpen: false
};

// Initialize side panel settings when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  // Set up the side panel configuration
  chrome.sidePanel.setOptions({
    enabled: true,
    path: 'sidepanel.html'
  });
  
  console.log('GitHub DeepWiki Sidebar extension installed');
});

// Listen for clicks on the extension icon
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Store the current tab ID
    currentState.tabId = tab.id;
    
    // Verify we're on a GitHub repository page
    if (!tab.url.match(/^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/)) {
      console.log('Not a GitHub repository page');
      currentState.isGitHubRepo = false;
      // Show notification or handle non-GitHub pages
      return;
    }
    
    currentState.isGitHubRepo = true;

    // Extract repository owner and name from URL
    const urlParts = tab.url.replace('https://github.com/', '').split('/');
    const repoOwner = urlParts[0];
    const repoName = urlParts[1];

    // Construct DeepWiki URL
    const deepWikiUrl = `https://deepwiki.com/${repoOwner}/${repoName}`;
    currentState.deepWikiUrl = deepWikiUrl;
    
    // Store the URL in local storage for the side panel to access
    chrome.storage.local.set({ deepWikiUrl: deepWikiUrl });
    
    // Open the side panel
    await chrome.sidePanel.open({ tabId: tab.id });
    currentState.sidebarOpen = true;
    
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
  // Handle request for DeepWiki URL from side panel
  if (message.action === 'getDeepWikiUrl') {
    chrome.storage.local.get(['deepWikiUrl'], (result) => {
      sendResponse({ url: result.deepWikiUrl });
    });
    return true; // Required for async sendResponse
  }
  
  // Handle repository URL updates from content script
  if (message.action === 'updateDeepWikiUrl' && message.data) {
    const { deepWikiUrl, githubUrl } = message.data;
    
    // Update current state
    if (sender.tab) {
      currentState.tabId = sender.tab.id;
      currentState.isGitHubRepo = true;
      currentState.deepWikiUrl = deepWikiUrl;
    }
    
    console.log(`Received updated repository info: ${deepWikiUrl}`);
    
    // Store the new URL
    chrome.storage.local.set({ deepWikiUrl: deepWikiUrl });
    
    // If the sidebar is already open for this tab, update it
    chrome.sidePanel.getOptions({ tabId: currentState.tabId }, (options) => {
      if (options && options.enabled && currentState.sidebarOpen) {
        // Send message to the side panel to load the new URL
        chrome.runtime.sendMessage({
          action: 'loadDeepWikiUrl',
          url: deepWikiUrl
        });
        
        console.log(`Updated DeepWiki sidebar with new URL: ${deepWikiUrl}`);
      }
    });
  }
});

// Listen for tab updates to track active tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only process complete loads of GitHub repository pages
  if (changeInfo.status === 'complete' && tab.url && tab.url.match(/^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/)) {
    // If this is our tracked tab and the sidebar is open, we'll let the content script handle the update
    if (tabId === currentState.tabId) {
      console.log(`Tab ${tabId} updated to a GitHub repository page`);
      currentState.isGitHubRepo = true;
    }
  }
});

// Listen for tab activation changes
chrome.tabs.onActivated.addListener(({ tabId }) => {
  // Update the current tab ID
  currentState.tabId = tabId;
  
  // Check if this tab has the sidebar open
  chrome.sidePanel.getOptions({ tabId }, (options) => {
    currentState.sidebarOpen = options && options.enabled;
  });
  
  // Get tab info to check if it's a GitHub repo
  chrome.tabs.get(tabId, (tab) => {
    if (tab.url && tab.url.match(/^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/)) {
      currentState.isGitHubRepo = true;
    } else {
      currentState.isGitHubRepo = false;
    }
  });
});
