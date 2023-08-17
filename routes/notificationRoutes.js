const express = require('express');
const router = express.Router();

const { findById, createNotification, getNotifications, findByRecipient, findByStatus, updateNotification } = require('../controllers/notification');

router.post('/add', createNotification);
router.get('/list', getNotifications);
router.get('/findById', findById);
router.get('/findByRecipient', findByRecipient);
router.get('/findByStatus', findByStatus);
router.put('/update', updateNotification);

module.exports = router;