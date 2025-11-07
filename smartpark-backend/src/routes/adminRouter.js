const express = require('express');
const adminRouter = express.Router();
const {authenticate, requireAdmin} = require('../middleware/auth');
const adminController = require('../controllers/buildingsContoller');
const adminFloorController = require('../controllers/floorController');
const adminSlotsController = require('../controllers/slotsController')
// admin Dashboard buildings Information
adminRouter.get('/buildings', authenticate, requireAdmin, adminController.all_lots_data);
adminRouter.post('/buildings/', authenticate, requireAdmin, adminController.create_lots);
adminRouter.put('/buildings/:id', authenticate, requireAdmin, adminController.update_lots);
adminRouter.delete('/buildings/:id', authenticate, requireAdmin, adminController.delete_lots);

// admin Lots Floor Information      
adminRouter.get('/buildings/:id', authenticate, requireAdmin, adminFloorController.get_floor_buildings);
adminRouter.post('/buildings/create/:id', authenticate, requireAdmin, adminFloorController.create_floor_buildings);
adminRouter.delete('/buildings/delete/:id', authenticate, requireAdmin, adminFloorController.delete_floor_buildings);

// Parking Slot Manage
adminRouter.get('/slots/:id', authenticate, requireAdmin, adminSlotsController.get_floor_slots);
adminRouter.put('/slots/:id', authenticate, requireAdmin, adminSlotsController.update_slot_status);

module.exports = {adminRouter}