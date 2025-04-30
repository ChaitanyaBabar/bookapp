/**
 * Copyright (c) 2025 Chaitanya Babar (cbabar)
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

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
