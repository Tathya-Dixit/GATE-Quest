import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getSubjectMeta } from "@/lib/subjectMeta";

export default async function SubjectsPage() {
  const session = await auth();
  
  if (!session?.user?.id) return null;

  const subjects = await prisma.subject.findMany({
    include: {
      _count: { select: { subtopics: true } },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="subjects-container animate-slide-in">
      <header className="page-header">
        <h1>GATE CS Subjects</h1>
        <p>Select a subject to start playing mini-games and earning badges.</p>
      </header>

      <div className="subjects-grid">
        {subjects.map((subject) => {
          const meta = getSubjectMeta(subject.slug);
          return (
          <Link href={`/subjects/${subject.slug}`} key={subject.id} className="subject-card card" style={{ borderTop: `3px solid ${meta.color}` }}>
            <div className="card-header">
              <div className="subject-icon" style={{ color: meta.color }}>{meta.icon}</div>
              <div className="topic-count">{subject._count.subtopics} topics</div>
            </div>
            
            <div className="card-body">
              <h2>{subject.name}</h2>
              <p>{subject.description}</p>
            </div>
            
            <div className="card-footer">
              <span className="action-text">Explore &rarr;</span>
            </div>
          </Link>
          );
        })}
      </div>

      
    </div>
  );
}
