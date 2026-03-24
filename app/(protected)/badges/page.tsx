/* eslint-disable */
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function BadgesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const badges = await prisma.badge.findMany({
    where: { userId: session.user.id },
    include: {
      subtopic: {
        include: { subject: true }
      }
    },
    orderBy: { earnedAt: "desc" }
  });

  const tiers = {
    gold: badges.filter((b: any) => b.tier === "gold"),
    silver: badges.filter((b: any) => b.tier === "silver"),
    bronze: badges.filter((b: any) => b.tier === "bronze"),
  };

  return (
    <div className="badges-container animate-slide-in">
      <header className="page-header">
        <h1>My Badges</h1>
        <p>Showcase your GATE CS mastery. Earn badges by completing quizzes.</p>
      </header>

      <div className="tier-stats">
        <div className="tier-stat-card card">
          <div className="tier-icon tier-gold">🥇</div>
          <div className="tier-info">
            <h3>Gold</h3>
            <p className="tier-count">{tiers.gold.length}</p>
          </div>
        </div>
        <div className="tier-stat-card card">
          <div className="tier-icon tier-silver">🥈</div>
          <div className="tier-info">
            <h3>Silver</h3>
            <p className="tier-count">{tiers.silver.length}</p>
          </div>
        </div>
        <div className="tier-stat-card card">
          <div className="tier-icon tier-bronze">🥉</div>
          <div className="tier-info">
            <h3>Bronze</h3>
            <p className="tier-count">{tiers.bronze.length}</p>
          </div>
        </div>
      </div>

      <div className="badges-grid">
        {badges.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">🎖️</div>
            <h3>No Badges Yet</h3>
            <p>Go play some modules and ace the quizzes to earn your first badge!</p>
          </div>
        ) : (
          badges.map((badge: any) => (
            <div key={badge.id} className="badge-card card">
              <div className={"badge-large tier-" + badge.tier}>
                🏅
              </div>
              <div className="badge-details">
                <span className="badge-tier">{badge.tier.toUpperCase()} BADGE</span>
                <h3>{badge.subtopic.name}</h3>
                <p className="badge-subject">{badge.subtopic.subject.name}</p>
                <div className="badge-date">
                  Earned {new Date(badge.earnedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      
    </div>
  );
}
