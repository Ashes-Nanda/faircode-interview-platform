
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface MediaStreamOptions {
  video: boolean;
  audio: boolean;
}

export const useMediaStream = (options: MediaStreamOptions) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(options.video);
  const [isAudioEnabled, setIsAudioEnabled] = useState(options.audio);

  // Initialize the stream
  useEffect(() => {
    const initializeStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: isVideoEnabled, 
          audio: !isAudioEnabled 
        });
        
        setLocalStream(stream);
        
        // For demo purposes, we'll use the same stream for remote
        // In a real app, this would come from WebRTC connection
        setTimeout(() => {
          setRemoteStream(stream);
        }, 1000);
        
        toast.success('Connected to video call');
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast.error('Failed to access camera or microphone');
        setIsVideoEnabled(false);
      }
    };

    initializeStream();

    return () => {
      // Cleanup function to stop all tracks
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Toggle mute
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isAudioEnabled; // Toggle opposite of current state
      });
    }
    setIsAudioEnabled(!isAudioEnabled);
    toast.info(isAudioEnabled ? 'Microphone muted' : 'Microphone enabled');
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled; // Toggle opposite of current state
      });
    }
    setIsVideoEnabled(!isVideoEnabled);
    toast.info(isVideoEnabled ? 'Camera disabled' : 'Camera enabled');
  };

  return {
    localStream,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleMute
  };
};
