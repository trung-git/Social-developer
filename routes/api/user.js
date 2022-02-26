const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const config = require("config");

// @route     POST api/users
// @desc      Resgister user
// @access    Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or mor characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { name, email, password } = req.body;
    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [{ msg: "User already exists" }],
        });
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      // Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
      // Return JWT

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
module.exports = router;
