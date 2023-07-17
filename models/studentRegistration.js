const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentRegistrationSchema = new mongoose.Schema({
    fullName: {
        type: String, 
        required: true,
    },
    registrationNumber: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true,
        enum: {
            values: ['1', '2', '3'],
            message: '{VALUE} is not supported as a semester number'
        }
    }, 
    registeredOn: {
        type: Date,
        required: true,
        default: Date.now()
    },
    courses: {
        type: Array,
        required: true,
    }
});

module.exports = mongoose.model('studentRegistration', studentRegistrationSchema);