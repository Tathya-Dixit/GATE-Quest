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
    <div className="done-screen card animate-slide-in">
      <div className="badge-display">
        <div className="badge-emoji-large">{badgeEmoji}</div>
        <h2 className="badge-title">{badgeLabel}</h2>
      </div>
      
      <div className="result-stats">
        <div className="score-main">{quizScore} / {maxScore} correct</div>
        <div className="score-pct">{percentage}% Accuracy</div>
        {timeBonus > 0 && (
          <div className="speed-bonus">
            ⏱️ Speed Bonus: +{timeBonus} pts
          </div>
        )}
      </div>

      <div className="xp-gained">
        +{xpEarned} XP
      </div>

      {newLevel > previousLevel && (
        <div className="level-up-banner">
          <span className="party-icon">🎉</span>
          <div className="level-up-text">
            <strong>Level Up!</strong>
            <p>You reached Level {newLevel}</p>
          </div>
        </div>
      )}

      <div className="streak-result">
        🔥 {streakCount} Day Streak!
      </div>

      <div className="done-actions">
        <button 
          onClick={() => router.push(`/subjects/${subtopic.subject.slug}`)} 
          className="btn-secondary"
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

      <style jsx>{`
        .badge-display { margin-bottom: 2rem; }
        .badge-emoji-large { font-size: 5rem; line-height: 1; margin-bottom: 0.5rem; animation: badge-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .badge-title { color: var(--text-primary); font-size: 1.75rem; font-weight: 800; }
        
        .result-stats { margin-bottom: 2rem; }
        .score-main { fontSize: 1.25rem; fontWeight: 700; color: var(--text-primary); }
        .score-pct { color: var(--text-secondary); fontWeight: 500; }
        .speed-bonus { color: var(--success); fontWeight: 700; fontSize: 0.9rem; marginTop: 0.5rem; animation: fadeInUp 0.5s ease 0.8s both; }

        .level-up-text { display: flex; flexDirection: column; gap: 0.25rem; textAlign: left; }
        .level-up-text strong { fontSize: 1.1rem; color: var(--text-primary); }
        .level-up-text p { fontSize: 0.9rem; margin: 0; }
        .party-icon { fontSize: 2rem; }

        .streak-result { margin-bottom: 2rem; fontWeight: 800; color: var(--warning); fontSize: 1.1rem; }
        
        .done-actions { display: flex; flex-direction: column; gap: 1rem; width: 100%; }
        .btn-secondary { padding: 0.75rem 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); font-weight: 600; color: var(--text-primary); background: var(--bg-tertiary); }
        .btn-secondary:hover { background: var(--border-color); transform: translateY(-2px); }

        @keyframes badge-pop {
          0% { transform: scale(0); rotate: -20deg; }
          70% { transform: scale(1.1); rotate: 10deg; }
          100% { transform: scale(1); rotate: 0deg; }
        }
      `}</style>
    </div>
  );
}
