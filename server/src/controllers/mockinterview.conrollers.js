const MockInterviewModel = require("../models/mockinterview.model");
const UserModel = require("../models/user.model");
const { generateQuestionsFromAI } = require("../../services/ai.service.js");

const createMockInterview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobRole, experienceLevel, targetCompany, skills } = req.body;

    const newMockInterview = new MockInterviewModel({
      user: userId,
      jobRole,
      experienceLevel,
      targetCompany,
      skills,
    });

    const savedMockInterview = await newMockInterview.save();

    const generatedContent = await generateQuestionsFromAI(savedMockInterview);

    if (!generatedContent || !generatedContent.technicalQuestions || generatedContent.technicalQuestions.length === 0) {
      throw new Error("AI service failed to generate questions. Please check the backend server logs for Gemini API errors or try again after sometime");
    }
   
    const updatedInterview = await MockInterviewModel.findByIdAndUpdate(
      savedMockInterview._id,
      { $set: generatedContent },
      { new: true } 
    );

    await UserModel.findByIdAndUpdate(userId, {
      $push: { interviewList: updatedInterview._id },
    });
    res.status(201).json(updatedInterview);
  } catch (error) {
    res.status(500).json({ message: error.message || "Error creating mock interview" });
  }
};

const deleteMockInterview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;//this id is the interview id which we need to delete
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