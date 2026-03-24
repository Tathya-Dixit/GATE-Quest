"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

interface ResultScreenProps {
  subtopic: { name: string; subject: { slug: string } };
  quizScore: number;
  maxScore: number;
  percentage: number;
  badge: string | null;
  xpEarned: number;
  newLevel: number;
  previousLevel: number;
  streakCount: number;
  timeBonus?: number;
}

export default function ResultScreen({
  subtopic,
  quizScore,
  maxScore,
  percentage,
  badge,
  xpEarned,
  newLevel,
  previousLevel,
  streakCount,
  timeBonus = 0
}: ResultScreenProps) {
  const router = useRouter();

  useEffect(() => {
    if (badge) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  }, [badge]);

  let badgeEmoji = "🎯";
  let badgeLabel = "Good Effort!";
  if (badge === "gold") {
    badgeEmoji = "🥇";
    badgeLabel = "Gold Mastery";
  } else if (badge === "silver") {
    badgeEmoji = "🥈";
    badgeLabel = "Silver Scholar";
  } else if (badge === "bronze") {
    badgeEmoji = "🥉";
    badgeLabel = "Bronze Learner";
  }

  return (
    <div className="done-screen card animate-slide-in" style={{ textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
      <div style={{ fontSize: "5rem", marginBottom: "0.5rem", lineHeight: 1 }}>{badgeEmoji}</div>
      <h2 style={{ marginBottom: "1.5rem", color: "var(--text-primary)" }}>{badgeLabel}</h2>
      
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>{quizScore} / {maxScore} correct</div>
        <div style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{percentage}% Score</div>
        {timeBonus > 0 && (
          <div style={{ color: "var(--success)", fontWeight: 600, fontSize: "0.9rem", marginTop: "0.5rem" }}>
            ⏱️ Speed Bonus: +{timeBonus} pts
          </div>
        )}
      </div>

      <div className="xp-gained" style={{ marginBottom: "1.5rem" }}>
        +{xpEarned} XP
      </div>

      {newLevel > previousLevel && (
        <div className="level-up-banner" style={{ marginBottom: "1.5rem" }}>
          🎉 Level Up! You reached Level {newLevel}
        </div>
      )}

      <div style={{ marginBottom: "2rem", fontWeight: 700, color: "var(--warning)" }}>
        🔥 {streakCount} Day Streak!
      </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexDirection: "column" }}>
        <button 
          onClick={() => router.push(`/subjects/${subtopic.subject.slug}`)} 
          style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", border: "2px solid var(--border-color)", fontWeight: 600, color: "var(--text-primary)", backgroundColor: "transparent" }}
        >
          Back to Topics
        </button>
        <button 
          onClick={() => router.push("/dashboard")} 
          className="btn-primary"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
