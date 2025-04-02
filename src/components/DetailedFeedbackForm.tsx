
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Check, MessageSquare, FileText, Code, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';

interface DetailedFeedbackFormProps {
  candidateName: string;
  interviewDate: Date;
  problemTitle: string;
  onSubmit: (feedback: DetailedFeedback) => void;
  onClose: () => void;
}

export interface DetailedFeedback {
  technicalSkills: {
    problemSolving: number;
    codeQuality: number;
    dataStructures: number;
    algorithms: number;
    efficiency: number;
  };
  softSkills: {
    communication: number;
    clarification: number;
    collaboration: number;
  };
  notes: {
    strengths: string;
    areasOfImprovement: string;
    additionalComments: string;
  };
  overall: {
    hire: 'yes' | 'no' | 'maybe';
    recommendedLevel: 'junior' | 'mid' | 'senior' | 'unsure';
    recommendedTeam?: string;
  };
}

const DetailedFeedbackForm: React.FC<DetailedFeedbackFormProps> = ({
  candidateName,
  interviewDate,
  problemTitle,
  onSubmit,
  onClose
}) => {
  const [feedback, setFeedback] = useState<DetailedFeedback>({
    technicalSkills: {
      problemSolving: 3,
      codeQuality: 3,
      dataStructures: 3,
      algorithms: 3,
      efficiency: 3
    },
    softSkills: {
      communication: 3,
      clarification: 3,
      collaboration: 3
    },
    notes: {
      strengths: '',
      areasOfImprovement: '',
      additionalComments: ''
    },
    overall: {
      hire: 'maybe',
      recommendedLevel: 'unsure'
    }
  });

  const handleTechnicalSkillChange = (skill: keyof DetailedFeedback['technicalSkills'], value: number) => {
    setFeedback(prev => ({
      ...prev,
      technicalSkills: {
        ...prev.technicalSkills,
        [skill]: value
      }
    }));
  };

  const handleSoftSkillChange = (skill: keyof DetailedFeedback['softSkills'], value: number) => {
    setFeedback(prev => ({
      ...prev,
      softSkills: {
        ...prev.softSkills,
        [skill]: value
      }
    }));
  };

  const handleNotesChange = (field: keyof DetailedFeedback['notes'], value: string) => {
    setFeedback(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [field]: value
      }
    }));
  };

  const handleOverallChange = (field: keyof DetailedFeedback['overall'], value: any) => {
    setFeedback(prev => ({
      ...prev,
      overall: {
        ...prev.overall,
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!feedback.notes.strengths.trim() || !feedback.notes.areasOfImprovement.trim()) {
      toast.error('Please provide both strengths and areas of improvement');
      return;
    }
    
    onSubmit(feedback);
    toast.success('Interview feedback submitted successfully');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border p-6 max-w-3xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Interview Feedback</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 rounded-lg p-4">
        <div>
          <div className="text-sm text-muted-foreground">Candidate</div>
          <div className="font-medium">{candidateName}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Interview Date</div>
          <div className="font-medium">{formatDate(interviewDate)}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Problem</div>
          <div className="font-medium">{problemTitle}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Technical Assessment</h3>
          
          <div className="space-y-4">
            {[
              { id: 'problemSolving', label: 'Problem Solving Approach' },
              { id: 'codeQuality', label: 'Code Quality & Readability' },
              { id: 'dataStructures', label: 'Data Structures Knowledge' },
              { id: 'algorithms', label: 'Algorithms Knowledge' },
              { id: 'efficiency', label: 'Solution Efficiency' }
            ].map(skill => (
              <div key={skill.id}>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium">{skill.label}</label>
                  <span className="text-sm text-muted-foreground">
                    {feedback.technicalSkills[skill.id as keyof DetailedFeedback['technicalSkills']]}/5
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      className={`h-9 w-9 rounded-full flex items-center justify-center ${
                        feedback.technicalSkills[skill.id as keyof DetailedFeedback['technicalSkills']] === rating 
                          ? 'bg-brand-500 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => handleTechnicalSkillChange(
                        skill.id as keyof DetailedFeedback['technicalSkills'], 
                        rating
                      )}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Soft Skills Assessment</h3>
          
          <div className="space-y-4">
            {[
              { id: 'communication', label: 'Communication Skills' },
              { id: 'clarification', label: 'Asking for Clarification' },
              { id: 'collaboration', label: 'Collaboration & Listening' }
            ].map(skill => (
              <div key={skill.id}>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium">{skill.label}</label>
                  <span className="text-sm text-muted-foreground">
                    {feedback.softSkills[skill.id as keyof DetailedFeedback['softSkills']]}/5
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      className={`h-9 w-9 rounded-full flex items-center justify-center ${
                        feedback.softSkills[skill.id as keyof DetailedFeedback['softSkills']] === rating 
                          ? 'bg-brand-500 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => handleSoftSkillChange(
                        skill.id as keyof DetailedFeedback['softSkills'], 
                        rating
                      )}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Detailed Notes</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Strengths
              </label>
              <textarea
                value={feedback.notes.strengths}
                onChange={(e) => handleNotesChange('strengths', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                placeholder="What did the candidate do well? What impressed you?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Areas for Improvement
              </label>
              <textarea
                value={feedback.notes.areasOfImprovement}
                onChange={(e) => handleNotesChange('areasOfImprovement', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                placeholder="What could the candidate improve? Where did they struggle?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Comments
              </label>
              <textarea
                value={feedback.notes.additionalComments}
                onChange={(e) => handleNotesChange('additionalComments', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                placeholder="Any other observations or context about the interview..."
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Overall Assessment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Hiring Recommendation
              </label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={feedback.overall.hire === 'yes' ? 'default' : 'outline'}
                  onClick={() => handleOverallChange('hire', 'yes')}
                  className={feedback.overall.hire === 'yes' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Yes, Hire
                </Button>
                <Button
                  type="button"
                  variant={feedback.overall.hire === 'maybe' ? 'default' : 'outline'}
                  onClick={() => handleOverallChange('hire', 'maybe')}
                  className={feedback.overall.hire === 'maybe' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                >
                  Maybe
                </Button>
                <Button
                  type="button"
                  variant={feedback.overall.hire === 'no' ? 'default' : 'outline'}
                  onClick={() => handleOverallChange('hire', 'no')}
                  className={feedback.overall.hire === 'no' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  No
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Recommended Level
              </label>
              <select
                value={feedback.overall.recommendedLevel}
                onChange={(e) => handleOverallChange('recommendedLevel', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="junior">Junior Developer</option>
                <option value="mid">Mid-level Developer</option>
                <option value="senior">Senior Developer</option>
                <option value="unsure">Unsure / Need another interview</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Recommended Team (Optional)
              </label>
              <input
                type="text"
                value={feedback.overall.recommendedTeam || ''}
                onChange={(e) => handleOverallChange('recommendedTeam', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="e.g., Frontend, Backend, Infrastructure, etc."
              />
            </div>
          </div>
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
            <FileText className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DetailedFeedbackForm;
