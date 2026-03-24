/* eslint-disable */
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Image from "next/image";

import Link from "next/link";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams;
  const isWeekly = tab === "weekly";

  const session = await auth();
  
  // Aggregate data to simulate a leaderboard.
  // In a real app, this query would be heavily cached and optimized.
  const now = new Date();
  const day = now.getUTCDay() || 7; // 1-7 (Mon-Sun)
  const startOfWeek = new Date(now);
  startOfWeek.setUTCHours(0, 0, 0, 0);
  startOfWeek.setUTCDate(now.getUTCDate() - day + 1);

  const gameSessionsWhere = isWeekly 
    ? { completed: true, playedAt: { gte: startOfWeek } }
    : { completed: true };

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      streak: { select: { currentStreak: true } },
      _count: {
        select: {
          badges: true,
          gameSessions: { where: gameSessionsWhere }
        }
      }
    },
    take: 100, // Top 100 users
  });

  // Calculate score heuristic: 50pts per badge + 10pts per game + 10pts per streak day
  const gamePtsMultiplier = isWeekly ? 15 : 10;

  const leaderboard = users.map((user: any) => {
    const score = (user._count.badges * 50) + 
                  (user._count.gameSessions * gamePtsMultiplier) + 
                  ((user.streak?.currentStreak || 0) * 10);
    return { ...user, score };
  }).sort((a: any, b: any) => b.score - a.score);

  return (
    <div className="leaderboard-container animate-slide-in">
      <header className="page-header">
        <h1>Global Leaderboard</h1>
        <p>See how you stack up against other GATE aspirants.</p>
      </header>

      <div className="tab-bar">
        <Link 
          href="/leaderboard?tab=alltime" 
          className={`tab-btn ${!isWeekly ? "active" : ""}`}
        >
          All-Time
        </Link>
        <Link 
          href="/leaderboard?tab=weekly" 
          className={`tab-btn ${isWeekly ? "active" : ""}`}
        >
          Weekly
        </Link>
      </div>

      <div className="leaderboard-card card">
        <div className="table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="col-rank">Rank</th>
                <th className="col-student">Student</th>
                <th className="col-score">Score</th>
                <th className="col-stats">Badges</th>
                <th className="col-stats">Streak</th>
                <th className="col-stats hidden-mobile">Games Played</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-row">No players found</td>
                </tr>
              ) : (
                leaderboard.map((user: any, index: number) => {
                  const isCurrentUser = session?.user?.id === user.id;
                  
                  return (
                    <tr key={user.id} className={isCurrentUser ? "current-user" : ""}>
                      <td className="col-rank">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "#" + (index + 1)}
                      </td>
                      <td className="col-student">
                        <div className="user-info">
                          {user.image ? (
                            <Image src={user.image} alt={user.name || "User"} width={32} height={32} className="avatar" />
                          ) : (
                            <div className="avatar fallback">{user.name?.charAt(0) || "U"}</div>
                          )}
                          <span className="user-name">
                            {user.name} {isCurrentUser && "(You)"}
                          </span>
                        </div>
                      </td>
                      <td className="col-score">
                        <span className="score-badge">{user.score} pts</span>
                      </td>
                      <td className="col-stats">
                        <span className="stat-pill"><span className="icon">🏅</span> {user._count.badges}</span>
                      </td>
                      <td className="col-stats">
                         <span className="stat-pill"><span className="icon">🔥</span> {user.streak?.currentStreak || 0}</span>
                      </td>
                      <td className="col-stats hidden-mobile">
                         <span className="stat-pill">🎮 {user._count.gameSessions}</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
}
