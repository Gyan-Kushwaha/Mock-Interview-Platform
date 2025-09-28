const express = require("express");
const {
  registerUser,
  loginUser,
  editUser,
  logOutUser,
  getUser,
} = require("../controllers/user.controllers");
const { asyncHandler } = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Public routes
router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/logout", asyncHandler(logOutUser)); // Technically doesn't need auth, but is user-specific

// Protected routes
router.get("/get-user", authMiddleware, asyncHandler(getUser));
router.put("/edit-user", authMiddleware, asyncHandler(editUser));

module.exports = router;