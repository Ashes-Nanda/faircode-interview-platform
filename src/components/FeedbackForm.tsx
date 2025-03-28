
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

interface FeedbackFormProps {
  candidateName: string;
  onSubmit: (feedback: FeedbackData) => void;
  onClose: () => void;
}

export interface FeedbackData {
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  overallRating: number;
  strengths: string;
  areasForImprovement: string;
  additionalNotes: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  candidateName, 
  onSubmit, 
  onClose 
}) => {
  const [feedback, setFeedback] = useState<FeedbackData>({
    technicalScore: 3,
    communicationScore: 3,
    problemSolvingScore: 3,
    overallRating: 3,
    strengths: '',
    areasForImprovement: '',
    additionalNotes: ''
  });
  
  const handleChange = (name: keyof FeedbackData, value: string | number) => {
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
    <div className="bg-white rounded-xl shadow-md border p-6 max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Interview Feedback: {candidateName}</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Technical Skills (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    feedback.technicalScore === score 
                      ? 'bg-brand-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleChange('technicalScore', score)}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Communication (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    feedback.communicationScore === score 
                      ? 'bg-brand-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleChange('communicationScore', score)}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Problem Solving (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    feedback.problemSolvingScore === score 
                      ? 'bg-brand-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleChange('problemSolvingScore', score)}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Overall Rating (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  type="button"
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    feedback.overallRating === score 
                      ? 'bg-brand-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleChange('overallRating', score)}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Strengths
          </label>
          <textarea
            value={feedback.strengths}
            onChange={(e) => handleChange('strengths', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-24"
            placeholder="What did the candidate do well?"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Areas for Improvement
          </label>
          <textarea
            value={feedback.areasForImprovement}
            onChange={(e) => handleChange('areasForImprovement', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-24"
            placeholder="What could the candidate improve on?"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Additional Notes
          </label>
          <textarea
            value={feedback.additionalNotes}
            onChange={(e) => handleChange('additionalNotes', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-24"
            placeholder="Any other observations or comments..."
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
            <Check className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
