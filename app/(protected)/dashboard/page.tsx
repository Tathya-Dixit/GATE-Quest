import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  // Fetch dashboard stats concurrently
  const [streakQuery, gamesPlayed, totalBadges, subjects] = await Promise.all([
    prisma.streak.findUnique({ where: { userId } }),
    prisma.gameSession.count({ where: { userId, completed: true } }),
    prisma.badge.count({ where: { userId } }),
    prisma.subject.findMany({
      include: {
        _count: { select: { subtopics: true } },
      },
      orderBy: { order: "asc" },
      take: 4, // Show only top 4 subjects for quick access
    }),
  ]);

  const currentStreak = streakQuery?.currentStreak || 0;

  return (
    <div className="dashboard-container animate-slide-in">
      <header className="dashboard-header">
        <div>
          <h1 className="greeting">Welcome back, {session.user?.name?.split(" ")[0]}! 👋</h1>
          <p className="subtitle">Ready to conquer your GATE CS prep today?</p>
        </div>
        <div className="streak-badge">
          <span className="flame-icon">🔥</span>
          <div className="streak-info">
            <span className="streak-count">{currentStreak} Day</span>
            <span className="streak-label">Streak</span>
          </div>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue">🎮</div>
          <div className="stat-content">
            <h3>Games Played</h3>
            <p className="stat-value">{gamesPlayed}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-gold">🏅</div>
          <div className="stat-content">
            <h3>Badges Earned</h3>
            <p className="stat-value">{totalBadges}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-green">🎯</div>
          <div className="stat-content">
            <h3>Overall Accuracy</h3>
            <p className="stat-value">--%</p> {/* MVP placeholder */}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-section recent-subjects">
          <div className="section-header">
            <h2>Jump Back In</h2>
            <Link href="/subjects" className="view-all">View All Subjects &rarr;</Link>
          </div>
          
          <div className="subject-cards">
            {subjects.map((subject) => (
              <Link href={`/subjects/${subject.slug}`} key={subject.id} className="subject-card card">
                <div className="subject-icon">📚</div>
                <div className="subject-details">
                  <h3>{subject.name}</h3>
                  <p>{subject._count.subtopics} topics available</p>
                </div>
                <div className="card-action">Play &rarr;</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="dashboard-section recent-activity">
          <div className="section-header">
            <h2>Recent Activity</h2>
          </div>
          <div className="card empty-state">
            <div className="empty-icon">🌱</div>
            <h3>Your journey begins here</h3>
            <p>Play games and earn badges to populate your activity feed.</p>
            <Link href="/subjects" className="btn-primary" style={{ marginTop: '1rem' }}>
              Start Learning
            </Link>
          </div>
        </section>
      </div>

      
    </div>
  );
}
