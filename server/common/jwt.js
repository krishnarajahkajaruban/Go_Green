const jwt = require('jsonwebtoken');

const generateToken = (user, secret, expiresIn = '1d') => {
  const payload = {
    id: user._id,
    email: user.email,
    name: user.name,
    school: user.school,
    grade: user.grade,
    role: user.role
  };

  return jwt.sign(payload, secret, { expiresIn });
};

const decodeToken = (token, secret) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          reject({ status: 401, message: "Invalid JWT token" });
        } else {
          resolve(decoded);
        }
      });
    });
  };

module.exports = {
    generateToken,
    decodeToken
};
