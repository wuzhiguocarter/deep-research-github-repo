/**
 * Side Panel JavaScript for GitHub DeepWiki Sidebar Extension
 * 
 * This script handles:
 * 1. Communication with the background service worker
 * 2. Loading the DeepWiki content in an iframe
 * 3. Error handling and UI updates
 */

// DOM elements
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const iframeElement = document.getElementById('deepwiki-frame');

/**
 * Loads a DeepWiki URL in the iframe
 * @param {string} url - The DeepWiki URL to load
 */
function loadDeepWikiUrl(url) {
  try {
    console.log(`Loading DeepWiki URL: ${url}`);
    
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
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'loadDeepWikiUrl' && message.url) {
    loadDeepWikiUrl(message.url);
  }
});
