import express from "express";
let router = express.Router();

// @route Get api/Auth
// @desc  Test route
// @access Public
router.get("/", (req, res) => res.send("Auth route"));

export default router;
