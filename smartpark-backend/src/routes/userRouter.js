const express = require('express');
const userRouter = express.Router();
const {authenticate} = require('../middleware/auth');
const userController = require('../controllers/userController');

// admin Lots Floor Information      
// userRouter.get('/buildings', authenticate, userController.all_lots_data); 
// userRouter.get('/buildings/:id', authenticate, userController.get_floor_buildings);
// userRouter.get('/buildings/:id/floors/:floorNumber/slots', authenticate, userController.get_floor_slots); 
// module.exports = {userRouter}


// admin Lots Floor Information      
userRouter.get('/buildings', userController.all_lots_data); // List semua buildings
userRouter.get('/buildings/:id', userController.get_floor_buildings); // Detail building + floors
userRouter.get('/buildings/:id/floors/:floorNumber/slots', userController.get_floor_slots); // Slots per floor
module.exports = {userRouter}