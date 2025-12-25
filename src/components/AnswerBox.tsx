import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface AnswerBoxProps {
  transcript: string;
  isListening: boolean;
}

const AnswerBox: React.FC<AnswerBoxProps> = ({ transcript, isListening }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-foreground/90 text-sm font-medium">
          Your Answer
        </label>
        {isListening && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <Mic className="h-4 w-4 animate-pulse" />
            <span>Recording...</span>
          </div>
        )}
      </div>
      <div className="answer-box rounded-lg p-4 min-h-[120px] max-h-[200px] overflow-y-auto shadow-inner">
        {transcript ? (
          <p className="text-gray-800 leading-relaxed">{transcript}</p>
        ) : (
          <p className="text-gray-400 italic">
            Your spoken answer will appear here...
          </p>
        )}
      </div>
    </div>
  );
};

export default AnswerBox;
