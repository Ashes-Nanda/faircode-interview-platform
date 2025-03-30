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
const GLOBAL_NOTIFICATION_COOLDOWN = 2000; // 2 seconds between any notifications
let lastGlobalNotificationTime = 0;
let notificationQueue = [];
let isProcessingQueue = false;

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
  checkForSuspiciousCodeElements();

  const observer = new MutationObserver((mutations) => {
    const violations = new Set();
    
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
        const element = mutation.target;
        
        if (checkElementVisibility(element)) {
          violations.add('hide page content using CSS');
        }
        
        if (element.tagName === 'PRE' || element.tagName === 'CODE') {
          checkCodeElementManipulation(element);
        }
      }
      
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            checkForInvisibleWrapper(node);
            
            if (node.tagName === 'PRE' || node.tagName === 'CODE') {
              checkCodeElementManipulation(node);
            }
          }
        }
      }
    }

    // Report unique violations
    violations.forEach(violation => {
      reportViolation('DOM_MANIPULATION', `Attempted to ${violation}`);
    });
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
  
  // Collect all violations instead of reporting immediately
  const violations = [];
  
  // Check for semi-transparent overlays with algorithm solutions
  const hasLowOpacity = parseFloat(computedStyle.opacity) > 0 && parseFloat(computedStyle.opacity) < 0.3;
  if (hasLowOpacity) {
    const content = element.textContent?.toLowerCase() || '';
    const algorithmKeywords = [
      'dfs', 'depth first', 'depth-first',
      'bfs', 'breadth first', 'breadth-first',
      'recursion', 'recursive',
      'stack', 'queue',
      'visited', 'graph',
      'backtrack', 'backtracking'
    ];

    const codeIndicators = [
      'function', 'def ', 'class',
      'return', 'for', 'while',
      'if', 'else', '{', '}',
      '()', '[]', 'array',
      'list', 'set', 'map'
    ];

    const hasAlgorithmKeywords = algorithmKeywords.some(keyword => content.includes(keyword));
    const hasCodeIndicators = codeIndicators.some(indicator => content.includes(indicator));

    if (hasAlgorithmKeywords && hasCodeIndicators) {
      violations.push('algorithm solution in semi-transparent overlay');
    }
  }

  // Check other conditions and add to violations array
  if (computedStyle.pointerEvents === 'none') {
    violations.push('invisible to mouse interaction');
  }
  if (parseInt(computedStyle.zIndex) > 9000) {
    violations.push('suspicious z-index stacking');
  }
  if (element.classList.contains('shadow-sight-test-overlay')) {
    violations.push('test overlay detected');
  }

  // Report all violations as a single notification if any found
  if (violations.length > 0) {
    reportViolation('CHEATING_ATTEMPT', 
      `Detected cheating attempt: ${violations.join(', ')}`);
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
  
  // Check type-specific cooldown
  if (lastViolationTime[type] && (now - lastViolationTime[type]) < VIOLATION_COOLDOWN) {
    return; // Skip if within cooldown period for this type
  }

  // Add to queue instead of sending immediately
  notificationQueue.push({
    type,
    details,
    timestamp: new Date().toISOString(),
    url: window.location.href
  });

  // Start processing queue if not already processing
  if (!isProcessingQueue) {
    processNotificationQueue();
  }
}

