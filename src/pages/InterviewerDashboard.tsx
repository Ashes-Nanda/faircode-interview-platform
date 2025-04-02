
import { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import ScheduledInterviews from '@/components/ScheduledInterviews';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Video, MessageSquare, Clock, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InterviewerDashboard = () => {
  const { toast } = useToast();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock interview data
  const interviews = [
    {
      id: 'int-001',
      date: new Date('2025-04-15'),
      time: '2:00 PM - 3:30 PM',
      participants: ['John Doe', 'Front-end Developer Position'],
      status: 'upcoming' as const
    },
    {
      id: 'int-002',
      date: new Date('2025-04-10'),
      time: '10:00 AM - 11:30 AM',
      participants: ['Jane Smith', 'Senior React Developer Position'],
      status: 'completed' as const,
      feedback: {
        overallRating: 4,
        notes: 'Strong problem-solving skills, needs to improve on communication.'
      }
    },
    {
      id: 'int-003',
      date: new Date('2025-04-05'),
      time: '3:00 PM - 4:30 PM',
      participants: ['Mike Johnson', 'Full Stack Developer Position'],
      status: 'cancelled' as const
    }
  ];

  const handleJoin = (id: string) => {
    console.log(`Joining interview ${id}`);
    toast({
      title: "Joining Interview",
      description: "Preparing your interview environment...",
    });
  };

  const handleCancel = (id: string) => {
    console.log(`Cancelling interview ${id}`);
    toast({
      title: "Interview Cancelled",
      description: "The interview has been cancelled. Notifying the candidate.",
      variant: "destructive"
    });
  };

  const handleViewFeedback = (id: string) => {
    console.log(`Viewing feedback for interview ${id}`);
    toast({
      title: "Loading Feedback",
      description: "Retrieving feedback and performance data...",
    });
  };

  const handleScheduleInterview = () => {
    console.log('Schedule interview');
    toast({
      title: "Schedule Interview",
      description: "Opening interview scheduler...",
    });
  };

  const featureCards = [
    {
      icon: <Calendar className="h-6 w-6 text-brand-600" />,
      title: "Schedule Interviews",
      description: "Create and manage technical interview sessions"
    },
    {
      icon: <Video className="h-6 w-6 text-brand-600" />,
      title: "Live Coding Sessions",
      description: "Conduct interviews with real-time code monitoring"
    },
    {
      icon: <Users className="h-6 w-6 text-brand-600" />,
      title: "Candidate Management",
      description: "Track and evaluate candidates through the process"
    },
    {
      icon: <Briefcase className="h-6 w-6 text-brand-600" />,
      title: "Position Templates",
      description: "Create reusable interview templates for job roles"
    }
  ];

  return (
    <AnimatedTransition>
      <div className="flex flex-col min-h-screen">
        <Navigation />

        <main className="flex-1 pt-24 pb-16">
          <div className="container px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-medium tracking-tight mb-2">Interviewer Dashboard</h1>
                <p className="text-muted-foreground max-w-2xl">
                  Manage interviews, review candidate submissions, and track hiring progress.
                </p>
              </div>
              <Button onClick={handleScheduleInterview} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Interview
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium">Upcoming</h2>
                  <span className="bg-brand-100 text-brand-800 text-xs px-2 py-1 rounded-full">
                    {interviews.filter(i => i.status === 'upcoming').length}
                  </span>
                </div>
                <div className="text-3xl font-bold">
                  {interviews.filter(i => i.status === 'upcoming').length}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <Clock className="h-4 w-4 mr-1" />
                  Scheduled interviews
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium">Candidates</h2>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    12 New
                  </span>
                </div>
                <div className="text-3xl font-bold">37</div>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <Users className="h-4 w-4 mr-1" />
                  In your pipeline
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium">Feedback</h2>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    3 Pending
                  </span>
                </div>
                <div className="text-3xl font-bold">15</div>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Reviews submitted
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              <div className="order-2 lg:order-1">
                <h2 className="text-xl font-medium mb-4">Scheduled Interviews</h2>
                <ScheduledInterviews 
                  interviews={interviews}
                  onJoin={handleJoin}
                  onCancel={handleCancel}
                  onViewFeedback={handleViewFeedback}
                />
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-xl font-medium mb-4">Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featureCards.map((feature, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-xl shadow-sm border p-6 hover:border-brand-200 hover:shadow-md transition-all"
                    >
                      <div className="bg-brand-50 p-3 inline-block rounded-lg mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="font-medium mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default InterviewerDashboard;
