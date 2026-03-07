const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    chapters: [
      {
        chapterId: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        gamesCompleted: {
          type: Number,
          default: 0,
        },
        totalGames: {
          type: Number,
          default: 3,
        },
        lastAccessed: {
          type: Date,
          default: null,
        },
        completedAt: {
          type: Date,
          default: null,
        },
      },
    ],
    overallProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalGamesCompleted: {
      type: Number,
      default: 0,
    },
    totalGames: {
      type: Number,
      default: 12,
    },
    completedChapters: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate overall progress before saving
progressSchema.pre('save', function (next) {
  if (this.chapters && this.chapters.length > 0) {
    // Calculate overall progress
    const totalProgress = this.chapters.reduce((sum, chapter) => sum + chapter.progress, 0);
    this.overallProgress = Math.round(totalProgress / this.chapters.length);
    
    // Calculate total games completed
    this.totalGamesCompleted = this.chapters.reduce((sum, chapter) => sum + chapter.gamesCompleted, 0);
    
    // Calculate completed chapters
    this.completedChapters = this.chapters.filter(chapter => chapter.progress === 100).length;
  }
  next();
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
