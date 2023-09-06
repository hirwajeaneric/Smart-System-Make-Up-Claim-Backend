const Claim = require('../models/claim');
const NotificationModel = require('../models/notification')
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors/index');
const sendEmail = require('../utils/email/sendEmail');
const multer= require('multer');
const SENDEMAIL = require('../utils/SendEmail');

// Establishing a multer storage
const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => { callback(null, './uploads') },
    filename: (req, file, callback) => { callback(null, `${file.fieldname}-${file.originalname}`) }
})

const upload = multer({ storage: multerStorage});

// Middleware for attaching files to the request body before saving.
const attachFile = (req, res, next) => {
    if (req.file.fieldname === 'proofOfTuitionPayment') {
        req.body.proofOfTuitionPayment = req.file.filename;
    } else if (req.file.fieldname === 'examPermit') {
        req.body.examPermit = req.file.filename;
    } else if (req.file.fieldname === 'proofOfClaimPayment') {
        req.body.proofOfClaimPayment = req.file.filename;
    } else if (req.file.fieldname === 'otherAttachment') {
        req.body.otherAttachment = req.file.filename;
    } else if (req.file.fieldname === 'attachment') {
        req.body.attachment = req.file.filename;
    } else if (req.file.fieldname === 'absenceJustification') {
        req.body.absenceJustification = req.file.filename;
    }
    
    next();
}

const createClaim = async (req, res) => {
    const claim = await Claim.create(req.body);

    await sendEmail(
        claim.email,
        "Claim initiated",
        {
          name: claim.fullName
        },
        "./template/claimInitiated.handlebars"
    );

    res.status(StatusCodes.CREATED).json({ message: 'Exam absence declared', claim })
};

const updateClaims = async(req, res) => {
    // Claim before update
    var existingClaim = await Claim.findById(req.query.id);

    const updated = await Claim.findByIdAndUpdate({_id: req.query.id}, req.body);
    const updatedClaim = await Claim.findById(updated._id);

    // Check if the updates involved signing on the lecturer's behalf.
    if (!existingClaim.attachment && updatedClaim.attachment) {
        // Sending notifications
        const newNotification = await NotificationModel.create({
            text: `New claim from ${updatedClaim.fullName}`,
            subject: 'New claim',
            recipient: 'Head of Department',
            department: updatedClaim.department,
            claimId: updatedClaim._id,
            status: 'New'
        })
    }

    // HOD Signature
    if (updatedClaim.hodDeanSignature.signature !== existingClaim.hodDeanSignature.signature && updatedClaim.hodDeanSignature.signature === 'Rejected') {
        await SENDEMAIL(updatedClaim.email, 'Claim rejected',  `Dear ${updatedClaim.fullName}, \n\nYour claim for make up exam submitted on ${new Date(updatedClaim.submitDate).toDateString()} was rejected by the head of department office.\n\nPlease check your claim details for more information. \n\nBest regards, \n\nSSEMC`);
    }

    // Examination officer Signature
    if (updatedClaim.examinationOfficerSignature.signature !== existingClaim.examinationOfficerSignature.signature && updatedClaim.examinationOfficerSignature.signature === 'Rejected') {
        await SENDEMAIL(updatedClaim.email, 'Claim rejected',  `Dear ${updatedClaim.fullName}, \n\nYour claim for make up exam submitted on ${new Date(updatedClaim.submitDate).toDateString()} was rejected by the examination office.\n\nPlease check your claim details for more information. \n\nBest regards, \n\nSSEMC`);
    }

    // Dean of students Signature
    if (updatedClaim.deanOfStudentsSignature.signature !== existingClaim.deanOfStudentsSignature.signature && updatedClaim.deanOfStudentsSignature.signature === 'Rejected') {
        await SENDEMAIL(updatedClaim.email, 'Claim rejected',  `Dear ${updatedClaim.fullName}, \n\nYour claim for make up exam submitted on ${new Date(updatedClaim.submitDate).toDateString()} was rejected by the dean of students.\n\nPlease check your claim details for more information. \n\nBest regards, \n\nSSEMC`);
    }

    // Registration office Signature
    if (updatedClaim.registrationOfficerSignature.signature !== existingClaim.registrationOfficerSignature.signature && updatedClaim.registrationOfficerSignature.signature === 'Rejected') {
        await SENDEMAIL(updatedClaim.email, 'Claim rejected',  `Dear ${updatedClaim.fullName}, \n\nYour claim for make up exam submitted on ${new Date(updatedClaim.submitDate).toDateString()} was rejected by the registration office.\n\nPlease check your claim details for more information. \n\nBest regards, \n\nSSEMC`);
    }

    // Final signature by the accounting office
    if (updatedClaim.accountantSignature.signature !== existingClaim.accountantSignature.signature) {
        if (updatedClaim.accountantSignature.signature === 'Signed') {
            await Claim.findByIdAndUpdate({ _id: updatedClaim._id }, { status: 'Confirmed' });
            await SENDEMAIL(updatedClaim.email, 'Claim approved',  `Dear ${updatedClaim.fullName}, \n\nYour claim for make up exam submitted on ${new Date(updatedClaim.submitDate).toDateString()} is now approved.\n\nBest regards, \n\nSSEMC`);
        } else if (updatedClaim.accountantSignature.signature === 'Rejected') {
            await SENDEMAIL(updatedClaim.email, 'Claim rejected',  `Dear ${updatedClaim.fullName}, \n\nYour claim for make up exam submitted on ${new Date(updatedClaim.submitDate).toDateString()} was rejected by the accounting office.\n\nPlease check your claim details for more information. \n\nBest regards, \n\nSSEMC`);
        }
    }

    res.status(StatusCodes.OK).json({ message: 'Claim updated', payload: updatedClaim })
};

