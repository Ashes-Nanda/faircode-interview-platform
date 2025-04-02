
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Code, BookOpen, BarChart2, CheckCircle, Award, Timer, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import AnimatedTransition from '@/components/AnimatedTransition';
import Footer from '@/components/Footer';
import UpcomingInterviewsPanel from '@/components/UpcomingInterviewsPanel';
import PracticeProblemsPanel from '@/components/PracticeProblemsPanel';
import PerformanceMetricsPanel from '@/components/PerformanceMetricsPanel';
import LearningResourcesPanel from '@/components/LearningResourcesPanel';
import { Button } from '@/components/ui/button';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Candidate');
  const [completedProblems, setCompletedProblems] = useState(8);
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [studyHours, setStudyHours] = useState(24);
  
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

  // Progress metrics
  const learningPath = [
    { name: 'Arrays & Strings', complete: true },
    { name: 'Linked Lists', complete: true },
    { name: 'Trees & Graphs', complete: false },
    { name: 'Sorting Algorithms', complete: false },
    { name: 'Dynamic Programming', complete: false }
  ];

  return (
    <AnimatedTransition>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container px-4 sm:px-6">
            {/* Header with stats banner */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 mb-6">
                <h1 className="text-3xl font-medium mb-2">Welcome back, {userName}</h1>
                <p className="text-muted-foreground mb-6">
                  Continue your interview preparation journey
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center mr-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{completedProblems}</div>
                      <div className="text-sm text-muted-foreground">Problems solved</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center mr-4">
                      <Award className="h-6 w-6 text-brand-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{skillLevel}</div>
                      <div className="text-sm text-muted-foreground">Current level</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                      <Timer className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{studyHours}h</div>
                      <div className="text-sm text-muted-foreground">Study time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Learning Path */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Your Learning Path</h2>
                <Button variant="outline" size="sm">View All Topics</Button>
              </div>
              
              <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
                <div className="space-y-4">
                  {learningPath.map((topic, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                        topic.complete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {topic.complete ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-current" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={topic.complete ? 'font-medium' : 'text-muted-foreground'}>
                          {topic.name}
                        </div>
                      </div>
                      <Button 
                        variant={topic.complete ? "outline" : "default"}
                        size="sm"
                      >
                        {topic.complete ? 'Review' : 'Start'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Practice Problems - reimagined */}
                <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">Recommended Problems</h2>
                    <Button variant="outline" size="sm" onClick={handleStartPractice}>
                      View All
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      {
                        title: "Two Sum",
                        difficulty: "Easy",
                        category: "Arrays",
                        completion: "70% of candidates solve this"
                      },
                      {
                        title: "Valid Parentheses",
                        difficulty: "Easy",
                        category: "Stacks",
                        completion: "65% of candidates solve this"
                      },
                      {
                        title: "Merge Two Sorted Lists",
                        difficulty: "Medium",
                        category: "Linked Lists",
                        completion: "55% of candidates solve this"
                      }
                    ].map((problem, index) => (
                      <div key={index} className="flex items-center border border-gray-100 rounded-lg p-4">
                        <div className="flex-1">
                          <h3 className="font-medium">{problem.title}</h3>
                          <div className="flex items-center text-sm mt-1">
                            <span className={`rounded-full px-2 py-0.5 text-xs ${
                              problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {problem.difficulty}
                            </span>
                            <span className="text-muted-foreground ml-2">{problem.category}</span>
                            <span className="text-muted-foreground ml-2">• {problem.completion}</span>
                          </div>
                        </div>
                        <Button size="sm" onClick={handleStartPractice}>Solve</Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Upcoming Interviews */}
                <UpcomingInterviewsPanel onJoinInterview={handleJoinInterview} />
              </div>
              
              <div className="space-y-6">
                {/* Daily Tip */}
                <div className="bg-brand-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Lightbulb className="h-5 w-5 text-brand-600 mr-2" />
                    <h3 className="text-lg font-medium text-brand-800">Daily Tip</h3>
                  </div>
                  <p className="text-brand-700 text-sm mb-4">
                    When solving array problems, consider using two pointers or a hash map to improve time complexity.
                  </p>
                  <Button variant="outline" size="sm" className="bg-white border-brand-200 hover:bg-brand-100">
                    More Tips
                  </Button>
                </div>
                
                {/* Performance Metrics with visual changes */}
                <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Your Performance</h2>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Problem-solving Speed</span>
                        <span className="font-medium">Good</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Code Quality</span>
                        <span className="font-medium">Excellent</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Interview Confidence</span>
                        <span className="font-medium">Improving</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '55%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Learning Resources - simplified */}
                <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
                  <h2 className="text-lg font-medium mb-4">Learning Resources</h2>
                  
                  <div className="space-y-3">
                    {[
                      {
                        title: "Mastering Data Structures",
                        type: "Video Course",
                        length: "2h 45m"
                      },
                      {
                        title: "System Design Interview",
                        type: "Interactive Guide",
                        length: "1h 30m"
                      },
                      {
                        title: "Behavioral Interview Prep",
                        type: "Practice Questions",
                        length: "45m"
                      }
                    ].map((resource, index) => (
                      <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                        <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center mr-3">
                          <BookOpen className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{resource.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {resource.type} • {resource.length}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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

export default CandidateDashboard;
