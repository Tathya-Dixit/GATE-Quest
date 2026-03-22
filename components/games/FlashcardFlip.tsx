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
  const [knownCount, setKnownCount] = useState(0);

  const card = data[currentIndex];
  const isLast = currentIndex === data.length - 1;

  const handleNext = (known: boolean) => {
    setIsFlipped(false);
    
    // Tiny timeout to allow flip animation before changing content
    setTimeout(() => {
      const newKnownCount = known ? knownCount + 1 : knownCount;
      if (known) setKnownCount(newKnownCount);

      if (isLast) {
        if (onComplete) onComplete(newKnownCount);
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
        <button className="btn-action btn-review" onClick={() => handleNext(false)}>
          Need Review
        </button>
        <button className="btn-action btn-got-it" onClick={() => handleNext(true)}>
          Got It!
        </button>
      </div>

      
    </div>
  );
}
