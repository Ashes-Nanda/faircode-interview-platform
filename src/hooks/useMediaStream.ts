
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
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  // Initialize the stream
  useEffect(() => {
    const initializeStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: isVideoEnabled, 
          audio: isAudioEnabled 
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
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Toggle mute
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioEnabled; // Toggle opposite of current state
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

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing
        const displayMediaOptions = {
          video: {
            cursor: "always"
          },
          audio: false
        };
        
        const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        setScreenStream(stream);
        setRemoteStream(stream); // For demo, replace remote stream with screen
        setIsScreenSharing(true);
        
        // When user stops sharing via browser UI
        stream.getVideoTracks()[0].onended = () => {
          stopScreenSharing();
        };
        
        toast.success('Screen sharing started');
      } else {
        stopScreenSharing();
      }
    } catch (error) {
      console.error('Error during screen sharing:', error);
      toast.error('Failed to share screen');
    }
  };
  
  const stopScreenSharing = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      
      // Restore the original video in remote stream
      if (localStream) {
        setRemoteStream(localStream);
      }
      
      setIsScreenSharing(false);
      toast.info('Screen sharing stopped');
    }
  };

  return {
    localStream,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    toggleVideo,
    toggleMute,
    toggleScreenShare
  };
};
