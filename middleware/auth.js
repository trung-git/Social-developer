const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");

module.exports.auth = async function (req, res, next) {
  // Get token from the header
  // const token = req.header("x-auth-token");
  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
module.exports.getUserFromToken = async function (req, res, next) {
  // Get token from the header
  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // Check if no token
  if (!token) {
    return next();
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    const currentUser = await User.findById(decoded.user.id);
    currentUser.password = undefined;
    req.user = decoded.user;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    next();
  }
};
module.exports.navigateUserAfterLogin = async function (req, res, next) {
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
};
module.exports.navigateUserBeforLogin = async function (req, res, next) {
  if (req.user) {
    return res.redirect("/home");
  }
  next();
};
