import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";

interface SubtopicWithBadge {
  id: string;
  name: string;
  order: number;
  badges: { tier: string }[];
}

export default async function SubjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const subject = await prisma.subject.findUnique({
    where: { slug },
    include: {
      subtopics: {
        orderBy: { order: "asc" },
        include: {
          badges: { where: { userId } },
        },
      },
    },
  });

  if (!subject) {
    notFound();
  }

  const subtopics = subject.subtopics as any as SubtopicWithBadge[];

  // Define available games for MVP
  const games = [
    { id: "flashcard", name: "Flashcard Flip", icon: "🎴", desc: "Memorize key concepts" },
    { id: "sort-steps", name: "Sort the Steps", icon: "🔄", desc: "Master algorithms" },
  ];

  return (
    <div className="subtopics-container animate-slide-in">
      <div className="breadcrumb">
        <Link href="/subjects" className="back-link">&larr; Back to Subjects</Link>
      </div>

      <header className="page-header">
        <h1>{subject.name}</h1>
        <p>{subject.description}</p>
      </header>

      <div className="subtopics-list">
        {subtopics.map((topic) => {
          const highestBadge = topic.badges.length > 0 
            ? [...topic.badges].sort((a, b) => {
                const ranks: Record<string, number> = { gold: 3, silver: 2, bronze: 1 };
                return ranks[b.tier] - ranks[a.tier];
              })[0] 
            : null;

          return (
            <div key={topic.id} className="subtopic-card card">
              <div className="topic-header">
                <div>
                  <h2>{topic.name}</h2>
                  <div className="topic-meta">Topic {topic.order}</div>
                </div>
                {highestBadge && (
                  <div className={`badge-icon tier-${highestBadge.tier}`} title={`${highestBadge.tier} Badge earned!`}>
                    🏅
                  </div>
                )}
              </div>

              <div className="games-grid">
                {games.map((game) => (
                  <Link 
                    href={`/play/${game.id}/${topic.id}`} 
                    key={game.id} 
                    className="game-btn"
                  >
                    <span className="game-icon">{game.icon}</span>
                    <div className="game-info">
                      <span className="game-name">{game.name}</span>
                      <span className="game-desc">{game.desc}</span>
                    </div>
                    <span className="play-arrow">Play &rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      
    </div>
  );
}
