import express from "express";
let router = express.Router();

// @route Get api/post
// @desc  Test route
// @access Public
router.get("/", (req, res) => res.send("post route"));

export default router;
