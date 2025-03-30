import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Code, Play, Check, Loader2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { compileAndExecuteCode } from '@/services/compilerService';
import CodeExecutionResults from './CodeExecutionResults';
import useBehavioralTracking from '@/hooks/useBehavioralTracking';
import OverlayAttackSimulator from './OverlayAttackSimulator';
import { toast } from 'sonner';
import { honestyScoreService } from '@/services/honestyScoreService';
import { BehavioralSession, BehavioralEvent, initBehavioralSession } from '@/services/behavioralAnalyticsService';

const placeholderCode = {
  java: `// Java code template
public class Solution {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello, world!");
    }
}`,
  cpp: `// C++ code template
#include <iostream>

int main() {
    // Write your code here
    std::cout << "Hello, world!" << std::endl;
    return 0;
}`,
  python: `# Python code template
def solution():
    # Write your code here
    print("Hello, world!")

if __name__ == "__main__":
    solution()
`
};

interface CodeEditorPanelProps {
  initialCode?: string;
  language?: 'java' | 'cpp' | 'python';
  onRun?: (code: string) => void;
  onBehavioralUpdate?: (session: BehavioralSession, score: number, flags: { [key: string]: string }) => void;
  className?: string;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  initialCode,
  language = 'java',
  onRun,
  onBehavioralUpdate,
  className,
}) => {
  const [code, setCode] = useState(initialCode || placeholderCode[language]);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'output'>('editor');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [session, setSession] = useState<BehavioralSession>(initBehavioralSession());
  const [honestyScore, setHonestyScore] = useState(100);
  const [flagDescriptions, setFlagDescriptions] = useState<{ [key: string]: string }>({});
  const [interceptedEvents, setInterceptedEvents] = useState<string[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [antiCheatMode, setAntiCheatMode] = useState<'passive' | 'active'>('passive');
  const [interventionsEnabled, setInterventionsEnabled] = useState(true);
  const warningsIssued = useRef(0);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [executionSuccess, setExecutionSuccess] = useState<boolean>(false);

  const {
    startTracking,
    trackKeystroke,
    trackPaste,
  } = useBehavioralTracking();

  useEffect(() => {
    startTracking();
  }, [startTracking]);

  // Set up honesty score service callback
  useEffect(() => {
    const handleScoreChange = (score: number) => {
      setHonestyScore(score);
      if (onBehavioralUpdate && session) {
        onBehavioralUpdate(session, score, flagDescriptions);
      }
    };

    honestyScoreService.setScoreChangeCallback(handleScoreChange);

    return () => {
      honestyScoreService.setScoreChangeCallback(null);
    };
  }, [onBehavioralUpdate, session, flagDescriptions]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    // Track typing pattern
    const changes = newCode.length - code.length;
    if (changes > 0) {
      honestyScoreService.recordTyping(changes);
    }
    
    trackKeystroke();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    trackPaste(pastedText.length);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    setError(null);
    setExecutionError(null);
    setExecutionSuccess(false);

    try {
      const result = await compileAndExecuteCode(code, { language });
      setOutput(result.output);
      setExecutionTime(result.executionTime);
      setExecutionError(result.error);
      setExecutionSuccess(result.success);

      if (result.success) {
        toast.success('Code executed successfully');
      } else {
        toast.error('Code execution failed');
      }

      if (onRun) {
        onRun(code);
      }
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput(null);
      setExecutionError('An unexpected error occurred while executing the code.');
      setExecutionSuccess(false);
      toast.error('Execution error');
    } finally {
      setIsRunning(false);
    }
  };

  const languageExtensions = {
    java: 'java',
    cpp: 'cpp',
    python: 'py',
  };

  const editorVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  // Update session state with proper types
  const updateSession = (newFlags: string[]) => {
    setSession(prev => ({
      ...prev,
      flags: newFlags,
      anomalyScore: prev.anomalyScore + 1
    }));
  };

  const handleOverlayDetected = () => {
    setSession(prev => ({
      ...prev,
      flags: [...prev.flags, 'overlay_detected'],
      anomalyScore: prev.anomalyScore + 1
    }));
    
    if (onBehavioralUpdate) {
      onBehavioralUpdate(session, honestyScore, { ...flagDescriptions, overlay_detected: 'Overlay attack detected' });
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl border shadow-soft overflow-hidden transition-all",
        isFullscreen ? "fixed inset-0 z-50 rounded-none m-0" : "",
        className
      )}
    >
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          <OverlayAttackSimulator 
            className="mr-2" 
            onHonestyScoreChange={(score, message) => {
              if (session) {
                const updatedSession = {
                  ...session,
                  flags: [...session.flags, 'overlay_detected'],
                  anomalyScore: session.anomalyScore + 1
                };
                setSession(updatedSession);
                setHonestyScore(score);
                if (onBehavioralUpdate) {
                  onBehavioralUpdate(updatedSession, score, { ...flagDescriptions, overlay_detected: message });
                }
              }
            }}
          />

          <div className="flex items-center rounded-md border bg-white p-1">
            <button
              onClick={() => setActiveTab('editor')}
              className={cn(
                "rounded px-2 py-1 text-xs font-medium transition-colors",
                activeTab === 'editor'
                  ? "bg-brand-500 text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={cn(
                "rounded px-2 py-1 text-xs font-medium transition-colors",
                activeTab === 'output'
                  ? "bg-brand-500 text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Output
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center rounded-md border px-3 py-1.5 transition-colors",
            honestyScore >= 90 ? "bg-green-50 border-green-200" :
            honestyScore >= 70 ? "bg-yellow-50 border-yellow-200" :
            "bg-red-50 border-red-200"
          )}>
            <div className="flex flex-col">
              <span className="text-xs text-gray-600 font-medium">Trust Score</span>
              <span className={cn(
                "text-lg font-bold",
                honestyScore >= 90 ? "text-green-600" :
                honestyScore >= 70 ? "text-yellow-600" :
                "text-red-600"
              )}>
                {honestyScore}%
              </span>
            </div>
            <div className={cn(
              "ml-2 w-2 h-2 rounded-full animate-pulse",
              honestyScore >= 90 ? "bg-green-500" :
              honestyScore >= 70 ? "bg-yellow-500" :
              "bg-red-500"
            )} />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRunCode}
            disabled={isRunning}
            className="text-xs h-8"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Running
              </>
            ) : (
              <>
                <Play className="mr-1 h-3 w-3" />
                Run Code
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="h-[400px] overflow-auto relative">
        <AnimatePresence mode="wait">
          {activeTab === 'editor' ? (
            <motion.div
              key="editor"
              variants={editorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full"
            >
              <div className="flex h-full">
                <div className="bg-gray-50 text-right pr-2 pt-2 select-none border-r border-gray-100">
                  {Array.from({ length: code.split('\n').length }).map((_, i) => (
                    <div key={i} className="text-xs text-muted-foreground px-2">
                      {i + 1}
                    </div>
                  ))}
                </div>

                <textarea
                  value={code}
                  onChange={handleCodeChange}
                  onPaste={handlePaste}
                  className="flex-1 p-2 resize-none font-mono text-sm focus:outline-none"
                  spellCheck="false"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="output"
              variants={editorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full overflow-auto"
            >
              <div className="bg-gray-50 p-3 border-b">
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${isRunning ? 'bg-yellow-400' : error ? 'bg-red-400' : 'bg-green-400'}`}></div>
                  <span className="text-xs font-medium">
                    {isRunning ? 'Running...' : error ? 'Execution failed' : 'Execution complete'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                {isRunning ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="flex flex-col items-center space-y-3">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <div className="bg-muted/20 rounded-md p-2 flex items-center text-sm">
                        <Lock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        Running in secure sandbox environment
                      </div>
                    </div>
                  </div>
                ) : (
                  <CodeExecutionResults
                    output={output || ''}
                    error={executionError}
                    executionTime={executionTime}
                    success={executionSuccess}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CodeEditorPanel;
