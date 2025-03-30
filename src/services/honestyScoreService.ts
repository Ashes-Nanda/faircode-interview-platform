import { toast } from 'sonner';

interface Event {
  count: number;
  multiplier: number;
  weight: number;
}

interface Events {
  overlay: Event;
  focus: Event;
  typing: Event;
  lookaround: Event;
  person: Event;
  lip: Event;
  tabSwitch: { count: number };
  multipleScreens: { count: number };
}

class HonestyScoreService {
  private events: Events = {
    overlay: { count: 0, multiplier: 1.0, weight: 30 },
    focus: { count: 0, multiplier: 1.0, weight: 15 },
    typing: { count: 0, multiplier: 1.0, weight: 5 },
    lookaround: { count: 0, multiplier: 1.0, weight: 5 },
    person: { count: 0, multiplier: 1.0, weight: 10 },
    lip: { count: 0, multiplier: 1.0, weight: 1 },
    tabSwitch: { count: 0 },
    multipleScreens: { count: 0 }
  };

  private onScoreChange: ((score: number) => void) | null = null;

  constructor() {
    // Initialize event listeners
    this.initializeEventListeners();
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
  }

  public setScoreChangeCallback(callback: (score: number) => void) {
    this.onScoreChange = callback;
  }

  public recordEvent(eventType: keyof Events) {
    if (this.events.hasOwnProperty(eventType)) {
      if (eventType === 'tabSwitch') {
        this.events.tabSwitch.count++;
        console.log(`Tab switch event occurred. New count: ${this.events.tabSwitch.count}`);
      } else if (eventType === 'multipleScreens') {
        this.events.multipleScreens.count++;
        console.log(`Multiple screens event occurred. New count: ${this.events.multipleScreens.count}`);
      } else {
        this.events[eventType].count++;
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
      overlay: { count: 0, multiplier: 1.0, weight: 30 },
      focus: { count: 0, multiplier: 1.0, weight: 15 },
      typing: { count: 0, multiplier: 1.0, weight: 5 },
      lookaround: { count: 0, multiplier: 1.0, weight: 5 },
      person: { count: 0, multiplier: 1.0, weight: 10 },
      lip: { count: 0, multiplier: 1.0, weight: 1 },
      tabSwitch: { count: 0 },
      multipleScreens: { count: 0 }
    };
  }
}

// Create a singleton instance
export const honestyScoreService = new HonestyScoreService(); 