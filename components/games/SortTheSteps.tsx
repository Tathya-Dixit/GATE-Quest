"use client";

import React, { useState, useEffect } from "react";
import type { SortStepContent } from "@/lib/gameData";

interface SortTheStepsProps {
  data: SortStepContent[];
  onComplete?: (score: number) => void;
}

export default function SortTheSteps({ data, onComplete }: SortTheStepsProps) {
  // Simple implementation of sort game without adding full dnd-kit dependency to keep MVP light
  const [items, setItems] = useState<SortStepContent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    // Shuffle on mount
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  }, [data]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    setItems(newItems);
    setIsCorrect(null);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    setItems(newItems);
    setIsCorrect(null);
  };

  const checkOrder = () => {
    const isSorted = items.every((item, index) => item.order === index + 1);
    setIsCorrect(isSorted);
    if (isSorted && onComplete) {
      setTimeout(() => {
        onComplete(100);
      }, 1500);
    }
  };

  return (
    <div className="sort-container">
      <div className="instructions">
        <h3>Arrange the Steps</h3>
        <p>Use the arrows to order the algorithm correctly from top to bottom.</p>
      </div>

      <div className="sort-list">
        {items.map((item, index) => (
          <div key={item.id} className={"sort-item card " + (isCorrect ? 'success' : '')}>
            <div className="item-number">{index + 1}</div>
            <div className="item-text">{item.text}</div>
            <div className="item-controls">
              <button 
                onClick={() => moveUp(index)} 
                disabled={index === 0 || isCorrect === true}
                className="control-btn"
              >
                ▲
              </button>
              <button 
                onClick={() => moveDown(index)} 
                disabled={index === items.length - 1 || isCorrect === true}
                className="control-btn"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button 
          className={"btn-primary " + (isCorrect ? 'btn-success' : '') + (isCorrect === false ? ' btn-error' : '')}
          onClick={checkOrder}
          disabled={isCorrect === true}
        >
          {isCorrect === null && "Check Order"}
          {isCorrect === true && "Correct! Great Job 🎉"}
          {isCorrect === false && "Incorrect, try again"}
        </button>
      </div>

      
    </div>
  );
}
