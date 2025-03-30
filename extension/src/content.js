// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTasks') {
    // You can implement any page-specific task gathering logic here
    const tasks = [];
    sendResponse({ tasks });
  }
});

// Optional: Add a floating button to quickly add tasks
function createFloatingButton() {
  const button = document.createElement('button');
  button.innerHTML = '+';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-color: #2563eb;
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  `;

  button.addEventListener('click', () => {
    // Send message to open popup or handle task creation
    chrome.runtime.sendMessage({ action: 'openPopup' });
  });

  document.body.appendChild(button);
}

// Uncomment to add floating button
// createFloatingButton();

// Store original functions that might be tampered with
const originalFunctions = {
  addEventListener: window.addEventListener,
  removeEventListener: window.removeEventListener,
  MutationObserver: window.MutationObserver
};

let isMonitoring = false;
let lastViolationTime = {};
const VIOLATION_COOLDOWN = 5000; // 5 seconds cooldown between similar violations

// Initialize monitoring
async function initializeMonitoring() {
  const { settings } = await chrome.storage.local.get('settings');
  
  // Set up fullscreen change monitoring
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);

  // Monitor visibility changes
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Monitor window focus
  window.addEventListener('blur', handleWindowBlur);
  window.addEventListener('focus', handleWindowFocus);

  setupEventListeners(settings);
  setupDOMObserver(settings);
  detectDevTools();
}

// Handle fullscreen changes
function handleFullscreenChange() {
  if (!document.fullscreenElement && 
      !document.webkitFullscreenElement && 
      !document.mozFullScreenElement && 
      !document.msFullscreenElement) {
    reportViolation('SECURITY_VIOLATION', 'Attempted to exit fullscreen mode');
    requestFullscreenAgain();
  }
}

// Handle visibility changes
function handleVisibilityChange() {
  if (document.hidden) {
    reportViolation('SECURITY_VIOLATION', 'Tab lost visibility - possible tab switch attempt');
  }
}

// Handle window focus changes
function handleWindowBlur() {
  reportViolation('SECURITY_VIOLATION', 'Window lost focus - possible tab/window switch');
}

function handleWindowFocus() {
  // Optional: You could clear any violation flags here if needed
}

async function requestFullscreenAgain() {
  try {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      await docEl.requestFullscreen();
    } else if (docEl.mozRequestFullScreen) {
      await docEl.mozRequestFullScreen();
    } else if (docEl.webkitRequestFullscreen) {
      await docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) {
      await docEl.msRequestFullscreen();
    }
  } catch (error) {
    reportViolation('FULLSCREEN_ERROR', 'Failed to re-enter fullscreen mode');
  }
}

// Set up event listeners for various behaviors
function setupEventListeners(settings) {
  if (settings.copyPaste) {
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    
    // Prevent default copy/paste behavior
    document.addEventListener('copy', preventDefaultBehavior, true);
    document.addEventListener('paste', preventDefaultBehavior, true);
    document.addEventListener('cut', preventDefaultBehavior, true);
  }

  // Monitor keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts, true);
  
  // Prevent alt+tab and other common shortcuts
  document.addEventListener('keydown', preventTabSwitching, true);
}

function preventDefaultBehavior(event) {
  event.preventDefault();
}

function preventTabSwitching(event) {
  // Prevent Alt+Tab
  if (event.altKey && event.key === 'Tab') {
    event.preventDefault();
    reportViolation('SECURITY_VIOLATION', 'Attempted to use Alt+Tab');
  }
  
  // Prevent Alt+F4
  if (event.altKey && event.key === 'F4') {
    event.preventDefault();
    reportViolation('SECURITY_VIOLATION', 'Attempted to use Alt+F4');
  }
  
  // Prevent Windows key
  if (event.key === 'Meta' || event.key === 'OS') {
    event.preventDefault();
    reportViolation('SECURITY_VIOLATION', 'Attempted to use Windows/Meta key');
  }
  
  // Prevent Ctrl+W and Ctrl+Shift+W
  if ((event.ctrlKey && event.key === 'w') || 
      (event.ctrlKey && event.shiftKey && event.key === 'W')) {
    event.preventDefault();
    reportViolation('SECURITY_VIOLATION', 'Attempted to close window/tab');
  }
}

// Set up MutationObserver for DOM changes
function setupDOMObserver(settings) {
  if (!settings.domManipulation) return;

  // Initial check for existing invisible wrappers
  checkForInvisibleWrappers();

  const observer = new MutationObserver((mutations) => {
    let hasHiddenContent = false;
    let hasInvisibleWrapper = false;
    
    for (const mutation of mutations) {
      // Check for style changes that might hide content
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
        const element = mutation.target;
        hasHiddenContent = checkElementVisibility(element);
        
        if (hasHiddenContent) {
          reportViolation('DOM_MANIPULATION', 'Attempted to hide page content using CSS');
          break;
        }

        // Check if the element is an invisible wrapper
        hasInvisibleWrapper = checkForInvisibleWrapper(element);
        if (hasInvisibleWrapper) {
          break;
        }
      }
      
      // Check for added nodes that might be wrappers
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            hasInvisibleWrapper = checkForInvisibleWrapper(node);
            if (hasInvisibleWrapper) break;
          }
        }
        if (hasInvisibleWrapper) break;
      }
    }
  });

  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['style', 'class'],
    characterData: true
  });

  // Also monitor iframe creation
  const iframeObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.tagName === 'IFRAME') {
            reportViolation('DOM_MANIPULATION', 'Detected iframe creation which might be used for cheating');
          }
        }
      }
    }
  });

  iframeObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

function checkElementVisibility(element) {
  const computedStyle = window.getComputedStyle(element);
  
  // Check basic hiding techniques
  if (computedStyle.display === 'none' || 
      computedStyle.visibility === 'hidden' || 
      computedStyle.opacity === '0' || 
      parseInt(computedStyle.opacity) === 0) {
    return true;
  }

  // Check for off-screen positioning
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return true;
  }

  // Check for positioning tricks
  if (computedStyle.position === 'fixed' || computedStyle.position === 'absolute') {
    if (parseInt(computedStyle.left) < -1000 || 
        parseInt(computedStyle.top) < -1000 || 
        parseInt(computedStyle.right) < -1000 || 
        parseInt(computedStyle.bottom) < -1000) {
      return true;
    }
  }

  return false;
}

function checkForInvisibleWrapper(element) {
  // Skip non-element nodes
  if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;

  const computedStyle = window.getComputedStyle(element);
  
  // Check for common invisible wrapper techniques
  const suspiciousConditions = [
    // Check for transparent overlay
    computedStyle.position === 'fixed' && 
    computedStyle.top === '0px' && 
    computedStyle.left === '0px' && 
    (computedStyle.width === '100%' || computedStyle.width === '100vw') && 
    (computedStyle.height === '100%' || computedStyle.height === '100vh'),

    // Check for pointer-events manipulation
    computedStyle.pointerEvents === 'none',

    // Check for z-index stacking
    computedStyle.position !== 'static' && parseInt(computedStyle.zIndex) > 9000,

    // Check for suspicious class names
    element.className.toLowerCase().includes('overlay') ||
    element.className.toLowerCase().includes('wrapper') ||
    element.className.toLowerCase().includes('helper'),

    // Check for suspicious IDs
    element.id.toLowerCase().includes('overlay') ||
    element.id.toLowerCase().includes('wrapper') ||
    element.id.toLowerCase().includes('helper'),

    // Check for iframe wrappers
    element.tagName === 'IFRAME' && computedStyle.opacity === '0'
  ];

  if (suspiciousConditions.some(condition => condition)) {
    reportViolation('CHEATING_ATTEMPT', 'Detected potential cheating wrapper or overlay');
    return true;
  }

  // Check for nested invisible elements
  const children = element.children;
  for (let i = 0; i < children.length; i++) {
    if (checkForInvisibleWrapper(children[i])) {
      return true;
    }
  }

  return false;
}

function checkForInvisibleWrappers() {
  // Check entire document for existing wrappers
  const allElements = document.getElementsByTagName('*');
  for (const element of allElements) {
    if (checkForInvisibleWrapper(element)) {
      break; // Stop after first detection to avoid spam
    }
  }
}

// Detect DevTools
function detectDevTools() {
  const element = new Image();
  Object.defineProperty(element, 'id', {
    get: function() {
      reportViolation('DEVTOOLS_OPEN', 'DevTools was opened');
    }
  });
  console.debug(element);
}

// Event Handlers
function handleCopyPaste(event) {
  reportViolation('COPY_PASTE', `Attempted to ${event.type} content`);
}

function handleKeyboardShortcuts(event) {
  // Detect common shortcuts
  if (event.ctrlKey || event.metaKey) {
    const key = event.key.toLowerCase();
    if (['c', 'v', 'x', 'u', 'i', 'j'].includes(key)) {
      reportViolation('KEYBOARD_SHORTCUT', `Used keyboard shortcut: ${event.ctrlKey ? 'Ctrl' : 'Cmd'}+${event.key}`);
    }
  }
}

// Report violation to background script with rate limiting
function reportViolation(type, details) {
  if (!isMonitoring) return;

  const now = Date.now();
  if (lastViolationTime[type] && (now - lastViolationTime[type]) < VIOLATION_COOLDOWN) {
    return; // Skip if within cooldown period
  }
  
  lastViolationTime[type] = now;

  chrome.runtime.sendMessage({
    type: 'VIOLATION_DETECTED',
    violation: {
      type,
      details,
      timestamp: new Date().toISOString(),
      url: window.location.href
    }
  });
}

// Listen for monitoring status changes
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'START_MONITORING':
      isMonitoring = true;
      initializeMonitoring().then(() => {
        sendResponse({ success: true });
      }).catch(error => {
        sendResponse({ success: false, error: 'Failed to initialize monitoring' });
      });
      break;

    case 'STOP_MONITORING':
      isMonitoring = false;
      // Exit fullscreen if we're in it
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      sendResponse({ success: true });
      break;
  }
  return true;
});

// Anti-tampering protection
function protectFunctions() {
  // Prevent overriding addEventListener
  Object.defineProperty(window, 'addEventListener', {
    value: originalFunctions.addEventListener,
    writable: false,
    configurable: false
  });

  // Prevent overriding removeEventListener
  Object.defineProperty(window, 'removeEventListener', {
    value: originalFunctions.removeEventListener,
    writable: false,
    configurable: false
  });

  // Prevent overriding MutationObserver
  Object.defineProperty(window, 'MutationObserver', {
    value: originalFunctions.MutationObserver,
    writable: false,
    configurable: false
  });
}

// Initialize protection
protectFunctions(); 
protectFunctions(); 