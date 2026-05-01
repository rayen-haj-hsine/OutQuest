import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, QuestCompletion } from '../types';

const SUPABASE_URL = 'https://wqywjfebjakxamuufzed.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_IdKwWZ64cPySPdsINopAbg_ZJUelxip';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Module-level UID cache — mirrors how Firebase's auth.currentUser works
let _currentUid: string | null = null;

export const auth = {
  get currentUser() {
    return _currentUid ? { uid: _currentUid } : null;
  },
};

// ─── Auth ──────────────────────────────────────────────────────────────────

export const signInAndGetUid = async (): Promise<string> => {
  // Restore existing session first
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    _currentUid = session.user.id;
    return session.user.id;
  }

  // Sign in anonymously (must be enabled in Supabase dashboard)
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  _currentUid = data.user!.id;
  return _currentUid;
};

// ─── User Profiles ─────────────────────────────────────────────────────────

const mapUser = (row: any): UserProfile => ({
  uid: row.uid,
  username: row.username,
  avatarPreset: row.avatar_preset,
  xp: row.xp,
  level: row.level,
  title: row.title,
  completedQuestCount: row.completed_quest_count,
  mythicQuestCount: row.mythic_quest_count,
  isTester: row.is_tester,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toDbUser = (profile: UserProfile) => ({
  uid: profile.uid,
  username: profile.username,
  avatar_preset: profile.avatarPreset,
  xp: profile.xp,
  level: profile.level,
  title: profile.title,
  completed_quest_count: profile.completedQuestCount,
  mythic_quest_count: profile.mythicQuestCount,
  is_tester: profile.isTester ?? false,
  created_at: profile.createdAt,
  updated_at: profile.updatedAt,
});

export const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('uid', uid)
    .single();

  if (error || !data) return null;
  return mapUser(data);
};

export const createUserProfile = async (profile: UserProfile) => {
  const { error } = await supabase.from('users').insert(toDbUser(profile));
  if (error) throw error;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const dbData: any = {};
  if (data.username !== undefined) dbData.username = data.username;
  if (data.avatarPreset !== undefined) dbData.avatar_preset = data.avatarPreset;
  if (data.xp !== undefined) dbData.xp = data.xp;
  if (data.level !== undefined) dbData.level = data.level;
  if (data.title !== undefined) dbData.title = data.title;
  if (data.completedQuestCount !== undefined) dbData.completed_quest_count = data.completedQuestCount;
  if (data.mythicQuestCount !== undefined) dbData.mythic_quest_count = data.mythicQuestCount;
  if (data.isTester !== undefined) dbData.is_tester = data.isTester;
  if (data.updatedAt !== undefined) dbData.updated_at = data.updatedAt;

  const { error } = await supabase.from('users').update(dbData).eq('uid', uid);
  if (error) throw error;
};

// ─── Quest Completions ─────────────────────────────────────────────────────

const mapCompletion = (row: any): QuestCompletion => ({
  id: row.id,
  userId: row.user_id,
  questId: row.quest_id,
  questTitle: row.quest_title,
  difficulty: row.difficulty,
  xpEarned: row.xp_earned,
  proofTypes: row.proof_types || [],
  reportPreview: row.report_preview || '',
  reportFull: row.report_full,
  photoUrl: row.photo_url,
  createdAt: row.created_at,
});

export const recordQuestCompletion = async (completion: QuestCompletion) => {
  const { error } = await supabase.from('quest_completions').insert({
    user_id: completion.userId,
    quest_id: completion.questId,
    quest_title: completion.questTitle,
    difficulty: completion.difficulty,
    xp_earned: completion.xpEarned,
    proof_types: completion.proofTypes,
    report_preview: completion.reportPreview,
    report_full: completion.reportFull || null,
    photo_url: completion.photoUrl || null,
    created_at: completion.createdAt,
  });
  if (error) throw error;
};

export const getTodayCompletions = async (uid: string): Promise<QuestCompletion[]> => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('quest_completions')
    .select('*')
    .eq('user_id', uid)
    .gte('created_at', startOfDay.getTime());

  if (error || !data) return [];
  return data.map(mapCompletion);
};

export const fetchUserCompletions = async (uid: string): Promise<QuestCompletion[]> => {
  const { data, error } = await supabase
    .from('quest_completions')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapCompletion);
};

export const getTopUsers = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('xp', { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data.map(mapUser);
};

// ─── Image Upload (Real Supabase Storage — no Base64 hack) ─────────────────

export const uploadImage = async (uri: string, path: string): Promise<string> => {
  const blob: any = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () { resolve(xhr.response); };
    xhr.onerror = function () { reject(new TypeError('Network request failed')); };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const { error } = await supabase.storage
    .from('quest-proofs')
    .upload(path, blob, { contentType: 'image/jpeg', upsert: true });

  blob.close();
  if (error) throw error;

  const { data } = supabase.storage.from('quest-proofs').getPublicUrl(path);
  return data.publicUrl;
};
