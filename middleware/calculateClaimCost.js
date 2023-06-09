const Claim = require('../models/claim');

const calculateClaimCost = (req, res, next) => {
    const { registrationNumber, faculty, courses, ...otherData } = req.body;
    let totalClaimCost = 0;
    let creditCost = 0;

    if (faculty === 'IT') {
        creditCost = 16829;
    } else if (faculty === 'Business administration') {
        creditCost = 15582;
    } else if (faculty === 'Theology') {
        creditCost = 13712;
    } else if (faculty === 'Education') {
        creditCost = 13712;
    }

    courses.forEach(element => {
        totalClaimCost = totalClaimCost + (element.credits * creditCost)/4;
    });

    req.body.totalClaimCost = totalClaimCost;
    next();
}

module.exports = calculateClaimCost;
