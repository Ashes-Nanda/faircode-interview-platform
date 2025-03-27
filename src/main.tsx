
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize the anti-cheat system by defining global guards
window.addEventListener('beforeunload', (e) => {
  // Warn before leaving the page during an active interview
  if (sessionStorage.getItem('interview_active') === 'true') {
    const message = 'Leaving this page will end your interview session. Are you sure?';
    e.returnValue = message;
    return message;
  }
});

// Monitor network activity
const originalFetch = window.fetch;
window.fetch = function(...args) {
  // Allow internal API calls but track external ones
  const url = args[0]?.toString() || '';
  if (!url.includes(window.location.origin) && !url.startsWith('/')) {
    console.log('External API call detected:', url);
    // In a real app, we could report this to the behavioral tracking system
  }
  return originalFetch.apply(this, args);
};

createRoot(document.getElementById("root")!).render(<App />);
