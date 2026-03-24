"use client";

import React, { useState } from "react";
import type { FlashcardContent } from "@/lib/gameData";

interface FlashcardFlipProps {
  data: FlashcardContent[];
  onComplete?: (score: number) => void;
}

export default function FlashcardFlip({ data, onComplete }: FlashcardFlipProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [confidenceScores, setConfidenceScores] = useState<('hard' | 'okay' | 'easy')[]>([]);

  const card = data[currentIndex];
  const isLast = currentIndex === data.length - 1;

  const handleNext = (confidence: 'hard' | 'okay' | 'easy') => {
    setIsFlipped(false);
    
    // Tiny timeout to allow flip animation before changing content
    setTimeout(() => {
      const newScores = [...confidenceScores, confidence];
      setConfidenceScores(newScores);

      if (isLast) {
        if (onComplete) {
          const easyCount = newScores.filter(s => s === 'easy').length;
          onComplete(easyCount);
        }
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, 150);
  };

  return (
    <div className="flashcard-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: ((currentIndex) / data.length) * 100 + "%" }}
        />
      </div>

      <div className="card-counter">
        Card {currentIndex + 1} of {data.length}
      </div>

      <div className="scene">
        <div 
          className={"flashcard " + (isFlipped ? "is-flipped" : "")}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="card-face card-front">
            <span className="hint">Tap to flip</span>
            <h3>{card.front}</h3>
          </div>
          <div className="card-face card-back">
            <span className="hint">Definition</span>
            <p>{card.back}</p>
          </div>
        </div>
      </div>

      <div className={"controls " + (isFlipped ? 'visible' : '')}>
        <button className="btn-action btn-hard" onClick={() => handleNext('hard')}>
          <span style={{ fontSize: '1.25rem' }}>😕</span> Still Learning
        </button>
        <button className="btn-action btn-okay" onClick={() => handleNext('okay')}>
          <span style={{ fontSize: '1.25rem' }}>😐</span> Getting There
        </button>
        <button className="btn-action btn-easy" onClick={() => handleNext('easy')}>
          <span style={{ fontSize: '1.25rem' }}>😄</span> Got It!
        </button>
      </div>

      
    </div>
  );
}
