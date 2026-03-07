# Quick Start Guide - Real-Time Features

## Prerequisites
- Node.js installed
- MongoDB running
- React Native development environment set up

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (Socket.IO is already installed)
npm install

# Start the backend server
npm run dev
# OR
npm start
```

Expected output:
```
Server running in development mode on port 5000
Socket.IO is ready for connections
```

### 2. Frontend Setup

```bash
# Navigate to App directory
cd Medical-College-Project/App

# Install dependencies (Socket.IO client is already installed)
npm install

# Start Expo
npx expo start
```

### 3. Update API URL

Before running the app, update the API URL in `App/services/api.js`:

```javascript
const API_URL = 'http://YOUR_COMPUTER_IP:5000/api';
```

To find your IP:
- **Windows**: `ipconfig` (look for IPv4 Address)
- **Mac/Linux**: `ifconfig` or `ip addr`

## Testing Real-Time Features

### Test 1: Profile Real-Time Updates

1. **Setup**: Open app on two devices or browser tabs
2. **Login**: Use the same account on both
3. **Action**: Update profile on Device A
   - Change name, address, or any field
   - Click Save
4. **Verify**: Device B should instantly show the updated profile

### Test 2: Progress Real-Time Updates

1. **Setup**: Open app on two devices
2. **Login**: Use the same account
3. **Navigate**: Open Progress screen on both devices
4. **Action**: Update progress via API or when completing games
5. **Verify**: Both devices show updated progress bars immediately

### Test 3: Socket Connection Status

Check console logs for:
```
✅ Socket connected: <socket-id>
Connected to real-time server: { success: true, ... }
```

### Test 4: Real-Time Notifications

Use this test code in any component:

```javascript
import { useSocket } from '../context/SocketContext';

const TestComponent = () => {
  const { socket, notifications } = useSocket();

  const testNotification = () => {
    socket.sendNotification(
      'TARGET_USER_ID',
      'Test notification!',
      'info'
    );
  };

  return (
    <View>
      <TouchableOpacity onPress={testNotification}>
        <Text>Send Test Notification</Text>
      </TouchableOpacity>
      {notifications.map((notif, idx) => (
        <Text key={idx}>{notif.message}</Text>
      ))}
    </View>
  );
};
```

## API Testing with Postman/Thunder Client

### Get Progress
```
GET http://localhost:5000/api/progress
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Chapter Progress
```
PUT http://localhost:5000/api/progress/chapter/1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "progress": 75,
  "gamesCompleted": 2
}
```

This will trigger real-time updates to all connected clients!

### Update Game Completion
```
PUT http://localhost:5000/api/progress/game
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "chapterId": 1,
  "gameId": "game1",
  "score": 95
}
```

## Troubleshooting

### Backend Issues

**Problem**: Server won't start
```bash
# Solution: Check if port 5000 is in use
# Windows:
netstat -ano | findstr :5000

# Mac/Linux:
lsof -i :5000

# Kill the process and restart
```

**Problem**: Socket.IO not connecting
- Verify MongoDB is running
- Check CORS configuration in server.js
- Ensure JWT_SECRET is set in .env file

### Frontend Issues

**Problem**: Cannot connect to backend
- Verify IP address in api.js
- Make sure backend is running
- Check firewall settings
- Ensure devices are on same WiFi network

**Problem**: Socket events not received
- Check console for connection status
- Verify JWT token is valid
- Check socket.isConnected() returns true

### Common Errors

**Error**: "Authentication error: No token provided"
- **Solution**: Login again to get fresh JWT token

**Error**: "CORS policy: No 'Access-Control-Allow-Origin'"
- **Solution**: Backend CORS is already configured for '*' in development

**Error**: "Socket disconnected: transport close"
- **Solution**: Network issue or backend crashed - restart backend

## Monitoring Real-Time Activity

### Backend Console
Watch for these logs:
```
User connected: John Doe (user-id)
Profile update request from John Doe
Progress update from John Doe: { chapterId: 1, ... }
User disconnected: John Doe (user-id)
```

### Frontend Console
Watch for these logs:
```
✅ Socket connected: abc123
Profile updated via socket: { data: {...} }
Progress updated via socket: { chapterId: 1, ... }
Game completed via socket: { score: 95, ... }
```

## Performance Tips

1. **Optimize Re-renders**: Use React.memo for components receiving socket updates
2. **Cleanup Listeners**: Always remove listeners in useEffect cleanup
3. **Debounce Updates**: Don't emit events too frequently
4. **Use Rooms**: Target specific users with rooms instead of broadcasting

## Next Steps

1. Test all real-time features listed above
2. Monitor console logs for socket activity
3. Test on multiple devices simultaneously
4. Check network tab for WebSocket connections
5. Review REALTIME_FEATURES.md for detailed documentation

## Quick Commands

```bash
# Start backend with logs
cd backend && npm run dev

# Start React Native app
cd Medical-College-Project/App && npx expo start

# View backend logs only
cd backend && npm start 2>&1 | grep -i socket

# Check MongoDB connection
mongo --eval "db.stats()"
```

## Visual Indicators

Look for these UI indicators:
- 🟢 Green dot = Socket connected
- 🔴 Red dot = Socket disconnected
- 🔔 Bell icon = Real-time notifications
- ↻ Refresh icon = Pull to refresh (loads and socket sync)

## Support Checklist

Before asking for help, verify:
- [ ] Backend server is running
- [ ] MongoDB is connected
- [ ] Frontend app is connected to correct IP
- [ ] Login successful
- [ ] JWT token is valid
- [ ] Console shows socket connected
- [ ] No CORS errors in browser/app console

---

Happy testing! 🚀
