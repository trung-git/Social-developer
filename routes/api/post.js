const express = require("express");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Post = require("../../models/Post");
const router = express.Router();

// @route     POST api/posts
// @desc      Create a post
// @access    Prive
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route     GET api/posts
// @desc      Get all posts
// @access    Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route     GET api/posts/:id
// @desc      Get post by id
// @access    Private

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route     DELETE api/posts/:id
// @desc      Delete a post
// @access    Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: "Post not found" });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();
    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});
// Thieu update post

// @route     PUT api/posts/like/:id
// @desc      Like a post
// @access    Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: "Post not found" });
    }

    // Check if the post has already been liked
    const isLiked = post.likes.filter((like) => {
      return like.user.toString() === req.user.id;
    });
    if (isLiked.length > 0) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route     PUT api/posts/unlike/:id
// @desc      Unlike a post
// @access    Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: "Post not found" });
    }

    // Check if the post has already been liked
    const isLiked = post.likes.filter((like) => {
      return like.user.toString() === req.user.id;
    });
    if (isLiked.length === 0) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }
    // Get remove index
    const likeIndex = post.likes.map((item) => {
      return item.user.toString();
    });
    let removeIndex = null;
    likeIndex.forEach((i) => {
      if (i === req.user.id) {
        removeIndex = likeIndex.indexOf(req.user.id);
      }
    });

    if (removeIndex !== null) post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route     POST api/posts/comment/:id
// @desc      Comment a post
// @access    Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");

      const post = await Post.findById(req.params.id);

      const newCmt = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newCmt);

      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
// @route     DELETE api/posts/comment/:id/:cmt_id
// @desc      Delete a comment
// @access    Private
router.delete("/comment/:id/:cmt_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Pull out comment
    const comment = post.comments.find((cmt) => {
      return cmt.id === req.params.cmt_id;
    });
    // Make sure comment exist
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    // Get remove index
    const cmtIndex = post.comments.map((item) => {
      return item.user.toString();
    });
    let removeIndex = null;
    cmtIndex.forEach((i) => {
      if (i === req.user.id) {
        removeIndex = cmtIndex.indexOf(req.user.id);
      }
    });

    if (removeIndex !== null) post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Thieu update cmt
module.exports = router;
