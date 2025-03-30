
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Maximize, Minimize, MessageSquare, Phone, Calendar, Share2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoControlsProps {
  isMuted: boolean;
  isVideoEnabled: boolean;
  isFullscreen: boolean;
  isChatOpen: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleFullscreen: () => void;
  onToggleChat: () => void;
  onEndCall: () => void;
  onScheduleInterview?: () => void;
  onToggleScreenShare?: () => void;
  isScreenSharing?: boolean;
  onToggleWhiteboard?: () => void;
  isWhiteboardActive?: boolean;
  className?: string;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isMuted,
  isVideoEnabled,
  isFullscreen,
  isChatOpen,
  onToggleMute,
  onToggleVideo,
  onToggleFullscreen,
  onToggleChat,
  onEndCall,
  onScheduleInterview,
  onToggleScreenShare,
  isScreenSharing = false,
  onToggleWhiteboard,
  isWhiteboardActive = false,
  className
}) => {
  return (
    <div className={cn("flex items-center justify-center gap-2 p-3 bg-gray-900 bg-opacity-80 rounded-lg", className)}>
      <Button
        onClick={onToggleMute}
        variant={isMuted ? "destructive" : "secondary"}
        size="icon"
        className="rounded-full h-10 w-10"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
      
      <Button
        onClick={onToggleVideo}
        variant={isVideoEnabled ? "secondary" : "destructive"}
        size="icon"
        className="rounded-full h-10 w-10"
        aria-label={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
      >
        {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
      </Button>
      
      {onToggleScreenShare && (
        <Button
          onClick={onToggleScreenShare}
          variant={isScreenSharing ? "secondary" : "outline"}
          size="icon"
          className="rounded-full h-10 w-10"
          aria-label={isScreenSharing ? "Stop sharing" : "Share screen"}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      )}
      
      {onToggleWhiteboard && (
        <Button
          onClick={onToggleWhiteboard}
          variant={isWhiteboardActive ? "secondary" : "outline"}
          size="icon"
          className="rounded-full h-10 w-10"
          aria-label={isWhiteboardActive ? "Hide whiteboard" : "Show whiteboard"}
        >
          <Pencil className="h-5 w-5" />
        </Button>
      )}
      
      <Button
        onClick={onToggleChat}
        variant={isChatOpen ? "secondary" : "outline"}
        size="icon"
        className="rounded-full h-10 w-10"
        aria-label={isChatOpen ? "Close chat" : "Open chat"}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
      
      {onScheduleInterview && (
        <Button
          onClick={onScheduleInterview}
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10"
          aria-label="Schedule Interview"
        >
          <Calendar className="h-5 w-5" />
        </Button>
      )}
      
      <Button
        onClick={onToggleFullscreen}
        variant="outline"
        size="icon"
        className="rounded-full h-10 w-10"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
      </Button>
      
      <Button
        onClick={onEndCall}
        variant="destructive"
        size="icon"
        className="rounded-full h-10 w-10"
        aria-label="End call"
      >
        <Phone className="h-5 w-5 rotate-135" />
      </Button>
    </div>
  );
};

export default VideoControls;
