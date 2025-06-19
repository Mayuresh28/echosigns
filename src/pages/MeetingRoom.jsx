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
  selectHMSMessages,
} from '@100mslive/react-sdk';
import { io } from 'socket.io-client';
import '../AppMeeting.css';
import '../dark-theme.css';
import '../MeetingRoomEnhanced.css';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Flex, Text, IconButton, VStack, HStack, Input, Button, Tabs, TabList, TabPanels, TabPanel, Tab, useColorModeValue, SimpleGrid, Spinner } from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaRegHandPeace, FaShareSquare, FaCommentDots, FaUsers, FaSignOutAlt, FaUserFriends, FaComments } from 'react-icons/fa';
import PeerVideoTile from '../components/PeerVideoTile';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');

function MeetingUI() {
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const peers = useHMSStore(selectPeers);
  const localPeer = useHMSStore(selectLocalPeer);
  const isAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const isVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);
  const messages = useHMSStore(selectHMSMessages);

  const [searchParams] = useSearchParams();
  const userNameFromUrl = searchParams.get('name') || '';
  const [prediction, setPrediction] = useState(null);
  const navigate = useNavigate();
  const [activeSidebarTab, setActiveSidebarTab] = useState(null); // 'chat' or 'participants'
  const [chatInput, setChatInput] = useState('');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef(null); // Ref for scrolling chat to bottom

  const ROOM_CODE = 'xgs-zxpu-ihz';
  const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoiYXBwIiwiYXBwX2RhdGEiOm51bGwsImFjY2Vzc19rZXkiOiI2ODUwYjNkZTE0NWNiNGU4NDQ5YWZjYjEiLCJyb2xlIjoiaG9zdCIsInJvb21faWQiOiI2ODUwYjNlYWE0OGNhNjFjNDY0NzQxM2IiLCJ1c2VyX2lkIjoiZGY0YTFhMDgtYTEwZS00OTM0LWFjYTAtMGRiODIxMzBiNDZkIiwiZXhwIjoxNzUwMzQzMDg2LCJqdGkiOiJlYjEzNDBhNy0wYWZjLTRkN2MtOGFlOS1lMGZmZTJmODMzZTYiLCJpYXQiOjE3NTAyNTY2ODYsImlzcyI6IjY4NTBiM2RlMTQ1Y2I0ZTg0NDlhZmNhZiIsIm5iZiI6MTc1MDI1NjY4Niwic3ViIjoiYXBpIn0.U4JcegU_zXBELJsRHI2IuGWx5waQ8raYuzOj2O2TXBo';

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

  useEffect(() => {
    if (!isConnected && userNameFromUrl && AUTH_TOKEN) {
      const joinMeeting = async () => {
        try {
          setIsLoading(true);
          socket.emit('join_room', { room: ROOM_CODE });
      await hmsActions.join({
            userName: userNameFromUrl,
            authToken: AUTH_TOKEN,
      });
    } catch (err) {
          console.error('Failed to join meeting:', err);
        } finally {
          setIsLoading(false);
        }
      };
      joinMeeting();
    } else if (isConnected) {
      setIsLoading(false);
    }
  }, [isConnected, userNameFromUrl, AUTH_TOKEN, hmsActions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLeave = () => {
    hmsActions.leave();
    navigate('/meetings');
  };

  const toggleAudio = () => hmsActions.setLocalAudioEnabled(!isAudioEnabled);
  const toggleVideo = () => hmsActions.setLocalVideoEnabled(!isVideoEnabled);
  const toggleSidebar = (tab) => {
    if (activeSidebarTab === tab) {
      setActiveSidebarTab(null);
    } else {
      setActiveSidebarTab(tab);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      hmsActions.sendBroadcastMessage(chatInput);
      setChatInput('');
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await hmsActions.stopScreenShare();
        setIsScreenSharing(false);
      } else {
        await hmsActions.startScreenShare();
        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error('Failed to toggle screen share:', error);
      setIsScreenSharing(false);
    }
  };

  // Calculate participant count for grid layout
  const participantCount = peers.length + (localPeer ? 1 : 0);
  const getGridClass = () => {
    if (participantCount === 1) return 'single-participant';
    if (participantCount === 2) return 'two-participants';
    if (participantCount === 3) return 'three-participants';
    return 'four-plus-participants';
  };

  return (
    <Box className="meeting-room-container">
      {isLoading && (
        <Box className="loading-overlay">
          <Spinner className="loading-spinner" />
        </Box>
      )}
      {/* Header */}
      <Box className="meeting-header">
        <Flex justify="center" align="center">
          <Text className="meeting-title" textAlign="center">
            Echosigns Meeting Room
        </Text>
        </Flex>
      </Box>

      {/* Main Content Area - Bootstrap Responsive Grid */}
      <div className="container-fluid h-100 d-flex flex-column justify-content-center align-items-center p-0" style={{flex: 1, minHeight: '70vh'}}>
        <div className="row w-100 justify-content-center align-items-center flex-grow-1" style={{minHeight: '60vh'}}>
          <div className={activeSidebarTab ? "col-12 col-md-8 col-lg-9 d-flex justify-content-center align-items-center" : "col-12 d-flex justify-content-center align-items-center"}>
            <div className="video-grid d-flex flex-wrap justify-content-center align-items-center w-100">
              {participantCount === 0 ? (
                <Box className="empty-state">
                  <Text className="empty-state-icon">👥</Text>
                  <Text className="empty-state-text">Waiting for participants to join...</Text>
                </Box>
              ) : (
                <>
        {localPeer && (
                    <div className="video-tile mb-3 mx-auto col-12 col-sm-10 col-md-8 col-lg-6">
            <PeerVideoTile peer={localPeer} isLocal={true} prediction={prediction} />
                    </div>
          )}
          {peers.filter(peer => !peer.isLocal).map(peer => (
                    <div key={peer.id} className="video-tile mb-3 mx-auto col-12 col-sm-10 col-md-8 col-lg-6">
                      <PeerVideoTile peer={peer} isLocal={false} />
                    </div>
          ))}
                </>
              )}
            </div>
          </div>
        {activeSidebarTab && (
            <div className="col-12 col-md-4 col-lg-3 sidebar px-0 d-flex flex-column" style={{maxHeight: '70vh'}}>
            <Tabs flex="1" display="flex" flexDirection="column" isFitted index={activeSidebarTab === 'participants' ? 0 : 1}>
                <TabList className="sidebar-tabs">
                  <Tab className="sidebar-tab" onClick={() => toggleSidebar('participants')}>
                    <FaUserFriends style={{ marginRight: '8px' }} />
                    Participants
                  </Tab>
                  <Tab className="sidebar-tab" onClick={() => toggleSidebar('chat')}>
                    <FaComments style={{ marginRight: '8px' }} />
                    Chat
                  </Tab>
              </TabList>
                <TabPanels flex="1" overflowY="auto" className="sidebar-content">
                <TabPanel p={0}>
                    <VStack spacing={3} align="stretch">
                      {peers.map(peer => (
                        <Box key={peer.id} className="participant-item">
                          <Text className="participant-name">
                          {peer.name} {peer.isLocal ? '(You)' : ''}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </TabPanel>
                <TabPanel p={0} display="flex" flexDirection="column" height="100%">
                    <VStack spacing={3} align="stretch" flex="1" overflowY="auto" mb={4}>
                      {messages.length === 0 ? (
                        <Box className="empty-state">
                          <Text className="empty-state-icon">💬</Text>
                          <Text className="empty-state-text">No messages yet</Text>
                        </Box>
                      ) : (
                        messages.map((msg, index) => (
                          <Box key={index} className="chat-message">
                            <Text className="chat-sender">{msg.senderName}:</Text>
                            <Text className="chat-text">{msg.message}</Text>
                      </Box>
                        ))
                      )}
                    <div ref={messagesEndRef} />
                  </VStack>
                    <form onSubmit={handleSendMessage} className="chat-input-container">
                    <HStack width="100%">
                      <Input
                          className="chat-input"
                        placeholder="Type your message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        flex="1"
                      />
                        <Button type="submit" className="chat-send-button">
                          Send
                        </Button>
                    </HStack>
                  </form>
                </TabPanel>
              </TabPanels>
            </Tabs>
            </div>
        )}
        </div>
      </div>

      {/* Control Bar - Fixed at Bottom */}
      <Box className="control-bar control-bar-fixed">
        <HStack spacing={4}>
          <IconButton
            aria-label={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
            icon={isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
            className={`control-button ${isAudioEnabled ? 'active' : ''}`}
            onClick={toggleAudio}
            size="lg"
            isRound
            style={{
              background: isAudioEnabled ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#23232b',
              color: '#fff',
              border: '1px solid #fff',
              boxShadow: '0 0 2px 0.5px rgba(255,255,255,0.18)',
            }}
          />
          <IconButton
            aria-label={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
            icon={isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
            className={`control-button ${isVideoEnabled ? 'active' : ''}`}
            onClick={toggleVideo}
            size="lg"
            isRound
            style={{
              background: isVideoEnabled ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#23232b',
              color: '#fff',
              border: '1px solid #fff',
              boxShadow: '0 0 2px 0.5px rgba(255,255,255,0.18)',
            }}
          />
          <IconButton
            aria-label="Share screen"
            icon={<FaShareSquare />}
            className={`control-button ${isScreenSharing ? 'active' : ''}`}
            onClick={toggleScreenShare}
            size="lg"
            isRound
            style={{
              background: isScreenSharing ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#23232b',
              color: '#fff',
              border: '1px solid #fff',
              boxShadow: '0 0 2px 0.5px rgba(255,255,255,0.18)',
            }}
          />
          <IconButton
            aria-label="Open chat"
            icon={<FaCommentDots />}
            className={`control-button ${activeSidebarTab === 'chat' ? 'active' : ''}`}
            onClick={() => toggleSidebar('chat')}
            size="lg"
            isRound
            style={{
              background: activeSidebarTab === 'chat' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#23232b',
              color: '#fff',
              border: '1px solid #fff',
              boxShadow: '0 0 2px 0.5px rgba(255,255,255,0.18)',
            }}
          />
          <IconButton
            aria-label="View participants"
            icon={<FaUsers />}
            className={`control-button ${activeSidebarTab === 'participants' ? 'active' : ''}`}
            onClick={() => toggleSidebar('participants')}
            size="lg"
            isRound
            style={{
              background: activeSidebarTab === 'participants' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#23232b',
              color: '#fff',
              border: '1px solid #fff',
              boxShadow: '0 0 2px 0.5px rgba(255,255,255,0.18)',
            }}
          />
          <IconButton
            aria-label="Leave meeting"
            icon={<FaSignOutAlt />}
            className="control-button danger"
            onClick={handleLeave}
            size="lg"
            isRound
            style={{
              background: '#e53e3e',
              color: '#fff',
              border: '1px solid #fff',
              boxShadow: '0 0 2px 0.5px rgba(255,255,255,0.18)',
            }}
          />
        </HStack>
      </Box>
    </Box>
  );
}

export default function AppMeeting() {
  return (
    <HMSRoomProvider>
      <MeetingUI />
    </HMSRoomProvider>
  );
}
