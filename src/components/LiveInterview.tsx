import React, { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import VideoControls from './VideoControls';
import VideoDisplay from './VideoDisplay';
import ChatPanel, { Message } from './ChatPanel';
import Whiteboard from './Whiteboard';
import { ActivitySummary } from './ActivitySummary';
import { useMediaStream } from '@/hooks/useMediaStream';
import { useBehavioralTracking } from '@/hooks/useBehavioralTracking';

interface LiveInterviewProps {
  isInterviewer?: boolean;
  candidateName?: string;
  interviewerName?: string;
  onEndInterview?: () => void;
}

const LiveInterview: React.FC<LiveInterviewProps> = ({
  isInterviewer = false,
  candidateName = 'John Doe',
  interviewerName = 'Jane Smith',
  onEndInterview
}) => {
  // State for UI controls
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  
  // Container ref for fullscreen
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use our custom hook for media streams
  const { 
    localStream, 
    remoteStream, 
    isVideoEnabled, 
    isAudioEnabled,
    isScreenSharing,
    toggleVideo,
    toggleMute,
    toggleScreenShare
  } = useMediaStream({ 
    video: true, 
    audio: true 
  });

  const { 
    session,
    honestyScore,
    flagDescriptions,
    startTracking,
    stopTracking,
  } = useBehavioralTracking();

  // Chat messages state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'interviewer',
      text: 'Hello! Welcome to the interview. Let me know if you have any questions about the problem.',
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: '2',
      sender: 'candidate',
      text: "Thanks! I'll get started on the problem right away.",
      timestamp: new Date(Date.now() - 60000)
    }
  ]);

  // Handle toggling fullscreen
  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Handle sending messages
  const handleSendMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      sender: isInterviewer ? 'interviewer' : 'candidate',
      text: text,
      timestamp: new Date()
    };
    setMessages([...messages, message]);
  };

  // Handle toggling whiteboard
  const handleToggleWhiteboard = () => {
    setIsWhiteboardOpen(!isWhiteboardOpen);
    if (!isWhiteboardOpen) {
      toast.info('Whiteboard opened for collaborative explanations');
    }
  };

  // Handle ending call
  const handleEndCall = () => {
    if (onEndInterview) {
      onEndInterview();
    }
    
    toast.warning('Call ended', {
      description: 'The interview session has been terminated'
    });
    // In a real app, this would disconnect WebRTC and redirect
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex flex-col rounded-xl border bg-white shadow-soft overflow-hidden transition-all",
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "h-[400px]"
      )}
    >
      <div className="flex items-center justify-between bg-gray-50 border-b p-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="font-medium text-sm">Live Interview Session</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-xs text-muted-foreground">
              {isInterviewer ? candidateName : interviewerName}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1">
        {/* Main video display */}
        <div className={cn(
          "relative flex-1 bg-gray-900 overflow-hidden",
          isChatOpen ? "hidden md:block md:flex-[2]" : ""
        )}>
          <VideoDisplay 
            localStream={localStream}
            remoteStream={remoteStream}
            isInterviewer={isInterviewer}
          />
          
          {/* Video controls overlay - positioned at bottom */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <VideoControls
              isMuted={!isAudioEnabled}
              isVideoEnabled={isVideoEnabled}
              isFullscreen={isFullscreen}
              isChatOpen={isChatOpen}
              isScreenSharing={isScreenSharing}
              isWhiteboardActive={isWhiteboardOpen}
              onToggleMute={toggleMute}
              onToggleVideo={toggleVideo}
              onToggleFullscreen={handleToggleFullscreen}
              onToggleChat={() => setIsChatOpen(!isChatOpen)}
              onToggleScreenShare={toggleScreenShare}
              onToggleWhiteboard={handleToggleWhiteboard}
              onEndCall={handleEndCall}
            />
          </div>

          {/* Activity Summary */}
          <div className="absolute bottom-24 left-4 right-4">
            <ActivitySummary
              session={session}
              honestyScore={honestyScore}
              flagDescriptions={flagDescriptions}
            />
          </div>
        </div>
        
        {/* Chat sidebar */}
        <AnimatePresence>
          {isChatOpen && (
            <ChatPanel
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              messages={messages}
              onSendMessage={handleSendMessage}
              isInterviewer={isInterviewer}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Whiteboard overlay */}
      <Whiteboard 
        isOpen={isWhiteboardOpen}
        onClose={() => setIsWhiteboardOpen(false)}
      />
    </div>
  );
};

export default LiveInterview;
