const express = require("express");
const {
  getUserFromToken,
  navigateUserAfterLogin,
  navigateUserBeforLogin,
} = require("../middleware/auth");
const Post = require("../models/Post");
const router = express.Router();

router.use(getUserFromToken);
// @route     GET /
// @desc      Render index landing page
// @access    Public
router.get("/", navigateUserBeforLogin, (req, res) => {
  res.render("index");
});

// @route     GET /login
// @desc      Render login page
// @access    Public
router.get("/login", navigateUserBeforLogin, (req, res) => {
  res.render("login");
});
// @route     GET /register
// @desc      Render register page
// @access    Public
router.get("/register", navigateUserBeforLogin, (req, res) => {
  res.render("register");
});
// @route     GET /profiles
// @desc      Render all dev page
// @access    Public
router.get("/profiles", (req, res) => {
  res.render("profiles");
});
// @route     GET /home
// @desc      Render all dev page
// @access    Private
router.get("/home", navigateUserAfterLogin, async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  res.render("posts", { posts });
});
router.get("/post/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("post", { post });
});

module.exports = router;
