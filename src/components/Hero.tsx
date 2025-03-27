
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './Button';

export const Hero = () => {
  const fade = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.1,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50 via-background to-background"></div>
      
      {/* Abstract circles and shapes */}
      <div className="absolute top-20 -left-40 w-96 h-96 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-2000"></div>
      
      <div className="container px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fade}
            custom={0}
            className="inline-flex items-center rounded-full border border-brand-200 bg-white/60 backdrop-blur-sm px-3 py-1 text-sm font-medium text-brand-800 shadow-sm mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-brand-500 mr-2"></span>
            Introducing FairCode Interview Platform
          </motion.div>
          
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={fade}
            custom={1}
            className="font-medium tracking-tight mb-4 max-w-3xl text-4xl sm:text-6xl"
          >
            Conduct <span className="text-brand-600">fair and honest</span> technical interviews
          </motion.h1>
          
          <motion.p 
            initial="hidden"
            animate="visible"
            variants={fade}
            custom={2}
            className="text-muted-foreground max-w-2xl text-lg sm:text-xl mb-8"
          >
            A secure, cheat-resistant environment for conducting live, one-on-one technical interviews with real-time code execution and behavioral analytics.
          </motion.p>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fade}
            custom={3}
            className="flex flex-col sm:flex-row gap-3 mb-12"
          >
            <Button asChild size="lg" className="px-8">
              <Link to="/candidate">For Candidates</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="group">
              <Link to="/interviewer" className="flex items-center">
                For Interviewers
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fade}
            custom={4}
            className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-elegant"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-100/20 to-brand-300/20 backdrop-blur-sm">
              <div className="flex items-center justify-center h-full">
                <div className="relative w-full max-w-4xl mx-auto rounded-md overflow-hidden shadow-hard border border-white/20">
                  <img 
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1400&q=80" 
                    alt="Code editor interface"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
