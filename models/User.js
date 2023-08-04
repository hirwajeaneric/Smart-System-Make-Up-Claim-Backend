const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    fullName: { 
        type: String, 
        trim: true, 
        required: [true, 'Full name must be provided'],
        maxlength: 50,
        minlength: 3,
    },
    userName: {
        type: String, 
        required: false,
    },
    registrationNumber: { 
        type: Number, 
        required: false, 
    },
    email: { 
        type: String, 
        trim: true, 
        required: [true, 'Email must be provided'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true, 
    },
    phone: { 
        type: String, 
        required: [true, 'Phone number must be provided'],
    },
    role: { 
        type: String, 
        required: true,
        enum: {
            values: ['Student', 'Head of Department', 'Accountant', 'Registration Officer', 'Examination Officer', 'Teacher', 'Dean of Students'],
            message: '{VALUE} is not supported as a role.'
        } 
    },
    password: { 
        type: String, 
        required: [true, 'Password must be provided'], 
        minlength: 8, 
    },
    faculty: { 
        type: String, 
        required: false 
    },
    department: { 
        type: String, 
        required: false 
    },
    courses: [
        {
            semester: { 
                type: Number, 
                required: false 
            },
            academicYear: { 
                type: String, 
                required: false 
            },
            courseCode: { 
                type: String, 
                required: false 
            },
            courseName: { 
                type: String, 
                required: false 
            },
            groups: { 
                type: Array, 
                required: false 
            },
            faculty: { 
                type: String, 
                required: false 
            },
            department: { 
                type: String, 
                required: false 
            }
        }
    ],
    status: {
        type: String,
        required: true,
        default: 'No'
    }
}) 

UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function() {
    return jwt.sign(
        {
            userId: this._id,  
            role: this.role,
            email: this.email,
        }, 
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    );
};

UserSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

module.exports = mongoose.model('User', UserSchema);
