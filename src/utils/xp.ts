export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

export const getNextLevelXp = (level: number): number => {
  return level * 100;
};
