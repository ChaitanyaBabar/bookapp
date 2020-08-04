const jwt = require('jsonwebtoken');
const jwtsecret = 'secret';

module.exports = (req, res, next) => {
    try {
        const jwtToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(jwtToken, jwtsecret);
        req.decodedToken = decoded;
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: err.message,
            error: err
        });
    }
};
