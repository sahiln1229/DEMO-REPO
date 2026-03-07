const express = require('express');
const router = express.Router();
const {
  getProgress,
  updateChapterProgress,
  updateGameCompletion,
  resetProgress,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.get('/', getProgress);
router.put('/chapter/:chapterId', updateChapterProgress);
router.put('/game', updateGameCompletion);
router.delete('/reset', resetProgress);

module.exports = router;
