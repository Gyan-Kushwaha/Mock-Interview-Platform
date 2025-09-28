"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Monitor, StopCircle, Download, Trash2 } from "lucide-react";

export function ScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor",
          frameRate: { ideal: 30, max: 60 },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setShowDownloadDialog(true);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting screen recording:", err);
      setIsRecording(false);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
            errorMessage = "Screen recording permission denied. Please allow access.";
            break;
          case "NotFoundError":
            errorMessage = "No screen sharing source was found.";
            break;
          case "NotReadableError":
            errorMessage = "Could not access your screen. Check hardware.";
            break;
          default:
            errorMessage = `An error occurred: ${err.message}`;
        }
      }
      alert(errorMessage);
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      setError("An error occurred while stopping the recording.");
    }
  };

  const downloadRecording = () => {
    const blob = new Blob(chunksRef.current, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "screen-recording.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDownloadDialog(false);
  };

  const discardRecording = () => {
    chunksRef.current = [];
    setShowDownloadDialog(false);
  };

  return (
    <>
      <Button
        variant={isRecording ? "destructive" : "default"}
        size="sm"
        onClick={isRecording ? stopRecording : startRecording}
        className="mr-2"
      >
        {isRecording ? (
          <>
            <StopCircle className="mr-2 h-4 w-4" />
            Stop Recording
          </>
        ) : (
          <>
            <Monitor className="mr-2 h-4 w-4" />
            Record Screen
          </>
        )}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <AlertDialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Screen Recording Completed</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to download or discard the recording?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={discardRecording}>
              <Trash2 className="mr-2 h-4 w-4" />
              Discard
            </AlertDialogCancel>
            <AlertDialogAction onClick={downloadRecording}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}