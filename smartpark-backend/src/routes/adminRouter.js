const express = require('express');
const adminRouter = express.Router();
const {authenticate, requireAdmin} = require('../middleware/auth');
const adminBuilingsController = require('../controllers/buildingsContoller')
const adminFloorController = require('../controllers/floorController');
const adminSlotsController = require('../controllers/slotsController')

// // ===== BUILDINGS CRUD =====
// adminRouter.get('/buildings', authenticate, requireAdmin, adminController.all_lots_data);           // Get all buildings
// adminRouter.post('/buildings', authenticate, requireAdmin, adminController.create_lots);           // Create building
// adminRouter.put('/buildings/:id', authenticate, requireAdmin, adminController.update_lots);        // Update building
// adminRouter.delete('/buildings/:id', authenticate, requireAdmin, adminController.delete_lots);     // Delete building

// // ===== FLOORS MANAGEMENT =====
// adminRouter.get('/buildings/:id/floors', authenticate, requireAdmin, adminFloorController.get_floor_buildings);      // Get all floors in building
// adminRouter.post('/buildings/:id/floors', authenticate, requireAdmin, adminFloorController.create_floor_buildings);  // Add new floor to building
// adminRouter.delete('/buildings/:id/floors/:floorNumber', authenticate, requireAdmin, adminFloorController.delete_floor_buildings); // Delete specific floor

// // ===== SLOTS MANAGEMENT =====
// adminRouter.get('/buildings/:id/floors/:floorNumber/slots', authenticate, requireAdmin, adminSlotsController.get_floor_slots); // Get slots by floor
// adminRouter.put('/slots/:id/status', authenticate, requireAdmin, adminSlotsController.update_slot_status); // Update slot status

// module.exports = { adminRouter };



// ===== BUILDINGS CRUD =====
adminRouter.get('/buildings', adminBuilingsController.showAllParkingLot);           // Get all buildings
adminRouter.post('/buildings', adminBuilingsController.createParkingLots);           // Create building
adminRouter.put('/buildings/:id', adminBuilingsController.updateParkingLots);        // Update building
adminRouter.delete('/buildings/:id',adminBuilingsController.deleteParkingLots);     // Delete building

// ===== FLOORS MANAGEMENT =====
adminRouter.get('/buildings/:id/floors', adminFloorController.getAllFloors);      // Get all floors in building
adminRouter.post('/buildings/:id/floors', adminFloorController.createFloors);  // Add new floor to building
adminRouter.put('/buildings/:id/floors', adminFloorController.updateFloors)
adminRouter.delete('/buildings/:id/floors/:floorNumber', adminFloorController.deleteFloor); // Delete specific floor

// ===== SLOTS MANAGEMENT =====
adminRouter.get('/buildings/:id/floors/:floorNumber/slots', adminSlotsController.get_floor_slots); // Get slots by floor
adminRouter.put('/slots/:id/status', adminSlotsController.update_slot_status); // Update slot status

module.exports = { adminRouter };