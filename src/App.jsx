import React, { useState, useEffect, useRef } from 'react';
import {
  HMSRoomProvider,
  useHMSActions,
  useHMSStore,
  selectIsConnectedToRoom,
  selectPeers,
  selectLocalPeer,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
} from '@100mslive/react-sdk';
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AppMeeting.css';
import './dark-theme.css';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MeetingRoom from './pages/MeetingRoom';
import Meetings from './pages/Meetings';
import Schedule from './pages/Schedule';
import Learn from './pages/Learn';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'); // update with your backend URL if needed

function MeetingUI() {
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const peers = useHMSStore(selectPeers);
  const localPeer = useHMSStore(selectLocalPeer);
  const isAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const isVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);

  const [roomCode, setRoomCode] = useState('cac-kfch-edu');
  const [authToken, setAuthToken] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState(null);

  const localVideoRef = useRef(null);
  const frameCaptureRef = useRef(true);
  let lastFrameSent = 0;

  // Socket listeners
  useEffect(() => {
    socket.on('connected', (data) => {
      console.log('[Socket] Connected:', data.message);
    });

    socket.on('backend_message', (data) => {
      console.log('[Socket] Backend:', data.message);
    });

    socket.on('camera_ack', (data) => {
      console.log('[Socket] Camera ACK:', data.message);
    });

    socket.on('prediction', (data) => {
      setPrediction(data);
      console.log('[Prediction]', data);
    });

    return () => {
      socket.disconnect();
      socket.off('prediction');
    };
  }, []);

  // --- Step 1: Move captureFrame out of useEffect ---
  const captureFrame = () => {
    const videoElem = localVideoRef.current;
    if (!videoElem || !frameCaptureRef.current) return;
    const now = Date.now();
    if (now - lastFrameSent > 150) {
      const canvas = document.createElement('canvas');
      canvas.width = videoElem.videoWidth;
      canvas.height = videoElem.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
      // Use toDataURL for efficient base64 encoding
      const dataURL = canvas.toDataURL('image/jpeg');
      const base64 = dataURL.split(',')[1];
      // Removed frame captured log for cleaner console
      socket.emit('video_frame', { name, width: canvas.width, height: canvas.height, data: base64 });
      lastFrameSent = now;
    }
    videoElem.requestVideoFrameCallback(captureFrame);
  };

  // Attach local video & frame capture
  useEffect(() => {
    const videoElem = localVideoRef.current;
    const videoTrack = localPeer?.videoTrack;

    if (isVideoEnabled && videoTrack && videoElem) {
      hmsActions.attachVideo(videoTrack, videoElem);

      videoElem.onloadeddata = () => {
        console.log('[Video] onloadeddata triggered');
        frameCaptureRef.current = true;
        videoElem.requestVideoFrameCallback(captureFrame);
      };
    }

    return () => {
      if (localVideoRef.current && videoTrack) {
        hmsActions.detachVideo(videoTrack, localVideoRef.current);
      }
      frameCaptureRef.current = false;
    };
  }, [isVideoEnabled, localPeer?.videoTrack]);

  // Handle joining room
  const handleJoin = async (e) => {
    e.preventDefault();
    if (!authToken || !name) {
      setError('Please provide both name and auth token.');
      return;
    }

    try {
      socket.emit('join_room', { room: roomCode });
      await hmsActions.join({
        userName: name,
        authToken: authToken,
      });
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Leave room
  const handleLeave = () => {
    hmsActions.leave();
    frameCaptureRef.current = false;
  };

  // Toggle audio/video
  const toggleAudio = () => hmsActions.setLocalAudioEnabled(!isAudioEnabled);
  const toggleVideo = () => hmsActions.setLocalVideoEnabled(!isVideoEnabled);

  if (!isConnected) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="card p-4 shadow" style={{ width: '100%', maxWidth: 400 }}>
          <h3 className="text-center mb-3">Join 100ms Meeting</h3>
          <form onSubmit={handleJoin}>
            <div className="mb-2">
              <label>Name</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="mb-2">
              <label>Room Code</label>
              <input type="text" className="form-control" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
            </div>
            <div className="mb-2">
              <label>Auth Token</label>
              <input type="text" className="form-control" value={authToken} onChange={(e) => setAuthToken(e.target.value)} required />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">Join</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">🔵 Echosigns Meeting Room</h4>
        <button className="btn btn-outline-danger" onClick={handleLeave}>Leave</button>
      </div>

      <div className="mb-3">
        <button className={`btn me-2 ${isAudioEnabled ? 'btn-success' : 'btn-secondary'}`} onClick={toggleAudio}>
          {isAudioEnabled ? 'Mic On' : 'Mic Off'}
        </button>
        <button className={`btn ${isVideoEnabled ? 'btn-success' : 'btn-secondary'}`} onClick={toggleVideo}>
          {isVideoEnabled ? 'Camera On' : 'Camera Off'}
        </button>
      </div>

      <div className="row">
        {/* Local video with prediction box */}
        {localPeer && (
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card p-2" style={{ position: 'relative' }}>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="w-100"
                style={{
                  backgroundColor: '#000',
                  borderRadius: 10,
                  maxHeight: 300,
                  objectFit: 'cover',
                }}
              />
              {/* Prediction box at the bottom of the video frame */}
              {prediction && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  width: '100%',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  textAlign: 'center',
                  padding: '8px 0',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  zIndex: 2
                }}>
                  {prediction.action} ({(prediction.confidence * 100).toFixed(1)}%)
                </div>
              )}
              <div className="mt-2 text-center fw-bold">{localPeer.name} (You)</div>
              <div className="text-muted text-center small">
                🎤 {isAudioEnabled ? 'On' : 'Off'} | 🎥 {isVideoEnabled ? 'On' : 'Off'}
              </div>
            </div>
          </div>
        )}
        {/* Remote peers only (exclude local peer) */}
        {peers.filter(peer => !peer.isLocal).map(peer => (
          <div key={peer.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card p-2">
              <video
                autoPlay
                muted={peer.isLocal}
                className="w-100"
                style={{
                  backgroundColor: '#000',
                  borderRadius: 10,
                  maxHeight: 300,
                  objectFit: 'cover',
                }}
              />
              <div className="mt-2 text-center fw-bold">{peer.name}</div>
              <div className="text-muted text-center small">
                🎤 {peer.isAudioEnabled ? 'On' : 'Off'} | 🎥 {peer.isVideoEnabled ? 'On' : 'Off'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Root component with provider
export default function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/meeting" element={
              <HMSRoomProvider>
                <MeetingRoom />
              </HMSRoomProvider>
            } />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/learn" element={<Learn />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}
