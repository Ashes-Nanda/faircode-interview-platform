
import { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { OnboardingForm } from '@/components/OnboardingForm';
import AnimatedTransition from '@/components/AnimatedTransition';

const CandidateOnboarding = () => {
  const handleSubmit = (data: Record<string, string>) => {
    console.log('Candidate onboarding data:', data);
  };

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formFields = [
    {
      id: 'fullName',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email address',
      required: true
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Create a password',
      required: true
    },
    {
      id: 'experience',
      label: 'Years of Experience',
      type: 'number',
      placeholder: 'Enter years of coding experience',
    },
    {
      id: 'specialization',
      label: 'Primary Specialization',
      type: 'text',
      placeholder: 'e.g., Frontend, Backend, Full-Stack',
    }
  ];

  return (
    <AnimatedTransition>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        
        <main className="flex-1 pt-32 pb-16">
          <div className="container px-4 sm:px-6">
            <div className="max-w-md mx-auto">
              <OnboardingForm
                title="Candidate Registration"
                subtitle="Create your account to practice and join interviews"
                fields={formFields}
                submitText="Create Account"
                onSubmit={handleSubmit}
                userType="candidate"
              />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default CandidateOnboarding;
