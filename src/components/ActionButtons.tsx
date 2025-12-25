import React from 'react';
import { Play, Square, Video, VideoOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  isRecording: boolean;
  isCameraEnabled: boolean;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onToggleCamera: () => void;
  onNextQuestion: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isRecording,
  isCameraEnabled,
  timeLeft,
  formatTime,
  onStartRecording,
  onStopRecording,
  onToggleCamera,
  onNextQuestion,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {/* Start/Stop Recording Button */}
      {isRecording ? (
        <Button
          onClick={onStopRecording}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 py-6 text-base font-semibold rounded-full animate-pulse-glow transition-all duration-300"
        >
          <Square className="mr-2 h-5 w-5" />
          Stop ({formatTime(timeLeft)})
        </Button>
      ) : (
        <Button
          onClick={onStartRecording}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 py-6 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105"
        >
          <Play className="mr-2 h-5 w-5" />
          Start (2:00)
        </Button>
      )}

      {/* Camera Toggle Button */}
      <Button
        onClick={onToggleCamera}
        className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105"
      >
        {isCameraEnabled ? (
          <>
            <VideoOff className="mr-2 h-5 w-5" />
            Disable Camera
          </>
        ) : (
          <>
            <Video className="mr-2 h-5 w-5" />
            Enable Camera
          </>
        )}
      </Button>

      {/* Next Question Button */}
      <Button
        onClick={onNextQuestion}
        className="bg-success hover:bg-success/90 text-success-foreground px-8 py-6 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105"
      >
        Next Question
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
};

export default ActionButtons;
