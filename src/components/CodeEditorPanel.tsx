
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Code, Play, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface CodeEditorPanelProps {
  initialCode?: string;
  language?: 'java' | 'cpp' | 'python';
  onRun?: (code: string) => void;
  className?: string;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  initialCode = '// Write your code here\n\n',
  language = 'java',
  onRun,
  className,
}) => {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'output'>('editor');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    setActiveTab('output');
    
    // Simulate code execution
    setTimeout(() => {
      setIsRunning(false);
      setOutput('// Output will appear here after execution\nHello, World!');
      
      if (onRun) {
        onRun(code);
      }
    }, 1500);
  };

  const langSyntax = {
    java: 'java',
    cpp: 'cpp',
    python: 'python',
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

  const languageExtensions = {
    java: 'java',
    cpp: 'cpp',
    python: 'py',
  };

  // Sample placeholder code for demonstration
  const placeholderCode = {
    java: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
    python: `def greet():
    print("Hello, World!")

greet()`,
  };

  useEffect(() => {
    setCode(placeholderCode[language]);
  }, [language]);

  return (
    <div 
      className={cn(
        "bg-white rounded-xl border shadow-soft overflow-hidden transition-all",
        isFullscreen ? "fixed inset-0 z-50 rounded-none m-0" : "",
        className
      )}
    >
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b p-3 bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
          </div>
          <div className="text-xs font-medium text-muted-foreground px-2 py-1 rounded bg-gray-100">
            main.{languageExtensions[language]}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
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

      {/* Editor Body */}
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
                {/* Line numbers */}
                <div className="bg-gray-50 text-right pr-2 pt-2 select-none border-r border-gray-100">
                  {Array.from({ length: code.split('\n').length }).map((_, i) => (
                    <div key={i} className="text-xs text-muted-foreground px-2">
                      {i + 1}
                    </div>
                  ))}
                </div>
                
                {/* Code area */}
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
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
              className="h-full"
            >
              <div className="bg-gray-50 p-3 border-b">
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${isRunning ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                  <span className="text-xs font-medium">
                    {isRunning ? 'Running...' : 'Execution complete'}
                  </span>
                </div>
              </div>
              
              <div className="p-4 font-mono text-sm">
                {isRunning ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap">{output || 'No output yet'}</pre>
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
