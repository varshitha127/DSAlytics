import React, { useState, useEffect } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useVideoMonitoring } from '../hooks/useVideoMonitoring';

const AiInterviewer = () => {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const { transcript, startListening, stopListening } = useSpeechToText();
  const { videoRef, startVideo, stopVideo } = useVideoMonitoring();

  const startInterview = async () => {
    try {
      await startVideo();
      setIsInterviewActive(true);
      // TODO: Initialize interview session with backend
    } catch (error) {
      console.error('Failed to start interview:', error);
    }
  };

  const endInterview = async () => {
    stopVideo();
    stopListening();
    setIsInterviewActive(false);
    // TODO: End interview session and get feedback
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-4">
          <video
            ref={videoRef}
            className="w-full rounded-lg shadow-lg"
            autoPlay
            playsInline
            muted
          />
        </div>
        
        {!isInterviewActive ? (
          <button
            onClick={startInterview}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Start Interview
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Current Question:</h3>
              <p>{currentQuestion?.text || 'Loading question...'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Your Answer:</h3>
              <p>{transcript}</p>
            </div>

            <button
              onClick={endInterview}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              End Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiInterviewer; 