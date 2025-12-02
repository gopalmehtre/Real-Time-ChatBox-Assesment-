import React, { useState, useEffect } from 'react';
import { Box, Grid, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { channelAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
  const { user, logout } = useAuth();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Chat.jsx - Current user:', user);
  }, [user]);

  useEffect(() => {
    if (user) {
      loadChannels();
    }
  }, [user]);

  const loadChannels = async () => {
    try {
      const response = await channelAPI.getChannels();
      setChannels(response.data);

      const stillMember = response.data.find(ch => ch._id === selectedChannel?._id);
      if (!stillMember && response.data.length > 0) {
        setSelectedChannel(response.data[0]);
      } else if (response.data.length === 0) {
        setSelectedChannel(null);
      }
    } catch (error) {
      console.error('Error loading channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChannelLeft = () => {
    loadChannels();
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#ffffff'
    }}>
      <Grid container sx={{ flexGrow: 1, overflow: 'hidden', height: '100vh' }}>
        <Grid 
          item 
          xs={12} 
          sm={3}
          md={3}
          lg={2.5}
          sx={{ 
            borderRight: 1, 
            borderColor: '#e0e0e0',
            height: '100vh',
            bgcolor: '#f5f5f5',
            minWidth: '280px',
            maxWidth: '320px'
          }}
        >
          <Sidebar
            user={user}
            channels={channels}
            selectedChannel={selectedChannel}
            onSelectChannel={setSelectedChannel}
            onChannelsUpdate={loadChannels}
            onLogout={logout}
          />
        </Grid>

        <Grid 
          item 
          xs={12} 
          sm={9}
          md={9}
          lg={9.5}
          sx={{ 
            height: '100vh',
            bgcolor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            flexGrow: 1
          }}
        >
          <ChatWindow
            selectedChannel={selectedChannel}
            user={user}
            onChannelLeft={handleChannelLeft}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Chat;