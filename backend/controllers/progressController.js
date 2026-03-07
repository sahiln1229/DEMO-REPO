const Progress = require('../models/Progress');

// @desc    Get user progress
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user.id });

    // If no progress exists, create default progress
    if (!progress) {
      progress = await Progress.create({
        userId: req.user.id,
        chapters: [
          {
            chapterId: 1,
            name: 'Hand Hygiene',
            progress: 0,
            gamesCompleted: 0,
            totalGames: 3,
          },
          {
            chapterId: 2,
            name: 'Personal Protective Equipment',
            progress: 0,
            gamesCompleted: 0,
            totalGames: 3,
          },
          {
            chapterId: 3,
            name: 'Biomedical Waste Management',
            progress: 0,
            gamesCompleted: 0,
            totalGames: 3,
          },
          {
            chapterId: 4,
            name: 'Spill Management',
            progress: 0,
            gamesCompleted: 0,
            totalGames: 3,
          },
        ],
      });
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update chapter progress
// @route   PUT /api/progress/chapter/:chapterId
// @access  Private
const updateChapterProgress = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { progress, gamesCompleted } = req.body;

    let userProgress = await Progress.findOne({ userId: req.user.id });

    if (!userProgress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found. Please initialize progress first.',
      });
    }

    // Find and update the specific chapter
    const chapterIndex = userProgress.chapters.findIndex(
      (ch) => ch.chapterId === parseInt(chapterId)
    );

    if (chapterIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    // Update chapter data
    if (progress !== undefined) {
      userProgress.chapters[chapterIndex].progress = progress;
    }
    if (gamesCompleted !== undefined) {
      userProgress.chapters[chapterIndex].gamesCompleted = gamesCompleted;
    }
    userProgress.chapters[chapterIndex].lastAccessed = new Date();

    // Mark as completed if progress is 100%
    if (userProgress.chapters[chapterIndex].progress === 100) {
      userProgress.chapters[chapterIndex].completedAt = new Date();
    }

    await userProgress.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user.id}`).emit('progress:updated', {
        chapterId: parseInt(chapterId),
        progress,
        gamesCompleted,
        overallProgress: userProgress.overallProgress,
        timestamp: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chapter progress updated successfully',
      data: userProgress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update game completion
// @route   PUT /api/progress/game
// @access  Private
const updateGameCompletion = async (req, res) => {
  try {
    const { chapterId, gameId, score } = req.body;

    let userProgress = await Progress.findOne({ userId: req.user.id });

    if (!userProgress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found',
      });
    }

    const chapterIndex = userProgress.chapters.findIndex(
      (ch) => ch.chapterId === parseInt(chapterId)
    );

    if (chapterIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    // Increment games completed
    const currentCompleted = userProgress.chapters[chapterIndex].gamesCompleted;
    const totalGames = userProgress.chapters[chapterIndex].totalGames;
    
    if (currentCompleted < totalGames) {
      userProgress.chapters[chapterIndex].gamesCompleted += 1;
    }

    // Update progress based on games completed
    userProgress.chapters[chapterIndex].progress = Math.round(
      (userProgress.chapters[chapterIndex].gamesCompleted / totalGames) * 100
    );

    userProgress.chapters[chapterIndex].lastAccessed = new Date();

    await userProgress.save();

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user.id}`).emit('game:completed', {
        chapterId: parseInt(chapterId),
        gameId,
        score,
        gamesCompleted: userProgress.chapters[chapterIndex].gamesCompleted,
        progress: userProgress.chapters[chapterIndex].progress,
        overallProgress: userProgress.overallProgress,
        timestamp: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Game completion recorded',
      data: userProgress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Reset progress (for testing)
// @route   DELETE /api/progress/reset
// @access  Private
const resetProgress = async (req, res) => {
  try {
    const progress = await Progress.findOneAndDelete({ userId: req.user.id });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No progress found to reset',
      });
    }

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user.id}`).emit('progress:reset', {
        message: 'Progress has been reset',
        timestamp: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Progress reset successfully',
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
  getProgress,
  updateChapterProgress,
  updateGameCompletion,
  resetProgress,
};
