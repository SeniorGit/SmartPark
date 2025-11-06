const express = require('express');
const userRouter = express.Router();
const {authenticate} = require('../middleware/auth')

// register and login router
// app.get('/api/user/profile', authenticate, userController.getProfile);
// app.get('/api/user/parking', authenticate, userController.getParking);
// v0.1
userRouter.get('/profile', authenticate);
userRouter.get('/parking', authenticate);

module.exports = {userRouter}