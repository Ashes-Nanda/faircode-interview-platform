
import React from 'react';
import { AlertTriangle, Check, Clock, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BehavioralSession } from '@/services/behavioralAnalyticsService';

interface BehavioralAnalyticsProps {
  session: BehavioralSession;
  honestyScore: number;
  flagDescriptions: { [key: string]: string };
  className?: string;
}

export const BehavioralAnalytics: React.FC<BehavioralAnalyticsProps> = ({
  session,
  honestyScore,
  flagDescriptions,
  className,
}) => {
  // Get the color for the honesty score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  // Get the status message based on flags and score
  const getStatusMessage = () => {
    if (session.flags.length === 0) return 'No suspicious behavior detected';
    if (session.flags.length === 1) return '1 potential issue detected';
    return `${session.flags.length} potential issues detected`;
  };

  // Calculate session duration
  const sessionDuration = Math.floor((Date.now() - session.startTime) / 1000);
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Behavioral Analysis</h3>
        <div className="text-sm text-muted-foreground flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1" /> 
          Session time: {formatDuration(sessionDuration)}
        </div>
      </div>
      
      {/* Honesty Score */}
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-2 text-brand-600" />
            <span className="font-medium">Honesty Score</span>
          </div>
          <div className={cn("font-semibold text-xl", getScoreColor(honestyScore))}>
            {honestyScore}/100
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className={cn(
              "h-2.5 rounded-full", 
              honestyScore >= 90 ? "bg-green-500" : 
              honestyScore >= 70 ? "bg-amber-500" : "bg-red-500"
            )} 
            style={{ width: `${honestyScore}%` }}
          ></div>
        </div>
        
        <div className="text-sm mt-2 text-muted-foreground">
          {getStatusMessage()}
        </div>
      </div>
      
      {/* Flagged Behaviors */}
      {session.flags.length > 0 && (
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center mb-3">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
            <span className="font-medium text-amber-800">Flagged Behaviors</span>
          </div>
          
          <ul className="space-y-2">
            {Object.entries(flagDescriptions).map(([flag, description]) => (
              <li key={flag} className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <AlertTriangle className="h-3 w-3 text-amber-600" />
                </div>
                <span className="text-sm">{description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* No Flags */}
      {session.flags.length === 0 && (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center">
            <Check className="h-4 w-4 mr-2 text-green-600" />
            <span className="text-sm text-green-800">No suspicious behavior detected</span>
          </div>
        </div>
      )}
      
      {/* Event Summary */}
      <div className="bg-gray-50 rounded-lg p-4 border">
        <h4 className="text-sm font-medium mb-2">Activity Summary</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Keystroke events:</span>{' '}
            {session.events.filter(e => e.type === 'keystroke').length}
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Paste events:</span>{' '}
            {session.events.filter(e => e.type === 'paste').length}
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Focus lost:</span>{' '}
            {session.events.filter(e => e.type === 'focus_lost').length} times
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Tab switches:</span>{' '}
            {session.events.filter(e => e.type === 'tab_switch').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehavioralAnalytics;
