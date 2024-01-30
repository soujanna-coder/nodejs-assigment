const jwt = require("jsonwebtoken");
const util = require("util");
const asyncHandle = require("./asyncHandle");
const jwtSignature = async (_id) => {
  return jwt.sign(
    {
      _id: _id,
    },
    process.env.JWT_SECRETE,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};
const veryJsonData = async (token) => {
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRETE
  );
  return decodedToken;
};
module.exports = { jwtSignature, veryJsonData };
