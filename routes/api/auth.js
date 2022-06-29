const express = require('express');
const { auth } = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');
const router = express.Router();
// @route     GET api/auth
// @desc      Test route
// @access    Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route     POST api/auth
// @desc      Authenticate user and get token
// @access    Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res, next) => {
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
          errors: [{ msg: 'Incorrect email or password' }],
        });
      }

      const isMath = await bcrypt.compare(password, user.password);
      if (!isMath) {
        return res.status(400).json({
          errors: [{ msg: 'Incorrect email or password' }],
        });
      }

      const payload = {
        user: { id: user.id },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) next(err);
          const cookieOptions = {
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
          };
          if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
            cookieOptions.secure = true;
          }
          res.cookie('jwt', token, cookieOptions);
          user.password = undefined;
          res.json({ user });
        }
      );
    } catch (err) {
      console.error(err.message);
      // res.status(500).send('Server error');
      next(err);
    }
  }
);
// @route     GET api/auth/logout
// @desc      Logout route
// @access    Public
router.get('/logout', auth, async (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.redirect('/');
});
// @route     PATCH api/auth/update-password
// @desc      Update password
// @access    Private
router.patch('/update-password', auth, async (req, res, next) => {
  try {
    //Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    const isMatched = await bcrypt.compare(req.body.password, user.password);
    //check if POSTed current password is correct
    if (!isMatched) {
      return res.status(400).json({
        errors: [{ msg: 'Incorrect password' }],
      });
    }
    // Encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(req.body.newPassword, salt);
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    // return res.status(500).send('Server error');
    next(err);
  }
});
module.exports = router;
