/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import type { QuizQuestion } from "@/lib/gameData";

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete: (score: number, maxScore: number, percentage: number, badge: string | null, timeBonus: number) => void;
}

export function QuizComponent({ questions, onComplete }: QuizComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timeBonus, setTimeBonus] = useState(0);

  useEffect(() => {
    if (isAnswered) return;
    
    if (timeLeft <= 0) {
      setSelectedOption(-1);
      setIsAnswered(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isAnswered]);

  const question = questions[currentIndex];
  const isCorrect = selectedOption === question.correctIndex;

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === question.correctIndex) {
      setScore(prev => prev + 1);
      if (30 - timeLeft < 10 && index !== -1) {
        setTimeBonus(prev => prev + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      // Finish Quiz
      const finalScore = score;
      const percentage = Math.round((finalScore / questions.length) * 100);
      
      let badge = null;
      if (percentage >= 80) badge = "gold";
      else if (percentage >= 60) badge = "silver";
      else if (percentage >= 40) badge = "bronze";

      onComplete(finalScore, questions.length, percentage, badge, timeBonus);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
    }
  };

  return (
    <div className="quiz-container card">
      <div className="quiz-header">
        <h2 className="quiz-title">Assessment Quiz</h2>
        <div className="quiz-progress">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="timer-container">
        <svg className="timer-ring" viewBox="0 0 44 44">
          <circle className="timer-ring-bg" cx="22" cy="22" r="18" />
          <circle
            className="timer-ring-fill"
            cx="22" cy="22" r="18"
            strokeDasharray={`${2 * Math.PI * 18}`}
            strokeDashoffset={`${(1 - Math.max(0, timeLeft) / 30) * 2 * Math.PI * 18}`}
            style={{ stroke: timeLeft <= 10 ? 'var(--danger)' : 'var(--brand-primary)' }}
          />
        </svg>
        <span className="timer-text" style={{ color: timeLeft <= 10 ? 'var(--danger)' : 'var(--text-primary)' }}>
          {Math.max(0, timeLeft)}
        </span>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: ((currentIndex) / questions.length) * 100 + "%" }}
        />
      </div>

      <div className="question-section">
        <h3 className="question-text">{question.question}</h3>
        
        <div className="options-grid">
          {question.options.map((option, index) => {
            let className = "option-btn";
            if (isAnswered) {
              if (index === question.correctIndex) className += " correct";
              else if (index === selectedOption) className += " incorrect";
              else className += " disabled";
            } else if (index === selectedOption) {
              className += " selected";
            }

            return (
              <button
                key={index}
                className={className}
                onClick={() => handleSelect(index)}
                disabled={isAnswered}
              >
                <div className="option-indicator">{String.fromCharCode(65 + index)}</div>
                <div className="option-text">{option}</div>
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className={"feedback-section animate-slide-in " + (isCorrect ? "feedback-success" : "feedback-error")}>
          <div className="feedback-header">
            <h4>{isCorrect ? "Correct! 🎉" : "Incorrect 💡"}</h4>
          </div>
          <p className="explanation">{question.explanation}</p>
          <button className="btn-primary next-btn" onClick={handleNext}>
            {currentIndex === questions.length - 1 ? "Complete Quiz" : "Next Question &rarr;"}
          </button>
        </div>
      )}

      
    </div>
  );
}
