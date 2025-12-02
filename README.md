# Real-Time ChatBox.

A full-stack real-time chat application built with React, Node.js, Express, Socket.IO, and MongoDB. Users can create channels, send messages in real-time, and see online/offline status of other users.

- Project Link (Frontend) : https://real-time-chat-box-assesment.vercel.app
  
- Backend Link : https://chatbox-backend-3p39.onrender.com

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Socket Events](#socket-events)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core Features
- ✅ **User Authentication** - Signup and login with JWT tokens
- ✅ **Real-Time Messaging** - Instant message delivery using Socket.IO
- ✅ **Channels** - Create, join, and leave channels
- ✅ **Online Status** - Real-time presence tracking (online/offline)
- ✅ **Message History** - Persistent message storage with pagination
- ✅ **Responsive UI** - Clean interface built with Material-UI
- ✅ **Session Persistence** - Users remain logged in after page refresh

### Additional Features
- ✅ **Leave Channel** - Users can leave channels with confirmation dialog
- ✅ **Member Display** - Show channel members by name
- ✅ **Online Users List** - See who's currently online
- ✅ **Clean UI/UX** - Modern design with Material-UI components

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Material-UI (MUI)** - Component library
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Router** - Navigation
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - WebSocket library
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie handling
- **cors** - Cross-origin resource sharing

---

## 📁 Project Structure

```
Real-Time-ChatBox-Assessment/
├── backend/
│   ├── controllers/
│   │   ├── AuthController.js       # Authentication logic
│   │   ├── channelController.js    # Channel CRUD operations
│   │   ├── messageController.js    # Message operations
│   │   └── socketController.js     # Socket.IO event handlers
│   ├── middlewares/
│   │   └── authMiddleware.js       # JWT verification middleware
│   ├── models/
│   │   ├── userModel.js           # User schema
│   │   ├── channel.js             # Channel schema
│   │   └── message.js             # Message schema
│   ├── routes/
│   │   ├── AuthRoute.js           # Auth routes
│   │   ├── channelRoutes.js       # Channel routes
│   │   └── messageRoutes.js       # Message routes
│   ├── utils/
│   │   └── SecretToken.js         # JWT token generation
│   ├── .env                       # Environment variables (not tracked)
│   ├── .gitignore
│   ├── server.js                  # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx     # Main chat interface
│   │   │   └── Sidebar.jsx        # Channel list & user info
│   │   ├── pages/
│   │   │   ├── Authentication.jsx # Login/Signup page
│   │   │   └── Chat.jsx           # Chat page layout
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Authentication state management
│   │   ├── hooks/
│   │   │   └── useAuth.js         # Custom auth hook
│   │   ├── services/
│   │   │   ├── api.js             # API calls
│   │   │   └── socket.js          # Socket.IO client setup
│   │   ├── config/
│   │   │   └── environment.js     # Environment configuration
│   │   ├── App.jsx                # Root component
│   │   ├── App.css                # Global styles
│   │   └── main.jsx               # Entry point
│   ├── public/
│   ├── .gitignore
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** (optional, for version control)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/gopalmehtre/Real-Time-ChatBox-Assesment-.git
cd Real-Time-ChatBox-Assesment-
```

Or download and extract the ZIP file.

---

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

**Packages installed:**
- express
- socket.io
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- cookie-parser
- dotenv
- nodemon (dev dependency)

---

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

**Packages installed:**
- react
- react-dom
- react-router-dom
- @mui/material
- @emotion/react
- @emotion/styled
- @mui/icons-material
- axios
- socket.io-client

---

## 🔐 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Connection String
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/chatapp

# Server Port
PORT=8000

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters

# Node Environment
NODE_ENV=development
```

**How to get MongoDB URL:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### Frontend Environment Configuration

Update `frontend/src/config/environment.js`:

```javascript
const IS_PROD = false; // Set to true for production

const SERVER_URL = IS_PROD 
  ? "https://your-backend-url.onrender.com"  // Production URL
  : "http://localhost:8000";                 // Development URL

export default SERVER_URL;
```

---

## ▶️ Running the Application

### Development Mode

#### 1. Start Backend Server

```bash
cd backend
npm start
```

**Expected output:**
```
MONGODB CONNECTED HOST: cluster0-xxxxx.mongodb.net
SERVER LISTENING ON PORT 8000
Socket.IO initialized and ready
```

---

#### 2. Start Frontend (in a new terminal)

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.x.x ready in 500ms

➜  Local:   http://localhost:3000/
```

---

#### 3. Open Browser

Navigate to: **http://localhost:3000**

---

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/status` | Check auth status | No |

**Example Request:**
```javascript
// Signup
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "_id": "6492...",
  "username": "john_doe",
  "email": "john@example.com",
  "token": "eyJhbGci..."
}
```

---

### Channel Routes (`/api/channels`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's channels | Yes |
| GET | `/all` | Get all channels | Yes |
| POST | `/` | Create new channel | Yes |
| POST | `/:id/join` | Join a channel | Yes |
| POST | `/:id/leave` | Leave a channel | Yes |

**Example Request:**
```javascript
// Create Channel
POST /api/channels
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "general"
}

