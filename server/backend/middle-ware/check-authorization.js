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
