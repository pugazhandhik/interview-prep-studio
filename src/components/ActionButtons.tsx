import React from 'react';
import { Play, Square, Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  hasStarted: boolean;
  isRecording: boolean;
  isCameraEnabled: boolean;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  onStart: () => void;
  onStopRecording: () => void;
  onToggleCamera: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  hasStarted,
  isRecording,
  isCameraEnabled,
  timeLeft,
  formatTime,
  onStart,
  onStopRecording,
  onToggleCamera,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {/* Start Button - Only show before interview starts */}
      {!hasStarted ? (
        <Button
          onClick={onStart}
          className="bg-success hover:bg-success/90 text-success-foreground px-12 py-8 text-xl font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <Play className="mr-3 h-7 w-7" />
          Start Interview
        </Button>
      ) : (
        <>
          {/* Recording Status - Show when recording */}
          {isRecording ? (
            <Button
              onClick={onStopRecording}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 py-6 text-base font-semibold rounded-full animate-pulse-glow transition-all duration-300"
            >
              <Square className="mr-2 h-5 w-5" />
              Recording ({formatTime(timeLeft)})
            </Button>
          ) : (
            <div className="px-8 py-6 text-base font-semibold rounded-full bg-muted text-muted-foreground">
              Preparing next question...
            </div>
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
        </>
      )}
    </div>
  );
};

export default ActionButtons;
