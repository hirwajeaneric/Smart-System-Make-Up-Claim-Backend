const Notification = require('../models/notification');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index');

const createNotification = async (req, res) => {
    const notification = await Notification.create(req.body);
    res.status(StatusCodes.CREATED).json({ message: 'New notification', notification })
};

const getNotifications = async(req, res) => {
    const notifications = await Notification.find({})
    res.status(StatusCodes.OK).json({ nbHits: notifications.length, notifications })
};

const findById = async(req, res) => {
    const notificationId = req.query.id;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
        throw new BadRequestError(`Notification not found!`);
    }
    res.status(StatusCodes.OK).json({ notification });
};

const findByRecipient = async(req, res) => {
    const { recipient, department } = req.query;
    var notifications = {};

    if (department) {
        notifications = await Notification.find({ recipient: recipient, department: department });    
    }
    notifications = await Notification.find({ recipient: recipient });
    
    if (!notifications) {
        throw new BadRequestError(`No available notifications for this recipient : ${recipientRole}`);
    }

    res.status(StatusCodes.OK).json({ notifications });
};

const findByStatus = async(req, res) => {
    const notifications = await Notification.find({status: req.query.status });
    res.status(StatusCodes.OK).json({ notifications });
};

const updateNotification = async(req, res) => {
    const notificationId = req.query.id;
    const updatedNotification = await Course.findByIdAndUpdate({ _id: notificationId}, req.body);

    if (!updatedNotification) {
        throw new NotFoundError(`Notification with id ${notificationId} not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'Changed', payload: updatedNotification})
};


module.exports = { createNotification, getNotifications, findByRecipient, findByStatus, findById, updateNotification }