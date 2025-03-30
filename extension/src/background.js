let isMonitoring = false;
let monitoredTabId = null;
let settings = {
  tabSwitch: true,
  domManipulation: true,
  copyPaste: true
};

let lastNotificationTime = {};
const NOTIFICATION_COOLDOWN = 5000; // 5 seconds cooldown between similar notifications
let backendErrorShown = false;

// Initialize storage with default settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    isMonitoring: false,
    violations: [],
    settings: settings
  });
});

// Listen for tab switches
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (!isMonitoring) return;
  
  chrome.tabs.get(activeInfo.tabId).then(tab => {
    if (tab.id !== monitoredTabId) {
      handleViolation({
        type: 'TAB_SWITCH',
        details: `Switched to: ${tab.title}`,
        timestamp: new Date().toISOString()
      });
    }
  }).catch(error => {
    console.error('Error handling tab switch:', error);
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'START_MONITORING':
      isMonitoring = true;
      monitoredTabId = message.tabId;
      backendErrorShown = false; // Reset backend error flag
      chrome.storage.local.set({ isMonitoring: true });
      sendResponse({ success: true });
      break;

    case 'STOP_MONITORING':
      isMonitoring = false;
      monitoredTabId = null;
      chrome.storage.local.set({ isMonitoring: false });
      sendResponse({ success: true });
      break;

    case 'VIOLATION_DETECTED':
      handleViolation(message.violation);
      sendResponse({ success: true });
      break;

    case 'GET_STATUS':
      sendResponse({
        isMonitoring,
        monitoredTabId
      });
      break;

    case 'UPDATE_SETTINGS':
      settings = message.settings;
      chrome.storage.local.set({ settings });
      sendResponse({ success: true });
      break;
  }
  return true;
});

function handleViolation(violation) {
  // Get existing violations
  chrome.storage.local.get('violations', (result) => {
    const violations = result.violations || [];
    violations.push(violation);
    
    // Keep only last 100 violations
    if (violations.length > 100) {
      violations.shift();
    }
    
    // Store updated violations
    chrome.storage.local.set({ violations }, () => {
      // Show notification with rate limiting
      showNotification(violation);
      
      // Send to backend
      sendToBackend(violation);
    });
  });
}

function showNotification(violation) {
  const now = Date.now();
  if (lastNotificationTime[violation.type] && 
      (now - lastNotificationTime[violation.type]) < NOTIFICATION_COOLDOWN) {
    return; // Skip if within cooldown period
  }
  
  lastNotificationTime[violation.type] = now;

  const notificationId = 'violation_' + Date.now();
  const notificationOptions = {
    type: 'basic',
    iconUrl: '/public/icon128.png',
    title: 'Violation Detected',
    message: `Type: ${violation.type}\nDetails: ${violation.details}`,
    priority: 2,
    requireInteraction: false
  };

  chrome.notifications.create(notificationId, notificationOptions, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('Notification error:', chrome.runtime.lastError);
    }
  });
}

function sendToBackend(violation) {
  fetch('http://localhost:5173/api/violations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(violation)
  }).catch(error => {
    if (!backendErrorShown) {
      console.error('Failed to connect to backend. Violations will only be stored locally.');
      backendErrorShown = true;
    }
  });
}

// Handle periodic tasks
chrome.alarms.create('cleanupViolations', { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanupViolations') {
    cleanupOldViolations();
  }
});

function cleanupOldViolations() {
  chrome.storage.local.get('violations', (result) => {
    const violations = result.violations || [];
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    const recentViolations = violations.filter(v => 
      new Date(v.timestamp).getTime() > oneDayAgo
    );
    
    if (recentViolations.length !== violations.length) {
      chrome.storage.local.set({ violations: recentViolations });
    }
  });
} 