/**
 * Side Panel JavaScript for GitHub DeepWiki Sidebar Extension
 * 
 * This script handles:
 * 1. Communication with the background service worker
 * 2. Loading the DeepWiki content in an iframe
 * 3. Error handling and UI updates
 * 4. Responding to GitHub repository navigation changes
 */

// DOM elements
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const iframeElement = document.getElementById('deepwiki-frame');

// Track the current loaded URL to avoid unnecessary reloads
let currentLoadedUrl = null;

/**
 * Loads a DeepWiki URL in the iframe
 * @param {string} url - The DeepWiki URL to load
 */
function loadDeepWikiUrl(url) {
  try {
    // If the URL is the same as currently loaded, don't reload
    if (url === currentLoadedUrl && iframeElement.style.display === 'block') {
      console.log(`URL ${url} is already loaded, skipping reload`);
      return;
    }
    
    console.log(`Loading DeepWiki URL: ${url}`);
    currentLoadedUrl = url;
    
    // Show loading indicator
    loadingElement.style.display = 'flex';
    errorElement.style.display = 'none';
    iframeElement.style.display = 'none';
    
    // Set iframe source to the DeepWiki URL
    iframeElement.src = url;
    
    // Handle iframe load event
    iframeElement.onload = () => {
      // Hide loading indicator and show iframe
      loadingElement.style.display = 'none';
      iframeElement.style.display = 'block';
      console.log('DeepWiki content loaded successfully');
    };
    
    // Handle iframe error
    iframeElement.onerror = (error) => {
      showError(`Failed to load DeepWiki content: ${error.message}`);
    };
  } catch (error) {
    showError(`Error loading DeepWiki content: ${error.message}`);
  }
}

/**
 * Displays an error message
 * @param {string} message - The error message to display
 */
function showError(message) {
  console.error(message);
  loadingElement.style.display = 'none';
  iframeElement.style.display = 'none';
  errorElement.style.display = 'block';
  errorElement.textContent = message;
}

// When the side panel is loaded, request the DeepWiki URL from background
document.addEventListener('DOMContentLoaded', () => {
  console.log('Side panel loaded, requesting DeepWiki URL');
  
  // Request the DeepWiki URL from the background script
  chrome.runtime.sendMessage({ action: 'getDeepWikiUrl' }, (response) => {
    if (response && response.url) {
      loadDeepWikiUrl(response.url);
    } else {
      showError('No DeepWiki URL available. Please navigate to a GitHub repository and click the extension icon again.');
    }
  });
  
  // Set up a periodic check for URL updates (as a fallback)
  setInterval(() => {
    chrome.runtime.sendMessage({ action: 'getDeepWikiUrl' }, (response) => {
      if (response && response.url && response.url !== currentLoadedUrl) {
        console.log('Detected URL change from periodic check');
        loadDeepWikiUrl(response.url);
      }
    });
  }, 5000);
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'loadDeepWikiUrl' && message.url) {
    console.log('Received message to load new URL:', message.url);
    loadDeepWikiUrl(message.url);
  }
});