// Add new function to process notification queue
async function processNotificationQueue() {
  if (isProcessingQueue || notificationQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (notificationQueue.length > 0) {
    const now = Date.now();
    
    // Check global cooldown
    if (now - lastGlobalNotificationTime < GLOBAL_NOTIFICATION_COOLDOWN) {
      await new Promise(resolve => setTimeout(resolve, GLOBAL_NOTIFICATION_COOLDOWN));
      continue;
    }

    const violation = notificationQueue.shift();
    lastViolationTime[violation.type] = now;
    lastGlobalNotificationTime = now;

    try {
      await chrome.runtime.sendMessage({
        type: 'VIOLATION_DETECTED',
        violation
      });
      
      // Add delay between notifications
      await new Promise(resolve => setTimeout(resolve, GLOBAL_NOTIFICATION_COOLDOWN));
    } catch (error) {
      console.error('Failed to send violation:', error);
    }
  }

  isProcessingQueue = false;
}

// Listen for monitoring status changes
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'START_MONITORING':
      isMonitoring = true;
      console.log("[ShadowSight] Starting monitoring...");
      
      initializeMonitoring().then(() => {
        // Run simulation immediately when monitoring starts
        console.log("[ShadowSight] Monitoring initialized, running simulation...");
        injectCheatSimulation();
        sendResponse({ success: true });
      }).catch(error => {
        console.error("[ShadowSight] Failed to initialize monitoring:", error);
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

function checkCodeElementManipulation(element) {
  const computedStyle = window.getComputedStyle(element);
  const opacity = parseFloat(computedStyle.opacity);
  
  if (opacity > 0 && opacity < 0.3) {
    const content = element.textContent.toLowerCase();
    if (content.includes('dfs') || 
        content.includes('depth-first') || 
        content.includes('recursive')) {
      reportViolation('CHEATING_ATTEMPT', 'Detected semi-transparent DFS solution code');
    }
  }
}

function checkForSuspiciousCodeElements() {
  const codeElements = document.querySelectorAll('pre, code');
  codeElements.forEach(element => {
    checkCodeElementManipulation(element);
  });
}

// Add simulation function for testing
function injectCheatSimulation() {
  console.log("[ShadowSight Test] Starting simulation injection...");
  
  // Immediate check if we're on LeetCode
  if (!window.location.hostname.includes('leetcode.com')) {
    console.log("[ShadowSight Test] Not on LeetCode, simulation aborted");
    return;
  }

  // Create and inject the overlay immediately
  const overlay = document.createElement("div");
  overlay.className = "shadow-sight-test-overlay";
  
  overlay.innerHTML = `
    <pre style="margin: 0; font-family: monospace; padding: 10px;">
<b style="color: #FF0000; font-size: 16px;">🧠 Two Sum Solution (Test Overlay)</b>

function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return []; // No solution found
}

// Example usage:
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target)); // [0, 1]
    </pre>
  `;

  // Apply more visible styles
  overlay.style.cssText = `
    position: fixed;
    top: 20%;
    left: 20%;
    width: 500px;
    height: auto;
    opacity: 0.8;
    z-index: 999999;
    background: #1a1a1a;
    color: #00FF99;
    font-size: 14px;
    border: 3px solid #FF0000;
    padding: 20px;
    pointer-events: none;
    border-radius: 8px;
    box-shadow: 0 0 30px rgba(255, 0, 0, 0.3);
    font-family: 'Courier New', monospace;
    white-space: pre;
    overflow: auto;
    backdrop-filter: blur(5px);
  `;

  // Add to document and log
  try {
    document.body.appendChild(overlay);
    console.log("[ShadowSight Test] Overlay injected successfully");
    
    // Verify injection
    setTimeout(() => {
      const injectedOverlay = document.querySelector('.shadow-sight-test-overlay');
      if (injectedOverlay) {
        console.log("[ShadowSight Test] Overlay verified in DOM");
        
        // Log computed styles
        const computedStyle = window.getComputedStyle(injectedOverlay);
        console.log("[ShadowSight Test] Overlay styles:", {
          position: computedStyle.position,
          zIndex: computedStyle.zIndex,
          opacity: computedStyle.opacity,
          display: computedStyle.display,
          visibility: computedStyle.visibility
        });
      } else {
        console.log("[ShadowSight Test] Overlay not found in DOM after injection");
      }
    }, 100);

  } catch (error) {
    console.error("[ShadowSight Test] Failed to inject overlay:", error);
  }
} 