
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Play } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'guide';
  duration?: string;
  url: string;
}

const LearningResourcesPanel: React.FC = () => {
  // Mock data for learning resources
  const resources: Resource[] = [
    {
      id: 'res-001',
      title: 'How to Approach Dynamic Programming',
      type: 'video',
      duration: '12 min',
      url: '#'
    },
    {
      id: 'res-002',
      title: 'Mastering Graph Algorithms',
      type: 'article',
      url: '#'
    },
    {
      id: 'res-003',
      title: 'Common System Design Patterns',
      type: 'guide',
      url: '#'
    },
    {
      id: 'res-004',
      title: 'Behavioral Interview Tips',
      type: 'video',
      duration: '8 min',
      url: '#'
    }
  ];

  const getResourceIcon = (type: 'video' | 'article' | 'guide') => {
    switch (type) {
      case 'video':
        return <Play className="h-3.5 w-3.5" />;
      case 'article':
        return <BookOpen className="h-3.5 w-3.5" />;
      case 'guide':
        return <BookOpen className="h-3.5 w-3.5" />;
      default:
        return <BookOpen className="h-3.5 w-3.5" />;
    }
  };

  const getResourceColor = (type: 'video' | 'article' | 'guide') => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-700';
      case 'article':
        return 'bg-purple-100 text-purple-700';
      case 'guide':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Learning Resources</h2>
        <button className="text-sm text-brand-600 font-medium hover:text-brand-700">
          Browse All
        </button>
      </div>
      
      <div className="space-y-3">
        {resources.map((resource) => (
          <motion.a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.01 }}
            className="flex items-center justify-between p-3 border border-gray-100 hover:border-gray-200 rounded-lg"
          >
            <div className="flex items-center">
              <div className={`h-8 w-8 rounded-full ${getResourceColor(resource.type)} flex items-center justify-center mr-3`}>
                {getResourceIcon(resource.type)}
              </div>
              <div>
                <div className="font-medium text-sm">{resource.title}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                  <span className="capitalize">{resource.type}</span>
                  {resource.duration && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{resource.duration}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default LearningResourcesPanel;
