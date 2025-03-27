
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, X } from 'lucide-react';
import VideoControls from './VideoControls';
import { Button } from './Button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: 'interviewer' | 'candidate';
  text: string;
  timestamp: Date;
}

interface LiveInterviewProps {
  isInterviewer?: boolean;
  candidateName?: string;
  interviewerName?: string;
}

const LiveInterview: React.FC<LiveInterviewProps> = ({
  isInterviewer = false,
  candidateName = 'John Doe',
  interviewerName = 'Jane Smith'
}) => {
  // Video states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
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
      text: 'Thanks! I'll get started on the problem right away.',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Refs for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock function to simulate webcam access
  useEffect(() => {
    const getLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: isVideoEnabled, 
          audio: !isMuted 
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // For demo purposes, we'll use the same stream for remote
        // In a real app, this would come from WebRTC connection
        setTimeout(() => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        }, 1000);
        
        toast.success('Connected to video call');
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast.error('Failed to access camera or microphone');
        setIsVideoEnabled(false);
      }
    };

    getLocalStream();

    return () => {
      // Cleanup function to stop all tracks
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoEnabled, isMuted]);

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

  // Handle toggling mute
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // Toggle opposite of current state
      });
    }
    toast.info(isMuted ? 'Microphone enabled' : 'Microphone muted');
  };

  // Handle toggling video
  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled; // Toggle opposite of current state
      });
    }
    toast.info(isVideoEnabled ? 'Camera disabled' : 'Camera enabled');
  };

  // Handle sending messages
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: isInterviewer ? 'interviewer' : 'candidate',
        text: newMessage.trim(),
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  // Handle ending call
  const handleEndCall = () => {
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
            <Users className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-xs text-muted-foreground">
              {isInterviewer ? candidateName : interviewerName}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main video display */}
        <div className={cn(
          "relative flex-1 bg-gray-900 overflow-hidden",
          isChatOpen ? "hidden md:block md:flex-[2]" : ""
        )}>
          {/* Remote video (main view) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted={isInterviewer} // Only mute if you're the interviewer watching yourself
            className="w-full h-full object-cover"
          ></video>
          
          {/* Local video (picture-in-picture) */}
          <div className="absolute bottom-4 right-4 w-1/4 max-w-[180px] aspect-video rounded-lg overflow-hidden border-2 border-white shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted // Always mute local video to prevent feedback
              className="w-full h-full object-cover"
            ></video>
          </div>
          
          {/* Video controls overlay - positioned at bottom */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <VideoControls
              isMuted={isMuted}
              isVideoEnabled={isVideoEnabled}
              isFullscreen={isFullscreen}
              isChatOpen={isChatOpen}
              onToggleMute={handleToggleMute}
              onToggleVideo={handleToggleVideo}
              onToggleFullscreen={handleToggleFullscreen}
              onToggleChat={() => setIsChatOpen(!isChatOpen)}
              onEndCall={handleEndCall}
            />
          </div>
        </div>
        
        {/* Chat sidebar */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l flex flex-col md:w-1/3 bg-white"
            >
              <div className="flex items-center justify-between border-b p-3">
                <h3 className="font-medium text-sm flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1.5" />
                  Interview Chat
                </h3>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6" 
                  onClick={() => setIsChatOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={cn(
                      "flex gap-2 max-w-[85%]",
                      message.sender === (isInterviewer ? 'interviewer' : 'candidate') 
                        ? "ml-auto justify-end" 
                        : ""
                    )}
                  >
                    {message.sender !== (isInterviewer ? 'interviewer' : 'candidate') && (
                      <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 text-brand-800" />
                      </div>
                    )}
                    
                    <div className={cn(
                      "rounded-lg p-3 text-sm space-y-1",
                      message.sender === (isInterviewer ? 'interviewer' : 'candidate')
                        ? "bg-brand-50 text-brand-900"
                        : "bg-gray-100 text-gray-800"
                    )}>
                      <p>{message.text}</p>
                      <p className="text-xs opacity-60">
                        {new Intl.DateTimeFormat('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }).format(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message input */}
              <form onSubmit={handleSendMessage} className="border-t p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <Button type="submit" size="sm">Send</Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveInterview;
