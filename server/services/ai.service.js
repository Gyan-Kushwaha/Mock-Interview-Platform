const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuestionsFromAI = async (interviewDetails) => {
  const { jobRole, experienceLevel, skills } = interviewDetails;

const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

  const prompt = `
    Based on the following interview details, generate a set of interview questions.
    Job Role: ${jobRole}
    Experience Level: ${experienceLevel}
    Required Skills: ${skills.join(", ")}

    Please generate 3 Data Structures and Algorithms (DSA) questions, 5 technical questions specific to the job role and skills, and 2 core subject questions.

    IMPORTANT: Your response MUST be a valid JSON object. Do not include any text, explanation, or markdown formatting before or after the JSON object. 
    The JSON object must have three keys: "dsaQuestions", "technicalQuestions", and "coreSubjectQuestions".
    Each key should contain an array of objects, where each object has a single key "question" with the question text as its value.

    Here is the exact format you must follow:
    {
      "dsaQuestions": [
        { "question": "Your generated DSA question here." },
        { "question": "Your generated DSA question here." },
        { "question": "Your generated DSA question here." }
      ],
      "technicalQuestions": [
        { "question": "Your generated technical question here." },
        { "question": "Your generated technical question here." },
        { "question": "Your generated technical question here." },
        { "question": "Your generated technical question here." },
        { "question": "Your generated technical question here." }
      ],
      "coreSubjectQuestions": [
        { "question": "Your generated core subject question here." },
        { "question": "Your generated core subject question here." }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace('```json', '').replace('```', '').trim();
    
    const generatedQuestions = JSON.parse(cleanedText);

    // Adding empty answer and review fields to store candidate response for evaluation phase
    const formatQuestions = (questions) => questions.map(q => ({ ...q, answer: "", review: "" }));

    return {
      dsaQuestions: formatQuestions(generatedQuestions.dsaQuestions),
      technicalQuestions: formatQuestions(generatedQuestions.technicalQuestions),
      coreSubjectQuestions: formatQuestions(generatedQuestions.coreSubjectQuestions),
      overallReview: "",
      overallRating: 0,
    };

  } catch (error) {
    console.error("Error generating questions from AI:", error);
    return {
      dsaQuestions: [],
      technicalQuestions: [],
      coreSubjectQuestions: [],
      overallReview: "Error: Could not generate questions.",
      overallRating: 0,
    };
  }
};

module.exports = { generateQuestionsFromAI };