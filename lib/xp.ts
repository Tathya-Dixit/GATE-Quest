// XP awarded per action
export const XP_VALUES = {
  QUIZ_BRONZE: 50,
  QUIZ_SILVER: 100,
  QUIZ_GOLD: 150,
  QUIZ_NO_BADGE: 20,      // completed quiz but score < 40%
  STREAK_BONUS: 10,       // extra XP if streak > 1
}

// Level thresholds — level N requires N * 100 XP cumulative
export function getLevelFromXP(xp: number): number {
  return Math.floor(xp / 100) + 1
}

export function getXPForNextLevel(level: number): number {
  return level * 100
}

export function getXPProgress(xp: number): { level: number; currentXP: number; nextLevelXP: number; percentage: number } {
  const level = getLevelFromXP(xp)
  const baseXP = (level - 1) * 100
  const currentXP = xp - baseXP
  const nextLevelXP = 100
  const percentage = Math.round((currentXP / nextLevelXP) * 100)
  return { level, currentXP, nextLevelXP, percentage }
}
