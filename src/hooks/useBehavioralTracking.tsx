import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BehavioralSession, 
  initBehavioralSession,
  trackEvent,
  calculateHonestyScore,
  getFlagDescriptions
} from '@/services/behavioralAnalyticsService';
import { toast } from 'sonner';

export const useBehavioralTracking = () => {
  const [session, setSession] = useState<BehavioralSession>(initBehavioralSession());
  const [isTracking, setIsTracking] = useState(false);
  const [antiCheatMode, setAntiCheatMode] = useState<'passive' | 'active'>('passive');
  const [interventionsEnabled, setInterventionsEnabled] = useState(true);
  const [interceptedEvents, setInterceptedEvents] = useState<string[]>([]);
  
  const lastKeystrokeTime = useRef(0);
  const keystrokeBuffer = useRef<number[]>([]);
  const suspiciousActivityCount = useRef(0);
  const warningsIssued = useRef(0);
  
  // Start tracking user behavior
  const startTracking = useCallback((mode: 'passive' | 'active' = 'passive') => {
    setSession(initBehavioralSession());
    setIsTracking(true);
    setAntiCheatMode(mode);
    suspiciousActivityCount.current = 0;
    warningsIssued.current = 0;
    setInterceptedEvents([]);
  }, []);
  
  // Stop tracking user behavior
  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);
  
  // Reset the tracking session
  const resetTracking = useCallback(() => {
    setSession(initBehavioralSession());
    suspiciousActivityCount.current = 0;
    warningsIssued.current = 0;
    setInterceptedEvents([]);
  }, []);
  
  // Track keystroke events
  const trackKeystroke = useCallback(() => {
    if (!isTracking) return;
    
    const now = Date.now();
    keystrokeBuffer.current.push(now);
    
    // Keep only the last 20 keystrokes
    if (keystrokeBuffer.current.length > 20) {
      keystrokeBuffer.current.shift();
    }
    
    // Create a keystroke event every 5 keystrokes
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
      trackEvent(prev, 'paste', { pasteLength })
    );
    
    // In active mode, intercept large pastes
    if (antiCheatMode === 'active' && interventionsEnabled && pasteLength > 200) {
      suspiciousActivityCount.current += 1;
      setInterceptedEvents(prev => {
        if (!prev.includes('large_paste')) {
          if (warningsIssued.current < 3) {
            toast.warning('Large code paste detected', {
              description: 'Pasting large chunks of code may be flagged as suspicious behavior.'
            });
            warningsIssued.current += 1;
          }
          return [...prev, 'large_paste'];
        }
        return prev;
      });
    }
  }, [isTracking, antiCheatMode, interventionsEnabled]);
  
  // Track focus loss events
  const trackFocusLost = useCallback((duration: number) => {
    if (!isTracking) return;
    
    setSession(prev => 
      trackEvent(prev, 'focus_lost', { focusLostDuration: duration })
    );
    
    // In active mode, flag extended focus loss
    if (antiCheatMode === 'active' && interventionsEnabled && duration > 15000) {
      suspiciousActivityCount.current += 1;
      setInterceptedEvents(prev => {
        if (!prev.includes('extended_focus_loss')) {
          if (warningsIssued.current < 3) {
            toast.warning('Extended focus loss detected', {
              description: 'Switching away from the interview for extended periods may be flagged.'
            });
            warningsIssued.current += 1;
          }
          return [...prev, 'extended_focus_loss'];
        }
        return prev;
      });
    }
  }, [isTracking, antiCheatMode, interventionsEnabled]);
  
  // Track tab switch events
  const trackTabSwitch = useCallback(() => {
    if (!isTracking) return;
    
    setSession(prev => trackEvent(prev, 'tab_switch'));
    
    // In active mode, flag frequent tab switches
    if (antiCheatMode === 'active' && interventionsEnabled) {
      suspiciousActivityCount.current += 1;
      setInterceptedEvents(prev => {
        if (suspiciousActivityCount.current >= 5 && !prev.includes('frequent_tab_switching')) {
          if (warningsIssued.current < 3) {
            toast.warning('Frequent tab switching detected', {
              description: 'Repeatedly switching tabs during the interview may be flagged as suspicious.'
            });
            warningsIssued.current += 1;
          }
          return [...prev, 'frequent_tab_switching'];
        }
        return prev;
      });
    }
  }, [isTracking, antiCheatMode, interventionsEnabled]);
  
  // Set up event listeners for focus and visibility changes
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
    
    const handleDevToolsChange = () => {
      const devtoolsOpen = window.outerHeight - window.innerHeight > 200 || 
                           window.outerWidth - window.innerWidth > 200;
      
      if (devtoolsOpen && antiCheatMode === 'active' && interventionsEnabled) {
        setInterceptedEvents(prev => {
          if (!prev.includes('devtools_open')) {
            if (warningsIssued.current < 3) {
              toast.warning('Developer tools detected', {
                description: 'Opening developer tools during the interview may be flagged as suspicious.'
              });
              warningsIssued.current += 1;
            }
            return [...prev, 'devtools_open'];
          }
          return prev;
        });
      }
    };
    
    const handleCopy = () => {
      if (antiCheatMode === 'active' && interventionsEnabled) {
        setInterceptedEvents(prev => {
          if (!prev.includes('copy_operation')) {
            if (warningsIssued.current < 3) {
              toast.warning('Code copying detected', {
                description: 'Copying code from the interview may be flagged.'
              });
              warningsIssued.current += 1;
            }
            return [...prev, 'copy_operation'];
          }
          return prev;
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleFocusChange);
    window.addEventListener('focus', handleFocusChange);
    window.addEventListener('resize', handleDevToolsChange);
    document.addEventListener('copy', handleCopy);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleFocusChange);
      window.removeEventListener('focus', handleFocusChange);
      window.removeEventListener('resize', handleDevToolsChange);
      document.removeEventListener('copy', handleCopy);
    };
  }, [isTracking, trackFocusLost, antiCheatMode, interventionsEnabled]);
  
  // Toggle intervention mode
  const toggleInterventions = useCallback((enabled: boolean) => {
    setInterventionsEnabled(enabled);
  }, []);
  
  // Switch anti-cheat mode
  const setMode = useCallback((mode: 'passive' | 'active') => {
    setAntiCheatMode(mode);
  }, []);
  
  // Calculate current honesty score and flag descriptions
  const honestyScore = calculateHonestyScore(session);
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
    isTracking,
    antiCheatMode,
    setMode,
    interventionsEnabled,
    toggleInterventions,
    interceptedEvents
  };
};

export default useBehavioralTracking;
