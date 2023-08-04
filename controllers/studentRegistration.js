const StudentRegistration = require('../models/studentRegistration');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index');

const createStudentRegistration = async (req, res) => {
    const studentRegistration = await StudentRegistration.create(req.body);
    res.status(StatusCodes.CREATED).json({ message: 'Student registered', studentRegistration })
};

const getStudentRegistrations = async(req, res) => {
    const studentRegistrations = await StudentRegistration.find({})
    res.status(StatusCodes.OK).json({ nbHits: studentRegistrations.length, studentRegistrations })
};

const findById = async(req, res) => {
    const studentRegistrationId = req.query.id;
    const studentRegistration = await StudentRegistration.findById(studentRegistrationId);
    if (!studentRegistration) {
        throw new BadRequestError(`StudentRegistration not found!`);
    }
    res.status(StatusCodes.OK).json({ studentRegistration });
};

const findByRegistrationNumber = async(req, res) => {
    const studentRegistrationNumber = req.query.registrationNumber;
    const studentRegistrations = await StudentRegistration.find({ registrationNumber: studentRegistrationNumber });
    if (!studentRegistrations) {
        throw new BadRequestError(`StudentRegistration not found for registration number : ${studentRegistrationNumber}`);
    }
    res.status(StatusCodes.OK).json({ studentRegistrations });
};

const findByAcademicYear = async(req, res) => {
    const academicYear = req.query.academicYear;
    const studentRegistrations = await StudentRegistration.find({academicYear: academicYear});

    res.status(StatusCodes.OK).json({ studentRegistrations });
};

const findByAcademicYearAndSemester = async(req, res) => {
    const { registrationNumber, academicYear, semester } = req.query;
    const studentRegistration = await StudentRegistration.find({ 
        registrationNumber: registrationNumber, 
        academicYear: academicYear, 
        semester: semester 
    });
    if (!studentRegistration) {
        throw new BadRequestError(`StudentRegistration not found for faculty : ${studentRegistration}`);
    }
    res.status(StatusCodes.OK).json({ studentRegistration });
};


module.exports = { createStudentRegistration, getStudentRegistrations, findByAcademicYear, findByAcademicYearAndSemester, findByRegistrationNumber, findById }