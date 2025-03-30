import { toast } from 'sonner';

interface Event {
  count: number;
  multiplier: number;
  weight: number;
  lastTriggered?: number; // Add timestamp for last trigger
}

interface Events {
  overlay: Event;
  focus: Event;
  typing: Event;
  lookaround: Event;
  person: Event;
  lip: Event;
  tabSwitch: { count: number; lastTriggered?: number };
  multipleScreens: { count: number; lastTriggered?: number };
}

class HonestyScoreService {
  private events: Events = {
    overlay: { count: 0, multiplier: 1.0, weight: 30, lastTriggered: 0 },
    focus: { count: 0, multiplier: 1.0, weight: 15, lastTriggered: 0 },
    typing: { count: 0, multiplier: 1.0, weight: 5, lastTriggered: 0 },
    lookaround: { count: 0, multiplier: 1.0, weight: 5, lastTriggered: 0 },
    person: { count: 0, multiplier: 1.0, weight: 10, lastTriggered: 0 },
    lip: { count: 0, multiplier: 1.0, weight: 1, lastTriggered: 0 },
    tabSwitch: { count: 0, lastTriggered: 0 },
    multipleScreens: { count: 0, lastTriggered: 0 }
  };

  private onScoreChange: ((score: number) => void) | null = null;
  private typingPattern: { timestamp: number; count: number }[] = [];
  private lastTypingCheck: number = 0;
  private readonly TYPING_CHECK_INTERVAL = 1000; // 1 second
  private readonly BURST_THRESHOLD = 10; // characters per second
  private readonly EVENT_COOLDOWN = 5000; // 5 seconds cooldown between same event types
  private readonly HEAD_MOVEMENT_THRESHOLD = 150; // Increased threshold for head movement
  private readonly HEAD_MOVEMENT_COOLDOWN = 2000; // 2 seconds cooldown for head movement
  private lastHeadMovement = { x: 0, y: 0, timestamp: 0 };
  private movementBuffer: { x: number; y: number; timestamp: number }[] = [];
  private readonly MOVEMENT_BUFFER_SIZE = 5;
  private readonly RAPID_MOVEMENT_THRESHOLD = 3; // Number of significant movements needed

  constructor() {
    this.initializeEventListeners();
    this.startTypingMonitor();
  }

