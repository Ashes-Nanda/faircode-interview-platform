document.addEventListener('DOMContentLoaded', async () => {
  const toggleButton = document.getElementById('toggle-monitoring');
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  const violationsList = document.getElementById('violations-list');

  // Get settings checkboxes
  const tabSwitchCheckbox = document.getElementById('tab-switch');
  const domManipulationCheckbox = document.getElementById('dom-manipulation');
  const copyPasteCheckbox = document.getElementById('copy-paste');

  // Load initial state
  const { isMonitoring, violations = [], settings = {} } = await chrome.storage.local.get([
    'isMonitoring',
    'violations',
    'settings'
  ]);

  // Update UI based on current state
  updateMonitoringStatus(isMonitoring);
  updateViolationsList(violations);
  updateSettings(settings);

  // Check if we can monitor the current tab
  async function canMonitorCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab?.url || '';
    
    // Check if the URL is one we can monitor
    return url.includes('leetcode.com') || 
           url.includes('hackerearth.com') || 
           url.includes('hackerrank.com') || 
           url.includes('codechef.com');
  }

  // Send message to content script with retry
  async function sendMessageToContentScript(tabId, message, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await chrome.tabs.sendMessage(tabId, message);
        return true;
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error;
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return false;
  }

  // Handle monitoring toggle
  toggleButton.addEventListener('click', async () => {
    try {
      const { isMonitoring } = await chrome.storage.local.get('isMonitoring');
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        throw new Error('No active tab found');
      }

      if (!isMonitoring) {
        // Check if we can monitor this tab
        const canMonitor = await canMonitorCurrentTab();
        if (!canMonitor) {
          alert('Monitoring can only be started on supported coding platforms (LeetCode, HackerEarth, HackerRank, CodeChef)');
          return;
        }

        try {
          // Request fullscreen first
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
              const docEl = document.documentElement;
              if (docEl.requestFullscreen) {
                return docEl.requestFullscreen();
              } else if (docEl.mozRequestFullScreen) {
                return docEl.mozRequestFullScreen();
              } else if (docEl.webkitRequestFullscreen) {
                return docEl.webkitRequestFullscreen();
              } else if (docEl.msRequestFullscreen) {
                return docEl.msRequestFullscreen();
              }
            }
          });

          // Start monitoring
          await chrome.runtime.sendMessage({
            type: 'START_MONITORING',
            tabId: tab.id
          });

          // Inject content script if needed
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['src/content.js']
          });

          // Send message to content script
          await sendMessageToContentScript(tab.id, { type: 'START_MONITORING' });
          
          // Update storage
          await chrome.storage.local.set({ isMonitoring: true });
          updateMonitoringStatus(true);
        } catch (error) {
          console.error('Failed to start monitoring:', error);
          alert('Failed to start monitoring. Please refresh the page and try again.');
          return;
        }
      } else {
        try {
          // Stop monitoring
          await chrome.runtime.sendMessage({ type: 'STOP_MONITORING' });
          
          // Exit fullscreen if active
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
              if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
              }
            }
          });

          // Try to send stop message to content script
          try {
            await sendMessageToContentScript(tab.id, { type: 'STOP_MONITORING' });
          } catch (error) {
            console.log('Content script might already be unloaded');
          }

          // Update storage
          await chrome.storage.local.set({ isMonitoring: false });
          updateMonitoringStatus(false);
        } catch (error) {
          console.error('Failed to stop monitoring:', error);
          alert('Failed to stop monitoring. Please refresh the page.');
          return;
        }
      }
    } catch (error) {
      console.error('Toggle monitoring error:', error);
      alert('An error occurred. Please refresh the page and try again.');
    }
  });

  // Handle settings changes
  [tabSwitchCheckbox, domManipulationCheckbox, copyPasteCheckbox].forEach(checkbox => {
    checkbox.addEventListener('change', async () => {
      const settings = {
        tabSwitch: tabSwitchCheckbox.checked,
        domManipulation: domManipulationCheckbox.checked,
        copyPaste: copyPasteCheckbox.checked
      };

      try {
        await chrome.storage.local.set({ settings });
        
        // Try to update content script settings
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
          try {
            await sendMessageToContentScript(tab.id, { 
              type: 'UPDATE_SETTINGS', 
              settings 
            });
          } catch (error) {
            console.log('Content script not ready for settings update');
          }
        }
      } catch (error) {
        console.error('Failed to update settings:', error);
      }
    });
  });

  // Listen for violation updates
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.violations) {
      updateViolationsList(changes.violations.newValue);
    }
  });

  function updateMonitoringStatus(isMonitoring) {
    statusIndicator.classList.toggle('active', isMonitoring);
    statusText.textContent = isMonitoring ? 'Active' : 'Inactive';
    toggleButton.textContent = isMonitoring ? 'Stop Monitoring' : 'Start Monitoring';
    toggleButton.classList.toggle('stop', isMonitoring);
  }

  function updateSettings(settings) {
    tabSwitchCheckbox.checked = settings.tabSwitch ?? true;
    domManipulationCheckbox.checked = settings.domManipulation ?? true;
    copyPasteCheckbox.checked = settings.copyPaste ?? true;
  }

  function updateViolationsList(violations) {
    violationsList.innerHTML = '';
    
    if (!violations || violations.length === 0) {
      violationsList.innerHTML = '<div class="violation-item">No violations detected</div>';
      return;
    }

    violations.slice().reverse().forEach(violation => {
      const violationElement = document.createElement('div');
      violationElement.className = 'violation-item';
      
      const time = new Date(violation.timestamp).toLocaleTimeString();
      
      violationElement.innerHTML = `
        <div class="violation-time">${time}</div>
        <div class="violation-type">${violation.type}</div>
        <div class="violation-details">${violation.details}</div>
      `;
      
      violationsList.appendChild(violationElement);
    });
  }
}); 