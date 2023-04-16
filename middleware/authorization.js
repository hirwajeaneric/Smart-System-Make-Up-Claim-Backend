const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authorizeCourseModification = async(req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Invalid authentication');
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload.role === 'Hod/Dean' || !payload.role === 'Registration officer' || !payload.role === 'Lecturer' || !payload.role === 'Examination officer') {
      throw new UnauthenticatedError('Access denied');
    } else {
      next();
    }
  } catch (error) {
    throw new UnauthenticatedError('Access denied')
  }
};

const authorizeOfficialsClaimAccess = async(req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Invalid authentication');
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role === 'Student') {
      throw new UnauthenticatedError('Access denied');
    } else {
      next();
    }
  } catch (error) {
    throw new UnauthenticatedError('Access denied')
  }
};

module.exports = {authorizeCourseModification, authorizeOfficialsClaimAccess };