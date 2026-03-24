"use client";

import Link from "next/link";

export default function StreakBanner({
  lastActiveAt,
  currentStreak,
}: {
  lastActiveAt: string | Date;
  currentStreak: number;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = new Date(lastActiveAt);
  lastActive.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(today.getTime() - lastActive.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return null; // Already played today

  if (diffDays === 1) {
    return (
      <div className="streak-banner streak-banner-warning">
        🔥 Keep your {currentStreak}-day streak alive! Play a game today.
        <Link href="/subjects">Play Now &rarr;</Link>
      </div>
    );
  }

  return (
    <div className="streak-banner streak-banner-danger">
      😔 Your streak ended. Start a new one today!
      <Link href="/subjects">Start New Streak &rarr;</Link>
    </div>
  );
}
