import express from "express";
let router = express.Router();
import pkg from "express-validator";
const { check, validationResult } = pkg;

import checkObjectId from "../../middleware/checkObjectId.js";
import auth from "../../middleware/auth.js";
import Post from "../../models/Posts.js";
import User from "../../models/User.js";

// @route POST api/post
// @desc  Create a post
// @access Private
router.post("/", auth, check("text", "Comment Text is required").not().isEmpty(), async (req, res) => {
  //Check validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Get logged in user profile
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
    res.status(500).send("Server Error");
  }
});

// @route GET api/post
// @desc  Get all posts
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    //Get all Posts
    const posts = await Post.find().sort({ date: -1 });
    //Return all Posts
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/post/:id
// @desc  Get post by Id
// @access Private
router.get("/:id", auth, checkObjectId("id"), async (req, res) => {
  try {
    //Get Post
    const post = await Post.findById(req.params.id);
    //Check if Post Exists
    if (!post) {
      return res.status(400).json({ msg: "Post not found" });
    }
    //Return Post
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route DELETE api/post/:id
// @desc  Delete post by Id
// @access Private
router.delete("/:id", auth, checkObjectId("id"), async (req, res) => {
  try {
    //Get Post
    const post = await Post.findById(req.params.id);
    //Check if Post Exists
    if (!post) {
      return res.status(400).json({ msg: "Post not found" });
    }

    //Check if user owns Post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();
    //Return Post
    res.json({ msg: "Post Removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/post/like/:id
// @desc    Like a post
// @access  Private
router.put("/like/:id", auth, checkObjectId("id"), async (req, res) => {
  try {
    //Get Post
    const post = await Post.findById(req.params.id);
    //Check if Post Exists
    if (!post) {
      return res.status(400).json({ msg: "Post not found" });
    }

    //Check if Post has been liked by user
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    //Add user to likes array
    post.likes.unshift({ user: req.user.id });
    await post.save();
    //Return Post
    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/post/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put("/unlike/:id", auth, checkObjectId("id"), async (req, res) => {
  try {
    //Get Post
    const post = await Post.findById(req.params.id);
    //Check if Post Exists
    if (!post) {
      return res.status(400).json({ msg: "Post not found" });
    }

    //Check if Post has been liked by user
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Post has not been liked" });
    }
    //Remove the like
    post.likes = post.likes.filter(({ user }) => user.toString() !== req.user.id);
    await post.save();
    //Return Post
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/posts/comment/:id
// @desc  Comment on a post
// @access Private
router.post(
  "/comment/:id",
  auth,
  checkObjectId("id"),
  check("text", "Comment Text is required").not().isEmpty(),
  async (req, res) => {
    //Check validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Get logged in user profile
      const user = await User.findById(req.user.id).select("-password");
      // Get Post by Id
      const post = await Post.findById(req.params.id);
      //Check if Post Exists
      if (!post) {
        return res.status(400).json({ msg: "Post not found" });
      }

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      // Add comment to Post
      post.comments.unshift(newComment);
      await post.save();
      return res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc  Delete a comment on a post
// @access Private
router.delete("/comment/:id/:comment_id", auth, checkObjectId("id"), async (req, res) => {
  //Check validation
  try {
    // Get Post by Id
    const post = await Post.findById(req.params.id);
    //Check if Post Exists
    if (!post) {
      return res.status(400).json({ msg: "Post not found" });
    }

    // Get Comment by Id
    const comment = post.comments.find((comment) => comment.id === req.params.comment_id);
    // Check if comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    //Check if user owns Comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    //Remove Comment
    post.comments = post.comments.filter(({ id }) => id !== req.params.comment_id);
    await post.save();
    //Return Post
    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
