import express from "express";
let router = express.Router();

// @route Get api/users
// @desc  Test route
// @access Public
router.get("/", (req, res) => res.send("User route"));

export default router;
