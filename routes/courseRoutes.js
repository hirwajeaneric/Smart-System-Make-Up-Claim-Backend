const express = require('express');
const router = express.Router();
const { authorizeCourseModification } = require('../middleware/authorization');

const { findById, createCourse, deleteCourse, findByDepartment, findByFaculty, getCourses, updateCourse, findByCode, findByLecturerId } = require('../controllers/course');

router.post('/add', authorizeCourseModification, createCourse);
router.get('/list', getCourses);
router.get('/findById', findById);
router.get('/findByCode', findByCode);
router.get('/findByLecturerId', authorizeCourseModification ,findByLecturerId);
router.get('/findByFaculty', findByFaculty);
router.get('/findByDepartment', findByDepartment);
router.put('/update', authorizeCourseModification, updateCourse);
router.delete('/delete', authorizeCourseModification, deleteCourse);

module.exports = router;