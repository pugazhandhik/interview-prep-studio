import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { interviewQuestions } from '@/data/interviewQuestions';
import { Button } from '@/components/ui/button';
import { RotateCcw, Download, CheckCircle, XCircle } from 'lucide-react';

interface Answer {
  questionIndex: number;
  answer: string;
}

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const answers: Record<number, string> = location.state?.answers || {};

  const handleRetry = () => {
    navigate('/');
  };

  const handleDownload = () => {
    let content = "AI Mock Interview Results\n";
    content += "=".repeat(50) + "\n\n";
    
    interviewQuestions.forEach((q, index) => {
      content += `Question ${index + 1}: ${q.question}\n`;
      content += `Category: ${q.category}\n`;
      content += `Answer: ${answers[index] || 'No answer provided'}\n`;
      content += "-".repeat(50) + "\n\n";
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview-results.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const answeredCount = Object.keys(answers).filter(key => answers[parseInt(key)]?.trim()).length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="glass-card w-full max-w-4xl rounded-3xl p-6 md:p-10 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Interview Complete!
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            You answered {answeredCount} out of {interviewQuestions.length} questions
          </p>
        </div>

        {/* Progress Stats */}
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-success">{answeredCount}</div>
            <div className="text-xs text-muted-foreground">Answered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-destructive">{interviewQuestions.length - answeredCount}</div>
            <div className="text-xs text-muted-foreground">Skipped</div>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {interviewQuestions.map((q, index) => {
            const hasAnswer = answers[index]?.trim();
            return (
              <div
                key={q.id}
                className="question-card rounded-lg p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-300 text-xs font-semibold tracking-wider uppercase">
                        Question {index + 1}
                      </span>
                      <span className="text-muted-foreground text-xs px-2 py-0.5 bg-white/10 rounded-full">
                        {q.category}
                      </span>
                    </div>
                    <h3 className="text-foreground font-medium text-sm md:text-base">
                      {q.question}
                    </h3>
                  </div>
                  {hasAnswer ? (
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive/60 flex-shrink-0" />
                  )}
                </div>
                
                <div className="answer-box rounded-lg p-3 text-sm">
                  {hasAnswer ? (
                    <p className="text-gray-800 leading-relaxed">{answers[index]}</p>
                  ) : (
                    <p className="text-gray-400 italic">No answer provided</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button
            onClick={handleRetry}
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
          
          <Button
            onClick={handleDownload}
            className="bg-success hover:bg-success/90 text-success-foreground px-8 py-6 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
