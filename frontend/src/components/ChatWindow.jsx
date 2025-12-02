import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Send as SendIcon, ExitToApp as LeaveIcon } from '@mui/icons-material';
import { messageAPI, channelAPI } from '../services/api';
import { getSocket } from '../services/socket';

const ChatWindow = ({ selectedChannel, user, onChannelLeft }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    if (selectedChannel) {
      setMessages([]);
      loadMessages();
      
      if (socket) {
        socket.emit('joinChannel', selectedChannel._id);
      }

      return () => {
        if (socket) {
          socket.emit('leaveChannel', selectedChannel._id);
        }
      };
    }
  }, [selectedChannel, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        if (message.channel === selectedChannel?._id) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }
  }, [socket, selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await messageAPI.getMessages(selectedChannel._id);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel) return;

    try {
      console.log('=== Sending Message ===');
      console.log('User:', user);
      console.log('Selected Channel:', selectedChannel);
      console.log('Socket:', socket);
      console.log('Socket Connected:', socket?.connected);

      const messageData = {
        channelId: selectedChannel._id,
        content: newMessage,
        sender: user?._id || user?.id
      };

      console.log('Message Data:', messageData);

      if (!messageData.sender) {
        console.error(' User ID is missing!');
        alert('User ID missing. Please log out and log back in.');
        return;
      }

      if (!socket) {
        console.error(' Socket is not initialized!');
        alert('Socket connection error. Refresh the page.');
        return;
      }

      if (!socket.connected) {
        console.error(' Socket is not connected!');
        alert('Socket disconnected. Refresh the page.');
        return;
      }

      console.log(' Emitting sendMessage event...');
      socket.emit('sendMessage', messageData);

      setNewMessage('');
    } catch (error) {
      console.error(' Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLeaveChannel = async () => {
    try {
      await channelAPI.leaveChannel(selectedChannel._id);
      setOpenLeaveDialog(false);
      
      if (onChannelLeft) {
        onChannelLeft();
      }
    } catch (error) {
      console.error('Error leaving channel:', error);
      alert(error.response?.data?.message || 'Failed to leave channel');
    }
  };

  if (!selectedChannel) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Select a channel to start chatting :)
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      width: '100%'
    }}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 0,
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
          <Typography variant="h6"># {selectedChannel.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedChannel.members?.map(m => m.username).join(', ') || 'No members'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => setOpenLeaveDialog(true)}
        >
          Leave Channel
        </Button>
      </Paper>

      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 3,
          bgcolor: '#ffffff',
          width: '100%'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%', px: 4 }}>
            {messages.map((message, index) => (
              <Box
                key={message._id || index}
                sx={{
                  display: 'flex',
                  mb: message.isSystemMessage ? 2 : 3,
                  alignItems: message.isSystemMessage ? 'center' : 'flex-start',
                  justifyContent: message.isSystemMessage ? 'center' : 'flex-start'
                }}
              >
                {message.isSystemMessage ? (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      fontStyle: 'italic',
                      bgcolor: '#f5f5f5',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1
                    }}
                  >
                    {message.content}
                  </Typography>
                ) : (
                  <>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {message.sender?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mr: 1 }}>
                          {message.sender?.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                      <Typography variant="body1">{message.content}</Typography>
                    </Box>
                  </>
                )}
              </Box>
            ))}
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 0,
          borderTop: 1,
          borderColor: 'divider',
          flexShrink: 0
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
          <TextField
            fullWidth
            placeholder={`Message # ${selectedChannel.name}`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            variant="outlined"
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>

      <Dialog open={openLeaveDialog} onClose={() => setOpenLeaveDialog(false)}>
        <DialogTitle>Leave Channel?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to leave <strong>#{selectedChannel.name}</strong>? 
            You'll need to be re-invited to join again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLeaveDialog(false)}>Cancel</Button>
          <Button onClick={handleLeaveChannel} color="error" variant="contained">
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatWindow;