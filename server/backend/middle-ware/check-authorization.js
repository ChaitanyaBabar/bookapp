/**
 * Copyright (c) 2025 Chaitanya Babar (cbabar)
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */



/**
 * Copyright (c) 2025 Chaitanya Babar
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

module.exports = (req, res, next) => {
  let NUM_PATH_COMPONENTS  = req.originalUrl.split("/").length - 1;
  const acl = require('../authorization').getAcl();
  return acl.customMiddleWare(NUM_PATH_COMPONENTS, getUserId)(req, res, next);
}

function getUserId(req) {
  if (req.decodedToken) {
    return req.decodedToken.id;
  }
}
