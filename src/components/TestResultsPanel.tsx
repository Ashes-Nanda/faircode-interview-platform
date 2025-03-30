
import React from 'react';
import { TestResult } from '@/services/evaluationService';
import { Check, X, Clock } from 'lucide-react';
import { Button } from './Button';

interface TestResultsPanelProps {
  testResults: TestResult[];
  score: number;
  executionTime?: number;
  onRequestFeedback: () => void;
  isGeneratingFeedback?: boolean;
  feedback?: string;
  onClose?: () => void;
}

const TestResultsPanel: React.FC<TestResultsPanelProps> = ({
  testResults,
  score,
  executionTime,
  onRequestFeedback,
  isGeneratingFeedback,
  feedback,
  onClose
}) => {
  const passedTests = testResults.filter(result => result.passed).length;
  const totalTests = testResults.length;
  
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h2 className="font-medium text-lg">Test Results</h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Tests Passed</div>
            <div className="text-xl font-bold">
              {passedTests}/{totalTests} ({Math.round((passedTests / totalTests) * 100)}%)
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-muted-foreground">Score</div>
            <div className="text-xl font-bold">{score}/100</div>
          </div>
          
          {executionTime && (
            <div>
              <div className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" /> Execution Time
              </div>
              <div className="text-xl font-bold">{executionTime}ms</div>
            </div>
          )}
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <div className="bg-gray-50 py-2 px-4 border-b">
            <div className="flex justify-between text-sm font-medium">
              <span>Test Case</span>
              <span>Result</span>
            </div>
          </div>
          
          <div className="divide-y max-h-[300px] overflow-auto">
            {testResults.map((result, index) => (
              <div key={index} className="px-4 py-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="font-medium">{result.testCase}</div>
                    {!result.passed && (
                      <div className="text-sm space-y-1">
                        <div className="text-muted-foreground">
                          Expected: <span className="font-mono text-sm">{result.expected}</span>
                        </div>
                        <div className="text-muted-foreground">
                          Actual: <span className="font-mono text-sm">{result.actual}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    {result.passed ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="h-3.5 w-3.5 mr-1" /> Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <X className="h-3.5 w-3.5 mr-1" /> Fail
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {feedback ? (
          <div className="rounded-md border-l-4 border-blue-500 bg-blue-50 p-4">
            <h3 className="font-medium text-blue-800">AI Feedback</h3>
            <p className="text-sm text-blue-700 mt-1">{feedback}</p>
          </div>
        ) : (
          <div className="flex justify-end">
            <Button 
              onClick={onRequestFeedback} 
              disabled={isGeneratingFeedback}
            >
              {isGeneratingFeedback ? 'Generating Feedback...' : 'Get AI Feedback'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResultsPanel;
