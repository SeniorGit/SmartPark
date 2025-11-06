const express = require('express');
const adminRouter = express.Router();
const {authenticate, requireAdmin} = require('../middleware/auth')

// register and login router
adminRouter.post('/users', authenticate, requireAdmin);
adminRouter.post('/buildings', authenticate, requireAdmin);
adminRouter.put('/slots/:id', authenticate, requireAdmin);

// app.get('/api/admin/users', authenticate, requireAdmin, adminController.getUsers);
// app.post('/api/admin/buildings', authenticate, requireAdmin, adminController.createBuilding);
// app.put('/api/admin/slots/:id', authenticate, requireAdmin, adminController.updateSlot);

module.exports = {adminRouter}