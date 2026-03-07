const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Store connected users
const connectedUsers = new Map();

module.exports = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection event
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user._id})`);
    
    // Store user's socket
    connectedUsers.set(socket.user._id.toString(), socket.id);
    
    // Join user to their personal room
    socket.join(`user:${socket.user._id}`);
    
    // Emit connection success
    socket.emit('connected', {
      success: true,
      message: 'Connected to real-time server',
      userId: socket.user._id,
      userName: socket.user.name,
    });

    // Broadcast user online status to all users
    io.emit('user:status', {
      userId: socket.user._id,
      userName: socket.user.name,
      status: 'online',
      timestamp: new Date(),
    });

    // ===== PROFILE EVENTS =====
    
    // Listen for profile update requests
    socket.on('profile:update:request', (data) => {
      console.log(`Profile update request from ${socket.user.name}`);
      // This is handled by HTTP API, but we can acknowledge here
      socket.emit('profile:update:received', {
        success: true,
        message: 'Profile update received',
      });
    });

    // ===== PROGRESS EVENTS =====
    
    // Listen for progress updates
    socket.on('progress:update', (data) => {
      console.log(`Progress update from ${socket.user.name}:`, data);
      
      // Broadcast progress update to user's room
      io.to(`user:${socket.user._id}`).emit('progress:updated', {
        userId: socket.user._id,
        userName: socket.user.name,
        ...data,
        timestamp: new Date(),
      });
      
      // If admin wants to see all progress, broadcast to admin room
      io.to('role:admin').emit('user:progress:updated', {
        userId: socket.user._id,
        userName: socket.user.name,
        ...data,
        timestamp: new Date(),
      });
    });

    // Listen for chapter progress
    socket.on('chapter:progress', (data) => {
      console.log(`Chapter progress from ${socket.user.name}:`, data);
      
      io.to(`user:${socket.user._id}`).emit('chapter:progress:updated', {
        userId: socket.user._id,
        userName: socket.user.name,
        ...data,
        timestamp: new Date(),
      });
    });

    // ===== NOTIFICATION EVENTS =====
    
    // Send notification to user
    socket.on('notification:send', (data) => {
      const { targetUserId, message, type } = data;
      
      if (targetUserId && connectedUsers.has(targetUserId)) {
        const targetSocketId = connectedUsers.get(targetUserId);
        io.to(targetSocketId).emit('notification:received', {
          from: socket.user.name,
          message,
          type: type || 'info',
          timestamp: new Date(),
        });
      }
    });

    // ===== TYPING EVENTS (for future chat feature) =====
    
    socket.on('typing:start', () => {
      socket.broadcast.emit('user:typing', {
        userId: socket.user._id,
        userName: socket.user.name,
      });
    });

    socket.on('typing:stop', () => {
      socket.broadcast.emit('user:stopped:typing', {
        userId: socket.user._id,
      });
    });

    // ===== DISCONNECTION =====
    
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.user._id})`);
      
      // Remove user from connected users
      connectedUsers.delete(socket.user._id.toString());
      
      // Broadcast user offline status
      io.emit('user:status', {
        userId: socket.user._id,
        userName: socket.user.name,
        status: 'offline',
        timestamp: new Date(),
      });
    });

    // ===== ERROR HANDLING =====
    
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.user.name}:`, error);
      socket.emit('error', {
        message: 'An error occurred',
        error: error.message,
      });
    });
  });

  // Helper function to emit to specific user
  io.emitToUser = (userId, event, data) => {
    const socketId = connectedUsers.get(userId.toString());
    if (socketId) {
      io.to(socketId).emit(event, data);
      return true;
    }
    return false;
  };

  // Helper function to get connected users count
  io.getConnectedUsersCount = () => {
    return connectedUsers.size;
  };

  // Helper function to check if user is online
  io.isUserOnline = (userId) => {
    return connectedUsers.has(userId.toString());
  };

  console.log('Socket.IO handlers initialized');
};
