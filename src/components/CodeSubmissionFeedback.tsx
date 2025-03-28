
import React from 'react';
import { Button } from '@/components/Button';
import { Check, X, MessageSquare, AlertCircle, ThumbsUp, Download } from 'lucide-react';
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
  
  const handleDownloadResults = () => {
    // Create a text summary of the results
    const resultsText = `
CODE EVALUATION RESULTS
=======================
Score: ${score}/100
Tests Passed: ${passedTests}/${totalTests} (${percentagePassed}%)

INDIVIDUAL TEST RESULTS:
${testResults.map((result, index) => `
Test ${index + 1}: ${result.passed ? 'PASSED' : 'FAILED'}
Test Case: ${result.testCase}
${!result.passed ? `Expected: ${result.expected}\nActual: ${result.actual}` : ''}
`).join('\n')}
    `.trim();
    
    // Create a download link
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code-evaluation-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Results downloaded successfully');
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md border p-6 max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Code Submission Results</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Tests Passed</div>
            <div className="text-2xl font-bold">{passedTests}/{totalTests} ({percentagePassed}%)</div>
          </div>
          
          <div className="h-24 w-24 rounded-full flex items-center justify-center border-8 mx-auto sm:mx-0" 
               style={{ 
                 borderColor: score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444',
                 color: score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444',
               }}>
            <span className="text-2xl font-bold">{score}</span>
          </div>
        </div>
        
        {score >= 80 && (
          <div className="bg-green-50 border border-green-100 text-green-800 rounded-md p-4 flex items-start">
            <ThumbsUp className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Great job!</h4>
              <p className="text-sm">Your solution successfully passed most test cases with high performance.</p>
            </div>
          </div>
        )}
        
        {score < 40 && (
          <div className="bg-amber-50 border border-amber-100 text-amber-800 rounded-md p-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-3 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Keep trying!</h4>
              <p className="text-sm">Your solution didn't pass most test cases. Review the failed tests below.</p>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <h3 className="font-medium">Test Results</h3>
          <div className="max-h-[300px] overflow-auto pr-1 rounded-md border">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`p-3 ${index !== testResults.length - 1 ? 'border-b' : ''} ${result.passed ? 'bg-green-50' : 'bg-red-50'}`}
              >
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
        </div>
        
        <div className="flex flex-wrap justify-end gap-3">
          <Button 
            variant="outline" 
            type="button"
            onClick={handleDownloadResults}
            className="gap-1"
          >
            <Download className="h-4 w-4" />
            Download Results
          </Button>
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
            Request Detailed Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeSubmissionFeedback;
