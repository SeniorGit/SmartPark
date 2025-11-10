const { body, validationResult } = require('express-validator');

const registerValidator = [
  // First Name
  body('first_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be 2-50 characters')
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('First name can only contain letters and spaces'),

  // Last Name
  body('last_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be 2-50 characters')
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('Last name can only contain letters and spaces'),

  // Email
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  // Phone Number 
  body('phone_number')
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  // Password
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase, one lowercase, and one number'),

];

const loginValidator = [
  // Email
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  // Password
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase, one lowercase, and one number'),

];

module.exports = {registerValidator, loginValidator}