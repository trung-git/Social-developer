const express = require("express");
const { auth } = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
const router = express.Router();
// @route     GET api/auth
// @desc      Test route
// @access    Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route     POST api/auth
// @desc      Authenticate user and get token
// @access    Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;
    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "Incorrect email or password" }],
        });
      }

      const isMath = await bcrypt.compare(password, user.password);
      if (!isMath) {
        return res.status(400).json({
          errors: [{ msg: "Incorrect email or password" }],
        });
      }

      const payload = {
        user: { id: user.id },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          const cookieOptions = {
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          };
          if (req.secure || req.headers["x-forwarded-proto"] === "https") {
            cookieOptions.secure = true;
          }
          res.cookie("jwt", token, cookieOptions);
          user.password = undefined;
          res.json({ user });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
// @route     GET api/auth/logout
// @desc      Test route
// @access    Public
router.get("/logout", auth, async (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.redirect("/");
});
module.exports = router;
