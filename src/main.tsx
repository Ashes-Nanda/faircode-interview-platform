
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { toast } from 'sonner'

// Initialize the anti-cheat system by defining global guards
window.addEventListener('beforeunload', (e) => {
  // Warn before leaving the page during an active interview
  if (sessionStorage.getItem('interview_active') === 'true') {
    const message = 'Leaving this page will end your interview session. Are you sure?';
    e.returnValue = message;
    return message;
  }
});

// Monitor tab visibility to detect tab switching
document.addEventListener('visibilitychange', () => {
  if (sessionStorage.getItem('interview_active') === 'true') {
    if (document.visibilityState === 'hidden') {
      // User has switched to another tab
      console.log('Tab switch detected during interview');
      sessionStorage.setItem('tab_switch_count', 
        (parseInt(sessionStorage.getItem('tab_switch_count') || '0') + 1).toString());
      
      // Send warning when user returns
      setTimeout(() => {
        if (document.visibilityState === 'visible' && 
            sessionStorage.getItem('interventions_enabled') === 'true') {
          toast.warning('Tab switching detected', {
            description: 'Switching tabs during an interview may be flagged as suspicious behavior.'
          });
        }
      }, 500);
    }
  }
});

// Monitor window focus to detect other application usage
window.addEventListener('blur', () => {
  if (sessionStorage.getItem('interview_active') === 'true') {
    console.log('Window focus lost during interview');
    sessionStorage.setItem('focus_loss_count', 
      (parseInt(sessionStorage.getItem('focus_loss_count') || '0') + 1).toString());
  }
});

// Monitor network activity
const originalFetch = window.fetch;
window.fetch = function(...args) {
  // Allow internal API calls but track external ones
  const url = args[0]?.toString() || '';
  if (!url.includes(window.location.origin) && !url.startsWith('/')) {
    console.log('External API call detected:', url);
    
    if (sessionStorage.getItem('interview_active') === 'true') {
      sessionStorage.setItem('external_api_calls', 
        (parseInt(sessionStorage.getItem('external_api_calls') || '0') + 1).toString());
      
      if (sessionStorage.getItem('interventions_enabled') === 'true') {
        toast.warning('External API call detected', {
          description: 'Network requests to external services during an interview may be flagged.'
        });
      }
    }
  }
  return originalFetch.apply(this, args);
};

// Monitor for developer tools (basic detection)
const devToolsDetector = () => {
  const threshold = 160;
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;
  
  if (widthThreshold || heightThreshold) {
    if (sessionStorage.getItem('interview_active') === 'true') {
      console.log('Developer tools potentially detected');
      
      if (sessionStorage.getItem('interventions_enabled') === 'true' && 
          !sessionStorage.getItem('devtools_warning_shown')) {
        toast.warning('Developer tools detected', {
          description: 'Using developer tools during an interview may be flagged as suspicious behavior.'
        });
        sessionStorage.setItem('devtools_warning_shown', 'true');
      }
    }
  }
};

// Check periodically
setInterval(devToolsDetector, 1000);

createRoot(document.getElementById("root")!).render(<App />);
