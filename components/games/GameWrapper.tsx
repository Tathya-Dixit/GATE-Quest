"use client";

import React, { useState } from "react";
import { QuizComponent } from "../quiz/QuizComponent";
import type { QuizQuestion } from "@/lib/gameData";
import Link from "next/link";
import { useRouter } from "next/navigation";

import FlashcardFlip from "./FlashcardFlip";
import SortTheSteps from "./SortTheSteps";

interface GameWrapperProps {
  subtopic: { id: string; name: string; subject: { name: string; slug: string } };
  gameType: string;
  gameData: any;
  quizData: QuizQuestion[];
  userId: string;
}

export function GameWrapper({ subtopic, gameType, gameData, quizData, userId }: GameWrapperProps) {
  const [gameState, setGameState] = useState<"intro" | "playing" | "quiz" | "done">("intro");
  const [gameScore, setGameScore] = useState(0);
  const router = useRouter();

  const handleGameComplete = (score: number) => {
    setGameScore(score);
    setGameState("quiz");
  };

  const handleQuizComplete = async (quizScore: number, maxScore: number, percentage: number, badge: string | null) => {
    // Save to database
    try {
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subtopicId: subtopic.id,
          gameType,
          gameScore,
          quizScore,
          maxScore,
          percentage,
          badge
        }),
      });
      setGameState("done");
      // Pre-refresh router so dashboard/badges update
      router.refresh();
    } catch (err) {
      console.error("Failed to save quiz results", err);
      // Still show done screen
      setGameState("done");
    }
  };

  return (
    <div className="game-wrapper animate-slide-in">
      <div className="game-header">
        <Link href={`/subjects/${subtopic.subject.slug}`} className="back-link">
          &larr; Exit
        </Link>
        <div className="game-meta">
          <span className="subject-name">{subtopic.subject.name}</span>
          <span className="separator">/</span>
          <span className="topic-name">{subtopic.name}</span>
        </div>
      </div>

      <div className="game-content-area">
        {gameState === "intro" && (
          <div className="intro-screen card">
            <h1>{gameType === "flashcard" ? "Flashcards" : "Sort the Steps"}</h1>
            <p>Master the concepts, then take the quiz to earn your badge.</p>
            <button className="btn-primary" onClick={() => setGameState("playing")}>
              Start Learning
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="active-game">
            {gameType === "flashcard" && <FlashcardFlip data={gameData} onComplete={handleGameComplete} />}
            {gameType === "sort-steps" && <SortTheSteps data={gameData} onComplete={handleGameComplete} />}
          </div>
        )}

        {gameState === "quiz" && (
          <QuizComponent questions={quizData} onComplete={handleQuizComplete} />
        )}

        {gameState === "done" && (
          <div className="done-screen card">
            <div className="celebration-icon">🎉</div>
            <h2>Training Complete!</h2>
            <p>You have successfully completed this module.</p>
            <div className="action-buttons">
              <Link href={`/subjects/${subtopic.subject.slug}`} className="btn-primary" style={{ backgroundColor: "transparent", color: "var(--brand-primary)", border: "1px solid var(--brand-primary)" }}>
                Back to Topics
              </Link>
              <Link href="/dashboard" className="btn-primary">
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
}
