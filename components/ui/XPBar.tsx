"use client";

import { getXPProgress } from "@/lib/xp";

export default function XPBar({ xp, level }: { xp: number; level: number }) {
  const { currentXP, nextLevelXP, percentage } = getXPProgress(xp);

  let levelTitle = "Rookie";
  if (level === 2) levelTitle = "Learner";
  else if (level === 3) levelTitle = "Scholar";
  else if (level === 4) levelTitle = "Expert";
  else if (level === 5) levelTitle = "Master";
  else if (level >= 6) levelTitle = "Legend";

  return (
    <div className="xp-bar-container">
      <div className="xp-bar-header">
        <span className="level-pill">LVL {level}</span>
        <span className="level-title">GATE {levelTitle}</span>
        <span className="xp-text">{currentXP} / {nextLevelXP} XP</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
