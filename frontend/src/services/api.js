import axios from 'axios';
import SERVER_URL from '../config/environment.js';

const API_BASE_URL = `${SERVER_URL}/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});

export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login:(data) => api.post('/auth/login', data),
    checkStatus: () => api.get('/auth/status')
};

export const channelAPI = {
    getChannels: () => api.get('/channels'),
    getAllChannels: () => api.get('/channels/all'),
    createChannel : (data) => api.post('/channels', data),
    joinChannel: (id) => api.post(`/channels/${id}/join`),
    leaveChannel: (id) => api.post(`/channels/${id}/leave`)
};

export const messageAPI = {
    getMessages : (channelId, page =1, limit = 50) => 
        api.get(`/messages/${channelId}?page=${page}&limit=${limit}`),
    sendMessage: (data) => api.post('/messages', data)
};

export default api;