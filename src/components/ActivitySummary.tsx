import React from 'react';
import { AlertTriangle, Eye, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivitySummaryProps {
  session: any;
  honestyScore: number;
  flagDescriptions: { [key: string]: string };
  className?: string;
}

export function ActivitySummary({ session, honestyScore, flagDescriptions, className }: ActivitySummaryProps) {
  if (!session) return null;

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-amber-600" />
          <h3 className="text-sm font-medium">Activity Monitor</h3>
        </div>
        <div className={cn(
          "text-sm font-medium",
          honestyScore >= 90 ? "text-green-500" :
          honestyScore >= 70 ? "text-amber-500" : "text-red-500"
        )}>
          Trust Score: {honestyScore}%
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="space-y-2 max-h-[150px] overflow-y-auto">
        {Object.entries(flagDescriptions).map(([flag, description], index) => (
          <div
            key={flag}
            className="flex items-start gap-2 p-2 bg-amber-50 rounded-md border border-amber-100 animate-fadeIn"
          >
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-800">{description}</p>
              <p className="text-xs text-amber-600 mt-0.5">
                Detected {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {Object.keys(flagDescriptions).length === 0 && (
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-md border border-green-100">
            <Shield className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-800">No suspicious activity detected</p>
          </div>
        )}
      </div>
    </div>
  );
} 