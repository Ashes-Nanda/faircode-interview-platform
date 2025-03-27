
import { motion } from 'framer-motion';
import { Code, Shield, Eye, Clock, Users, Zap } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const featuresList = [
  {
    icon: <Code className="h-6 w-6 text-brand-500" />,
    title: "Real-time Code Editor",
    description: "Live coding environment with built-in compiler for Java, C++, and Python with real-time execution."
  },
  {
    icon: <Shield className="h-6 w-6 text-brand-500" />,
    title: "Anti-Cheat Protection",
    description: "Secure environment with browser lock, copy-paste detection, and tab-switching prevention."
  },
  {
    icon: <Eye className="h-6 w-6 text-brand-500" />,
    title: "Behavioral Analytics",
    description: "Track typing patterns, focus shifts, and other behavioral signals to ensure interview integrity."
  },
  {
    icon: <Clock className="h-6 w-6 text-brand-500" />,
    title: "Live Monitoring",
    description: "Interviewers can view code in real-time with alerts for suspicious behaviors and instant feedback."
  },
  {
    icon: <Users className="h-6 w-6 text-brand-500" />,
    title: "Seamless Communication",
    description: "Integrated video and audio chat with built-in notes for a smooth interview experience."
  },
  {
    icon: <Zap className="h-6 w-6 text-brand-500" />,
    title: "Adaptive Questions",
    description: "Intelligent question selection based on candidate performance with randomized ordering."
  }
];

const Feature = ({ icon, title, description, index }: FeatureProps) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + index * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.div 
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="flex flex-col p-6 rounded-xl bg-white shadow-soft border border-gray-100"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export const Features = () => {
  const sectionControls = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="section bg-soft-gray py-24" id="features">
      <div className="container px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 mb-4">
            Features
          </div>
          <h2 className="text-3xl font-medium tracking-tight mb-4">
            Everything you need for secure technical interviews
          </h2>
          <p className="text-muted-foreground text-lg">
            Our platform combines real-time code execution with behavioral analysis to ensure a fair and accurate assessment of candidates.
          </p>
        </div>
        
        <motion.div 
          variants={sectionControls}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featuresList.map((feature, index) => (
            <Feature 
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
