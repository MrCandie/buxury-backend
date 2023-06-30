const jwt = require("jsonwebtoken");

// CREATE JWT TOKEN
const createJWTToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// CREATE AND SEND JWT TOKEN
const createSendToken = (user, statusCode, res) => {
  const token = createJWTToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  user.pin = undefined;
  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

module.exports = createSendToken;
