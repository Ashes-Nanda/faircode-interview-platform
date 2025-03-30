
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import ScheduledInterviews from '@/components/ScheduledInterviews';
import InterviewScheduler from '@/components/InterviewScheduler';
import { Button } from '@/components/Button';
import FeedbackForm from '@/components/FeedbackForm';
import { LiveInterview } from '@/components/LiveInterview';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import CodeReviewForm from '@/components/CodeReviewForm';
import { evaluateCode, generateCodeFeedback } from '@/services/evaluationService';
import TestResultsPanel from '@/components/TestResultsPanel';
import CodeEditorPanel from '@/components/CodeEditorPanel';

// Added for UUID generation
<lov-add-dependency>uuid@9.0.1</lov-add-dependency>
<lov-add-dependency>@types/uuid@9.0.8</lov-add-dependency>

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

const InterviewSchedule: React.FC = () => {
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
  const [isLiveInterview, setIsLiveInterview] = useState(false);
  
  // New states for code submission and review functionality
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showTestResults, setShowTestResults] = useState(false);
  const [showCodeReview, setShowCodeReview] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const [testResults, setTestResults] = useState<any>(null);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  
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
  
  const handleJoinInterview = (id: string) => {
    setSelectedInterview(id);
    setIsLiveInterview(true);
    // In a real app, this would initiate a WebRTC connection
    sessionStorage.setItem('interview_active', 'true');
    toast.success('Joined interview session');
  };
  
  const handleEndInterview = () => {
    setIsLiveInterview(false);
    sessionStorage.removeItem('interview_active');
    // Show code editor after interview ends
    setShowCodeEditor(true);
  };
  
  const handleCancelInterview = (id: string) => {
    setInterviews(interviews.map(interview => 
      interview.id === id ? { ...interview, status: 'cancelled' } : interview
    ));
    toast.info('Interview cancelled');
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
  
  // New handlers for code submission functionality
  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
  };
  
  const handleSubmitCode = async () => {
    if (!currentCode.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }
    
    setIsSubmittingCode(true);
    
    try {
      const result = await evaluateCode(currentCode, 'java', 'Two Sum');
      setTestResults(result);
      setShowTestResults(true);
      setShowCodeEditor(false);
    } catch (error) {
      toast.error('Error evaluating code');
      console.error(error);
    } finally {
      setIsSubmittingCode(false);
    }
  };
  
  const handleRequestAIFeedback = async () => {
    if (!testResults) return;
    
    setIsGeneratingFeedback(true);
    
    try {
      const feedback = await generateCodeFeedback(currentCode, 'java', testResults.testResults);
      setAiFeedback(feedback);
    } catch (error) {
      toast.error('Error generating feedback');
      console.error(error);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };
  
  const handleRequestCodeReview = () => {
    setShowTestResults(false);
    setShowCodeReview(true);
  };
  
  const handleSubmitCodeReview = (review: any) => {
    toast.success('Code review submitted');
    setShowCodeReview(false);
    
    // In a real app, this would be saved to a database
    console.log('Code review:', review);
  };
  
  const selectedInterviewData = selectedInterview 
    ? interviews.find(i => i.id === selectedInterview) 
    : null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Container className="flex-1 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Interview Schedule</h1>
            <Button onClick={() => setShowScheduler(true)}>
              Schedule Interview
            </Button>
          </div>
          
          <ScheduledInterviews 
            interviews={interviews}
            onJoin={handleJoinInterview}
            onCancel={handleCancelInterview}
            onViewFeedback={handleViewFeedback}
          />
        </div>
      </Container>
      
      {/* Modals and overlays */}
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
      
      {isLiveInterview && (
        <div className="fixed inset-0 bg-gray-900 z-50">
          <LiveInterview onEndInterview={handleEndInterview} />
        </div>
      )}
      
      {/* New modals for code submission and review */}
      {showCodeEditor && (
        <div className="fixed inset-0 bg-gray-900/95 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-semibold text-xl">Coding Assessment: Two Sum</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowCodeEditor(false)}>
                Close
              </Button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 bg-gray-50 rounded-md p-4 border">
                <h3 className="font-medium mb-2">Problem: Two Sum</h3>
                <p className="text-sm mb-2">
                  Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
                </p>
                <p className="text-sm mb-2">
                  You may assume that each input would have exactly one solution, and you may not use the same element twice.
                </p>
                <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                  <div>Example 1:</div>
                  <div>Input: nums = [2,7,11,15], target = 9</div>
                  <div>Output: [0,1]</div>
                </div>
              </div>
              
              <CodeEditorPanel
                initialCode="// Write your solution here\n\npublic int[] twoSum(int[] nums, int target) {\n    // Your code implementation\n    return new int[0];\n}\n"
                language="java"
                onRun={handleCodeChange}
              />
              
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={handleSubmitCode}
                  disabled={isSubmittingCode}
                >
                  {isSubmittingCode ? 'Submitting...' : 'Submit Solution'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showTestResults && testResults && (
        <div className="fixed inset-0 bg-gray-900/95 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <TestResultsPanel 
              testResults={testResults.testResults}
              score={testResults.score}
              executionTime={testResults.executionTime}
              onRequestFeedback={handleRequestAIFeedback}
              isGeneratingFeedback={isGeneratingFeedback}
              feedback={aiFeedback || undefined}
              onClose={() => {
                setShowTestResults(false);
                setTestResults(null);
                setAiFeedback(null);
                
                // For demo purposes, show code review form when closing test results
                // In a real app, this might be triggered by an interviewer action
                if (testResults.score >= 70) {
                  setTimeout(() => handleRequestCodeReview(), 500);
                }
              }}
            />
          </div>
        </div>
      )}
      
      {showCodeReview && (
        <div className="fixed inset-0 bg-gray-900/95 flex items-center justify-center z-50 p-4">
          <CodeReviewForm 
            candidateName="John Doe"
            problemTitle="Two Sum"
            code={currentCode}
            onSubmit={handleSubmitCodeReview}
            onClose={() => setShowCodeReview(false)}
          />
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default InterviewSchedule;
