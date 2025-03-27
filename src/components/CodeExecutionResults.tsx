
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Clock, AlertTriangle, X } from 'lucide-react';

interface CodeExecutionResultsProps {
  output: string;
  error: string | null;
  executionTime: number;
  success: boolean;
  className?: string;
}

export const CodeExecutionResults: React.FC<CodeExecutionResultsProps> = ({
  output,
  error,
  executionTime,
  success,
  className,
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between bg-muted/50 rounded-md p-2">
        <div className="flex items-center gap-2">
          {success ? (
            <div className="flex items-center text-green-600 font-medium">
              <Check className="h-4 w-4 mr-1" />
              Execution Successful
            </div>
          ) : (
            <div className="flex items-center text-destructive font-medium">
              <X className="h-4 w-4 mr-1" />
              Execution Failed
            </div>
          )}
        </div>
        
        <div className="flex items-center text-muted-foreground text-sm">
          <Clock className="h-3.5 w-3.5 mr-1" />
          {executionTime}ms
        </div>
      </div>
      
      {success ? (
        <div className="bg-black text-white font-mono text-sm p-4 rounded-md overflow-auto max-h-[300px]">
          <pre className="whitespace-pre-wrap">{output || 'No output generated'}</pre>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 text-red-800 font-mono text-sm p-4 rounded-md overflow-auto max-h-[300px]">
          <div className="flex items-start mb-2">
            <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <span className="font-semibold">Compilation/Execution Error</span>
          </div>
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeExecutionResults;
