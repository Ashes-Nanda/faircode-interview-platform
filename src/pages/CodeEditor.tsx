import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Clock, MessageSquare, Code, Check, X, AlertCircle, Shield, Server, Eye } from 'lucide-react';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { CodeEditorPanel } from '@/components/CodeEditorPanel';
import { Button } from '@/components/Button';
import AnimatedTransition from '@/components/AnimatedTransition';
import BehavioralAnalytics from '@/components/BehavioralAnalytics';
import LiveInterview from '@/components/LiveInterview';
import AntiCheatSettings from '@/components/AntiCheatSettings';
import CodeSubmissionFeedback from '@/components/CodeSubmissionFeedback';
import { BehavioralSession } from '@/services/behavioralAnalyticsService';
import { evaluateCode, EvaluationResult } from '@/services/evaluationService';
import { toast } from 'sonner';

const demoQuestion = {
  title: "Two Sum",
  difficulty: "Easy",
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
    }
  ],
  constraints: [
    "2 <= nums.length <= 104",
    "-109 <= nums[i] <= 109",
    "-109 <= target <= 109",
    "Only one valid answer exists."
  ]
};

const CodeEditor = () => {
  const [language, setLanguage] = useState<'java' | 'cpp' | 'python'>('java');
  const [remainingTime, setRemainingTime] = useState(45 * 60); // 45 minutes in seconds
  const [tabView, setTabView] = useState<'problem' | 'discussion'>('problem');
  const [sandboxInfo, setSandboxInfo] = useState({
    environment: 'Docker Container',
    memoryLimit: '256MB',
    timeLimit: '10s',
    securityLevel: 'High'
  });
  
  const [session, setSession] = useState<BehavioralSession | null>(null);
  const [honestyScore, setHonestyScore] = useState<number>(100);
  const [flagDescriptions, setFlagDescriptions] = useState<{ [key: string]: string }>({});
  
  const [antiCheatMode, setAntiCheatMode] = useState<'passive' | 'active'>('passive');
  const [interventionsEnabled, setInterventionsEnabled] = useState(true);
  const [interceptedEvents, setInterceptedEvents] = useState<string[]>([]);
  
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeRun = (code: string) => {
    setCurrentCode(code);
    
    if (code.includes('System.') && code.includes('exit') || 
        code.includes('Runtime') || 
        code.includes('ProcessBuilder')) {
      toast.warning('Security alert: Potentially unsafe system operation detected', {
        description: 'Your code contains operations that could pose security risks.'
      });
    }
  };

  const handleBehavioralUpdate = (
    updatedSession: BehavioralSession, 
    updatedScore: number, 
    updatedFlags: { [key: string]: string }
  ) => {
    setSession(updatedSession);
    setHonestyScore(updatedScore);
    setFlagDescriptions(updatedFlags);
    
    const prevFlagsCount = Object.keys(flagDescriptions).length;
    const newFlagsCount = Object.keys(updatedFlags).length;
    
    if (newFlagsCount > prevFlagsCount) {
      toast.warning('New suspicious behavior detected', {
        description: 'Check the behavioral analytics panel for details.'
      });
    }
  };

  const toggleInterviewSession = () => {
    if (!isInterviewActive) {
      setIsInterviewActive(true);
      sessionStorage.setItem('interview_active', 'true');
      toast.success('Live interview session started');
    } else {
      setIsInterviewActive(false);
      sessionStorage.setItem('interview_active', 'false');
      toast.info('Live interview session ended');
    }
  };

  const handleAntiCheatModeChange = (mode: 'passive' | 'active') => {
    setAntiCheatMode(mode);
    toast.info(`Anti-cheat mode set to ${mode}`);
  };

  const handleToggleInterventions = (enabled: boolean) => {
    setInterventionsEnabled(enabled);
    toast.info(enabled ? 'Candidate warnings enabled' : 'Candidate warnings disabled');
  };

  const recordInterceptedEvent = (eventType: string) => {
    setInterceptedEvents(prev => [...prev, eventType]);
  };

  const handleCodeSubmit = async () => {
    if (!currentCode) {
      toast.error('Please write some code before submitting', {
        description: 'Your code editor is empty'
      });
      return;
    }
    
    setIsSubmitting(true);
    toast.loading('Evaluating your solution...', { id: 'code-evaluation' });
    
    try {
      const result = await evaluateCode(currentCode, language, demoQuestion.title);
      setEvaluationResult(result);
      setShowFeedback(true);
      
      if (result.passed) {
        toast.success('Solution passed tests!', { id: 'code-evaluation' });
      } else {
        toast.error('Solution did not pass all tests', { id: 'code-evaluation' });
      }
    } catch (error) {
      console.error('Error evaluating code:', error);
      toast.error('Failed to evaluate solution', { id: 'code-evaluation' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRequestDetailedFeedback = () => {
    toast.success('Feedback request sent to interviewer', {
      description: 'You will receive detailed feedback soon'
    });
    setShowFeedback(false);
  };
  
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center">
                  <Link to="/" className="text-muted-foreground hover:text-foreground mr-4">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                  <h1 className="text-xl font-medium">Technical Interview Session</h1>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <User className="text-muted-foreground mr-2 h-4 w-4" />
                    <span className="text-sm">John Doe (Candidate)</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="text-muted-foreground mr-2 h-4 w-4" />
                    <span className={`text-sm font-medium ${remainingTime < 5 * 60 ? 'text-destructive' : ''}`}>
                      {formatTime(remainingTime)}
                    </span>
                  </div>
                  
                  <div className="hidden sm:flex">
                    <Button 
                      size="sm" 
                      variant={isInterviewActive ? "destructive" : "outline"}
                      onClick={toggleInterviewSession}
                    >
                      {isInterviewActive ? "End Session" : "Start Live Interview"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="container px-4 sm:px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
              <div className="md:col-span-2 lg:col-span-5">
                <div className="bg-white rounded-xl shadow-soft border overflow-hidden h-full">
                  <div className="flex border-b">
                    <button
                      onClick={() => setTabView('problem')}
                      className={`flex-1 py-3 text-sm font-medium text-center ${
                        tabView === 'problem'
                          ? 'border-b-2 border-brand-500 text-brand-700'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Problem
                    </button>
                    <button
                      onClick={() => setTabView('discussion')}
                      className={`flex-1 py-3 text-sm font-medium text-center ${
                        tabView === 'discussion'
                          ? 'border-b-2 border-brand-500 text-brand-700'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Discussion
                    </button>
                  </div>
                  
                  <div className="p-4 overflow-auto max-h-[calc(100vh-250px)]">
                    {tabView === 'problem' ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-medium">{demoQuestion.title}</h2>
                          <span className="text-sm px-2 py-1 bg-brand-50 text-brand-700 rounded-full font-medium">
                            {demoQuestion.difficulty}
                          </span>
                        </div>
                        
                        <div className="prose prose-sm max-w-none">
                          <p className="whitespace-pre-line">{demoQuestion.description}</p>
                          
                          <h3 className="text-base font-medium mt-4 mb-2">Examples:</h3>
                          {demoQuestion.examples.map((example, index) => (
                            <div key={index} className="mb-4 bg-gray-50 p-3 rounded-md">
                              <div className="mb-1">
                                <span className="font-medium">Input:</span> {example.input}
                              </div>
                              <div className="mb-1">
                                <span className="font-medium">Output:</span> {example.output}
                              </div>
                              {example.explanation && (
                                <div>
                                  <span className="font-medium">Explanation:</span> {example.explanation}
                                </div>
                              )}
                            </div>
                          ))}
                          
                          <h3 className="text-base font-medium mt-4 mb-2">Constraints:</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {demoQuestion.constraints.map((constraint, index) => (
                              <li key={index} className="text-sm">{constraint}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h2 className="text-lg font-medium">Interview Discussion</h2>
                        <p className="text-sm text-muted-foreground">
                          Use this space to discuss the problem with your interviewer. Ask clarifying questions or explain your approach.
                        </p>
                        
                        <div className="bg-gray-50 rounded-lg p-4 border space-y-4 max-h-[400px] overflow-y-auto">
                          <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-brand-800" />
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-soft text-sm flex-1">
                              <p className="font-medium text-xs text-muted-foreground mb-1">Interviewer:</p>
                              <p>Could you walk me through your initial approach to this problem?</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-3 justify-end">
                            <div className="bg-brand-50 rounded-lg p-3 shadow-soft text-sm max-w-[80%]">
                              <p className="font-medium text-xs text-muted-foreground mb-1">You:</p>
                              <p>Sure! I think we can use a hash map to store the values we've seen so far. Then for each number, we check if the complement (target - current number) exists in the map.</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-brand-800" />
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-soft text-sm flex-1">
                              <p className="font-medium text-xs text-muted-foreground mb-1">Interviewer:</p>
                              <p>That sounds like a good approach. What would the time complexity be?</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                          <Button size="sm">Send</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-4 lg:col-span-7">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white rounded-xl shadow-soft border overflow-hidden">
                    <div className="flex justify-between items-center p-3 border-b">
                      <div className="flex items-center gap-3">
                        <label htmlFor="language-select" className="text-sm font-medium">
                          Language:
                        </label>
                        <select
                          id="language-select"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value as 'java' | 'cpp' | 'python')}
                          className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                          <option value="python">Python</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={handleCodeSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="animate-spin mr-1">⏳</span>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4" />
                              Submit
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="h-[calc(100vh-380px)] min-h-[300px]">
                      <CodeEditorPanel
                        language={language}
                        onRun={handleCodeRun}
                        onBehavioralUpdate={handleBehavioralUpdate}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-12 gap-4">
                    {isInterviewActive && (
                      <div className="col-span-12">
                        <LiveInterview 
                          isInterviewer={false}
                          candidateName="John Doe"
                          interviewerName="Jane Smith"
                        />
                      </div>
                    )}
                    
                    {session && (
                      <div className="col-span-12 md:col-span-6 bg-white rounded-xl shadow-soft border overflow-hidden">
                        <div className="p-3 border-b bg-gray-50 flex items-center">
                          <Eye className="h-4 w-4 mr-2 text-brand-600" />
                          <h3 className="text-sm font-medium">Behavioral Analytics</h3>
                        </div>
                        <div className="p-3 max-h-[200px] overflow-auto">
                          <BehavioralAnalytics
                            session={session}
                            honestyScore={honestyScore}
                            flagDescriptions={flagDescriptions}
                          />
                        </div>
                      </div>
                    )}
                    
                    {session && (
                      <div className="col-span-12 md:col-span-6 bg-white rounded-xl shadow-soft border overflow-hidden">
                        <div className="p-3 border-b bg-gray-50 flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-brand-600" />
                          <h3 className="text-sm font-medium">Anti-Cheat Protection</h3>
                        </div>
                        <div className="p-3 max-h-[200px] overflow-auto">
                          <AntiCheatSettings
                            antiCheatMode={antiCheatMode}
                            setAntiCheatMode={handleAntiCheatModeChange}
                            interventionsEnabled={interventionsEnabled}
                            toggleInterventions={handleToggleInterventions}
                            interceptedEvents={interceptedEvents}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="col-span-12 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-medium mb-2 text-brand-900">Secure Sandbox Environment</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="bg-white rounded-md p-2 border border-gray-100">
                              <div className="flex items-center text-xs mb-1 text-muted-foreground">
                                <Server className="h-3.5 w-3.5 mr-1" />
                                Environment
                              </div>
                              <div className="font-medium text-sm">{sandboxInfo.environment}</div>
                            </div>
                            <div className="bg-white rounded-md p-2 border border-gray-100">
                              <div className="flex items-center text-xs mb-1 text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                Time Limit
                              </div>
                              <div className="font-medium text-sm">{sandboxInfo.timeLimit}</div>
                            </div>
                            <div className="bg-white rounded-md p-2 border border-gray-100">
                              <div className="flex items-center text-xs mb-1 text-muted-foreground">
                                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                Memory Limit
                              </div>
                              <div className="font-medium text-sm">{sandboxInfo.memoryLimit}</div>
                            </div>
                            <div className="bg-white rounded-md p-2 border border-gray-100">
                              <div className="flex items-center text-xs mb-1 text-muted-foreground">
                                <Shield className="h-3.5 w-3.5 mr-1" />
                                Security
                              </div>
                              <div className="font-medium text-sm">{sandboxInfo.securityLevel}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {showFeedback && evaluationResult && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <CodeSubmissionFeedback
              testResults={evaluationResult.testResults}
              score={evaluationResult.score}
              onProvideDetailedFeedback={handleRequestDetailedFeedback}
              onClose={() => setShowFeedback(false)}
            />
          </div>
        )}
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default CodeEditor;
