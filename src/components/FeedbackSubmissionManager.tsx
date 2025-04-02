
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { MessageSquare, CheckCircle, Clock, FileText, ChevronDown, ChevronUp, X } from 'lucide-react';
import { toast } from 'sonner';
import DetailedFeedbackForm from './DetailedFeedbackForm';
import { submitFeedback, getAllFeedback, InterviewFeedback } from '../services/feedbackService';

interface FeedbackSubmissionManagerProps {
  onSubmitFeedback?: (feedback: InterviewFeedback) => void;
}

const FeedbackSubmissionManager: React.FC<FeedbackSubmissionManagerProps> = ({
  onSubmitFeedback
}) => {
  const [feedback, setFeedback] = useState<InterviewFeedback[]>([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<{
    candidateName: string;
    interviewDate: Date;
    problemTitle: string;
  } | null>(null);
  const [expandedSection, setExpandedSection] = useState<'recent' | 'all'>('recent');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      const allFeedback = await getAllFeedback();
      setFeedback(allFeedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenFeedbackForm = (interview: {
    candidateName: string;
    interviewDate: Date;
    problemTitle: string;
  }) => {
    setSelectedInterview(interview);
    setShowFeedbackForm(true);
  };

  const handleSubmitFeedback = async (feedbackData: any) => {
    if (!selectedInterview) return;
    
    try {
      const submittedFeedback = await submitFeedback(
        'candidate-id', // In a real app, this would be the actual candidate ID
        selectedInterview.candidateName,
        'interviewer-id', // In a real app, this would be the current user's ID
        'Jane Smith', // In a real app, this would be the current user's name
        'problem-id', // In a real app, this would be the actual problem ID
        selectedInterview.problemTitle,
        selectedInterview.interviewDate,
        feedbackData
      );
      
      setShowFeedbackForm(false);
      toast.success('Feedback submitted successfully');
      fetchFeedback();
      
      if (onSubmitFeedback) {
        onSubmitFeedback(submittedFeedback);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getHireRecommendationColor = (hire: string) => {
    switch(hire) {
      case 'yes': return 'bg-green-100 text-green-800';
      case 'no': return 'bg-red-100 text-red-800';
      case 'maybe': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHireRecommendationText = (hire: string) => {
    switch(hire) {
      case 'yes': return 'Hire';
      case 'no': return 'Reject';
      case 'maybe': return 'Maybe';
      default: return 'Undecided';
    }
  };

  // Mock data for recent interviews that need feedback
  const recentInterviews = [
    {
      id: '1',
      candidateName: 'Mike Johnson',
      interviewDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      problemTitle: 'Two Sum'
    },
    {
      id: '2',
      candidateName: 'Sarah Williams',
      interviewDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      problemTitle: 'Valid Parentheses'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Interview Feedback</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-soft border overflow-hidden">
          <button
            className="flex justify-between items-center w-full p-4 bg-gray-50 hover:bg-gray-100 text-left"
            onClick={() => setExpandedSection(expandedSection === 'recent' ? 'all' : 'recent')}
          >
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-500" />
              <h3 className="font-medium">Pending Feedback ({recentInterviews.length})</h3>
            </div>
            {expandedSection === 'recent' ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {expandedSection === 'recent' && (
            <div className="p-4">
              {recentInterviews.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No pending feedback
                </div>
              ) : (
                <div className="space-y-3">
                  {recentInterviews.map(interview => (
                    <div 
                      key={interview.id}
                      className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
                    >
                      <div>
                        <h4 className="font-medium">{interview.candidateName}</h4>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(interview.interviewDate)} — {interview.problemTitle}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleOpenFeedbackForm(interview)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Provide Feedback
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-soft border overflow-hidden">
          <button
            className="flex justify-between items-center w-full p-4 bg-gray-50 hover:bg-gray-100 text-left"
            onClick={() => setExpandedSection(expandedSection === 'all' ? 'recent' : 'all')}
          >
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <h3 className="font-medium">Submitted Feedback ({feedback.length})</h3>
            </div>
            {expandedSection === 'all' ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {expandedSection === 'all' && (
            <div className="p-4">
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : feedback.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No submitted feedback
                </div>
              ) : (
                <div className="space-y-3">
                  {feedback.map(item => (
                    <div 
                      key={item.id}
                      className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
                    >
                      <div>
                        <h4 className="font-medium">{item.candidateName}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{formatDate(item.interviewDate)} — {item.problemTitle}</span>
                          <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${getHireRecommendationColor(item.overall.hire)}`}>
                            {getHireRecommendationText(item.overall.hire)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showFeedbackForm && selectedInterview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <DetailedFeedbackForm
            candidateName={selectedInterview.candidateName}
            interviewDate={selectedInterview.interviewDate}
            problemTitle={selectedInterview.problemTitle}
            onSubmit={handleSubmitFeedback}
            onClose={() => {
              setShowFeedbackForm(false);
              setSelectedInterview(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FeedbackSubmissionManager;
