import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BehavioralSession, 
  initBehavioralSession,
  trackEvent,
  calculateHonestyScore,
  getFlagDescriptions
} from '@/services/behavioralAnalyticsService';

export const useBehavioralTracking = () => {
  const [session, setSession] = useState<BehavioralSession>(initBehavioralSession());
  const [isTracking, setIsTracking] = useState(false);
  const lastKeystrokeTime = useRef(0);
  const keystrokeBuffer = useRef<number[]>([]);
  
  // Start tracking user behavior
  const startTracking = useCallback(() => {
    setSession(initBehavioralSession());
    setIsTracking(true);
  }, []);
  
  // Stop tracking user behavior
  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);
  
  // Reset the tracking session
  const resetTracking = useCallback(() => {
    setSession(initBehavioralSession());
  }, []);
  
  // Track keystroke events
  const trackKeystroke = useCallback(() => {
    if (!isTracking) return;
    
    const now = Date.now();
    keystrokeBuffer.current.push(now);
    
    // Keep only the last 20 keystrokes in the buffer
    if (keystrokeBuffer.current.length > 20) {
      keystrokeBuffer.current.shift();
    }
    
    // Only create a keystroke event every 5 keystrokes to avoid too many events
    if (keystrokeBuffer.current.length % 5 === 0) {
      setSession(prev => 
        trackEvent(prev, 'keystroke', {
          keyCount: 5,
          duration: now - lastKeystrokeTime.current
        })
      );
    }
    
    lastKeystrokeTime.current = now;
  }, [isTracking]);
  
  // Track paste events
  const trackPaste = useCallback((pasteLength: number) => {
    if (!isTracking) return;
    
    setSession(prev => 
      trackEvent(prev, 'paste', {
        pasteLength
      })
    );
  }, [isTracking]);
  
  // Track focus loss events
  const trackFocusLost = useCallback((duration: number) => {
    if (!isTracking) return;
    
    setSession(prev => 
      trackEvent(prev, 'focus_lost', {
        focusLostDuration: duration
      })
    );
  }, [isTracking]);
  
  // Track tab switch events
  const trackTabSwitch = useCallback(() => {
    if (!isTracking) return;
    
    setSession(prev => trackEvent(prev, 'tab_switch'));
  }, [isTracking]);
  
  // Set up event listeners for visibility and focus changes
  useEffect(() => {
    if (!isTracking) return;
    
    let focusLostTime = 0;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        focusLostTime = Date.now();
      } else if (focusLostTime > 0) {
        const duration = Date.now() - focusLostTime;
        trackFocusLost(duration);
        focusLostTime = 0;
      }
    };
    
    const handleFocusChange = (event: FocusEvent) => {
      if (event.type === 'blur') {
        focusLostTime = Date.now();
      } else if (event.type === 'focus' && focusLostTime > 0) {
        const duration = Date.now() - focusLostTime;
        trackFocusLost(duration);
        focusLostTime = 0;
      }
    };
    
    // Listen for visibility and focus changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleFocusChange);
    window.addEventListener('focus', handleFocusChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleFocusChange);
      window.removeEventListener('focus', handleFocusChange);
    };
  }, [isTracking, trackFocusLost]);
  
  // Calculate current honesty score
  const honestyScore = calculateHonestyScore(session);
  
  // Get descriptions for any raised flags
  const flagDescriptions = getFlagDescriptions(session.flags);
  
  return {
    session,
    honestyScore,
    flagDescriptions,
    startTracking,
    stopTracking,
    resetTracking,
    trackKeystroke,
    trackPaste,
    trackFocusLost,
    trackTabSwitch,
    isTracking
  };
};

export default useBehavioralTracking;
