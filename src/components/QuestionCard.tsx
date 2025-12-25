import React from 'react';

interface QuestionCardProps {
  questionNumber: number;
  question: string;
  category: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionNumber,
  question,
  category,
}) => {
  return (
    <div className="question-card rounded-lg p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-yellow-300 text-sm font-semibold tracking-wider uppercase">
          Question {questionNumber}
        </span>
        <span className="text-muted-foreground text-xs px-2 py-1 bg-white/10 rounded-full">
          {category}
        </span>
      </div>
      <h2 className="text-foreground text-xl md:text-2xl font-semibold leading-relaxed">
        {question}
      </h2>
    </div>
  );
};

export default QuestionCard;
