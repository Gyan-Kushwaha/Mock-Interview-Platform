export const languages = [
  { id: 54, name: "C++", extension: "cpp" },
  { id: 50, name: "C", extension: "c" },
  { id: 74, name: "TypeScript", extension: "ts" },
  { id: 63, name: "JavaScript", extension: "js" },
  { id: 62, name: "Java", extension: "java" },
  { id: 71, name: "Python", extension: "py" },
  { id: 60, name: "Go", extension: "go" },
  { id: 51, name: "C#", extension: "cs" },
];

export const getLanguageId = (name) => {
  const language = languages.find((lang) => lang.name === name);
  return language ? language.id : 63; // Default to JavaScript
};

export const getFileExtension = (name) => {
  const language = languages.find((lang) => lang.name === name);
  return language ? language.extension : "js"; // Default to .js
};