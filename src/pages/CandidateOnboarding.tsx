
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { OnboardingForm } from '@/components/OnboardingForm';
import AnimatedTransition from '@/components/AnimatedTransition';

const CandidateOnboarding = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Candidate form fields
  const candidateFields = [
    {
      id: 'fullName',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true,
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email address',
      required: true,
    },
    {
      id: 'company',
      label: 'Company You\'re Interviewing With',
      type: 'text',
      placeholder: 'Enter company name',
      required: true,
    },
    {
      id: 'interviewCode',
      label: 'Interview Access Code',
      type: 'text',
      placeholder: 'Enter the code provided by the interviewer',
      required: true,
    },
  ];

  const handleSubmit = (data: Record<string, string>) => {
    console.log('Candidate form submitted:', data);
    // In a real app, this would send data to an API
  };

  return (
    <AnimatedTransition>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        
        <main className="flex-1 pt-24">
          <div className="container px-4 sm:px-6 py-12">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground mb-8 hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <div className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 mb-4">
                  For Candidates
                </div>
                <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                  Get ready for your technical interview
                </h1>
                <p className="text-muted-foreground text-lg mb-8">
                  Enter your details below to access your upcoming interview session.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="bg-brand-50 p-2 rounded-full mr-4">
                      <CheckCircle className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Real-time code editing</h3>
                      <p className="text-muted-foreground text-sm">
                        Solve technical problems in our secure coding environment with support for Java, C++, and Python.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-brand-50 p-2 rounded-full mr-4">
                      <CheckCircle className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Interactive interview experience</h3>
                      <p className="text-muted-foreground text-sm">
                        Communicate directly with your interviewer through built-in video and audio chat.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-brand-50 p-2 rounded-full mr-4">
                      <CheckCircle className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Secure and fair assessment</h3>
                      <p className="text-muted-foreground text-sm">
                        Our platform ensures a level playing field so you can demonstrate your true skills.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-soft-blue rounded-lg p-4 border border-brand-100">
                  <h3 className="font-medium mb-2 text-brand-900">Before you start</h3>
                  <p className="text-sm text-brand-800">
                    Ensure you're in a quiet environment with a stable internet connection. Have your webcam and microphone ready. The session will be recorded for security purposes.
                  </p>
                </div>
              </div>
              
              <div>
                <OnboardingForm
                  title="Candidate Registration"
                  subtitle="Enter your details to access your interview"
                  fields={candidateFields}
                  submitText="Access Interview"
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default CandidateOnboarding;
