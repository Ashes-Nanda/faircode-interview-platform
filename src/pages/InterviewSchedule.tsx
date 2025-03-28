
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import AnimatedTransition from '@/components/AnimatedTransition';
import InterviewScheduler from '@/components/InterviewScheduler';
import ScheduledInterviews, { ScheduledInterview } from '@/components/ScheduledInterviews';
import FeedbackForm, { FeedbackData } from '@/components/FeedbackForm';

const InterviewSchedule = () => {
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [interviews, setInterviews] = useState<ScheduledInterview[]>([
    {
      id: '1',
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: '10:00',
      participants: ['john.doe@example.com', 'interviewer@company.com'],
      status: 'upcoming'
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000), // Yesterday
      time: '14:00',
      participants: ['jane.smith@example.com', 'interviewer@company.com'],
      status: 'completed',
      feedback: {
        overallRating: 4,
        notes: 'Good technical skills, could improve communication'
      }
    }
  ]);
  
  const handleScheduleInterview = (date: Date, time: string, participants: string[]) => {
    const newInterview: ScheduledInterview = {
      id: Date.now().toString(),
      date,
      time,
      participants,
      status: 'upcoming'
    };
    
    setInterviews([...interviews, newInterview]);
    toast.success('Interview scheduled successfully');
    setIsSchedulerOpen(false);
  };
  
  const handleJoinInterview = (id: string) => {
    // Navigate to the interview
    window.location.href = `/editor?interview=${id}`;
  };
  
  const handleCancelInterview = (id: string) => {
    setInterviews(interviews.map(interview => 
      interview.id === id 
        ? { ...interview, status: 'cancelled' } 
        : interview
    ));
    toast.info('Interview cancelled');
  };
  
  const handleViewFeedback = (id: string) => {
    setSelectedInterviewId(id);
    setIsFeedbackOpen(true);
  };
  
  const handleSubmitFeedback = (feedback: FeedbackData) => {
    if (!selectedInterviewId) return;
    
    setInterviews(interviews.map(interview => 
      interview.id === selectedInterviewId 
        ? { 
            ...interview, 
            status: 'completed',
            feedback: {
              overallRating: feedback.overallRating,
              notes: feedback.additionalNotes
            }
          } 
        : interview
    ));
    
    setSelectedInterviewId(null);
    setIsFeedbackOpen(false);
  };
  
  const selectedInterview = selectedInterviewId 
    ? interviews.find(i => i.id === selectedInterviewId) 
    : null;
  
  const upcomingInterviews = interviews.filter(i => i.status === 'upcoming');
  const pastInterviews = interviews.filter(i => i.status !== 'upcoming');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <AnimatedTransition>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        
        <main className="flex-1 pt-16">
          <div className="bg-white border-b shadow-sm">
            <div className="container px-4 sm:px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Link to="/" className="text-muted-foreground hover:text-foreground mr-4">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                  <h1 className="text-xl font-medium">Interview Schedule</h1>
                </div>
                
                <Button onClick={() => setIsSchedulerOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
              </div>
            </div>
          </div>
          
          <div className="container px-4 sm:px-6 py-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium mb-4">Upcoming Interviews</h2>
                <ScheduledInterviews 
                  interviews={upcomingInterviews}
                  onJoin={handleJoinInterview}
                  onCancel={handleCancelInterview}
                />
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-4">Past Interviews</h2>
                <ScheduledInterviews 
                  interviews={pastInterviews}
                  onJoin={handleJoinInterview}
                  onCancel={handleCancelInterview}
                  onViewFeedback={handleViewFeedback}
                />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
        
        {/* Interview Scheduler Modal */}
        {isSchedulerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <InterviewScheduler 
                onSchedule={handleScheduleInterview}
                onClose={() => setIsSchedulerOpen(false)}
              />
            </motion.div>
          </div>
        )}
        
        {/* Feedback Modal */}
        {isFeedbackOpen && selectedInterview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-h-[90vh] overflow-y-auto"
            >
              <FeedbackForm 
                candidateName={selectedInterview.participants[0]}
                onSubmit={handleSubmitFeedback}
                onClose={() => setIsFeedbackOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </div>
    </AnimatedTransition>
  );
};

export default InterviewSchedule;
