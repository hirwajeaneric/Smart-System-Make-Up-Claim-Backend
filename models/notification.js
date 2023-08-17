const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new mongoose.Schema({
    text: { 
        type: String, 
        required: true, trim: true 
    },
    subject: { 
        type: String, 
        required: true, 
        trim: true 
    },
    recipient: { 
        type: String, 
        required: true,
        enum: {
            values: ['Student', 'Head of Department', 'Accountant', 'Registration Officer', 'Examination Officer', 'Teacher', 'Dean of Students'],
            message: '{VALUE} is not supported as a role.'
        } 
    },
    department: { 
        type: String, 
        required: false,  
    }, 
    status: { 
        type: String,
        require: true,
        enum: { 
            values: ['New','Seen'],
            message: '{VALUE} is not supported as a notification status'
        }, 
        default: 'New', 
    },
    createdOn: { 
        type: Date, 
        default: new Date().toUTCString() 
    },
}) 

module.exports = mongoose.model('Notification', notificationSchema);