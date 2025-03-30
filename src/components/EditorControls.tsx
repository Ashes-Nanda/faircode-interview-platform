import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EditorControlsProps {
  onHonestyScoreChange: (score: number, message: string) => void;
}

export function EditorControls({ onHonestyScoreChange }: EditorControlsProps) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);

  // Function to create and inject the overlay
  const createOverlay = () => {
    console.log("Creating overlay...");
    const overlay = document.createElement('div');
    overlay.id = 'simulated-attack-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(209, 20, 20, 0.8);
      z-index: 999999;
      pointer-events: none;
      display: block !important;
      visibility: visible !important;
      opacity: 0.1 !important;
    `;
    console.log("Overlay element created:", overlay);
    
    if (document.body) {
      document.body.appendChild(overlay);
      console.log("Overlay appended to body");
      
      // Verify the overlay exists in DOM
      const overlayElement = document.getElementById('simulated-attack-overlay');
      console.log("Overlay exists in DOM:", !!overlayElement);
    } else {
      console.error("document.body not found");
    }
    setOverlayActive(true);
  };

  // Function to remove the overlay
  const removeOverlay = () => {
    const overlay = document.getElementById('simulated-attack-overlay');
    if (overlay) {
      overlay.remove();
      setOverlayActive(false);
    }
  };

  // Handle overlay attack simulation
  const handleOverlayAttack = () => {
    console.log("Overlay attack button clicked, current state:", overlayActive);
    if (overlayActive) {
      removeOverlay();
      toast.info("Overlay attack simulation removed");
    } else {
      createOverlay();
      toast.info("Overlay attack simulation started");
    }
  };

  // Handle DOM monitoring toggle
  const handleMonitoringToggle = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      // Import and initialize shadowSight monitoring
      import('../lib/shadowSight').then(() => {
        toast.success("DOM Monitoring activated");
      });
    } else {
      // Remove the observer
      const observer = (window as any).shadowSightObserver;
      if (observer) {
        observer.disconnect();
        toast.info("DOM Monitoring deactivated");
      }
    }
  };

  // Effect to handle overlay detection
  useEffect(() => {
    if (isMonitoring && overlayActive) {
      onHonestyScoreChange(-10, "DOM wrapper detected");
      toast.error("DOM wrapper detected! Honesty score affected.");
    }
  }, [isMonitoring, overlayActive, onHonestyScoreChange]);

  // Add this near your other useEffect
  useEffect(() => {
    console.log("EditorControls mounted");
    return () => {
      // Cleanup any existing overlay on unmount
      removeOverlay();
      console.log("EditorControls unmounted");
    };
  }, []);

  return (
    <div className="flex gap-4 p-4">
      <Button
        variant={overlayActive ? "destructive" : "default"}
        onClick={handleOverlayAttack}
      >
        {overlayActive ? "Remove Overlay Attack" : "Simulate Overlay Attack"}
      </Button>
      <Button
        variant={isMonitoring ? "destructive" : "default"}
        onClick={handleMonitoringToggle}
      >
        {isMonitoring ? "Deactivate DOM Monitoring" : "Activate DOM Monitoring"}
      </Button>
    </div>
  );
} 