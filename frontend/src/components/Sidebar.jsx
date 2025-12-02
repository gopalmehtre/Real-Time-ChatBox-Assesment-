import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Avatar,
  IconButton,
  ListItemAvatar,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Logout as LogoutIcon,
  Tag as TagIcon,
  FiberManualRecord as OnlineIcon
} from '@mui/icons-material';
import { channelAPI } from '../services/api';

const Sidebar = ({ user, channels, selectedChannel, onSelectChannel, onChannelsUpdate, onLogout }) => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [allChannels, setAllChannels] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const handleCreateChannel = async () => {
    try {
      if (!newChannelName.trim()) return;
      
      await channelAPI.createChannel({ name: newChannelName });
      setNewChannelName('');
      setOpenCreateModal(false);
      onChannelsUpdate();
    } catch (error) {
      console.error('Error creating channel:', error);
      alert(error.response?.data?.message || 'Failed to create channel');
    }
  };

  const handleJoinChannel = async (channelId) => {
    try {
      await channelAPI.joinChannel(channelId);
      setOpenJoinModal(false);
      onChannelsUpdate();
    } catch (error) {
      console.error('Error joining channel:', error);
      alert(error.response?.data?.message || 'Failed to join channel');
    }
  };

  const handleOpenJoinModal = async () => {
    try {
      const response = await channelAPI.getAllChannels();
      setAllChannels(response.data);
      setOpenJoinModal(true);
    } catch (error) {
      console.error('Error loading channels:', error);
    }
  };

  useEffect(() => {
    const usersMap = new Map();
    channels.forEach(channel => {
      channel.members?.forEach(member => {
        if (member.onlineStatus && member._id !== user?._id) {
          usersMap.set(member._id, member);
        }
      });
    });
    setOnlineUsers(Array.from(usersMap.values()));
  }, [channels, user]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      bgcolor: '#fafafa'
    }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {user?.username}
              </Typography>
              <Chip
                icon={<OnlineIcon sx={{ fontSize: 12 }} />}
                label="Online"
                color="success"
                size="small"
                sx={{ height: 20 }}
              />
            </Box>
          </Box>
          <IconButton onClick={onLogout} color="error" size="small">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Channels</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateModal(true)}
            >
              Create
            </Button>
            <Button
              variant="contained"
              size="small"
              fullWidth
              startIcon={<TagIcon />}
              onClick={handleOpenJoinModal}
            >
              Join
            </Button>
          </Box>
        </Box>

        <List>
          {channels.map((channel) => (
            <ListItem key={channel._id} disablePadding>
              <ListItemButton
                selected={selectedChannel?._id === channel._id}
                onClick={() => onSelectChannel(channel)}
              >
                <ListItemText
                  primary={`# ${channel.name}`}
                  secondary={`${channel.members?.length || 0} members`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {channels.length === 0 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No channels yet. Create or join one!
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ borderTop: 1, borderColor: 'divider', p: 2, maxHeight: '200px', overflow: 'auto' }}>
        <Typography variant="subtitle2" gutterBottom>
          Online Users ({onlineUsers.length})
        </Typography>
        <List dense>
          {onlineUsers.map((member) => (
            <ListItem key={member._id}>
              <ListItemAvatar>
                <Avatar sx={{ width: 28, height: 28, bgcolor: 'success.main' }}>
                  {member.username?.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={member.username} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <DialogTitle>Create New Channel</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Channel Name"
            fullWidth
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateChannel()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
          <Button onClick={handleCreateChannel} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openJoinModal} onClose={() => setOpenJoinModal(false)}>
        <DialogTitle>Join Channel</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <List>
            {allChannels
              .filter(ch => !channels.find(myChannel => myChannel._id === ch._id))
              .map((channel) => (
                <ListItem
                  key={channel._id}
                  secondaryAction={
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleJoinChannel(channel._id)}
                    >
                      Join
                    </Button>
                  }
                >
                  <ListItemText
                    primary={`# ${channel.name}`}
                    secondary={`${channel.members?.length || 0} members`}
                  />
                </ListItem>
              ))}
          </List>
          {allChannels.filter(ch => !channels.find(myChannel => myChannel._id === ch._id)).length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              No new channels to join
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJoinModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;