
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShieldCheck, Eye, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { OnboardingForm } from '@/components/OnboardingForm';
import AnimatedTransition from '@/components/AnimatedTransition';

const InterviewerOnboarding = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Interviewer form fields
  const interviewerFields = [
    {
      id: 'fullName',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true,
    },
    {
      id: 'email',
      label: 'Work Email',
      type: 'email',
      placeholder: 'Enter your work email',
      required: true,
    },
    {
      id: 'company',
      label: 'Company Name',
      type: 'text',
      placeholder: 'Enter your company name',
      required: true,
    },
    {
      id: 'role',
      label: 'Job Title',
      type: 'text',
      placeholder: 'E.g. Technical Recruiter, Engineering Manager',
      required: true,
    },
  ];

  const handleSubmit = (data: Record<string, string>) => {
    console.log('Interviewer form submitted:', data);
    // In a real app, this would send data to an API
  };

  const features = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-brand-600" />,
      title: "Anti-Cheat Protection",
      description: "Prevent candidates from using external resources with our browser lock and behavioral monitoring."
    },
    {
      icon: <Eye className="h-5 w-5 text-brand-600" />,
      title: "Real-Time Monitoring",
      description: "View candidates' code as they type with alerts for suspicious behaviors."
    },
    {
      icon: <Clock className="h-5 w-5 text-brand-600" />,
      title: "Comprehensive Reports",
      description: "Receive detailed post-interview reports with code samples, behavioral data, and honesty scores."
    }
  ];

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
                  For Interviewers
                </div>
                <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                  Conduct secure technical interviews
                </h1>
                <p className="text-muted-foreground text-lg mb-8">
                  Create an account to start conducting fair, cheat-resistant technical interviews.
                </p>
                
                <div className="space-y-6 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-brand-50 p-2 rounded-full mr-4">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-soft-green rounded-lg p-4 border border-green-100">
                  <h3 className="font-medium mb-2 text-green-900">Company benefits</h3>
                  <p className="text-sm text-green-800 mb-2">
                    FairCode helps companies reduce hiring risks and identify genuine talent:
                  </p>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 shrink-0" />
                      <span>Minimize false positives in your hiring process</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 shrink-0" />
                      <span>Protect your company from hiring fraud</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 shrink-0" />
                      <span>Make fair, data-driven hiring decisions</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div>
                <OnboardingForm
                  title="Interviewer Registration"
                  subtitle="Create your account to start conducting technical interviews"
                  fields={interviewerFields}
                  submitText="Create Account"
                  onSubmit={handleSubmit}
                />
                
                <div className="mt-6 bg-gray-50 rounded-lg p-4 border text-center">
                  <p className="text-sm text-muted-foreground">
                    By creating an account, you agree to our 
                    <a href="#" className="text-brand-600 hover:text-brand-700 mx-1">Terms of Service</a>
                    and
                    <a href="#" className="text-brand-600 hover:text-brand-700 mx-1">Privacy Policy</a>.
                  </p>
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

export default InterviewerOnboarding;