const remove = async(req, res) => {
    const claimId = req.query.id;
    const deletedClaim = await Claim.findByIdAndRemove({ _id: claimId});

    if (!deletedClaim) {
        throw new NotFoundError(`Claim not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'Deleted'})
};

const getClaims = async(req, res) => {
    console.log(req.body);
    const claims = await Claim.find({})
    res.status(StatusCodes.OK).json({ nbHits: claims.length, claims })
};

const findById = async(req, res) => {
    const claimId = req.query.id;
    const claim = await Claim.findById(claimId);
    if(!claim){
        throw new BadRequestError(`Claim not found!`)
    }
    res.status(StatusCodes.OK).json({ claim })
};

const findByRegistrationNumber = async(req, res) => {
    const registrationNumber = req.query.registrationNumber;
    const claims = await Claim.find({ registrationNumber: registrationNumber });
    if (!claims) {
        throw new BadRequestError(`Claim not found for registration number : ${registrationNumber}`);
    }
    res.status(StatusCodes.OK).json({ claims });
};

const findByFaculty = async(req, res) => {
    const faculty = req.query.faculty;
    const claims = await Claim.find({ faculty: faculty });
    if (!claims) {
        throw new BadRequestError(`No claim found for faculty : ${faculty}`);
    }
    res.status(StatusCodes.OK).json({ claims });
};

const findByDepartment = async(req, res) => {
    const department = req.query.department;
    const claims = await Claim.find({ department: department });
    
    if (!claims) {
        throw new BadRequestError(`No claim found for department : ${department}`);
    }
    res.status(StatusCodes.OK).json({ nbHits: claim.length, claims });
};

const findByCourse = async(req, res) => {
    const courseCode = req.query.courseCode;
    const allClaims = await Claim.find({});
    let claims = [];
    allClaims.forEach(element => {
        if (element.courseCode === courseCode) {
            claims.push(element);
        }
    })
    if (!claims) {
        throw new BadRequestError(`No claim found for course code : ${courseCode}`);
    }
    res.status(StatusCodes.OK).json({ claims });
};

const findByPaid = async (req, res) => {
    const claims = await Claim.find({});
    var paidClaims = claims.filter(element => element.proofOfClaimPayment && element.hodDeanSignature.signature === 'Signed');
    res.status(StatusCodes.OK).json({ claims: paidClaims });
}

const findByLecturerSignature = async (req, res) => {
    const department = req.query.department;
    const claims = await Claim.find({});
    var lecturerSignedClaims = [];
    claims.forEach((claim) => {
        claim.courses.forEach((course) => {
            if (course.lecturer.signature === 'Signed' && department === department) {
                lecturerSignedClaims.push(claim);
            }
        })
    });
    res.status(StatusCodes.OK).json({ claims: lecturerSignedClaims });
}

const findByDepartmentSignature = async (req, res) => {
    const claims = await Claim.find({});
    var departmentSignedClaims = [];
    claims.forEach(claim => {
        if (claim.hodDeanSignature.signature === 'Signed') {
            departmentSignedClaims.push(claim);
        }
    })
    res.status(StatusCodes.OK).json({ claims: departmentSignedClaims });
}

const findByStudentSignature = async (req, res) => {
    const studentSignedClaims = await Claim.find({ studentSignature: 'Signed'});
    res.status(StatusCodes.OK).json({ claims: studentSignedClaims });
}

const findByAccountantSignature = async (req, res) => {
    const claims = await Claim.find({});
    var accountantSignedClaims = [];
    claims.forEach(claim => {
        if (claim.accountantSignature.signature === 'Signed') {
            accountantSignedClaims.push(claim);
        }
    });
    
    res.status(StatusCodes.OK).json({ claims: accountantSignedClaims });
}

const findByRegistrationOfficerSignature = async (req, res) => {
    const claims = await Claim.find({});
    var registrationSignedClaims = [];
    claims.forEach(claim => {
        if (claim.registrationOfficerSignature.signature === 'Signed') {
            registrationSignedClaims.push(claim);
        }
    })
    res.status(StatusCodes.OK).json({ claims: registrationSignedClaims });
}

const findByDeanOfStudentSignature = async (req, res) => {
    const claims = await Claim.find({});
    var deanOfStudentSignedClaims = [];
    claims.forEach(claim => {
        if (claim.deanOfStudentsSignature.signature === 'Signed') {
            deanOfStudentSignedClaims.push(claim);
        }
    })
    res.status(StatusCodes.OK).json({ claims: deanOfStudentSignedClaims });
}

module.exports = { 
    createClaim, 
    getClaims, 
    remove,
    findById, 
    findByCourse, 
    findByDepartment, 
    findByFaculty, 
    findByRegistrationNumber,
    findByAccountantSignature,
    findByDeanOfStudentSignature, 
    findByLecturerSignature,
    findByRegistrationOfficerSignature,
    findByStudentSignature,
    findByDepartmentSignature,
    findByPaid,
    updateClaims, 
    upload, 
    attachFile 
};