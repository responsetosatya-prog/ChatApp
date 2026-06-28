# 💬 ChatSphere - Complete Chat Application

## Features

- ✅ **Real-time Messaging** - Instant messages with Socket.IO
- ✅ **User Authentication** - JWT-based secure login/register
- ✅ **User Profiles** - Edit profile, upload picture, change password
- ✅ **Admin Dashboard** - Manage users, approve/block/delete
- ✅ **Message Replies** - Reply to specific messages
- ✅ **Online Status** - See who's online in real-time
- ✅ **Typing Indicators** - See when someone is typing
- ✅ **Search Users** - Find users by name or username
- ✅ **Responsive Design** - Works on mobile and desktop
- ✅ **Dark Theme** - Beautiful modern dark interface

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL
- Socket.IO
- JWT Authentication
- Bcrypt for password hashing

### Frontend
- React.js
- Vite
- Socket.IO Client
- React Router
- React Icons

## Deployment

### Backend (Render)
1. Create a new Web Service
2. Connect your GitHub repository
3. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FRONTEND_URL`

### Frontend (Render)
1. Create a new Static Site
2. Connect your GitHub repository
3. Set build command: `cd frontend && npm install && npm run build`
4. Set publish directory: `frontend/dist`
5. Set environment variable: `VITE_BACKEND_URL`

## Default Admin

- Email: `admin@chatsphere.com`
- Password: `admin123`

## License
MIT
