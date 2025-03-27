
// Behavioral events that can be tracked
export type BehavioralEvent = {
  type: 'keystroke' | 'copy' | 'paste' | 'tab_switch' | 'focus_lost' | 'burst_typing';
  timestamp: number;
  details?: {
    keyCount?: number;
    duration?: number;
    pasteLength?: number;
    focusLostDuration?: number;
  };
};

// Session containing behavioral data
export type BehavioralSession = {
  sessionId: string;
  events: BehavioralEvent[];
  startTime: number;
  anomalyScore: number;
  flags: string[];
};

// Initialize a new behavioral tracking session
export const initBehavioralSession = (): BehavioralSession => {
  return {
    sessionId: generateSessionId(),
    events: [],
    startTime: Date.now(),
    anomalyScore: 0,
    flags: [],
  };
};

// Generate a unique session ID
const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Add a behavioral event to the session
export const trackEvent = (
  session: BehavioralSession,
  eventType: BehavioralEvent['type'],
  details?: BehavioralEvent['details']
): BehavioralSession => {
  const event: BehavioralEvent = {
    type: eventType,
    timestamp: Date.now(),
    details,
  };
  
  const updatedSession = {
    ...session,
    events: [...session.events, event],
  };
  
  // Process events to detect anomalies
  return detectAnomalies(updatedSession);
};

// Analyze events to detect suspicious behavior
const detectAnomalies = (session: BehavioralSession): BehavioralSession => {
  const { events } = session;
  const updatedFlags = [...session.flags];
  let anomalyScore = session.anomalyScore;
  
  // Check for rapid paste events (potential copy-paste from external sources)
  const pasteEvents = events.filter(e => e.type === 'paste');
  if (pasteEvents.length >= 3) {
    const recentPastes = pasteEvents.slice(-3);
    // Check if 3 paste events happened within 10 seconds
    if (recentPastes[2].timestamp - recentPastes[0].timestamp < 10000) {
      if (!updatedFlags.includes('frequent_pasting')) {
        updatedFlags.push('frequent_pasting');
        anomalyScore += 20;
      }
    }
  }
  
  // Check for burst typing (unnaturally fast typing)
  const keyEvents = events.filter(e => e.type === 'keystroke');
  if (keyEvents.length >= 2) {
    const recentKeys = keyEvents.slice(-10);
    if (recentKeys.length >= 10) {
      const first = recentKeys[0].timestamp;
      const last = recentKeys[recentKeys.length - 1].timestamp;
      const duration = last - first;
      // If 10 keys were typed in less than 1 second, flag as burst typing
      if (duration < 1000) {
        if (!updatedFlags.includes('burst_typing')) {
          updatedFlags.push('burst_typing');
          anomalyScore += 25;
        }
      }
    }
  }
  
  // Check for frequent focus loss
  const focusLostEvents = events.filter(e => e.type === 'focus_lost');
  if (focusLostEvents.length >= 3) {
    if (!updatedFlags.includes('frequent_focus_loss')) {
      updatedFlags.push('frequent_focus_loss');
      anomalyScore += 15;
    }
  }
  
  // Check for tab switching
  const tabSwitchEvents = events.filter(e => e.type === 'tab_switch');
  if (tabSwitchEvents.length >= 2) {
    if (!updatedFlags.includes('tab_switching')) {
      updatedFlags.push('tab_switching');
      anomalyScore += 30;
    }
  }
  
  return {
    ...session,
    flags: updatedFlags,
    anomalyScore,
  };
};

// Calculate an "honesty score" based on behavioral data
export const calculateHonestyScore = (session: BehavioralSession): number => {
  // Start with a perfect score of 100
  let score = 100;
  
  // Subtract points based on anomaly score
  score -= Math.min(session.anomalyScore, 70); // Cap the penalty at 70 points
  
  // Ensure score doesn't go below 0
  return Math.max(0, score);
};

// Get human-readable descriptions for flags
export const getFlagDescriptions = (flags: string[]): { [key: string]: string } => {
  const descriptions: { [key: string]: string } = {
    'frequent_pasting': 'Multiple rapid paste actions detected',
    'burst_typing': 'Unusually fast typing pattern detected',
    'frequent_focus_loss': 'Candidate frequently looked away or changed focus',
    'tab_switching': 'Candidate switched browser tabs during session',
  };
  
  const result: { [key: string]: string } = {};
  flags.forEach(flag => {
    if (descriptions[flag]) {
      result[flag] = descriptions[flag];
    }
  });
  
  return result;
};
