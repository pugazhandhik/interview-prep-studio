import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { interviewQuestions } from '@/data/interviewQuestions';
import { Button } from '@/components/ui/button';
import { RotateCcw, Download, CheckCircle, Clock, XCircle, Trophy, AlertCircle } from 'lucide-react';

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const answers: Record<number, string> = location.state?.answers || {};

  // Calculate score based on answers (simple scoring: each answered question gets points based on answer length and content)
  const { score, answeredCount } = useMemo(() => {
    let totalScore = 0;
    let answered = 0;

    interviewQuestions.forEach((_, index) => {
      const answer = answers[index]?.trim() || '';
      if (answer) {
        answered++;
        // Score based on answer quality (simplified scoring)
        const wordCount = answer.split(/\s+/).length;
        
        if (wordCount >= 50) {
          totalScore += 1; // Excellent answer
        } else if (wordCount >= 30) {
          totalScore += 0.8; // Good answer
        } else if (wordCount >= 15) {
          totalScore += 0.6; // Average answer
        } else if (wordCount >= 5) {
          totalScore += 0.4; // Brief answer
        } else {
          totalScore += 0.2; // Very short answer
        }
      }
    });

    // Normalize to 10-point scale
    const normalizedScore = Math.round((totalScore / interviewQuestions.length) * 10);
    return { score: Math.min(normalizedScore, 10), answeredCount: answered };
  }, [answers]);

  // Determine status based on score
  const getStatus = () => {
    if (score >= 8) {
      return {
        type: 'selected',
        title: 'Congratulations! You are Selected!',
        message: 'You have been selected for the next round - 2 Way Interview. Our team will contact you shortly with further details.',
        icon: Trophy,
        iconColor: 'text-success',
        bgColor: 'bg-success/20',
      };
    } else if (score >= 4 && score <= 7) {
      return {
        type: 'pending',
        title: 'Under Review',
        message: 'Please wait. Our team will process your data and inform you whether you will move to the next round or not.',
        icon: Clock,
        iconColor: 'text-accent',
        bgColor: 'bg-accent/20',
      };
    } else {
      return {
        type: 'not-selected',
        title: 'Thank You for Attending',
        message: 'Thank you for participating in the placement drive. Unfortunately, you have not been selected for the next round. We encourage you to keep practicing and try again.',
        icon: AlertCircle,
        iconColor: 'text-destructive',
        bgColor: 'bg-destructive/20',
      };
    }
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  const handleRetry = () => {
    navigate('/');
  };

  const handleDownload = () => {
    let content = "AI Mock Interview Results\n";
    content += "=".repeat(50) + "\n\n";
    content += `Overall Score: ${score}/10\n`;
    content += `Status: ${status.title}\n\n`;
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="glass-card w-full max-w-4xl rounded-3xl p-6 md:p-10 space-y-6 animate-fade-in">
        {/* Status Header */}
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${status.bgColor}`}>
            <StatusIcon className={`w-10 h-10 ${status.iconColor}`} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            {status.title}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            {status.message}
          </p>
        </div>

        {/* Score Display */}
        <div className="flex justify-center">
          <div className="question-card rounded-2xl p-6 text-center min-w-[200px]">
            <div className="text-5xl font-bold text-primary mb-2">{score}/10</div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8">
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
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
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
                      <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                        Question {index + 1}
                      </span>
                      <span className="text-muted-foreground text-xs px-2 py-0.5 bg-secondary rounded-full">
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
                    <p className="text-foreground leading-relaxed">{answers[index]}</p>
                  ) : (
                    <p className="text-muted-foreground italic">No answer provided</p>
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
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
          
          <Button
            onClick={handleDownload}
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105"
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
