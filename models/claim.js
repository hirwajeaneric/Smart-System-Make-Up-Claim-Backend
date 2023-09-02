const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const claimSchema = new mongoose.Schema({
    fullName: { type: String, required: [ true, 'Full name must be provided' ], trim: true },
    registrationNumber: { 
        type: String, 
        required: [ true, 'Registration number must be provided'], 
        trim: true, 
        maxlength: [5, 'Registration number must be 5 digits long.'], 
        minlength: [5, 'Registration number must be 5 digits long.'], 
    },
    email: { type: String, required: [ true, 'Email must be provided' ] },
    phone: { type: String, required: [ true, 'Phone number must be provided' ] },
    faculty: { type: String, required: [ true, 'Faculty must be provided' ] },
    department: { type: String, required: [ true, 'Department must be provided' ] },
    academicYear: { type: String, required: [ true, 'Academic year must be provided' ] },
    semester: { type: String, required: [ true, 'Semester must be provided' ] },
    period: {type: String, required: [true, 'Examination period must be provided']},
    courses: [
        { 
            courseName: { type: String, required: [true, 'Course name must be provided'] },
            courseCode: { type: String, required: [true, 'Course code must be provided'] },
            semester: { type: String, required: [true, 'Semester must be provided'] },
            academicYear: { type: String, required: [true, 'Academic year must be provided'] },
            credits: { type: Number, required: [true, 'Credits must be provided'] },
            lecturer: { 
                id: { type: Schema.Types.ObjectId, required: false, ref: 'User' },
                name: { type: String, required: false },
                comment: { type: String, required: false },
                signature: { 
                    type: String, 
                    enum: { 
                        values: ['None','Signed', 'Rejected'],
                        message: '{VALUE} is not supported as a signature'
                    }, 
                    default: 'None', 
                    required: false 
                },
                dateOfSignature: { type: Date, required: false },
            },
            group: { type: String, required: [true, 'Course group attended must be provided'] },
            reason: { type: String, required: [true, 'Reason for missing the exam must be provided'] },
        }
    ],
    examPermit: { type: String, required: false },
    proofOfTuitionPayment: { type: String, required: [true, 'A registration form that proves that you have submitted full semester payment must be provided'] },
    proofOfClaimPayment: { type: String, required: false },
    absenceJustification: { type: String, required: false },
    attachment: { type: String, required: false },
    otherAttachment: { type: String, required: false },
    totalClaimCost: { type: Number, required: false },
    paidClaimCost: { type: Number, required: false },
    dateOfPayment: { type: Date, required: false},
    studentSignature: { 
        type: String, 
        enum: { 
            values: ['None','Signed', 'Rejected'],
            message: '{VALUE} is not supported as a signature'
        }, 
        default: 'None', 
        required: false
    },
    hodDeanSignature: {
        signature: { 
            type: String, 
            enum: { 
                values: ['None','Signed', 'Rejected'],
                message: '{VALUE} is not supported as a signature'
            }, 
            default: 'None', 
            required: false 
        },
        comment: { type: String, required: false },
        dateOfSignature: { type: Date, required: false },  
    }, 
    registrationOfficerSignature: {
        signature: { 
            type: String, 
            enum: { 
                values: ['None','Signed', 'Rejected'],
                message: '{VALUE} is not supported as a signature'
            }, 
            default: 'None', 
            required: false 
        },
        comment: { type: String, required: false },
        dateOfSignature: { type: Date, required: false },  
    },
    deanOfStudentsSignature: {
        signature: { 
            type: String, 
            enum: { 
                values: ['None','Signed', 'Rejected'],
                message: '{VALUE} is not supported as a signature'
            }, 
            default: 'None', 
            required: false 
        },
        comment: { type: String, required: false },
        dateOfSignature: { type: Date, required: false },  
    },
    accountantSignature: {
        signature: { 
            type: String, 
            enum: { 
                values: ['None','Signed', 'Rejected'],
                message: '{VALUE} is not supported as a signature'
            }, 
            default: 'None', 
            required: false 
        },
        comment: { type: String, required: false },
        dateOfSignature: { type: Date, required: false },  
    },
    examinationOfficerSignature: {
        signature: { 
            type: String, 
            enum: { 
                values: ['None','Signed', 'Rejected'],
                message: '{VALUE} is not supported as a signature'
            }, 
            default: 'None', 
            required: false 
        },
        comment: { type: String, required: false },
        dateOfSignature: { type: Date, required: false },  
    },
    status: { 
        type: String,
        require: true,
        enum: { 
            values: ['Pending','In Progress', 'Confirmed', 'Rejected'],
            message: '{VALUE} is not supported as a status'
        }, 
        default: 'Pending', 
    },
    submitDate: { type: Date, default: Date.now() }
}) 

module.exports = mongoose.model('Claim', claimSchema);