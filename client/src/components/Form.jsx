// src/components/Form.jsx

import { createInterview } from "@/api/mockinterview.api";
import { useState, useRef } from "react";
import { useNotification } from "@/components/Notifications/NotificationContext";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [jobProfile, setJobProfile] = useState("");
  const [targetCompany, setTargetCompany] = useState("");

  const handleCreateInterview = async () => {
    if (jobProfile === "" || tags.length === 0 || targetCompany === "") {
      addNotification({
        id: Date.now().toString(),
        type: "warning",
        message: "Please fill all the fields",
      });
      return;
    }
    try {
      const formData = {
        jobRole: jobProfile,
        experienceLevel,
        skills: tags,
        targetCompany,
      };

      const response = await createInterview(formData);

      addNotification({
        id: Date.now().toString(),
        type: "success",
        message: "Interview Created Successfully",
      });

      // Navigate to the correct path defined in your App.jsx router
      if (response && response._id) {
        navigate(`/interviewinterface/${response._id}`);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      addNotification({
        id: Date.now().toString(),
        type: "error",
        message: "Error creating interview.",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      setTags([...tags, input.trim()]);
      setInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex w-full max-w-[24rem] flex-col rounded-lg bg-white border border-slate-200 shadow-sm">
      <div className="relative m-2.5 flex h-32 flex-col items-center justify-center rounded-md bg-green-400 text-white">
        <h5 className="text-xl text-white">Create New Interview</h5>
      </div>
      <div className="p-6">
        <div className="mt-4 flex flex-col">
          <div className="w-full min-w-[200px] max-w-sm">
            <label className="mb-2 block text-sm text-slate-600">Job Profile</label>
            <input type="text" onChange={(e) => setJobProfile(e.target.value)} className="w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition duration-300 ease-in-out hover:border-slate-300 focus:border-slate-400 focus:shadow focus:outline-none" placeholder="Enter Job Profile" />
          </div>
          <div className="mt-4 w-full min-w-[200px] max-w-sm">
            <label className="mb-1 block text-sm text-slate-600">Experience Level</label>
            <select
              onChange={(e) => setExperienceLevel(e.target.value)}
              value={experienceLevel}
              className="w-full cursor-pointer appearance-none rounded border border-slate-200 bg-transparent py-2 pl-3 pr-8 text-sm text-slate-700 shadow-sm transition duration-300 ease-in-out hover:border-slate-400 focus:border-slate-400 focus:shadow-md focus:outline-none"
            >
              <option value="Fresher">Fresher</option>
              <option value="Junior">Junior</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
          <div className="mx-auto mt-8 w-full">
            <label className="mb-1 block text-sm text-slate-600">Skills</label>
            <div className="flex min-h-[35px] flex-wrap content-start rounded-md border-2 border-gray-200 p-1 text-sm focus-within:border-gray-200">
              {tags.map((tag, index) => (
                <span key={index} className="mr-2 mb-2 flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                  {tag}
                  <button type="button" onClick={() => removeTag(index)} className="ml-1.5 text-gray-600 hover:text-gray-800 focus:outline-none" aria-label={`Remove ${tag}`}>
                    &times;
                  </button>
                </span>
              ))}
              <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} className="h-8 min-w-[50px] flex-grow text-gray-700 outline-none" placeholder={tags.length === 0 ? "Type and press Enter" : ""} aria-label="Add a tag" />
            </div>
          </div>
          <label className="mb-1 mt-4 block text-sm text-slate-600">Target Company</label>
          <input type="text" onChange={(e) => setTargetCompany(e.target.value)} className="w-full rounded-md border border-slate-200 bg-transparent py-2 pl-3 pr-20 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition duration-300 ease-in-out hover:border-slate-300 focus:border-slate-400 focus:shadow focus:outline-none" placeholder="Example Company" />
          <button type="button" onClick={handleCreateInterview} className="mt-6 w-full rounded-md border border-transparent bg-slate-800 py-2 px-4 text-center text-sm text-white shadow-md transition-all hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
            Create Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;