const express = require('express');
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  updateProfileImage,
  deleteProfile,
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation middleware for profile update
const profileUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('age').optional().isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
  body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender value'),
];

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/', getProfile);
router.put('/', profileUpdateValidation, updateProfile);
router.put('/image', updateProfileImage);
router.delete('/', deleteProfile);

module.exports = router;
