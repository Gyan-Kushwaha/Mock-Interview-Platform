import { X } from "lucide-react";
import { useState } from "react";
import Form from "../components/Form";

const Hero = () => {
  const [isFormOpen, setFormOpen] = useState(false);

  const handleFormOpen = () => {
    setFormOpen(!isFormOpen);
  };

  if (isFormOpen) {
    return (
      // These new classes will center the form on the screen
      <div className="fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-black/80 p-4">
        <Form />
        <button
          className="fixed top-3 right-5 z-40 rounded-full border border-slate-300 py-2 px-4 text-center text-sm text-white shadow-sm transition-all hover:border-slate-800 hover:bg-slate-200 hover:text-slate-600 hover:shadow-lg focus:border-slate-800 focus:bg-slate-800 focus:text-white active:border-slate-800 active:bg-slate-800 active:text-white disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          onClick={handleFormOpen}
        >
          <X />
        </button>
      </div>
    );
  }

  return (
    <div>
      <section className="pt-24">
        <div className="mx-auto max-w-7xl px-12">
          <div className="mx-auto w-full text-left md:w-11/12 md:text-center xl:w-9/12">
            <h1 className="mb-8 text-4xl font-extrabold leading-none tracking-normal text-gray-900 md:text-6xl md:tracking-tight">
              <span className="block w-full-py-2 bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text py-2 text-transparent lg:inline">
                AI-Powered
              </span>{" "}
              <span className="text-white"> Mock Interviews</span>
            </h1>
            <p className="px-0 mb-8 text-lg text-gray-200 md:text-xl lg:px-24">
              Practice, Prepare, and Succeed!
            </p>
            <div className="mb-4 space-x-0 md:space-x-2 md:mb-8">
              <button
                onClick={handleFormOpen}
                className="mb-2 inline-flex items-center justify-center rounded-2xl bg-green-400 px-6 py-3 text-lg text-white sm:w-auto sm:mb-0"
              >
                Create Interview
                <svg
                  className="ml-1 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;