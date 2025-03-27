
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Code, Shield, CheckCircle, Monitor, Users, ArrowRight } from 'lucide-react';

import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';
import { CodeEditorPanel } from '@/components/CodeEditorPanel';
import { Button } from '@/components/Button';
import AnimatedTransition from '@/components/AnimatedTransition';

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AnimatedTransition>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        
        <main className="flex-1">
          {/* Hero Section */}
          <Hero />
          
          {/* Features Section */}
          <Features />
          
          {/* How It Works Section */}
          <section className="section bg-white">
            <div className="container px-4 sm:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 mb-4">
                  How It Works
                </div>
                <h2 className="text-3xl font-medium tracking-tight mb-4">
                  Simple and secure technical interviews
                </h2>
                <p className="text-muted-foreground text-lg">
                  Our platform makes it easy to conduct fair and secure technical interviews with real-time monitoring and analysis.
                </p>
              </div>
              
              <div className="grid gap-16 md:gap-24">
                {/* Step 1 */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                  <div className="order-2 md:order-1">
                    <div className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 mb-4">
                      Step 1
                    </div>
                    <h3 className="text-2xl font-medium mb-4">
                      Create your interview session
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Set up your interview by selecting questions from our library or adding your own custom coding problems.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {['Choose coding language', 'Select difficulty level', 'Set time limits', 'Add custom test cases'].map((item) => (
                        <li key={item} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-brand-500 mr-2 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/interviewer" className="group inline-flex items-center text-brand-600 font-medium">
                      Learn more
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                  
                  <div className="order-1 md:order-2">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-brand-50 to-brand-100 rounded-xl -z-10 transform -rotate-1"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80" 
                        alt="Create interview session"
                        className="rounded-lg shadow-medium w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-brand-100 to-brand-50 rounded-xl -z-10 transform rotate-1"></div>
                    <CodeEditorPanel 
                      language="java"
                      className="shadow-medium"
                    />
                  </div>
                  
                  <div>
                    <div className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 mb-4">
                      Step 2
                    </div>
                    <h3 className="text-2xl font-medium mb-4">
                      Real-time code execution
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Candidates solve problems in our secure, real-time code editor with support for multiple languages and automated testing.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {['Syntax highlighting', 'Live compiler feedback', 'Secure sandboxed environment', 'Anti-cheat protection'].map((item) => (
                        <li key={item} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-brand-500 mr-2 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/editor" className="group inline-flex items-center text-brand-600 font-medium">
                      Try the editor
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                  <div className="order-2 md:order-1">
                    <div className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 mb-4">
                      Step 3
                    </div>
                    <h3 className="text-2xl font-medium mb-4">
                      Monitor and analyze
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Interviewers can view code in real-time, receive alerts for suspicious behaviors, and get comprehensive reports.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {['Live code viewing', 'Behavior analytics', 'Honesty score', 'Comprehensive reports'].map((item) => (
                        <li key={item} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-brand-500 mr-2 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/interviewer" className="group inline-flex items-center text-brand-600 font-medium">
                      Learn more
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                  
                  <div className="order-1 md:order-2">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-brand-50 to-brand-100 rounded-xl -z-10 transform -rotate-1"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80" 
                        alt="Monitor and analyze"
                        className="rounded-lg shadow-medium w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="section bg-brand-50">
            <div className="container px-4 sm:px-6">
              <div className="py-12 md:py-20 px-6 md:px-12 lg:px-16 bg-white rounded-2xl shadow-soft border border-gray-100 text-center">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-medium mb-4">
                    Ready to transform your technical interviews?
                  </h2>
                  <p className="text-muted-foreground text-lg mb-8">
                    Join the companies that are using FairCode to find the best technical talent without the uncertainty.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                      <Link to="/interviewer">For Interviewers</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link to="/candidate" className="group flex items-center">
                        For Candidates
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Index;
