import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewQuestions } from '@/data/interviewQuestions';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useCamera } from '@/hooks/useCamera';
import { useTimer } from '@/hooks/useTimer';
import QuestionCard from './QuestionCard';
import CameraPreview from './CameraPreview';
import ActionButtons from './ActionButtons';
import AnswerBox from './AnswerBox';
import StatusBar from './StatusBar';
import { useToast } from '@/hooks/use-toast';

const QUESTION_TIME = 120; // 2 minutes in seconds

const InterviewApp: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const navigate = useNavigate();
  
  const { toast } = useToast();
  const currentQuestion = interviewQuestions[currentQuestionIndex];
  
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isSpeechSupported,
  } = useSpeechRecognition();
  
  const {
    videoRef,
    isEnabled: isCameraEnabled,
    enableCamera,
    disableCamera,
    error: cameraError,
  } = useCamera();

  const saveCurrentAnswer = useCallback(() => {
    if (transcript) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: transcript,
      }));
    }
  }, [currentQuestionIndex, transcript]);

  const handleNextQuestion = useCallback(() => {
    // Save current answer
    const updatedAnswers = {
      ...answers,
      [currentQuestionIndex]: transcript || answers[currentQuestionIndex] || '',
    };
    setAnswers(updatedAnswers);
    
    // Stop recording if active
    if (isListening) {
      stopListening();
    }
    
    // Move to next question or show completion
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetTranscript();
      resetTimer();
      
      toast({
        title: "Next Question",
        description: `Moving to question ${currentQuestionIndex + 2} of ${interviewQuestions.length}`,
      });
    } else {
      // Interview complete - navigate to results
      disableCamera();
      navigate('/results', { state: { answers: updatedAnswers } });
      
      toast({
        title: "Interview Complete!",
        description: "Redirecting to your results...",
      });
    }
  }, [currentQuestionIndex, transcript, answers, isListening, stopListening, resetTranscript, navigate, disableCamera, toast]);

  const {
    timeLeft,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime,
  } = useTimer(QUESTION_TIME, handleNextQuestion);

  const handleStartRecording = useCallback(() => {
    if (!isSpeechSupported) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser. Please use Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }
    
    resetTranscript();
    startListening();
    startTimer();
    
    toast({
      title: "Recording Started",
      description: "Speak your answer clearly. Timer started!",
    });
  }, [isSpeechSupported, resetTranscript, startListening, startTimer, toast]);

  const handleStopRecording = useCallback(() => {
    stopListening();
    stopTimer();
    saveCurrentAnswer();
    
    toast({
      title: "Recording Stopped",
      description: "Your answer has been captured.",
    });
  }, [stopListening, stopTimer, saveCurrentAnswer, toast]);

  const handleToggleCamera = useCallback(async () => {
    if (isCameraEnabled) {
      disableCamera();
      toast({
        title: "Camera Disabled",
        description: "Camera has been turned off.",
      });
    } else {
      await enableCamera();
      if (!cameraError) {
        toast({
          title: "Camera Enabled",
          description: "Camera is now active.",
        });
      }
    }
  }, [isCameraEnabled, enableCamera, disableCamera, cameraError, toast]);

  return (
    <div className="h-screen flex items-center justify-center p-2 md:p-4 overflow-hidden">
      <div className="glass-card w-full max-w-4xl h-full max-h-[98vh] rounded-2xl p-4 md:p-6 flex flex-col">
        {/* Header */}
        <div className="text-center space-y-1 flex-shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            AI Mock Interview
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Frequently Asked CSE Interview Questions
          </p>
        </div>

        {/* Question Card */}
        <div className="flex-shrink-0 mt-3">
          <QuestionCard
            questionNumber={currentQuestionIndex + 1}
            question={currentQuestion.question}
            category={currentQuestion.category}
          />
        </div>

        {/* Camera Preview */}
        <div className="flex justify-center flex-1 min-h-0 my-3">
          <CameraPreview videoRef={videoRef} isEnabled={isCameraEnabled} />
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0">
          <ActionButtons
            isRecording={isListening}
            isCameraEnabled={isCameraEnabled}
            timeLeft={timeLeft}
            formatTime={formatTime}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onToggleCamera={handleToggleCamera}
            onNextQuestion={handleNextQuestion}
          />
        </div>

        {/* Answer Box */}
        <div className="flex-shrink-0 mt-3">
          <AnswerBox transcript={transcript} isListening={isListening} />
        </div>

        {/* Status Bar */}
        <div className="flex-shrink-0 mt-3">
          <StatusBar
            timeLeft={timeLeft}
            formatTime={formatTime}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={interviewQuestions.length}
            isRunning={isRunning}
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewApp;
