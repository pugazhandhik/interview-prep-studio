import React from 'react';
import { Clock } from 'lucide-react';

interface StatusBarProps {
  timeLeft: number;
  formatTime: (seconds: number) => string;
  currentQuestion: number;
  totalQuestions: number;
  isRunning: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({
  timeLeft,
  formatTime,
  currentQuestion,
  totalQuestions,
  isRunning,
}) => {
  return (
    <div className="flex items-center justify-between text-foreground/80 text-sm font-medium px-2">
      <div className="flex items-center gap-2">
        <Clock className={`h-4 w-4 ${isRunning && timeLeft <= 30 ? 'text-destructive animate-timer' : ''}`} />
        <span className={isRunning && timeLeft <= 30 ? 'text-destructive font-bold' : ''}>
          Time Left: {formatTime(timeLeft)}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="hidden sm:flex items-center gap-3 flex-1 max-w-xs mx-6">
        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent to-success rounded-full transition-all duration-500"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
      
      <span>
        Question {currentQuestion} / {totalQuestions}
      </span>
    </div>
  );
};

export default StatusBar;
