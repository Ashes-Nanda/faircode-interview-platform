
import React from 'react';
import { Button } from '@/components/Button';
import { Check, X, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface CodeSubmissionFeedbackProps {
  testResults: {
    passed: boolean;
    message: string;
    testCase: string;
    expected: string;
    actual: string;
  }[];
  score: number;
  onProvideDetailedFeedback: () => void;
  onClose: () => void;
}

const CodeSubmissionFeedback: React.FC<CodeSubmissionFeedbackProps> = ({
  testResults,
  score,
  onProvideDetailedFeedback,
  onClose
}) => {
  const passedTests = testResults.filter(result => result.passed).length;
  const totalTests = testResults.length;
  const percentagePassed = Math.round((passedTests / totalTests) * 100);
  
  return (
    <div className="bg-white rounded-xl shadow-md border p-6 max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Code Submission Results</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Tests Passed</div>
            <div className="text-2xl font-bold">{passedTests}/{totalTests} ({percentagePassed}%)</div>
          </div>
          
          <div className="h-24 w-24 rounded-full flex items-center justify-center border-8" 
               style={{ 
                 borderColor: score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444',
                 color: score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444',
               }}>
            <span className="text-2xl font-bold">{score}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-medium">Test Results</h3>
          {testResults.map((result, index) => (
            <div key={index} className={`p-3 rounded-md ${result.passed ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-start">
                <div className={`mt-0.5 mr-2 ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
                  {result.passed ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                </div>
                <div>
                  <div className="font-medium">Test {index + 1}</div>
                  <div className="text-sm">{result.testCase}</div>
                  {!result.passed && (
                    <div className="mt-2 space-y-1 text-sm">
                      <div><span className="font-medium">Expected:</span> {result.expected}</div>
                      <div><span className="font-medium">Actual:</span> {result.actual}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            type="button"
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            onClick={onProvideDetailedFeedback}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Provide Detailed Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeSubmissionFeedback;
