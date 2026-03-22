import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GameWrapper } from "@/components/games/GameWrapper";
import FlashcardFlip from "@/components/games/FlashcardFlip";
import SortTheSteps from "@/components/games/SortTheSteps";
import { getGameData, getQuizData } from "@/lib/gameData";
import { auth } from "@/lib/auth";

export default async function PlayRoute({
  params,
}: {
  params: Promise<{ gameType: string; subtopicId: string }>;
}) {
  const { gameType, subtopicId } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const subtopic = await prisma.subtopic.findUnique({
    where: { id: subtopicId },
    include: { subject: true },
  });

  if (!subtopic) {
    notFound();
  }

  const gameData = getGameData(gameType, subtopicId);
  const quizData = getQuizData(subtopicId);

  if (!gameData || gameData.length === 0) {
    return (
      <div className="error-state">
        <h2>Game Content Not Found</h2>
        <p>There is no content available for this game type right now.</p>
      </div>
    );
  }

  return (
    <GameWrapper
      subtopic={subtopic}
      gameType={gameType}
      gameData={gameData}
      quizData={quizData}
      userId={userId}
    />
  );
}
