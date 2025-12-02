import messageModel from "../models/message.js";
import channelModel from "../models/channel.js";
import { connect } from "mongoose";
import UserModel from "../models/userModel.js";

const initializeSocket = (io) => {
    const connectedUsers = new Map();

    io.on('connection', (socket) => {
        console.log('user connected :', socket.id);

        socket.on('register', async (userId) => {
            try {
                connectedUsers.set(userId, socket.id);
                socket.userId = userId;

                const user = await UserModel.findByIdAndUpdate(userId, { onlineStatus: true });

                io.emit('userOnline', userId);
                
                console.log(`${user.username} is now online`);
            } catch (error) {
                console.error('Register error:', error);
            }
        });

        socket.on('joinChannel', (channelId) => {
            socket.join(channelId);
        });

        socket.on('leaveChannel', (channelId) => {
            socket.leave(channelId);
            
            // if (socket.userId) {
            //     UserModel.findById(socket.userId).then(user => {
            //         if (user) {
            //             io.to(channelId).emit('userLeftChannel', {
            //                 username: user.username,
            //                 channelId: channelId,
            //                 timestamp: new Date()
            //             });
            //         }
            //     });
            // }
        });

        socket.on('sendMessage', async (data) => {
            try {
                console.log(' Received sendMessage event');
                console.log('Data:', data);
                
                const { channelId, content, sender } = data;

                if (!channelId || !content || !sender) {
                    console.error(' Missing required fields:', { channelId, content, sender });
                    socket.emit('error', { message: 'Missing required fields' });
                    return;
                }

                const channel = await channelModel.findById(channelId);
                if (!channel) {
                    console.error(' Channel not found:', channelId);
                    socket.emit('error', { message: 'Channel not found' });
                    return;
                }

                if (!channel.members.includes(sender)) {
                    console.error(' User not a member:', sender);
                    socket.emit('error', { message: 'Not authorized to send message' });
                    return;
                }

                console.log('Creating message...');
            
                const message = await messageModel.create({
                    sender,
                    channel: channelId,
                    content
                });

                console.log(' Message created:', message._id);

                const populatedMessage = await messageModel.findById(message._id)
                    .populate('sender', 'username email');

                console.log(' Broadcasting to channel:', channelId);

                io.to(channelId).emit('newMessage', populatedMessage);
                
                console.log(' Message sent successfully');
            } catch (error) {
                console.error(' Send message error:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        socket.on('typing', (data) => {
            socket.to(data.channelId).emit('userTyping', {
                channelId: data.channelId,
                userId: data.userId,
                username: data.username
            });
        });

        socket.on('stopTyping', (data) => {
            socket.to(data.channelId).emit('userStopTyping', {
                channelId: data.channelId,
                userId: data.userId
            });
        });

        socket.on('disconnect', async () => {
            try {
                if (socket.userId) {
                    connectedUsers.delete(socket.userId);

                    const user = await UserModel.findByIdAndUpdate(socket.userId, { onlineStatus: false });

                    io.emit('userOffline', socket.userId);
                    
                    console.log(`${user.username} is now offline`);
                }
                console.log('user disconnected : ', socket.id);
            } catch(err) {
                console.error('dissconnect error:', err);
            }

        });
    });
};

export default initializeSocket;