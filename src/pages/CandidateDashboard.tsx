
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, BarChart2, Code, Award, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import AnimatedTransition from '@/components/AnimatedTransition';
import Footer from '@/components/Footer';
import UpcomingInterviewsPanel from '@/components/UpcomingInterviewsPanel';
import PracticeProblemsPanel from '@/components/PracticeProblemsPanel';
import PerformanceMetricsPanel from '@/components/PerformanceMetricsPanel';
import LearningResourcesPanel from '@/components/LearningResourcesPanel';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Candidate');
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate getting user data
    setTimeout(() => {
      setUserName('Alex Chen');
      toast.success('Welcome back, Alex!');
    }, 1000);
  }, []);

  const handleStartPractice = () => {
    navigate('/editor?mode=practice');
  };
  
  const handleJoinInterview = (id: string) => {
    navigate(`/editor?interview=${id}`);
  };

  return (
    <AnimatedTransition>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container px-4 sm:px-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-medium mb-2">Welcome back, {userName}</h1>
              <p className="text-muted-foreground">
                Prepare for your upcoming technical interviews and improve your coding skills
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-soft p-5 border border-gray-100 flex flex-col items-center text-center"
              >
                <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="font-medium mb-2">Practice Coding</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Practice with real technical interview questions
                </p>
                <button 
                  onClick={handleStartPractice} 
                  className="mt-auto text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Start Practice
                </button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-soft p-5 border border-gray-100 flex flex-col items-center text-center"
              >
                <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="font-medium mb-2">Upcoming Interviews</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View and prepare for scheduled interviews
                </p>
                <button 
                  onClick={() => navigate('/schedule')} 
                  className="mt-auto text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  View Schedule
                </button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-soft p-5 border border-gray-100 flex flex-col items-center text-center"
              >
                <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center mb-4">
                  <BarChart2 className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="font-medium mb-2">Your Performance</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Review your interview and practice statistics
                </p>
                <button 
                  className="mt-auto text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  View Metrics
                </button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-soft p-5 border border-gray-100 flex flex-col items-center text-center"
              >
                <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="font-medium mb-2">Learning Resources</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Access tutorials and interview preparation guides
                </p>
                <button 
                  className="mt-auto text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Browse Resources
                </button>
              </motion.div>
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Upcoming Interviews */}
                <UpcomingInterviewsPanel onJoinInterview={handleJoinInterview} />
                
                {/* Practice Problems */}
                <div className="mt-6">
                  <PracticeProblemsPanel onStartProblem={handleStartPractice} />
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Performance Metrics */}
                <PerformanceMetricsPanel />
                
                {/* Learning Resources */}
                <LearningResourcesPanel />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default CandidateDashboard;
