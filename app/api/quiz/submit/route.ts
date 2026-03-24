import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { XP_VALUES, getLevelFromXP } from "@/lib/xp";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subtopicId, gameType, gameScore, quizScore, maxScore, percentage, badge } = await req.json();

    // 1. Record the game session
    await prisma.gameSession.create({
      data: {
        userId,
        subtopicId,
        gameType,
        score: gameScore,
        maxScore: 100, // Normalized max score for games
        completed: true,
      },
    });

    // 2. Record the quiz result
    await prisma.quizResult.create({
      data: {
        userId,
        subtopicId,
        score: quizScore,
        maxScore,
        percentage,
      },
    });

    // 3. Award badge if applicable (only keep best badge per subtopic)
    if (badge) {
      const existingBadge = await prisma.badge.findUnique({
        where: {
          userId_subtopicId: {
            userId,
            subtopicId,
          },
        },
      });

      // Tier logic (gold > silver > bronze)
      const isUpgrade = (newTier: string, oldTier: string) => {
        const ranks = { gold: 3, silver: 2, bronze: 1 };
        return ranks[newTier as keyof typeof ranks] > ranks[oldTier as keyof typeof ranks];
      };

      if (!existingBadge) {
        await prisma.badge.create({
          data: {
            userId,
            subtopicId,
            tier: badge,
          },
        });
      } else if (isUpgrade(badge, existingBadge.tier)) {
        await prisma.badge.update({
          where: { id: existingBadge.id },
          data: { tier: badge },
        });
      }
    }

    // 4. Update the User Streak
    // Basic streak logic: 
    // If not played today, update lastActive and increment streak.
    // Actually, properly tracking date changes requires timezones, but for MVP we use basic NextJS server Date logic.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingStreak = await prisma.streak.findUnique({ where: { userId } });
    let finalStreakCount = 1;

    if (!existingStreak) {
      await prisma.streak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveAt: new Date(),
        },
      });
    } else {
      const lastActive = new Date(existingStreak.lastActiveAt);
      lastActive.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(today.getTime() - lastActive.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Active yesterday, increment streak
        const newStreak = existingStreak.currentStreak + 1;
        finalStreakCount = newStreak;
        await prisma.streak.update({
          where: { id: existingStreak.id },
          data: {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, existingStreak.longestStreak),
            lastActiveAt: new Date(),
          },
        });
      } else if (diffDays > 1) {
        // Missed a day, reset streak
        finalStreakCount = 1;
        await prisma.streak.update({
          where: { id: existingStreak.id },
          data: {
            currentStreak: 1,
            lastActiveAt: new Date(),
          },
        });
      } else {
        finalStreakCount = existingStreak.currentStreak;
      }
      // If diffDays === 0, they already played today, leave streak as is.
    }

    // 4b. Award XP
    let xpEarned = XP_VALUES.QUIZ_NO_BADGE;
    if (badge === 'gold') xpEarned = XP_VALUES.QUIZ_GOLD;
    else if (badge === 'silver') xpEarned = XP_VALUES.QUIZ_SILVER;
    else if (badge === 'bronze') xpEarned = XP_VALUES.QUIZ_BRONZE;

    // Add streak bonus
    if (finalStreakCount > 1) xpEarned += XP_VALUES.STREAK_BONUS;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true }
    });

    const previousLevel = currentUser ? getLevelFromXP(currentUser.xp) : 1;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: xpEarned } },
      select: { xp: true }
    });

    // Recalculate level
    const newLevel = getLevelFromXP(updatedUser.xp);
    if (newLevel !== (currentUser?.level || 1)) {
      await prisma.user.update({
        where: { id: userId },
        data: { level: newLevel }
      });
    }

    return NextResponse.json({ success: true, xpEarned, newLevel, previousLevel, streakCount: finalStreakCount });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
