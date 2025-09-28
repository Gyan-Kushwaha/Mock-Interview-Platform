const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const mockInterviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
    },
    overallReview: {
      type: String,
    },
    overallRating: {
      type: Number,
    },
    experienceLevel: {
      type: String,
      enum: ["Fresher", "Junior", "Mid-Level", "Senior"],
      required: true,
    },
    targetCompany: {
      type: String,
    },
    skills: {
      type: [String],
    },
    dsaQuestions: [
      {
        question: String,
        answer: String,
        review: String,
      },
    ],
    technicalQuestions: [
      {
        question: String,
        answer: String,
        review: String,
      },
    ],
    coreSubjectQuestions: [
      {
        question: String,
        answer: String,
        review: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MockInterviewModel = model("MockInterview", mockInterviewSchema);
module.exports = MockInterviewModel;