/**
 * Content Script for GitHub DeepWiki Sidebar Extension
 * 
 * This script runs on GitHub repository pages and:
 * 1. Verifies the current page is a GitHub repository
 * 2. Extracts repository information
 * 3. Communicates with the background service worker
 * 4. Detects navigation to new GitHub repositories
 */

// Function to extract repository owner and name from the current URL
function extractRepoInfo() {
  try {
    // Check if we're on a GitHub repository page
    const isRepoPage = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/.test(window.location.href);
    
    if (!isRepoPage) {
      console.log('Not on a GitHub repository main page');
      return null;
    }
    
    // Extract repository owner and name from URL
    const urlParts = window.location.pathname.split('/').filter(part => part.length > 0);
    
    if (urlParts.length >= 2) {
      return {
        owner: urlParts[0],
        name: urlParts[1]
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting repository information:', error);
    return null;
  }
}

// Function to send repository information to the background script
function sendRepoInfoToBackground() {
  const repoInfo = extractRepoInfo();
  
  if (repoInfo) {
    // Construct DeepWiki URL
    const deepWikiUrl = `https://deepwiki.com/${repoInfo.owner}/${repoInfo.name}`;
    
    chrome.runtime.sendMessage({
      action: 'updateDeepWikiUrl',
      data: {
        repoInfo: repoInfo,
        deepWikiUrl: deepWikiUrl,
        githubUrl: window.location.href
      }
    });
    
    console.log(`Sent repository info to background: ${repoInfo.owner}/${repoInfo.name}`);
  }
}

// Run when the content script is loaded
(function() {
  // Send repository information when the page loads
  sendRepoInfoToBackground();
  
  // Listen for URL changes (for single-page applications)
  let lastUrl = window.location.href;
  
  // Create a new MutationObserver to watch for URL changes
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      console.log('URL changed, updating repository information');
      setTimeout(sendRepoInfoToBackground, 500); // Small delay to ensure page has loaded
    }
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document, { subtree: true, childList: true });
  
  // Also listen for history state changes (pushState/replaceState)
  window.addEventListener('popstate', () => {
    console.log('History state changed, updating repository information');
    setTimeout(sendRepoInfoToBackground, 500);
  });
  
  // Check for URL changes periodically as a fallback
  setInterval(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      console.log('URL changed (interval check), updating repository information');
      sendRepoInfoToBackground();
    }
  }, 2000);
  
  console.log('GitHub DeepWiki Sidebar content script initialized');
})();
