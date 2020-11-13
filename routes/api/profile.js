import express from "express";
let router = express.Router();

// @route Get api/profile
// @desc  Test route
// @access Public
router.get("/", (req, res) => res.send("profile route"));

export default router;
