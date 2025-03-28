
import React from 'react';
import { Button } from '@/components/Button';
import { Calendar, Clock, Users, Check, X } from 'lucide-react';

export interface ScheduledInterview {
  id: string;
  date: Date;
  time: string;
  participants: string[];
  status: 'upcoming' | 'completed' | 'cancelled';
  feedback?: {
    overallRating: number;
    notes: string;
  };
}

interface ScheduledInterviewsProps {
  interviews: ScheduledInterview[];
  onJoin: (id: string) => void;
  onCancel: (id: string) => void;
  onViewFeedback?: (id: string) => void;
}

const ScheduledInterviews: React.FC<ScheduledInterviewsProps> = ({
  interviews,
  onJoin,
  onCancel,
  onViewFeedback
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md border overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-medium">Scheduled Interviews</h2>
      </div>
      
      {interviews.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          No interviews scheduled yet
        </div>
      ) : (
        <div className="divide-y">
          {interviews.map(interview => (
            <div key={interview.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{formatDate(interview.date)}</div>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    {interview.time}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <Users className="h-3.5 w-3.5 mr-1.5" />
                    {interview.participants.length} participant{interview.participants.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="flex items-center">
                  {interview.status === 'upcoming' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => onCancel(interview.id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onJoin(interview.id)}
                      >
                        Join
                      </Button>
                    </>
                  )}
                  
                  {interview.status === 'completed' && onViewFeedback && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewFeedback(interview.id)}
                    >
                      View Feedback
                    </Button>
                  )}
                  
                  {interview.status === 'cancelled' && (
                    <span className="text-sm text-muted-foreground px-2 py-1 bg-gray-100 rounded">
                      Cancelled
                    </span>
                  )}
                </div>
              </div>
              
              {interview.status === 'completed' && interview.feedback && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="text-sm font-medium">Rating:</div>
                    <div className="ml-2 flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={star <= interview.feedback!.overallRating ? "text-yellow-400" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {interview.feedback.notes && (
                    <div className="text-sm mt-1">{interview.feedback.notes}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledInterviews;
