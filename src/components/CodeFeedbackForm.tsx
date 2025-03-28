
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Check, X, MessageSquare, AlertCircle, Code, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface CodeFeedbackFormProps {
  candidateName: string;
  problemTitle: string;
  score: number;
  code: string;
  onSubmit: (feedback: CodeFeedback) => void;
  onClose: () => void;
}

export interface CodeFeedback {
  overallScore: number;
  timeComplexity: string;
  spaceComplexity: string;
  correctness: number;
  efficiency: number;
  styleAndFormatting: number;
  documentation: number;
  suggestions: string;
  strengths: string;
  areasToImprove: string;
}

const CodeFeedbackForm: React.FC<CodeFeedbackFormProps> = ({
  candidateName,
  problemTitle,
  score,
  code,
  onSubmit,
  onClose
}) => {
  const [showCode, setShowCode] = useState(false);
  const [feedback, setFeedback] = useState<CodeFeedback>({
    overallScore: score,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    correctness: 3,
    efficiency: 3,
    styleAndFormatting: 3,
    documentation: 3,
    suggestions: '',
    strengths: '',
    areasToImprove: ''
  });
  
  const handleChange = (name: keyof CodeFeedback, value: string | number) => {
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(feedback);
    toast.success('Feedback submitted successfully');
    onClose();
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md border p-6 max-w-3xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Provide Code Feedback</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="font-medium">Candidate Solution for "{problemTitle}"</h3>
            <p className="text-sm text-muted-foreground">Candidate: {candidateName}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-1"
          >
            <Code className="h-4 w-4" />
            {showCode ? 'Hide Code' : 'View Code'}
            {showCode ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {showCode && (
          <div className="bg-gray-50 border rounded-md p-3 mb-4 overflow-auto max-h-[300px]">
            <pre className="text-sm font-mono whitespace-pre-wrap">{code}</pre>
          </div>
        )}
        
        <div className="flex items-center bg-brand-50 rounded-md p-3 text-brand-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p className="text-sm">The candidate solution received an automated score of <strong>{score}%</strong></p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Time Complexity
            </label>
            <select
              value={feedback.timeComplexity}
              onChange={(e) => handleChange('timeComplexity', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="O(1)">O(1) - Constant</option>
              <option value="O(log n)">O(log n) - Logarithmic</option>
              <option value="O(n)">O(n) - Linear</option>
              <option value="O(n log n)">O(n log n) - Linearithmic</option>
              <option value="O(n²)">O(n²) - Quadratic</option>
              <option value="O(n³)">O(n³) - Cubic</option>
              <option value="O(2^n)">O(2^n) - Exponential</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Space Complexity
            </label>
            <select
              value={feedback.spaceComplexity}
              onChange={(e) => handleChange('spaceComplexity', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="O(1)">O(1) - Constant</option>
              <option value="O(log n)">O(log n) - Logarithmic</option>
              <option value="O(n)">O(n) - Linear</option>
              <option value="O(n log n)">O(n log n) - Linearithmic</option>
              <option value="O(n²)">O(n²) - Quadratic</option>
              <option value="O(n³)">O(n³) - Cubic</option>
              <option value="O(2^n)">O(2^n) - Exponential</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Correctness (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    feedback.correctness === score 
                      ? 'bg-brand-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleChange('correctness', score)}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Efficiency (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    feedback.efficiency === score 
                      ? 'bg-brand-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleChange('efficiency', score)}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Style & Formatting (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    feedback.styleAndFormatting === score 
                      ? 'bg-brand-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleChange('styleAndFormatting', score)}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Documentation/Comments (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    feedback.documentation === score 
                      ? 'bg-brand-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleChange('documentation', score)}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Code Strengths
          </label>
          <textarea
            value={feedback.strengths}
            onChange={(e) => handleChange('strengths', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-24"
            placeholder="What aspects of the solution are well implemented?"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Areas to Improve
          </label>
          <textarea
            value={feedback.areasToImprove}
            onChange={(e) => handleChange('areasToImprove', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-24"
            placeholder="What could be improved in the solution?"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Specific Suggestions
          </label>
          <textarea
            value={feedback.suggestions}
            onChange={(e) => handleChange('suggestions', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-24"
            placeholder="Provide specific code improvements or alternative approaches..."
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CodeFeedbackForm;
