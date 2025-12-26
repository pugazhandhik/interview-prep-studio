import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  const [hasStarted, setHasStarted] = useState(false);
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

  // Refs to hold latest values for the timer callback
  const transcriptRef = useRef(transcript);
  const answersRef = useRef(answers);
  const currentQuestionIndexRef = useRef(currentQuestionIndex);
  const isListeningRef = useRef(isListening);

  useEffect(() => {
    transcriptRef.current = transcript;
    answersRef.current = answers;
    currentQuestionIndexRef.current = currentQuestionIndex;
    isListeningRef.current = isListening;
  }, [transcript, answers, currentQuestionIndex, isListening]);

  const saveCurrentAnswer = useCallback(() => {
    if (transcript) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: transcript,
      }));
    }
  }, [currentQuestionIndex, transcript]);

  // This will be called when time runs out
  const handleTimeUp = useCallback(() => {
    const currentIdx = currentQuestionIndexRef.current;
    const currentTranscript = transcriptRef.current;
    const currentAnswers = answersRef.current;
    
    // Save current answer
    const updatedAnswers = {
      ...currentAnswers,
      [currentIdx]: currentTranscript || currentAnswers[currentIdx] || '',
    };
    setAnswers(updatedAnswers);
    
    // Stop recording if active
    if (isListeningRef.current) {
      stopListening();
    }
    
    // Move to next question or show completion
    if (currentIdx < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetTranscript();
      
      toast({
        title: "Time's Up!",
        description: `Moving to question ${currentIdx + 2} of ${interviewQuestions.length}`,
      });
      
      // Auto-start recording for next question after a brief delay
      setTimeout(() => {
        if (isSpeechSupported) {
          startListening();
        }
      }, 500);
    } else {
      // Interview complete - navigate to results
      disableCamera();
      navigate('/results', { state: { answers: updatedAnswers } });
      
      toast({
        title: "Interview Complete!",
        description: "Redirecting to your results...",
      });
    }
  }, [stopListening, resetTranscript, navigate, disableCamera, toast, isSpeechSupported, startListening]);

  const {
    timeLeft,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime,
  } = useTimer(QUESTION_TIME, handleTimeUp);

  const handleStart = useCallback(() => {
    setHasStarted(true);
    
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
      title: "Interview Started",
      description: "Speak your answer clearly. You have 2 minutes per question!",
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
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="glass-card w-full max-w-4xl rounded-3xl p-6 md:p-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            AI Mock Interview
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Frequently Asked CSE Interview Questions
          </p>
        </div>

        {/* Question Card */}
        <QuestionCard
          questionNumber={currentQuestionIndex + 1}
          question={currentQuestion.question}
          category={currentQuestion.category}
        />

        {/* Camera Preview */}
        <div className="flex justify-center">
          <CameraPreview videoRef={videoRef} isEnabled={isCameraEnabled} />
        </div>

        {/* Action Buttons */}
        <ActionButtons
          hasStarted={hasStarted}
          isRecording={isListening}
          isCameraEnabled={isCameraEnabled}
          timeLeft={timeLeft}
          formatTime={formatTime}
          onStart={handleStart}
          onStopRecording={handleStopRecording}
          onToggleCamera={handleToggleCamera}
        />

        {/* Answer Box */}
        <AnswerBox transcript={transcript} isListening={isListening} />

        {/* Status Bar */}
        <StatusBar
          timeLeft={timeLeft}
          formatTime={formatTime}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={interviewQuestions.length}
          isRunning={isRunning}
        />
      </div>
    </div>
  );
};

export default InterviewApp;
