const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const courseRoutes = require('./courseRoutes');
const claimRoutes = require('./claimRoutes');
const notificationRoutes = require('./notificationRoutes');
const studentRegistrationRoutes = require('./studentRegistrationRoutes');

router.use('/uploads/', express.static('./uploads'));
router.use('/user', userRoutes);
router.use('/course', courseRoutes);
router.use('/claim', claimRoutes);
router.use('/notification', notificationRoutes);
router.use('/registration', studentRegistrationRoutes);

module.exports = router;