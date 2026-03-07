# Real-Time Socket.IO Integration

## Overview
This application now supports real-time communication using Socket.IO, enabling instant updates across all connected clients without page refreshes.

## Features Implemented

### 🔄 Real-Time Updates
1. **Profile Updates** - Instant synchronization when user profiles are modified
2. **Progress Tracking** - Live chapter and game progress updates
3. **Notifications** - Real-time notification delivery
4. **User Status** - Online/offline status indicators
5. **Typing Indicators** - For future chat functionality

## Backend Architecture

### Socket.IO Server Setup
- **Location**: `backend/server.js`
- **Handler**: `backend/socket/socketHandler.js`
- **Configuration**: CORS enabled for cross-origin requests, WebSocket and polling transports

### Authentication
- Socket connections are authenticated using JWT tokens
- Token verification happens in the socket middleware
- Only authenticated users can establish socket connections

### Socket Events

#### Profile Events
- `profile:updated` - Fired when user profile is updated
- `profile:image:updated` - Fired when profile image changes

#### Progress Events
- `progress:updated` - General progress update event
- `chapter:progress:updated` - Specific chapter progress changes
- `game:completed` - When a user completes a game
- `progress:reset` - When progress is reset

#### Notification Events
- `notification:received` - Real-time notification delivery
- `notification:send` - Send notifications to specific users

#### Status Events
- `user:status` - User online/offline status changes
- `connected` - Successful socket connection confirmation

### Backend Models

#### Progress Model (`backend/models/Progress.js`)
Tracks user progress across all chapters with:
- Chapter-wise progress (0-100%)
- Games completed per chapter
- Overall progress calculation
- Last accessed timestamps

### Backend Controllers

#### Progress Controller (`backend/controllers/progressController.js`)
API endpoints for:
- `GET /api/progress` - Get user progress
- `PUT /api/progress/chapter/:chapterId` - Update chapter progress
- `PUT /api/progress/game` - Record game completion
- `DELETE /api/progress/reset` - Reset progress (testing)

## Frontend Architecture

### Socket Service (`App/services/socketService.js`)
- Singleton service managing socket connections
- Automatic reconnection with exponential backoff
- Event listeners management
- Helper methods for common operations

### Socket Context (`App/context/SocketContext.js`)
- React Context providing socket access throughout the app
- Global notification management
- User status tracking
- Connection state management

### Socket Integration in Screens

#### ProfileScreen
- Real-time profile updates from other sessions
- Automatic UI refresh when profile changes
- Socket connection on login
- Socket disconnection on logout

#### ProgressScreen
- Live progress updates as users complete chapters/games
- Pull-to-refresh functionality
- Automatic data synchronization
- Real-time chapter completion notifications

#### LoginScreen
- Establishes socket connection after successful login
- Initiates real-time session

### Progress Service (`App/services/progressService.js`)
API client for progress-related HTTP requests:
- Get current progress
- Update chapter progress
- Record game completions
- Reset progress

## How It Works

### Connection Flow
1. User logs in via LoginScreen
2. JWT token is stored in AsyncStorage
3. Socket connection is established with authentication token
4. User joins their personal room (`user:{userId}`)
5. Socket listens for real-time events

### Update Flow
1. User performs an action (e.g., updates profile)
2. HTTP API request is sent to backend
3. Backend updates database
4. Backend emits socket event to user's room
5. All connected clients receive the update
6. UI automatically refreshes with new data

### Disconnection Flow
1. User logs out
2. Socket disconnection is triggered
3. Backend removes user from connected users map
4. Offline status is broadcast to other users

## Usage Examples

### Listening to Events (Frontend)
```javascript
import { useSocket } from '../context/SocketContext';

const MyComponent = () => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.onProfileUpdated((data) => {
      console.log('Profile updated:', data);
      // Update UI
    });

    return () => {
      socket.off('profile:updated');
    };
  }, [socket, isConnected]);
};
```

### Emitting Events (Frontend)
```javascript
socket.updateProgress({
  chapterId: 1,
  progress: 75,
  gamesCompleted: 2
});
```

### Emitting Events (Backend)
```javascript
const io = req.app.get('io');
io.to(`user:${userId}`).emit('progress:updated', data);
```

## Configuration

### Backend Environment Variables
Ensure these are set in `backend/.env`:
```
JWT_SECRET=your_jwt_secret
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### Frontend API Configuration
Update the API URL in `App/services/api.js`:
```javascript
const API_URL = 'http://YOUR_IP:5000/api';
```

## Testing Real-Time Features

### Test Profile Updates
1. Login on two different devices/browsers
2. Update profile on one device
3. Observe instant update on the other device

### Test Progress Updates
1. Login and navigate to Progress screen
2. Complete a game or update progress via API call
3. See real-time progress bar updates

### Test Notifications
1. Use the notification send event from one user
2. Target another user's ID
3. Receive instant notification

## Troubleshooting

### Socket Connection Issues
- Verify backend server is running
- Check if port 5000 is accessible
- Ensure JWT token is valid
- Check network connectivity
- Look for CORS errors in console

### Events Not Firing
- Verify socket is connected: `console.log(socket.isConnected())`
- Check event names match exactly (case-sensitive)
- Ensure user is in the correct room
- Check backend logs for errors

### Performance Issues
- Monitor number of listeners with `socket.listeners`
- Always cleanup listeners in useEffect return
- Avoid excessive re-renders
- Use useMemo/useCallback for optimization

## Security Considerations

1. **Authentication**: All socket connections require valid JWT tokens
2. **Authorization**: Users can only join their own rooms
3. **Data Validation**: All incoming data should be validated
4. **Rate Limiting**: Consider adding rate limiting for socket events
5. **Error Handling**: All errors are caught and logged

## Future Enhancements

- [ ] Add chat functionality with typing indicators
- [ ] Implement presence system (who's online)
- [ ] Add real-time leaderboards
- [ ] Push notifications for offline users
- [ ] Add admin dashboard with real-time analytics
- [ ] Implement rooms for group features
- [ ] Add message acknowledgments
- [ ] Implement event history/replay

## Dependencies

### Backend
- `socket.io`: ^4.x - Socket.IO server
- `jsonwebtoken`: ^9.x - JWT authentication

### Frontend
- `socket.io-client`: ^4.x - Socket.IO client

## Resources

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [React Native WebSockets](https://reactnative.dev/docs/network#websocket-support)
- [JWT Authentication](https://jwt.io/)

## Support

For issues or questions about real-time features:
1. Check browser console for errors
2. Check backend logs for socket events
3. Verify network connectivity
4. Ensure both frontend and backend are using compatible Socket.IO versions

---

**Last Updated**: February 2026
**Author**: GitHub Copilot
**Version**: 1.0.0
