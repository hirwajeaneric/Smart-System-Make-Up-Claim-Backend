const Course = require('../models/course');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index');

const createCourse = async (req, res) => {
    const course = await Course.create(req.body);
    res.status(StatusCodes.CREATED).json({ message: 'Course added', payload: course })
};

const getCourses = async(req, res) => {
    const courses = await Course.find({})
    res.status(StatusCodes.OK).json({ nbHits: courses.length, courses })
};

const findById = async(req, res) => {
    const courseId = req.query.id;
    const course = await Course.findById(courseId);
    if (!course) {
        throw new BadRequestError(`Course not found!`);
    }
    res.status(StatusCodes.OK).json({ course });
};

const findByCode = async(req, res) => {
    const courseCode = req.query.code;
    const course = await Course.findOne({ code: courseCode });
    if (!course) {
        throw new BadRequestError(`Course not found for code : ${courseFaculty}`);
    }
    res.status(StatusCodes.OK).json({ course });
};

const findByFaculty = async(req, res) => {
    const courseFaculty = req.query.faculty;
    const course = await Course.find({faculty: courseFaculty});
    if (!course) {
        throw new BadRequestError(`Course not found for faculty : ${courseFaculty}`);
    }
    res.status(StatusCodes.OK).json({ nbHits: course.length, course });
};

const findByDepartment = async(req, res) => {
    const courseDepartment = req.query.department;
    let course = [];
    if (courseDepartment === 'All') {
        course = await Course.find({});
    } else {
        course = await Course.find({department: courseDepartment});
    }
    if (!course) {
        throw new BadRequestError(`Course not found for department : ${courseDepartment}`);
    }
    res.status(StatusCodes.OK).json({ nbHits: course.length, course });
};

const deleteCourse = async(req, res) => {
    const courseId = req.query.id;
    const updatedCourse = await Course.findByIdAndRemove({ _id: courseId});

    if (!updatedCourse) {
        throw new NotFoundError(`Course with id ${courseId} not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'Course deleted'})
};

const updateCourse = async(req, res) => {
    const course = req.body;
    const courseId = req.query.id;
    if (course.code === '' || course.name === '' || course.credits === '' || course.faculty === '' || course.department === '') {
        throw new BadRequestError('Some required fields are not provided with data.')
    }

    const updatedCourse = await Course.findByIdAndUpdate({ _id: courseId}, req.body);

    if (!updatedCourse) {
        throw new NotFoundError(`Course with id ${courseId} not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'Course updated', payload: updatedCourse})
};

module.exports = { createCourse, getCourses, updateCourse, findByDepartment, findByFaculty, findByCode, findById, deleteCourse }