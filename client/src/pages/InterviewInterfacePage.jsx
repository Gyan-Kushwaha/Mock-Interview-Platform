// src/pages/InterviewInterfacePage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader/Loader";
import { getInterviewByID } from "@/api/mockinterview.api";
// Import the component from Step 1
import InterviewInterface from '@/components/InterviewInterface';

const InterviewInterfacePage = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      if (id) {
        try {
          const data = await getInterviewByID(id);
          setInterview(data);
        } catch (error) {
          console.error("Failed to fetch interview details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInterview();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-900">
        <Loader />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex h-screen items-center justify-center text-white bg-zinc-900">
        <h1 className="text-2xl">Interview Not Found.</h1>
      </div>
    );
  }

  // Render the component from Step 1, passing the fetched data as a prop
  return (
    <>
      
      <InterviewInterface interviewDetails={interview} />
    </>
  );
};

export default InterviewInterfacePage;