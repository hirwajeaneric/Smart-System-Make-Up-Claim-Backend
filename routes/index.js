const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const courseRoutes = require('./courseRoutes');
const claimRoutes = require('./claimRoutes');

router.use('/uploads/', express.static('./uploads'));
router.use('/user', userRoutes);
router.use('/course', courseRoutes);
router.use('/claim', claimRoutes);

module.exports = router;