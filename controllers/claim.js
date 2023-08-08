const Claim = require('../models/claim');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors/index');
const sendEmail = require('../utils/email/sendEmail');
const multer= require('multer');

// Establishing a multer storage
const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => { callback(null, './uploads') },
    filename: (req, file, callback) => { callback(null, `${file.fieldname}-${file.originalname}`) }
})

const upload = multer({ storage: multerStorage});

// Middleware for attaching files to the request body before saving.
const attachFile = (req, res, next) => {
    console.log(req.body);

    if (req.file.fieldname === 'proofOfTuitionPayment') {
        req.body.proofOfTuitionPayment = req.file.filename;
    } else if (req.file.fieldname === 'examPermit') {
        req.body.examPermit = req.file.filename;
    } else if (req.file.fieldname === 'proofOfClaimPayment') {
        req.body.proofOfClaimPayment = req.file.filename;
    } else if (req.file.fieldname === 'otherAttachment') {
        req.body.otherAttachment = req.file.filename;
    }

    console.log(req.body);
    
    if (req.file.fieldname === 'attachment') {
        req.body.courses.forEach((element, index) => {
            if (element.lecturer.attachment !== '') {
                req.body.courses[index].lecturer.attachment = req.file.filename;    
            }
        });
    }

    console.log(req.body);
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
    const updated = await Claim.findByIdAndUpdate({_id: req.query.id}, req.body);
    const updatedClaim = await Claim.findById(updated._id);
    res.status(StatusCodes.OK).json({ message: 'Claim updated', payload: updatedClaim })
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
    var paidClaims = [];
    claims.forEach((claim) => {
        claim.courses.forEach((course) => {
            if (course.proofOfClaimPayment) {
                if (!paidClaims.includes(claim)) {
                    paidClaims.push(claim);
                }
            }
        })
    });
    res.status(StatusCodes.OK).json({ paidClaims });
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
    })
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