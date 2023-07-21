const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const sendEmail = require('../utils/email/sendEmail');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const testing = async (req, res) => {
    const users = await User.find({});
    res.status(StatusCodes.OK).json({ nbHits: users.length, users })
};

const signIn = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            userName: user.userName,
            phone: user.phone,
            role: user.role,
            registrationNumber: user.registrationNumber,
            courses: user.courses,
            faculty: user.faculty, 
            department: user.department,
            token: token,
        }
    })
};

const signInAsStudent = async (req, res) => {
    const { registrationNumber, password } = req.body;
    
    if (!registrationNumber || !password) {
        throw new BadRequestError('Please provide registration number and password');
    }

    const user = await User.findOne({ registrationNumber });
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            userName: user.userName,
            phone: user.phone,
            role: user.role,
            registrationNumber: user.registrationNumber,
            courses: user.courses,
            faculty: user.faculty, 
            department: user.department,
            token: token,
        }
    })
};

const signUp = async (req, res) => {
    // Checking if the user is not already registered
    const userWithEmailExists = await User.findOne({ email: req.body.email })
    if (userWithEmailExists) {
        return res.status(StatusCodes.BAD_REQUEST).send({ msg: `User with the provided email already exists.` });
    }

    if (req.body.userName) {
        const userWithUserNameExists = await User.findOne({ userName: req.body.userName })
        if (userWithUserNameExists) {
            return res.status(StatusCodes.BAD_REQUEST).send({ msg: `User with the provided user name already exists.` });
        }
    }

    // Validate password
    const schema = Joi.object({
        password: passwordComplexity().required().label('Password'),
    })
    const {error} = schema.validate({password: req.body.password});
    if (error) { return res.status(StatusCodes.BAD_REQUEST).send({ msg: error.details[0].message }) }
    
    // Registering the user
    const user = await User.create({...req.body});
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
        message: 'Account created',
        user: {
            id: user._id,
            email: user.email,
            phone: user.phone,
            fullName: user.fullName,
            userName: user.userName,
            role: user.role,
            registrationNumber: user.registrationNumber,
            courses: user.courses,
            faculty: user.faculty, 
            department: user.department,
            token: token,
        }
    })

};

const getUsers = async(req, res, next) => {
    const users = await User.find({})
    res.status(StatusCodes.OK).json({ nbHits: users.length, users })
};

const findById = async(req, res, next) => {
    const userId = req.query.id;
    const user = await User.findById(userId)

    if (!user || user === null ) {
        throw new NotFoundError(`No user with ID: ${userId} found!`);
    }

    res.status(200).json({ user });
};

const findByRole = async(req, res, next) => {
    const userRole = req.query.role;
    const users = await User.find({ role: userRole })
    
    if (!users || users.length === 0 ) {
        throw new NotFoundError(`No user with role: ${regNo}`);
    }
    
    res.status(200).json({ users });
};

const findByRegistrationNumber = async(req, res, next) => {
    const regNo = req.query.registrationNumber;
    const user = await User.findOne({ registrationNumber: regNo })
    
    if (!user || user.length === 0 ) {
        throw new NotFoundError(`No user with registration number: ${regNo}`);
    }
    
    res.status(200).json({ user });
};

const updateUser = async(req, res, next) => {
    const user = await User.findByIdAndUpdate({ _id: req.query.id }, req.body);
	const updatedUser = await User.findById(user._id);
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
        message: "Account successfully updated!",
        user: {
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            userName: user.userName,
            role: updatedUser.role,
            registrationNumber: updatedUser.role,
            courses: updatedUser.courses,
            faculty: updatedUser.faculty, 
            department: updatedUser.department,
            token: token,
        }
    })
};

const requestPasswordReset = async(req, res, next) => {
    const { role, email } = req.body;
    if (!email) {throw new BadRequestError('Your email is required')} 
    
    const registeredUser = await User.findOne({ email: email });
    if (!registeredUser) { throw new BadRequestError('Email address unrecognized');}
  
    let token = jwt.sign({ role: role, email: email }, process.env.JWT_SECRET, { expiresIn: 1800 }); 
    
    let clientDomain = '192.168.43.16';

    let link = '';
    if (role === 'Student'){
        link = `http://${clientDomain || localhost}:3333/student/s/auth/reset-password/${token}/${registeredUser._id}`; 
    } else if (role === 'Lecturer') {
        link = `http://${clientDomain || localhost}:3333/lecturer/l/auth/reset-password/${token}/${registeredUser._id}`;
    } else if (role === 'Hod/Dean') {
        link = `http://${clientDomain || localhost}:3333/hod/h/auth/reset-password/${token}/${registeredUser._id}`;
    } else if (role === 'Director of student discipline') {
        link = `http://${clientDomain || localhost}:3333/dsd/d/auth/reset-password/${token}/${registeredUser._id}`;
    } else if (role === 'Accountant') {
        link = `http://${clientDomain || localhost}:3333/accountant/a/auth/reset-password/${token}/${registeredUser._id}`;
    } else if (role === 'Examination officer') {
        link = `http://${clientDomain || localhost}:3333/exo/e/auth/reset-password/${token}/${registeredUser._id}`;
    } else if (role === 'Registration officer') {
        link = `http://${clientDomain || localhost}:3333/reg/r/auth/reset-password/${token}/${registeredUser._id}`;
    } 

    await sendEmail(
        registeredUser.email,
        "Reset password",
        {
          payload: link,
          name: registeredUser.fullName
        },
        "./template/requestResetPassword.handlebars"
    );

    res.status(StatusCodes.OK).json({ message: `Password reset link sent to your email: ${registeredUser.email}`})   
}

const resetPassword = async(req, res, next) => {
    const password = req.body.password;
    
    const user = await User.findById(req.query.id);
    if (!user) { throw new BadRequestError('Invalid or expired link')}
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) { throw new UnauthenticatedError('Invalid authentication') }
    
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) { throw new UnauthenticatedError('Invalid or expired link')}

    // Validating the password using Joi and Join Password Complexity
    const schema = Joi.object({
        password: passwordComplexity().required().label('Password'),
    })
    const {error} = schema.validate(req.body);
    if (error) { return res.status(StatusCodes.BAD_REQUEST).send({ msg: error.details[0].message }) }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findOneAndUpdate( req.query.id, { password: hashedPassword });    

    if (!updatedUser) {
        throw new UnauthenticatedError('Unable to change password');
    } else {
        res.status(StatusCodes.OK).json({ message: "Password changed" })
    }
}

module.exports = { testing, signIn, signInAsStudent, signUp, requestPasswordReset, findByRole, resetPassword, getUsers, findById, findByRegistrationNumber, updateUser }
