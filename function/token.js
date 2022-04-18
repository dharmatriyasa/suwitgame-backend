const crypto = require("crypto");

module.exports.generateToken = () => {
  const access_token = crypto.randomBytes(20).toString("hex");
  return access_token;
};
