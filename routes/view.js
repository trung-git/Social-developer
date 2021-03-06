const express = require('express');
const axios = require('axios');

const {
  getUserFromToken,
  navigateUserAfterLogin,
  navigateUserBeforLogin,
  checkUserProfile,
} = require('../middleware/auth');
const Post = require('../models/Post');
const Profile = require('../models/Profile');
const User = require('../models/User');
const router = express.Router();

router.use(getUserFromToken);

// @route     GET /
// @desc      Render index landing page
// @access    Public
router.get('/', navigateUserBeforLogin, (req, res) => {
  res.render('index');
});

// @route     GET /login
// @desc      Render login page
// @access    Public
router.get('/login', navigateUserBeforLogin, (req, res) => {
  res.render('login');
});
// @route     GET /register
// @desc      Render register page
// @access    Public
router.get('/register', navigateUserBeforLogin, (req, res) => {
  res.render('register');
});
// @route     GET /profiles
// @desc      Render all dev page
// @access    Public
router.get('/profiles', async (req, res) => {
  const profiles = Profile.find();
  profiles.populate({ path: 'user', select: '-password' });
  const doc = await profiles;
  res.render('profiles', { profiles: doc });
});
// @route     GET /home
// @desc      Render home page
// @access    Private
router.get(
  '/home',
  navigateUserAfterLogin,
  checkUserProfile,
  async (req, res) => {
    const posts = await Post.find().sort({ date: -1 });
    res.render('posts', { posts });
  }
);
// @route     GET /post/:id
// @desc      Render a post
// @access    Private
router.get(
  '/post/:id/:index',
  navigateUserAfterLogin,
  checkUserProfile,
  async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post', { post, index: req.params.index });
  }
);
// @route     GET /update-profile
// @desc      Render create or update profile page
// @access    Private
router.get('/update-profile', navigateUserAfterLogin, async (req, res) => {
  let profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    profile = {};
  }
  res.render('update-profile', { profile });
});

// @route     GET /dashboard
// @desc      Render create or update profile page
// @access    Private
router.get(
  '/dashboard',
  navigateUserAfterLogin,
  checkUserProfile,
  async (req, res) => {
    let profile = await Profile.findOne({ user: req.user.id });
    res.render('dashboard', { profile });
  }
);
// @route     GET /add-education
// @desc      Render add education page
// @access    Private
router.get(
  '/add-education',
  navigateUserAfterLogin,
  checkUserProfile,
  async (req, res) => {
    res.render('add-education');
  }
);

// @route     GET /add-experience
// @desc      Render add experience page
// @access    Private
router.get(
  '/add-experience',
  navigateUserAfterLogin,
  checkUserProfile,
  async (req, res) => {
    res.render('add-experience');
  }
);

// @route     GET /profiles/:idUser
// @desc      Render a profile
// @access    Private
router.get(`/user/:id`, async (req, res, next) => {
  try {
    const profiles = Profile.findOne({ user: req.params.id });
    profiles.populate({ path: 'user', select: '-password' });
    const doc = await profiles;
    console.log(doc.githubusername);
    if (doc.githubusername?.trim().length > 0) {
      axios
        .get(
          `https://fodev-social.herokuapp.com/api/profiles/github/${doc.githubusername.trim()}`
        )
        .then(function (response) {
          // handle success

          return res.render('profile', { doc, github: response.data });
        })
        .catch(function (error) {
          // handle error
          return res.render('profile', { doc, github: [] });
        });
    } else {
      return res.render('profile', { doc, github: [] });
    }

    //   }
    //   if (doc.githubusername?.length > 0) {
    //     // console.log('USERRRRR');

    //     axios
    //       .get(
    //         `http://localhost:3000/api/profiles/github/${doc.githubusername.trim()}`
    //       )
    //       .then(function (response) {
    //         // handle success

    //         return res.render('profile', { doc, github: response.data });
    //       })
    //       .catch(function (error) {
    //         // handle error
    //         console.log(1);
    //         return res.render('profile', { doc, github: [] });
    //       });
    //   } else {
    //     return res.render('profile', { doc, github: [] });
    //   }
  } catch (error) {
    // console.log(error);
    // res.send('400 - Not found');
    next(error);
  }
});

module.exports = router;
