
import React, { useState } from 'react';
import { Button } from './Button';
import { Check, Code, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface CodeReviewFormProps {
  candidateName: string;
  problemTitle: string;
  code: string;
  onSubmit: (feedback: CodeReviewFeedback) => void;
  onClose: () => void;
}

export interface CodeReviewFeedback {
  algorithmRating: number;
  codeQualityRating: number;
  problemSolvingRating: number;
  overallRating: number;
  timeComplexity: string;
  spaceComplexity: string;
  strengths: string;
  improvements: string;
  comments: string;
}

const CodeReviewForm: React.FC<CodeReviewFormProps> = ({
  candidateName,
  problemTitle,
  code,
  onSubmit,
  onClose
}) => {
  const [showCode, setShowCode] = useState(false);
  const [feedback, setFeedback] = useState<CodeReviewFeedback>({
    algorithmRating: 3,
    codeQualityRating: 3,
    problemSolvingRating: 3,
    overallRating: 3,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    strengths: '',
    improvements: '',
    comments: ''
  });
  
  const handleChange = (name: keyof CodeReviewFeedback, value: string | number) => {
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(feedback);
    toast.success('Feedback submitted');
    onClose();
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md border p-6 max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Code Review: {problemTitle}</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <div>
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
          </Button>
        </div>
        
        {showCode && (
          <div className="bg-gray-50 border rounded-md p-3 mb-4 overflow-auto max-h-[200px]">
            <pre className="text-sm font-mono whitespace-pre-wrap">{code}</pre>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Algorithm Approach (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  className={`h-9 w-9 rounded-full flex items-center justify-center ${
                    feedback.algorithmRating === rating 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleChange('algorithmRating', rating)}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Code Quality (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  className={`h-9 w-9 rounded-full flex items-center justify-center ${
                    feedback.codeQualityRating === rating 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleChange('codeQualityRating', rating)}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Problem Solving (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  className={`h-9 w-9 rounded-full flex items-center justify-center ${
                    feedback.problemSolvingRating === rating 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleChange('problemSolvingRating', rating)}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Overall Rating (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  className={`h-9 w-9 rounded-full flex items-center justify-center ${
                    feedback.overallRating === rating 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleChange('overallRating', rating)}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Time Complexity
            </label>
            <select
              value={feedback.timeComplexity}
              onChange={(e) => handleChange('timeComplexity', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
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
            <label className="block text-sm font-medium mb-1">
              Space Complexity
            </label>
            <select
              value={feedback.spaceComplexity}
              onChange={(e) => handleChange('spaceComplexity', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
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
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Code Strengths
          </label>
          <textarea
            value={feedback.strengths}
            onChange={(e) => handleChange('strengths', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[80px]"
            placeholder="What aspects of the code are well implemented?"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Areas for Improvement
          </label>
          <textarea
            value={feedback.improvements}
            onChange={(e) => handleChange('improvements', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[80px]"
            placeholder="What could be improved in the solution?"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Additional Comments
          </label>
          <textarea
            value={feedback.comments}
            onChange={(e) => handleChange('comments', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[80px]"
            placeholder="Any other observations or feedback..."
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
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
            Submit Review
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CodeReviewForm;