  private initializeEventListeners() {
    // Tab switch detection
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.recordEvent('tabSwitch');
      }
    });

    // Focus detection
    window.addEventListener('blur', () => {
      this.recordEvent('focus');
    });

    // Multiple screens detection
    window.addEventListener('resize', () => {
      if (window.screen.width > window.innerWidth) {
        this.recordEvent('multipleScreens');
      }
    });

    // Head movement detection with improved accuracy
    window.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - this.lastHeadMovement.timestamp < this.HEAD_MOVEMENT_COOLDOWN) {
        return; // Skip if within cooldown
      }

      const movement = Math.sqrt(
        Math.pow(e.clientX - this.lastHeadMovement.x, 2) +
        Math.pow(e.clientY - this.lastHeadMovement.y, 2)
      );

      if (movement > this.HEAD_MOVEMENT_THRESHOLD) {
        // Add to movement buffer
        this.movementBuffer.push({ x: e.clientX, y: e.clientY, timestamp: now });
        if (this.movementBuffer.length > this.MOVEMENT_BUFFER_SIZE) {
          this.movementBuffer.shift();
        }

        // Check for rapid movements
        if (this.movementBuffer.length === this.MOVEMENT_BUFFER_SIZE) {
          let significantMovements = 0;
          for (let i = 1; i < this.movementBuffer.length; i++) {
            const prevMove = this.movementBuffer[i - 1];
            const currMove = this.movementBuffer[i];
            const moveDistance = Math.sqrt(
              Math.pow(currMove.x - prevMove.x, 2) +
              Math.pow(currMove.y - prevMove.y, 2)
            );
            if (moveDistance > this.HEAD_MOVEMENT_THRESHOLD) {
              significantMovements++;
            }
          }

          if (significantMovements >= this.RAPID_MOVEMENT_THRESHOLD) {
            this.recordEvent('lookaround');
            this.movementBuffer = []; // Reset buffer after detection
            this.lastHeadMovement = { x: e.clientX, y: e.clientY, timestamp: now };
          }
        }
      }
    });

    // Multiple people detection (simulated for demo)
    setInterval(() => {
      if (Math.random() < 0.05) {
        this.recordEvent('person');
      }
    }, 10000);

    // Lip movement detection (simulated for demo)
    setInterval(() => {
      if (Math.random() < 0.1) {
        this.recordEvent('lip');
      }
    }, 5000);
  }

  private startTypingMonitor() {
    setInterval(() => {
      const now = Date.now();
      if (now - this.lastTypingCheck >= this.TYPING_CHECK_INTERVAL) {
        this.checkTypingPattern();
        this.lastTypingCheck = now;
      }
    }, 1000);
  }

  private checkTypingPattern() {
    const now = Date.now();
    // Remove entries older than 1 second
    this.typingPattern = this.typingPattern.filter(
      entry => now - entry.timestamp < this.TYPING_CHECK_INTERVAL
    );

    // Calculate typing rate
    const totalChars = this.typingPattern.reduce((sum, entry) => sum + entry.count, 0);
    const typingRate = totalChars / (this.TYPING_CHECK_INTERVAL / 1000);

    // If typing rate exceeds threshold, record suspicious typing
    if (typingRate > this.BURST_THRESHOLD) {
      this.recordEvent('typing');
    }

    // Clear the pattern for next interval
    this.typingPattern = [];
  }

  public recordTyping(count: number) {
    this.typingPattern.push({
      timestamp: Date.now(),
      count
    });
  }

  public setScoreChangeCallback(callback: (score: number) => void) {
    this.onScoreChange = callback;
  }

  private canTriggerEvent(eventType: keyof Events): boolean {
    const now = Date.now();
    const event = this.events[eventType];
    
    if (!event.lastTriggered) return true;
    
    return now - event.lastTriggered >= this.EVENT_COOLDOWN;
  }

  public recordEvent(eventType: keyof Events) {
    if (!this.canTriggerEvent(eventType)) {
      return; // Skip if event is in cooldown
    }

    if (this.events.hasOwnProperty(eventType)) {
      const now = Date.now();
      
      if (eventType === 'tabSwitch') {
        this.events.tabSwitch.count++;
        this.events.tabSwitch.lastTriggered = now;
        console.log(`Tab switch event occurred. New count: ${this.events.tabSwitch.count}`);
      } else if (eventType === 'multipleScreens') {
        this.events.multipleScreens.count++;
        this.events.multipleScreens.lastTriggered = now;
        console.log(`Multiple screens event occurred. New count: ${this.events.multipleScreens.count}`);
      } else {
        this.events[eventType].count++;
        this.events[eventType].lastTriggered = now;
        if (eventType === 'lip') {
          this.events[eventType].multiplier += 0.1;
        } else {
          this.events[eventType].multiplier += 0.2;
        }
        console.log(`Event "${eventType}" occurred. New count: ${this.events[eventType].count}, Multiplier: ${this.events[eventType].multiplier}`);
      }

      // Calculate and update score
      const newScore = this.calculateScore();
      if (this.onScoreChange) {
        this.onScoreChange(newScore);
      }

      // Show appropriate toast messages
      this.showEventToast(eventType);
    } else {
      console.warn(`Event "${eventType}" is not defined.`);
    }
  }

  private showEventToast(eventType: keyof Events) {
    const messages: { [key in keyof Events]?: string } = {
      overlay: "Overlay attack detected!",
      focus: "Focus lost from interview window",
      typing: "Suspicious typing pattern detected",
      lookaround: "Excessive head movement detected",
      person: "Multiple people detected in frame",
      lip: "Suspicious lip movement detected",
      tabSwitch: "Tab switch detected",
      multipleScreens: "Multiple screens detected"
    };

    if (messages[eventType]) {
      toast.warning(messages[eventType], {
        description: `This will affect your honesty score.`,
        duration: 3000,
      });
    }
  }

  private calculateScore(): number {
    const baseScore = 100;
    
    // Calculate penalty from standard events
    const weightedPenalty = (
      this.events.overlay.count * this.events.overlay.weight * this.events.overlay.multiplier +
      this.events.focus.count * this.events.focus.weight * this.events.focus.multiplier +
      this.events.typing.count * this.events.typing.weight * this.events.typing.multiplier +
      this.events.lookaround.count * this.events.lookaround.weight * this.events.lookaround.multiplier +
      this.events.person.count * this.events.person.weight * this.events.person.multiplier +
      this.events.lip.count * this.events.lip.weight
    );
    
    // Calculate tab switch penalty
    let tabSwitchPenalty = 0;
    if (this.events.tabSwitch.count >= 3) {
      console.log("Disqualified due to excessive tab switching.");
      return 0; // Disqualified
    } else if (this.events.tabSwitch.count === 2) {
      tabSwitchPenalty = 30; // 1st time: 10, 2nd time: 20 (total 30)
    } else if (this.events.tabSwitch.count === 1) {
      tabSwitchPenalty = 10;
    }
    
    // Calculate multiple screens penalty
    const multipleScreensPenalty = this.events.multipleScreens.count * 40;
    
    // Calculate total penalty
    const totalPenalty = weightedPenalty + tabSwitchPenalty + multipleScreensPenalty;
    
    const trustScore = Math.max(0, baseScore - totalPenalty);
    return trustScore;
  }

  public getCurrentScore(): number {
    return this.calculateScore();
  }

  public resetEvents() {
    this.events = {
      overlay: { count: 0, multiplier: 1.0, weight: 30, lastTriggered: 0 },
      focus: { count: 0, multiplier: 1.0, weight: 15, lastTriggered: 0 },
      typing: { count: 0, multiplier: 1.0, weight: 5, lastTriggered: 0 },
      lookaround: { count: 0, multiplier: 1.0, weight: 5, lastTriggered: 0 },
      person: { count: 0, multiplier: 1.0, weight: 10, lastTriggered: 0 },
      lip: { count: 0, multiplier: 1.0, weight: 1, lastTriggered: 0 },
      tabSwitch: { count: 0, lastTriggered: 0 },
      multipleScreens: { count: 0, lastTriggered: 0 }
    };
  }
}

// Create a singleton instance
export const honestyScoreService = new HonestyScoreService(); 