// Response
{
  "_id": "6492...",
  "name": "general",
  "members": ["6491..."],
  "createdBy": "6491...",
  "createdAt": "2025-12-03T10:30:00.000Z"
}
```

---

### Message Routes (`/api/messages`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/:channelId?page=1&limit=50` | Get messages with pagination | Yes |
| POST | `/` | Send message | Yes |

**Example Request:**
```javascript
// Get Messages
GET /api/messages/6492abc123?page=1&limit=50
Authorization: Bearer <token>

// Response
{
  "messages": [
    {
      "_id": "6493...",
      "sender": {
        "_id": "6491...",
        "username": "john_doe"
      },
      "channel": "6492...",
      "content": "Hello everyone!",
      "timestamp": "2025-12-03T10:35:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 3,
  "totalMessages": 120
}
```

---

## 🔌 Socket Events

### Client → Server

| Event | Data | Description |
|-------|------|-------------|
| `register` | `userId` | Register user on connect |
| `joinChannel` | `channelId` | Join a channel room |
| `leaveChannel` | `channelId` | Leave a channel room |
| `sendMessage` | `{ channelId, content, sender }` | Send a message |
| `typing` | `{ channelId, userId, username }` | User is typing (optional) |
| `stopTyping` | `{ channelId, userId }` | User stopped typing (optional) |

---

### Server → Client

| Event | Data | Description |
|-------|------|-------------|
| `userOnline` | `userId` | User came online |
| `userOffline` | `userId` | User went offline |
| `newMessage` | `messageObject` | New message in channel |
| `error` | `{ message }` | Error message |

**Example Socket Usage (Frontend):**
```javascript
import { getSocket } from '../services/socket';

const socket = getSocket();

// Listen for new messages
socket.on('newMessage', (message) => {
  console.log('New message:', message);
});

// Send a message
socket.emit('sendMessage', {
  channelId: '6492...',
  content: 'Hello!',
  sender: '6491...'
});
```



## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot connect to MongoDB"
**Solution:**
- Check your MongoDB Atlas connection string in `.env`
- Ensure IP whitelist allows your IP (or use `0.0.0.0/0` for all IPs)
- Verify username/password are correct
- Check if database user has read/write permissions

#### 2. "Socket not connecting"
**Solution:**
- Check CORS settings in `backend/server.js`
- Verify Socket.IO URLs match in `frontend/src/config/environment.js`
- Check browser console for errors
- Ensure backend server is running

#### 3. "Messages not appearing"
**Solution:**
- Open browser DevTools → Console tab
- Check for Socket.IO connection errors
- Verify user is a member of the channel
- Check backend terminal for errors

#### 4. "Module not found" errors
**Solution:**
- Run `npm install` in both `backend` and `frontend` directories
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Ensure Node.js version is 18+

#### 5. "Port already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

#### 6. "Cookie not set / Auth not working"
**Solution:**
- Check that `withCredentials: true` is set in Axios and Socket.IO
- Verify CORS includes `credentials: true`
- Clear browser cookies and try again

---

## 📝 Testing Multiple Users

Since the app uses httpOnly cookies (shared across tabs), test with:

**Option 1:** Different Browsers
- Chrome: User 1
- Firefox/Edge: User 2

**Option 2:** Incognito/Private Mode
- Regular window: User 1
- Incognito window (Ctrl+Shift+N): User 2

---


## 👨‍💻 Author

**Gopal Mehtre**
- GitHub: [@gopalmehtre](https://github.com/gopalmehtre)
- Repository: [Real-Time-ChatBox-Assessment](https://github.com/gopalmehtre/Real-Time-ChatBox-Assesment-)

---

## 📄 License

This project is an assessment assignment. All rights reserved.


---

## 📚 Documentation Links

- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

---

