import React, { useEffect, useRef, useState } from 'react';
import { useHMSActions } from '@100mslive/react-sdk';
import { Box, Text, HStack, useColorModeValue, IconButton } from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaVolumeUp } from 'react-icons/fa';
import { io } from 'socket.io-client';

// Create a single socket instance for all components
const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');

function PeerVideoTile({ peer, isLocal, prediction }) {
  const hmsActions = useHMSActions();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [remotePrediction, setRemotePrediction] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isSpeakOn, setIsSpeakOn] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState(null);

  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Get the correct peer ID
  const peerId = peer?.peerID || peer?.id;

  useEffect(() => {
    console.log('[PeerVideoTile] Component mounted for peer:', peerId, 'isLocal:', isLocal);
    
    // Listen for predictions from backend
    socket.on('sign_prediction', (data) => {
      console.log('[PeerVideoTile] Received sign prediction:', data);
      if (data.peerId === peerId) {
        console.log('[PeerVideoTile] Setting prediction for peer:', peerId);
        setRemotePrediction(data.prediction);
      }
    });

    return () => {
      console.log('[PeerVideoTile] Cleaning up for peer:', peerId);
      socket.off('sign_prediction');
    };
  }, [peerId, isLocal]);

  useEffect(() => {
    const videoElem = videoRef.current;
    const canvasElem = canvasRef.current;
    let trackToAttach = null;
    let frameCaptureInterval = null;

    console.log('[PeerVideoTile] Setting up video track for peer:', peerId, 'isLocal:', isLocal);

    // Get all video tracks from the peer
    const videoTracks = peer?.videoTrack ? [peer.videoTrack] : [];
    const auxiliaryTracks = peer?.auxiliaryTracks || [];
    const allTracks = [...videoTracks, ...auxiliaryTracks];

    // Find screen share track (it will have source === 'SCREEN')
    const screenShareTrack = allTracks.find(track => track.source === 'SCREEN');
    
    // If screen share is available, use it; otherwise use regular video track
    if (screenShareTrack) {
      trackToAttach = screenShareTrack;
    } else if (peer?.videoTrack) {
      trackToAttach = peer.videoTrack;
    }

    if (trackToAttach && videoElem) {
      console.log('[PeerVideoTile] Attaching video track for peer:', peerId);
      hmsActions.attachVideo(trackToAttach, videoElem);

      // Set up video ready handler
      const handleVideoReady = () => {
        console.log('[PeerVideoTile] Video ready for peer:', peerId);
        setIsVideoReady(true);
      };
      videoElem.addEventListener('loadeddata', handleVideoReady);

      // Only capture frames for remote users who are not screen sharing
      if (!isLocal && !screenShareTrack) {
        console.log('[PeerVideoTile] Setting up frame capture for remote peer:', peerId);
        
        // Set up canvas for frame capture
        const setupCanvas = () => {
          if (videoElem.videoWidth && videoElem.videoHeight) {
            canvasElem.width = videoElem.videoWidth;
            canvasElem.height = videoElem.videoHeight;
            console.log('[PeerVideoTile] Canvas set up for peer:', peerId, 'dimensions:', canvasElem.width, 'x', canvasElem.height);
          }
        };

        // Initial setup
        setupCanvas();

        // Capture and send frames every 500ms
        frameCaptureInterval = setInterval(() => {
          if (videoElem.readyState === 4 && canvasElem.width && canvasElem.height) {
            const ctx = canvasElem.getContext('2d');
            ctx.drawImage(videoElem, 0, 0, canvasElem.width, canvasElem.height);
            
            // Convert to base64
            const frameData = canvasElem.toDataURL('image/jpeg', 0.8);
            
            // Send to backend
            console.log('[PeerVideoTile] Sending frame to backend for peer:', peerId);
            socket.emit('process_sign', {
              frame: frameData,
              peerId: peerId
            });
          }
        }, 500);
      }
    }

    return () => {
      if (trackToAttach && videoElem) {
        console.log('[PeerVideoTile] Detaching video track for peer:', peerId);
        hmsActions.detachVideo(trackToAttach, videoElem);
        if (typeof handleVideoReady === 'function') {
          videoElem.removeEventListener('loadeddata', handleVideoReady);
        }
      }
      if (frameCaptureInterval) {
        console.log('[PeerVideoTile] Clearing frame capture interval for peer:', peerId);
        clearInterval(frameCaptureInterval);
      }
    };
  }, [peer?.videoTrack, peer?.auxiliaryTracks, peerId, isLocal, hmsActions]);

  // Determine if audio/video is enabled for display
  const isAudioEnabled = isLocal ? peer?.isLocalAudioEnabled : peer?.isAudioEnabled;
  const isVideoEnabled = isLocal ? peer?.isLocalVideoEnabled : peer?.isVideoEnabled;

  // Use remote prediction for remote users
  const currentPrediction = isLocal ? null : remotePrediction;

  // Speak overlayed text when speak is ON and text changes
  useEffect(() => {
    if (!isSpeakOn) {
      window.speechSynthesis.cancel();
      setLastSpokenText(null); // Clear last spoken when toggled off
      return;
    }
    if (currentPrediction && currentPrediction.action) {
      if (lastSpokenText !== currentPrediction.action) {
        window.speechSynthesis.cancel();
        const utter = new window.SpeechSynthesisUtterance(currentPrediction.action);
        window.speechSynthesis.speak(utter);
        setLastSpokenText(currentPrediction.action);
      }
    }
  }, [isSpeakOn, currentPrediction, lastSpokenText]);

  return (
    <Box
      bg={cardBgColor}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="xl"
      position="relative"
      height={{ base: "200px", md: "250px", lg: "300px" }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted={isLocal || !isAudioEnabled}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          backgroundColor: '#000',
        }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {/* Only show the user name in the top left overlay, remove mic and camera icons */}
      <Box
        position="absolute"
        top={2}
        left={2}
        bg="rgba(0,0,0,0.55)"
        px={3}
        py={1}
        borderRadius="md"
        zIndex={2}
        minWidth="110px"
      >
        <Text fontWeight="bold" fontSize="md" color="blue.200">
          {peer?.name || 'Unknown'} {isLocal ? '(You)' : ''}
        </Text>
      </Box>
      {currentPrediction && (
        <Box
          position="absolute"
          bottom={2}
          left={2}
          right={2}
          bg="rgba(30,30,30,0.92)"
          color="white"
          p={3}
          textAlign="center"
          fontWeight="bold"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
          fontSize={{ base: 'md', md: 'lg' }}
          boxShadow="0 2px 8px rgba(0,0,0,0.25)"
        >
          <span style={{ letterSpacing: 0.5, fontWeight: 600, flex: 1, textShadow: '0 2px 8px #000' }}>
            {currentPrediction.action} ({(currentPrediction.confidence * 100).toFixed(1)}%)
          </span>
          <IconButton
            aria-label={isSpeakOn ? 'Disable Speech' : 'Enable Speech'}
            icon={<FaVolumeUp color={isSpeakOn ? '#38B2AC' : '#CBD5E0'} />} // teal when on, gray when off
            onClick={() => setIsSpeakOn((prev) => !prev)}
            ml={2}
            size="md"
            variant="solid"
            bg={isSpeakOn ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.10)'}
            _hover={{ bg: 'rgba(255,255,255,0.28)' }}
            style={{ boxShadow: '0 2px 8px #000', borderRadius: 8 }}
          />
        </Box>
      )}
    </Box>
  );
}

export default PeerVideoTile;