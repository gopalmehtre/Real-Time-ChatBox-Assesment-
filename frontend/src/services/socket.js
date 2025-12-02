import { io } from 'socket.io-client';
import SERVER_URL from '../config/environment.js';

let socket = null;

const initializeSocket = (userId) => {
  if (!socket) {
    socket = io(SERVER_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('register', userId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }
  return socket;
};

const getSocket = () => socket;

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export { initializeSocket, getSocket, disconnectSocket };