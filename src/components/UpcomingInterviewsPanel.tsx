
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink } from 'lucide-react';

interface Interview {
  id: string;
  company: string;
  position: string;
  date: Date;
  time: string;
  status: 'upcoming' | 'completed';
  daysUntil: number;
}

interface UpcomingInterviewsPanelProps {
  onJoinInterview: (id: string) => void;
}

const UpcomingInterviewsPanel: React.FC<UpcomingInterviewsPanelProps> = ({ onJoinInterview }) => {
  // Mock data for upcoming interviews
  const interviews: Interview[] = [
    {
      id: 'int-001',
      company: 'Tech Solutions Inc.',
      position: 'Frontend Developer',
      date: new Date('2025-04-15T14:00:00'),
      time: '2:00 PM - 3:30 PM',
      status: 'upcoming',
      daysUntil: 14
    },
    {
      id: 'int-002',
      company: 'DataViz Systems',
      position: 'Full Stack Engineer',
      date: new Date('2025-04-22T10:30:00'),
      time: '10:30 AM - 12:00 PM',
      status: 'upcoming',
      daysUntil: 21
    },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Upcoming Interviews</h2>
        <button className="text-sm text-brand-600 font-medium hover:text-brand-700">
          View All
        </button>
      </div>
      
      {interviews.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
          <h3 className="font-medium mb-1">No Upcoming Interviews</h3>
          <p className="text-muted-foreground text-sm">
            You don't have any interviews scheduled yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <motion.div
              key={interview.id}
              whileHover={{ scale: 1.01 }}
              className="border border-gray-100 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">{interview.company}</h3>
                    <span className="ml-2 px-2 py-0.5 bg-brand-50 text-brand-700 text-xs rounded-full">
                      {interview.position}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-1 flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    {formatDate(interview.date)}
                    <span className="mx-2">•</span>
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    {interview.time}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {interview.daysUntil <= 7 && (
                    <button
                      onClick={() => onJoinInterview(interview.id)}
                      className="text-sm bg-brand-600 hover:bg-brand-700 text-white px-3 py-1 rounded-md flex items-center"
                    >
                      Join
                      <ExternalLink className="ml-1 h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    className="text-sm border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded-md"
                  >
                    Prepare
                  </button>
                </div>
              </div>
              
              {/* Countdown */}
              <div className="mt-3 flex items-center">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div 
                    className="bg-brand-500 h-1.5 rounded-full" 
                    style={{ 
                      width: `${Math.max(0, Math.min(100, 100 - (interview.daysUntil / 30) * 100))}%` 
                    }}
                  ></div>
                </div>
                <span className="ml-3 text-xs text-muted-foreground whitespace-nowrap">
                  {interview.daysUntil === 0 
                    ? 'Today!' 
                    : `${interview.daysUntil} day${interview.daysUntil !== 1 ? 's' : ''} left`}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingInterviewsPanel;
