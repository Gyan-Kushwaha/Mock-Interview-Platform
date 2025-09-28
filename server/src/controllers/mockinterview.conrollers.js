const MockInterviewModel = require("../models/mockinterview.model");
const UserModel = require("../models/user.model");
const { generateQuestionsFromAI } = require("../../services/ai.service.js");

const createMockInterview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobRole, experienceLevel, targetCompany, skills } = req.body;

    // Step 1: Create the initial interview document
    const newMockInterview = new MockInterviewModel({
      user: userId,
      jobRole,
      experienceLevel,
      targetCompany,
      skills,
    });

    const savedMockInterview = await newMockInterview.save();

    // Step 2: Generate questions using the real Gemini AI service
    const generatedContent = await generateQuestionsFromAI(savedMockInterview);

    // --- NEW: Check if the AI generation failed ---
    // If the AI service returns an empty object or has no technical questions, we know it failed.
    if (!generatedContent || !generatedContent.technicalQuestions || generatedContent.technicalQuestions.length === 0) {
      // Throw a new error that will be caught by the main catch block.
      throw new Error("AI service failed to generate questions. Please check the backend server logs for Gemini API errors (e.g., billing issues, invalid API key).");
    }
    // ---------------------------------------------

    // Step 3: Update the interview with the generated questions and review fields
    const updatedInterview = await MockInterviewModel.findByIdAndUpdate(
      savedMockInterview._id,
      { $set: generatedContent },
      { new: true } // This option returns the updated document
    );

    // Step 4: Add the interview ID to the user's list
    await UserModel.findByIdAndUpdate(userId, {
      $push: { interviewList: updatedInterview._id },
    });

    // Step 5: Send the complete interview object (with questions) back to the client
    res.status(201).json(updatedInterview);
  } catch (error) {
    // The error we threw above will now be caught here and sent to the frontend.
    res.status(500).json({ message: error.message || "Error creating mock interview" });
  }
};


// --- Other functions (delete, edit, get) remain the same ---

const deleteMockInterview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const mockInterview = await MockInterviewModel.findOneAndDelete({ _id: id, user: userId });
    if (!mockInterview) {
      return res.status(404).json({ message: "Mock interview not found or user not authorized to delete" });
    }
    await UserModel.findByIdAndUpdate(userId, { $pull: { interviewList: mockInterview._id } });
    res.status(200).json({ message: "Mock interview deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error deleting mock interview" });
  }
};

const editMockInterview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const updates = req.body;
    const mockInterview = await MockInterviewModel.findOneAndUpdate({ _id: id, user: userId }, updates, { new: true });
    if (!mockInterview) {
      return res.status(404).json({ message: "Mock interview not found or user not authorized to edit" });
    }
    res.status(200).json(mockInterview);
  } catch (error) {
    res.status(500).json({ message: error.message || "Error editing mock interview" });
  }
};

const getMockInterviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const mockInterviews = await MockInterviewModel.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(mockInterviews);
  } catch (error) {
    res.status(500).json({ message: error.message || "Error fetching mock interviews" });
  }
};

const getMockInterviewById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const mockInterview = await MockInterviewModel.findOne({ _id: id, user: userId });
    if (!mockInterview) {
      return res.status(404).json({ message: "Mock interview not found or user not authorized to view" });
    }
    res.status(200).json(mockInterview);
  } catch (error) {
    res.status(500).json({ message: error.message || "Error fetching interview by ID" });
  }
};

module.exports = {
  createMockInterview,
  deleteMockInterview,
  editMockInterview,
  getMockInterviews,
  getMockInterviewById,
};