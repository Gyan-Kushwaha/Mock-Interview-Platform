const axios = require("axios");
require("dotenv").config();
const MockInterviewModel = require("../models/mockinterview.model");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Your controller file (e.g., mockinterview.controller.js)

const GEMINI_API_URL ="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";


function parseJsonResponse(responseText) {
  try {
    const jsonString = responseText.match(/```json\n([\s\S]*?)\n```/)[1];
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON from Gemini response:", error);
    return null;
  }
}

const generateQuestionsForCategory = async (category, interviewDetails) => {
  const { jobRole, experienceLevel, targetCompany, skills } = interviewDetails;

  const prompt = `
Generate a JSON object containing 10 interview questions for the following category: ${category}.
The questions should be tailored for a candidate with the following profile:
- Job Role: ${jobRole}
- Experience Level: ${experienceLevel}
- Target Company: ${targetCompany || 'a leading tech company'}
- Key Skills: ${skills.join(", ")}

The JSON output should be an array of objects, where each object has a "question" field.
Example format:
\`\`\`json
{
  "questions": [
    { "question": "Explain the concept of..." },
    { "question": "Describe a situation where you..." }
  ]
}
\`\`\`
Return only the JSON object.
`;

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      { contents: [{ parts: [{ text: prompt }] }] },
      { params: { key: GEMINI_API_KEY } }
    );
    const responseData = response.data.candidates[0].content.parts[0].text;
    const parsedData = parseJsonResponse(responseData);
    return parsedData ? parsedData.questions.map(q => ({ ...q, answer: '', review: '' })) : [];
  } catch (error) {
    console.error(`Error generating ${category} questions:`, error.message);
    return [];
  }
};


const GenerateInterviewQuestions = async (req, res) => {
  const { interviewID } = req.body;
  const userId = req.user._id;

  if (!interviewID) {
    return res.status(400).json({ error: "Interview ID is required" });
  }

  try {
    const mockInterview = await MockInterviewModel.findOne({ _id: interviewID, user: userId });
    if (!mockInterview) {
        return res.status(404).json({ error: "Mock interview not found" });
    }

    const [dsaQuestions, techStackQuestions, coreSubjectQuestions] = await Promise.all([
      generateQuestionsForCategory("Data Structures and Algorithms", mockInterview),
      generateQuestionsForCategory("Technical Stack", mockInterview),
      generateQuestionsForCategory("Core Computer Science Subjects", mockInterview),
    ]);

    mockInterview.dsaQuestions = dsaQuestions;
    mockInterview.technicalQuestions = techStackQuestions;
    mockInterview.coreSubjectQuestions = coreSubjectQuestions;

    await mockInterview.save();

    return res.status(200).json(mockInterview);
  } catch (error) {
    console.error("Error generating interview questions:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const GenerateReview = async (req, res) => {
  const { interviewDetails } = req.body;

  if (!interviewDetails) {
    return res.status(400).json({ message: "Invalid request format, missing interviewDetails" });
  }

  const reviewPrompt = `
You are an expert technical interviewer. Please analyze the following interview data and provide a detailed review for each answer, an overall review, and an overall rating from 1 to 5.
The interview data is provided as a JSON object.

Your response should be a JSON object with the exact same structure as the input, but with the 'review' fields populated for each question, and the 'overallReview' and 'overallRating' fields populated at the top level.

Interview Data:
\`\`\`json
${JSON.stringify(interviewDetails, null, 2)}
\`\`\`

Return only the updated JSON object.
`;

  try {
    const response = await axios.post(
        GEMINI_API_URL,
        { contents: [{ parts: [{ text: reviewPrompt }] }] },
        { params: { key: GEMINI_API_KEY } }
    );

    const responseData = response.data.candidates[0].content.parts[0].text;
    const generatedResponse = parseJsonResponse(responseData);

    if (!generatedResponse) {
        return res.status(500).json({ error: "Failed to parse review from AI service" });
    }

    const updatedInterview = await MockInterviewModel.findByIdAndUpdate(
        interviewDetails._id,
        {
            dsaQuestions: generatedResponse.dsaQuestions,
            technicalQuestions: generatedResponse.technicalQuestions,
            coreSubjectQuestions: generatedResponse.coreSubjectQuestions,
            overallRating: generatedResponse.overallRating,
            overallReview: generatedResponse.overallReview,
        },
        { new: true }
    );
    
    if (!updatedInterview) {
        return res.status(404).json({ error: "Interview not found" });
    }

    return res.status(200).json(updatedInterview);
  } catch (error) {
    console.error("Error generating review:", error.response?.data || error.message);
    return res.status(500).json({ error: "Internal server error during review generation" });
  }
};

module.exports = {
  GenerateInterviewQuestions,
  GenerateReview,
};