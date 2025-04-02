
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScheduledInterviews from '@/components/ScheduledInterviews';
import InterviewScheduler from '@/components/InterviewScheduler';
import { Button } from '@/components/Button';
import FeedbackForm from '@/components/FeedbackForm';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import ProblemSubmissionManager from '@/components/ProblemSubmissionManager';
import FeedbackSubmissionManager from '@/components/FeedbackSubmissionManager';

interface Interview {
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

const InterviewerDashboard: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: '1',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      time: '14:00',
      participants: ['john.doe@example.com', 'interviewer@company.com'],
      status: 'upcoming'
    },
    {
      id: '2',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      time: '10:00',
      participants: ['jane.smith@example.com', 'interviewer@company.com'],
      status: 'completed',
      feedback: {
        overallRating: 4,
        notes: 'Strong technical skills, good problem solving approach.'
      }
    }
  ]);
  
  const [showScheduler, setShowScheduler] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('interviews');
  
  const handleScheduleInterview = (date: Date, time: string, participants: string[]) => {
    const newInterview: Interview = {
      id: uuidv4(),
      date,
      time,
      participants,
      status: 'upcoming'
    };
    
    setInterviews([...interviews, newInterview]);
    setShowScheduler(false);
    toast.success('Interview scheduled successfully');
  };
  
  const handleCancelInterview = (id: string) => {
    setInterviews(interviews.map(interview => 
      interview.id === id ? { ...interview, status: 'cancelled' } : interview
    ));
    toast.info('Interview cancelled');
  };
  
  const handleJoinInterview = (id: string) => {
    window.location.href = `/editor?interview=${id}`;
  };
  
  const handleViewFeedback = (id: string) => {
    setSelectedInterview(id);
    setShowFeedbackForm(true);
  };
  
  const handleSubmitFeedback = (feedback: any) => {
    if (!selectedInterview) return;
    
    setInterviews(interviews.map(interview => 
      interview.id === selectedInterview 
        ? { 
            ...interview, 
            status: 'completed',
            feedback: {
              overallRating: feedback.overallRating,
              notes: feedback.strengths + ' ' + feedback.areasForImprovement
            }
          } 
        : interview
    ));
    
    setShowFeedbackForm(false);
    setSelectedInterview(null);
    toast.success('Feedback submitted successfully');
  };
  
  const selectedInterviewData = selectedInterview 
    ? interviews.find(i => i.id === selectedInterview) 
    : null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="mt-16 bg-white border-b shadow-sm py-4">
        <Container>
          <h1 className="text-2xl font-semibold">Interviewer Dashboard</h1>
        </Container>
      </div>
      
      <Container className="flex-1 py-6">
        <Tabs 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="interviews">
              Scheduled Interviews
            </TabsTrigger>
            <TabsTrigger value="problems">
              Problem Management
            </TabsTrigger>
            <TabsTrigger value="feedback">
              Interview Feedback
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="interviews" className="w-full">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Interview Schedule</h2>
                <Button onClick={() => setShowScheduler(true)}>
                  Schedule Interview
                </Button>
              </div>
              
              <div className="bg-white rounded-xl shadow-soft border overflow-hidden">
                <ScheduledInterviews 
                  interviews={interviews}
                  onJoin={handleJoinInterview}
                  onCancel={handleCancelInterview}
                  onViewFeedback={handleViewFeedback}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="problems" className="w-full">
            <ProblemSubmissionManager />
          </TabsContent>
          
          <TabsContent value="feedback" className="w-full">
            <FeedbackSubmissionManager />
          </TabsContent>
        </Tabs>
      </Container>
      
      {showScheduler && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <InterviewScheduler 
            onSchedule={handleScheduleInterview}
            onClose={() => setShowScheduler(false)}
          />
        </div>
      )}
      
      {showFeedbackForm && selectedInterviewData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <FeedbackForm 
            candidateName={selectedInterviewData.participants[0]}
            onSubmit={handleSubmitFeedback}
            onClose={() => setShowFeedbackForm(false)}
          />
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default InterviewerDashboard;
