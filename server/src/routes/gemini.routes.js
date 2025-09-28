const express = require("express");
// This line is now corrected to import from 'gemini.controllers.js' (plural)
const { GenerateInterviewQuestions, GenerateReview } = require("../controllers/gemini.controllers"); 
const authMiddleware = require("../middlewares/auth.middleware");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

// All these routes are protected
router.use(authMiddleware);

router.post("/generate-questions", asyncHandler(GenerateInterviewQuestions));

router.post("/generate-review", asyncHandler(GenerateReview));

module.exports = router;