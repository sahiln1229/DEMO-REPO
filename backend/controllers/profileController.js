const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        staffPost: user.staffPost,
        age: user.age,
        gender: user.gender,
        profileImage: user.profileImage,
        notifications: user.notifications,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, address, staffPost, age, gender, profileImage, notifications } = req.body;

    console.log('📥 Profile update request received:', {
      userId: req.user.id,
      hasImage: !!profileImage,
      imageSize: profileImage ? `${(profileImage.length / 1024).toFixed(2)} KB` : '0 KB'
    });

    const user = await User.findById(req.user.id);

    if (!user) {
      console.error('❌ User not found:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (address !== undefined) user.address = address;
    if (staffPost !== undefined) user.staffPost = staffPost;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (profileImage !== undefined) {
      // Validate base64 image (basic check)
      if (profileImage && !profileImage.startsWith('data:image/')) {
        console.warn('⚠️ Profile image not in base64 format, length:', profileImage.length);
        return res.status(400).json({
          success: false,
          message: 'Profile image must be in base64 format (data:image/...)',
        });
      }
      if (profileImage) {
        console.log('✅ Valid base64 image received, size:', `${(profileImage.length / 1024).toFixed(2)} KB`);
      }
      user.profileImage = profileImage;
    }
    if (notifications !== undefined) user.notifications = notifications;

    await user.save();
    
    console.log('✅ User profile saved to database:', {
      userId: user._id,
      name: user.name,
      hasImage: !!user.profileImage,
      imageSize: user.profileImage ? `${(user.profileImage.length / 1024).toFixed(2)} KB` : '0 KB'
    });

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      staffPost: user.staffPost,
      age: user.age,
      gender: user.gender,
      profileImage: user.profileImage,
      notifications: user.notifications,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Emit socket event for real-time profile update
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${user._id}`).emit('profile:updated', {
        data: userData,
        timestamp: new Date(),
      });
      console.log('📡 Socket event emitted: profile:updated');
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userData,
    });
  } catch (error) {
    console.error('❌ Profile update error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to save profile. ' + error.message,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Update profile image
// @route   PUT /api/profile/image
// @access  Private
const updateProfileImage = async (req, res) => {
  try {
    const { profileImage } = req.body;

    if (!profileImage) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a profile image',
      });
    }

    // Validate base64 image
    if (!profileImage.startsWith('data:image/')) {
      console.warn('⚠️ Profile image not in base64 format');
      return res.status(400).json({
        success: false,
        message: 'Profile image must be in base64 format (data:image/...)',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.profileImage = profileImage;
    await user.save();
    
    console.log('✅ Profile image saved to database:', {
      userId: user._id,
      imageSize: profileImage.length
    });

    // Emit socket event for real-time profile image update
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${user._id}`).emit('profile:image:updated', {
        profileImage: user.profileImage,
        timestamp: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile image updated successfully',
      data: {
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/profile
// @access  Private
const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Soft delete by setting isActive to false
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateProfileImage,
  deleteProfile,
};
