const express = require('express');
const router = express.Router();
const calculateClaimCost = require('../middleware/calculateClaimCost');
const { authorizeOfficialsClaimAccess } = require('../middleware/authorization');

const { 
    findById, 
    findByDepartment, 
    findByFaculty, 
    updateClaims,
    remove, 
    createClaim, 
    findByCourse, 
    findByRegistrationNumber,
    findByAccountantSignature,
    findByDeanOfStudentSignature,
    findByDepartmentSignature,
    findByLecturerSignature,
    findByPaid,
    findByRegistrationOfficerSignature,
    findByStudentSignature, 
    getClaims, 
    attachFile,
    upload 
} = require('../controllers/claim');

router.post('/add', upload.single('proofOfTuitionPayment'), attachFile, calculateClaimCost, createClaim);
router.get('/list', authorizeOfficialsClaimAccess, getClaims);
router.get('/findById', findById);
router.get('/findByRegistrationNumber', findByRegistrationNumber);
router.get('/findByCourse', authorizeOfficialsClaimAccess, findByCourse);
router.get('/findByAccountantSignature', authorizeOfficialsClaimAccess, findByAccountantSignature);
router.get('/findByDeanOfStudentSignature', authorizeOfficialsClaimAccess, findByDeanOfStudentSignature);
router.get('/findByDepartmentSignature', authorizeOfficialsClaimAccess, findByDepartmentSignature);
router.get('/findByLecturerSignature', authorizeOfficialsClaimAccess, findByLecturerSignature);
router.get('/findByPaid', authorizeOfficialsClaimAccess, findByPaid);
router.get('/findByRegistrationOfficerSignature', authorizeOfficialsClaimAccess, findByRegistrationOfficerSignature);
router.get('/findByStudentSignature', authorizeOfficialsClaimAccess, findByStudentSignature);
router.get('/findByFaculty', authorizeOfficialsClaimAccess, findByFaculty);
router.get('/findByDepartment', authorizeOfficialsClaimAccess, findByDepartment);
router.put('/update', updateClaims);
router.put('/updateWithAttachment', upload.single('attachment'), attachFile, updateClaims);
router.put('/updateWithExamPermit', upload.single('examPermit'), attachFile, updateClaims);
router.put('/updateWithProofOfClaimPayment', upload.single('proofOfClaimPayment'), attachFile, updateClaims);
router.put('/updateWithOtherAttachments', upload.single('otherAttachments'), attachFile, updateClaims);
router.put('/updateWithAbsenceJustification', upload.single('absenceJustification'), attachFile, updateClaims);
router.delete('/delete', remove);


module.exports = router;