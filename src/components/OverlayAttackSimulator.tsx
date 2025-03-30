
import { useState, useEffect } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";
import { startDOMMonitoring, stopDOMMonitoring, logRedFlag } from "@/utils/shadowSight";

interface OverlayAttackSimulatorProps {
  className?: string;
}

const OverlayAttackSimulator = ({ className }: OverlayAttackSimulatorProps) => {
  const [isActive, setIsActive] = useState(false);
  const [monitoringEnabled, setMonitoringEnabled] = useState(false);

  // Start/stop DOM monitoring when the toggle changes
  useEffect(() => {
    if (monitoringEnabled) {
      startDOMMonitoring();
      return () => stopDOMMonitoring();
    }
  }, [monitoringEnabled]);

  // Handle the overlay attack simulation
  useEffect(() => {
    if (!isActive) {
      // Remove any existing overlay
      const existingOverlay = document.getElementById("simulated-attack-overlay");
      if (existingOverlay) {
        document.body.removeChild(existingOverlay);
      }
      return;
    }

    // Create and inject the overlay div
    const overlay = document.createElement("div");
    overlay.id = "simulated-attack-overlay";
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.opacity = "0.01";
    overlay.style.zIndex = "9999";
    overlay.style.pointerEvents = "none";
    overlay.style.backgroundColor = "transparent";
    
    const editorArea = document.querySelector(".CodeMirror, .code-editor-area") || document.body;
    
    // Position the overlay relative to the editor area
    if (editorArea !== document.body) {
      overlay.style.position = "absolute";
      editorArea.appendChild(overlay);
    } else {
      // Default to body if specific editor can't be found
      document.body.appendChild(overlay);
    }
    
    // Log using ShadowSight
    logRedFlag("overlay", "Simulated attack overlay injected for testing");
    console.warn("[ShadowSight] Simulated overlay element detected on editor area");
    
    // Show a warning message
    toast.warning("Simulated overlay active", {
      description: "ShadowSight would detect this in a real interview.",
      duration: 4000,
    });
    
    return () => {
      // Cleanup when component unmounts or toggle turns off
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };
  }, [isActive]);

  return (
    <div className={className}>
      <div className="flex items-center gap-2 flex-wrap">
        <Toggle
          pressed={isActive}
          onPressedChange={setIsActive}
          aria-label="Toggle overlay attack simulation"
          variant="outline"
          className={`${isActive ? "bg-red-100 text-red-700 border-red-300" : ""}`}
        >
          {isActive ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
          Simulate Overlay Attack
        </Toggle>
        
        <Toggle
          pressed={monitoringEnabled}
          onPressedChange={setMonitoringEnabled}
          aria-label="Toggle ShadowSight monitoring"
          variant="outline"
          className={`${monitoringEnabled ? "bg-green-100 text-green-700 border-green-300" : ""}`}
        >
          <Shield className="h-4 w-4 mr-1" />
          DOM Monitoring
        </Toggle>
        
        {isActive && (
          <span className="text-xs text-red-600 font-medium flex items-center">
            <span className="h-2 w-2 rounded-full bg-red-600 mr-1 animate-pulse"></span>
            Active
          </span>
        )}
        
        {monitoringEnabled && (
          <span className="text-xs text-green-600 font-medium flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-600 mr-1 animate-pulse"></span>
            Monitoring
          </span>
        )}
      </div>
    </div>
  );
};

export default OverlayAttackSimulator;
