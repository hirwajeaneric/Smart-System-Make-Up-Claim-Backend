const calculateClaimCost = async (req, res, next) => {
    const { faculty, courses } = req.body;

    var creditCost = 0;

    if (faculty === 'Information Technology') {
        creditCost = 16829;
    } else if (faculty === 'Business Administration') {
        creditCost = 15582;
    } else if (faculty === 'Theology') {
        creditCost = 13712;
    } else if (faculty === 'Education') {
        creditCost = 13712;
    }

    var totalClaimCost = (Number(req.body.courses[0].credits) * creditCost)/4;

    console.log('Calculated cost');
    req.body.totalClaimCost = totalClaimCost;

    console.log(req.body.totalClaimCost);

    next();
}

module.exports = calculateClaimCost;
