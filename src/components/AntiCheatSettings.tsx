
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Bell 
} from 'lucide-react';

interface AntiCheatSettingsProps {
  antiCheatMode: 'passive' | 'active';
  setAntiCheatMode: (mode: 'passive' | 'active') => void;
  interventionsEnabled: boolean;
  toggleInterventions: (enabled: boolean) => void;
  interceptedEvents: string[];
}

const AntiCheatSettings: React.FC<AntiCheatSettingsProps> = ({
  antiCheatMode,
  setAntiCheatMode,
  interventionsEnabled,
  toggleInterventions,
  interceptedEvents
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Shield className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium mb-2">Anti-Cheat Protection</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border rounded-md p-3 bg-white">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">Passive Mode</span>
                  <p className="text-xs text-muted-foreground">Monitor behavior without intervention</p>
                </div>
              </div>
              <Toggle
                pressed={antiCheatMode === 'passive'}
                onPressedChange={() => setAntiCheatMode('passive')}
                aria-label="Toggle passive mode"
              />
            </div>
            
            <div className="flex items-center justify-between border rounded-md p-3 bg-white">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <div>
                  <span className="text-sm font-medium">Active Mode</span>
                  <p className="text-xs text-muted-foreground">Alert and intervene on suspicious actions</p>
                </div>
              </div>
              <Toggle
                pressed={antiCheatMode === 'active'}
                onPressedChange={() => setAntiCheatMode('active')}
                aria-label="Toggle active mode"
              />
            </div>
            
            <div className="flex items-center justify-between border rounded-md p-3 bg-white">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">Candidate Warnings</span>
                  <p className="text-xs text-muted-foreground">Show alerts to the candidate</p>
                </div>
              </div>
              <Toggle
                pressed={interventionsEnabled}
                onPressedChange={toggleInterventions}
                aria-label="Toggle interventions"
              />
            </div>
          </div>
        </div>
      </div>
      
      {interceptedEvents.length > 0 && (
        <div className="bg-amber-50 rounded-md p-3 border border-amber-200">
          <h4 className="text-sm font-medium text-amber-700 mb-2">
            Intercepted Activities ({interceptedEvents.length})
          </h4>
          <ul className="text-xs text-amber-600 space-y-1">
            {interceptedEvents.map((event, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>
                  {event.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AntiCheatSettings;
