const express = require('express');
const router = express.Router();
const { findById, findByAcademicYear, findByAcademicYearAndSemester, findByRegistrationNumber, createStudentRegistration, getStudentRegistrations } = require('../controllers/studentRegistration');

router.post('/add', createStudentRegistration);
router.get('/list', getStudentRegistrations);
router.get('/findById', findById);
router.get('/findByRegistrationNumber', findByRegistrationNumber);
router.get('/findByAcademicYear', findByAcademicYear);
router.get('/findByAcademicYearAndSemester', findByAcademicYearAndSemester);

module.exports = router;