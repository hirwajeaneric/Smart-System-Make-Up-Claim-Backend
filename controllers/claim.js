const Claim = require('../models/claim');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors/index');
const sendEmail = require('../utils/email/sendEmail');
const multer= require('multer');

// Establishing a multer storage
const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => { callback(null, './uploads') },
    filename: (req, file, callback) => { callback(null, `${file.originalname}`) }
})

const upload = multer({ storage: multerStorage});

// Middleware for attaching files to the request body before saving.
const attachFile = (req, res, next) => {
    const { courses, ...otherData } = req.body;
    
    courses.forEach((element, index) => {
        if (element.lecturer.attachment !== '') {
            req.body.courses[index].lecturer.attachment = req.file.filename;    
        } else if (element.examPermit !== '') {
            req.body.courses[index].examPermit = req.file.filename;
        } else if (element.proofOfTuitionPayment !== '') {
            req.body.courses[index].proofOfTuitionPayment = req.file.filename;
        } else if (element.proofOfClaimPayment !== '') {
            req.body.courses[index].proofOfClaimPayment = req.file.filename;
        } else if (element.otherAttachments !== '') {
            req.body.courses[index].otherAttachments = req.file.filename;
        }
    });
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

    res.status(StatusCodes.CREATED).json({ message: 'Exam makeup claim initiated', payload: claim })
};

const getClaims = async(req, res) => {
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
    const claim = await Claim.find({ registrationNumber: registrationNumber });
    if (!claim) {
        throw new BadRequestError(`Claim not found for registration number : ${registrationNumber}`);
    }
    res.status(StatusCodes.OK).json({ nbHits: claim.length, claim });
};

const findByFaculty = async(req, res) => {
    const faculty = req.query.faculty;
    const claim = await Claim.find({ faculty: faculty });
    if (!claim) {
        throw new BadRequestError(`No claim found for faculty : ${faculty}`);
    }
    res.status(StatusCodes.OK).json({ nbHits: claim.length, claim });
};

const findByDepartment = async(req, res) => {
    const department = req.query.department;
    const claim = await Claim.find({ department: department });
    if (!claim) {
        throw new BadRequestError(`No claim found for department : ${department}`);
    }
    res.status(StatusCodes.OK).json({ nbHits: claim.length, claim });
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
    res.status(StatusCodes.OK).json({ nbHits: claims.length, claims });
};

const updateClaims = async(req, res) => {
    const claim = req.body;
    const claimId = req.query.id;
    
    const updated = await Claim.findByIdAndUpdate({ _id: claimId }, req.body);
    const updatedClaim = await Claim.findById(updated._id);

    res.status(StatusCodes.OK).json({ message: 'Claim updated', payload: updatedClaim })
};

module.exports = { createClaim, getClaims, findById, findByCourse, findByDepartment, findByFaculty, findByRegistrationNumber, updateClaims, upload, attachFile }