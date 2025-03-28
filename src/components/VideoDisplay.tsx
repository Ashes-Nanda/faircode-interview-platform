
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

interface VideoDisplayProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isInterviewer?: boolean;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({
  localStream,
  remoteStream,
  isInterviewer = false
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Set the stream sources when they change
  React.useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  return (
    <>
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
    </>
  );
};

export default VideoDisplay;
