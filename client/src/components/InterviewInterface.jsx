import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Camera, Mic as MicSquare, Power, Video, VideoOff } from "lucide-react";
import { Timer } from "./InterviewInterface/Timer";
import { ExitButton } from "./InterviewInterface/ExitButton";
import { ScreenRecorder } from "./InterviewInterface/ScreenRecorder";
import { useNavigate } from "react-router-dom";
import AudioVisualizer from "@/components/InterviewInterface/AudioVisualizer";
import CodeEditor from "./CodeEdior/CodeEditor";
import Loader from "./Loader/Loader";
import { useNotification } from "@/components/Notifications/NotificationContext";
import { generateReview } from "@/api/gemini.api";


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true; 
  recognition.interimResults = true;
  recognition.lang = "en-US";
}
// ----------------------------------------------------

const InterviewInterface = ({ interviewDetails }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCurrentAnswerSaved, setIsCurrentAnswerSaved] = useState(false);
  const [codeResponse, setCodeResponse] = useState("");
  const [savedInterviewData, setSavedInterviewData] = useState(interviewDetails);

  // --- State for Web Speech API ---
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [partialTranscript, setPartialTranscript] = useState("");
  // ------------------------------

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const maxQuestions = questions.length;

  
  useEffect(() => {
    if (!recognition) return;

    
    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        setTranscript(prev => (prev + " " + finalTranscript).trim());
        setIsCurrentAnswerSaved(false);
      }
      setPartialTranscript(interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      addNotification({ id: Date.now().toString(), type: "error", message: `Speech recognition error: ${event.error}` });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [addNotification]);

  const handleListen = () => {
    if (!recognition) {
      addNotification({ id: Date.now().toString(), type: "error", message: "Speech recognition is not supported in your browser." });
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      setTranscript(""); 
      setPartialTranscript("");
      recognition.start();
    }
    setIsListening(!isListening);
  };


  useEffect(() => {
    const allQuestions = [
      ...(interviewDetails.technicalQuestions?.map(q => ({ ...q, type: 'technicalQuestions' })) || []),
      ...(interviewDetails.coreSubjectQuestions?.map(q => ({ ...q, type: 'coreSubjectQuestions' })) || []),
      ...(interviewDetails.dsaQuestions?.map(q => ({ ...q, type: 'dsaQuestions' })) || [])
    ];
    setQuestions(allQuestions);
  }, [interviewDetails]);

  useEffect(() => {
    const cameraAction = async () => {
      if (isCameraOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (videoRef.current) videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setHasPermission(true);
        } catch (err) {
          console.error("Error accessing media devices:", err);
          setHasPermission(false);
          setIsCameraOn(false);
        }
      } else {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (videoRef.current) videoRef.current.srcObject = null;
      }
    };
    cameraAction();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  const toggleCamera = () => setIsCameraOn((prev) => !prev);

  const handleSaveResponse = () => {
    const allResponse = `Text Response: ${transcript}\nCode Response: ${codeResponse}`;
    const currentQuestionObj = questions[currentQuestion];
    const category = currentQuestionObj.type;

    setSavedInterviewData(prevData => {
      const updatedData = JSON.parse(JSON.stringify(prevData));
      if (updatedData[category]) {
        const questionIndex = updatedData[category].findIndex(q => q.question === currentQuestionObj.question);
        if (questionIndex !== -1) {
          updatedData[category][questionIndex].answer = allResponse;
        }
      }
      return updatedData;
    });

    addNotification({ id: Date.now().toString(), type: "info", message: "Response Saved Successfully" });
    setIsCurrentAnswerSaved(true);
  };

  const handleSetNextQuestion = async () => {
    if (!isCurrentAnswerSaved) {
      addNotification({
        id: Date.now().toString(),
        type: "error",
        message: "Please save your current response before proceeding.",
      });
      return;
    }

    if (isListening) {
      recognition.stop(); 
    }

    if (currentQuestion < maxQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTranscript("");
      setCodeResponse("");
      setPartialTranscript("");
      setIsCurrentAnswerSaved(false);
    } else {
      try {
        setIsSubmitting(true);
        const finalPayload = { interviewDetails: savedInterviewData };
        const generateReviewResponse = await generateReview(finalPayload);
        if (generateReviewResponse) {
          addNotification({ id: Date.now().toString(), type: "success", message: "Review generated! Redirecting..." });
          navigate("/dashboard");
        }
      } catch (error) {
        console.error(error);
        addNotification({
          id: Date.now().toString(),
          type: "error",
          message: "Failed to generate the final review.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isInterviewStarted) {
    return (
      <Dialog open={!isInterviewStarted} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader><DialogTitle>Begin Your Interview</DialogTitle></DialogHeader>
          <p>You are about to start your interview. Please ensure your camera and microphone are ready.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>Cancel</Button>
            <Button onClick={() => setIsInterviewStarted(true)}>Start Interview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (isSubmitting) return <Loader />;

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-800/50 backdrop-blur-sm">
        <h1 className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-[#4AE087] via-[#84B7D4] to-[#9D7AEA] bg-clip-text text-transparent">AI-Powered</span> Mock Interview
        </h1>
        <div className="flex items-center gap-4">
          <ScreenRecorder />
          <Button className="text-black" variant="outline" onClick={() => setIsEditorOpen(!isEditorOpen)}>
            {isEditorOpen ? "Close Editor" : "Open Code Editor"}
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {maxQuestions > 0 ? (
          <>
            <div className="space-y-6">
              <Card className="p-6 bg-zinc-800/50 border-zinc-700">
                <h2 className="text-xl text-white font-semibold mb-4">Question {currentQuestion + 1} of {maxQuestions}</h2>
                <p className="text-zinc-300 min-h-[50px]">{questions[currentQuestion].question}</p>
                <div className="w-full mt-4 flex justify-end gap-2">
                  <Button onClick={handleSaveResponse} disabled={isCurrentAnswerSaved} className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-900 disabled:opacity-70">
                    {isCurrentAnswerSaved ? "Saved" : "Save Response"}
                  </Button>
                  <Button onClick={handleSetNextQuestion} className="bg-green-600 hover:bg-green-700">
                    {currentQuestion === maxQuestions - 1 ? "Finish & Submit" : "Next Question"}
                  </Button>
                </div>
              </Card>
              <Card className="p-6 bg-zinc-800/50 border-zinc-700 min-h-[200px]">
                <h2 className="text-xl text-white font-semibold mb-4">Your Verbal Response</h2>
                <p className="text-zinc-300 italic">
                  {transcript}
                  <span className="text-zinc-500">{partialTranscript}</span>
                </p>
              </Card>
              <Card className="p-6 bg-zinc-800/50 border-zinc-700 min-h-[150px]">
                <h2 className="text-xl text-white font-semibold mb-4">Code Submission</h2>
                <textarea
                  value={codeResponse}
                  onChange={(e) => {
                    setCodeResponse(e.target.value);
                    setIsCurrentAnswerSaved(false); // Code change means answer is unsaved
                  }}
                  placeholder="Paste your code here, or type directly. To use a full editor, click 'Open Code Editor'."
                  className="w-full bg-zinc-800 h-full p-2 placeholder:italic text-zinc-200 rounded"
                />
              </Card>
            </div>
            <div className="space-y-4">
              <Card className="aspect-video relative bg-zinc-800/50 border-zinc-700 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                  {isCameraOn && hasPermission ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  ) : (
                    hasPermission === false ? <p className="text-red-500">Camera permission denied.</p> : <Camera className="w-16 h-16 text-zinc-600" />
                  )}
                </div>
              </Card>
              <div className="flex justify-center gap-4">
                <Button variant={isCameraOn ? "default" : "destructive"} onClick={toggleCamera} className="w-40">
                  {isCameraOn ? <><Video className="mr-2 h-4 w-4" /> On</> : <><VideoOff className="mr-2 h-4 w-4" /> Off</>}
                </Button>
                <Button variant={isListening ? "destructive" : "outline"} onClick={handleListen} className="w-40 text-black">
                  {isListening ? <><Power className="mr-2 h-4 w-4" /> Stop</> : <><MicSquare className="mr-2 h-4 w-4" /> Record</>}
                </Button>
              </div>
              <Card className="p-6 bg-zinc-800/50 border-zinc-700 min-h-[70px]">
                <p className="text-zinc-400 italic">{partialTranscript || "Real-time speech appears here..."}</p>
              </Card>
              {isListening && <AudioVisualizer />}
            </div>
          </>
        ) : (
          <div className="col-span-2 text-center py-20">
            <h2 className="text-2xl font-bold">No Questions Found</h2>
            <p className="text-zinc-400 mt-2">This interview does not have any questions loaded.</p>
            <Button onClick={() => navigate("/dashboard")} className="mt-6">Return to Dashboard</Button>
          </div>
        )}
      </div>

      <Timer />
      <ExitButton />
      {isEditorOpen && <CodeEditor />}
    </div>
  );
};

export default InterviewInterface;