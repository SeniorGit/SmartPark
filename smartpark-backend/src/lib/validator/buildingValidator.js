const { body, validationResult } = require('express-validator');

const createdLotsAdmins = {
  body: [
    // Building name
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Building name must be 2-50 characters')
      .matches(/^[A-Za-z0-9\s\-&]+$/)
      .withMessage('Building name can only contain letters, numbers, spaces, hyphens, and ampersands'),

    // Address 
    body('address')
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Address must be 5-100 characters')
      .matches(/^[A-Za-z0-9\s\-\.,#&]+$/)
      .withMessage('Address can only contain letters, numbers, spaces, and basic punctuation'),

    // Total floors 
    body('total_floors')
      .isInt({ min: 1, max: 20 })
      .withMessage('Total floors must be a number between 1 and 20')
  ]
};


const updateLotsAdmins = {
  body: [
    // Building name
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Building name must be 2-50 characters')
      .matches(/^[A-Za-z0-9\s\-&]+$/)
      .withMessage('Building name can only contain letters, numbers, spaces, hyphens, and ampersands'),

    // Address 
    body('address')
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Address must be 5-100 characters')
      .matches(/^[A-Za-z0-9\s\-\.,#&]+$/)
      .withMessage('Address can only contain letters, numbers, spaces, and basic punctuation'),

    // Total floors 
    body('total_floors')
      .isInt({ min: 1, max: 20 })
      .withMessage('Total floors must be a number between 1 and 20')
  ]
};
module.exports = { createdLotsAdmins, updateLotsAdmins };