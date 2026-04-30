export type Difficulty = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface Quest {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  proofRequired: string;
  baseXp: number;
  bonusXpRules?: string;
  category: string;
  titleReward?: string;
  safetyNotes?: string;
}

export interface UserProfile {
  uid: string;
  username: string;
  avatarPreset: string;
  xp: number;
  level: number;
  title: string;
  completedQuestCount: number;
  mythicQuestCount: number;
  isTester?: boolean;
  createdAt: number;

  updatedAt: number;
}

export interface QuestCompletion {
  id?: string;
  userId: string;
  questId: string;
  questTitle: string;
  difficulty: Difficulty;
  xpEarned: number;
  proofTypes: string[];
  reportPreview: string; // max 200 chars
  reportFull?: string;
  photoUrl?: string;
  createdAt: number;
}
