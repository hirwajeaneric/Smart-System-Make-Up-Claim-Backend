const calculateClaimCost = async (req, res, next) => {
    const { faculty, courses } = req.body;

    var creditCost = 0;

    if (faculty === 'Information Technology') {
        creditCost = Number(process.env.IT_CLAIM_COST);
    } else if (faculty === 'Business Administration') {
        creditCost = Number(process.env.BA_CLAIM_COST);
    } else if (faculty === 'Theology') {
        creditCost = Number(process.env.THEOLOGY_CLAIM_COST);
    } else if (faculty === 'Education') {
        creditCost = Number(process.env.EDUCATION_CLAIM_COST);
    }

    var totalClaimCost = (Number(req.body.courses[0].credits) * creditCost)/4;

    req.body.totalClaimCost = totalClaimCost;
    next();
}

module.exports = calculateClaimCost;
