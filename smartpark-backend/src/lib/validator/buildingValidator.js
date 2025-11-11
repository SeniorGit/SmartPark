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

const floorValidation = {
  body: [
    // Total floors 
    body('floor_number')
      .isInt({ min: -10, max: 100 }) 
      .withMessage('Floor number must be an integer between -10 and 100'),

    body('slots_count')
        .isInt({ min: 1, max: 1000 })
        .withMessage('Slots count must be between 1 and 1000')
  ]
};

module.exports = { createdLotsAdmins, updateLotsAdmins, floorValidation };