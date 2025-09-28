const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  createMockInterview,
  getMockInterviews,
  getMockInterviewById,
  editMockInterview,
  deleteMockInterview,
} = require("../controllers/mockinterview.conrollers");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/create",
  asyncHandler(authMiddleware),
  asyncHandler(createMockInterview)
);

router.get("/", asyncHandler(authMiddleware), asyncHandler(getMockInterviews));

router.get(
  "/:id",
  asyncHandler(authMiddleware),
  asyncHandler(getMockInterviewById)
);

router.put(
  "/edit/:id",
  asyncHandler(authMiddleware),
  asyncHandler(editMockInterview)
);

router.delete(
  "/delete/:id",
  asyncHandler(authMiddleware),
  asyncHandler(deleteMockInterview)
);

module.exports = router;
