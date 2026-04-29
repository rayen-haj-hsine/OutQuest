const BASE_XP = 100;
const MULTIPLIER = 1.5;

/**
 * Total XP required to REACH a specific level.
 * Level 1: 0 XP
 * Level 2: 100 XP
 * Level 3: 250 XP (100 + 150)
 * Level 4: 475 XP (100 + 150 + 225)
 */
export const getTotalXpForLevel = (level: number): number => {
  if (level <= 1) return 0;
  // Geometric series sum: a * (1 - r^n) / (1 - r)
  // where a = 100, r = 1.5, n = level - 1
  return Math.floor(BASE_XP * (Math.pow(MULTIPLIER, level - 1) - 1) / (MULTIPLIER - 1));
};

export const calculateLevel = (xp: number): number => {
  if (xp < BASE_XP) return 1;
  // Inverse of the sum formula:
  // xp = 100 * (1.5^(L-1) - 1) / 0.5
  // xp * 0.5 / 100 + 1 = 1.5^(L-1)
  const level = Math.log(xp * (MULTIPLIER - 1) / BASE_XP + 1) / Math.log(MULTIPLIER) + 1;
  return Math.floor(level);
};

export const getNextLevelXpThreshold = (currentLevel: number): number => {
  return getTotalXpForLevel(currentLevel + 1);
};

