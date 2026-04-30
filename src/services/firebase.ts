import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, signInAnonymously } from 'firebase/auth';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, limit, getDocs, initializeFirestore, where } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, QuestCompletion } from '../types';

// TODO: Replace with actual Firebase config from your project console
const firebaseConfig = {
  apiKey: "AIzaSyAyEFfiYvgogcqv88-QcLLkx1qriNxpxN0",
  authDomain: "fire-tp8-5cef2.firebaseapp.com",
  projectId: "fire-tp8-5cef2",
  storageBucket: "fire-tp8-5cef2.firebasestorage.app",
  messagingSenderId: "89126745276",
  appId: "1:89126745276:web:fdbf578ba8f7a216898cb9",
  measurementId: "G-76T1QNRDK6"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (e) {
    return getAuth(app);
  }
})();

export const db = getFirestore(app);

// Zero-Budget Storage: We skip Firebase Storage to avoid the paywall/credit card requirement.
// We save small compressed Base64 strings directly in Firestore.

export const signInAndGetUid = async () => {
  const { user } = await signInAnonymously(auth);
  return user.uid;
};

export const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

export const createUserProfile = async (profile: UserProfile) => {
  await setDoc(doc(db, 'users', profile.uid), profile);
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  await setDoc(doc(db, 'users', uid), data, { merge: true });
};

export const recordQuestCompletion = async (completion: QuestCompletion) => {
  await addDoc(collection(db, 'questCompletions'), completion);
};

export const getTodayCompletions = async (uid: string): Promise<QuestCompletion[]> => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const q = query(
    collection(db, 'questCompletions'),
    where('userId', '==', uid)
  );
  
  const querySnapshot = await getDocs(q);
  const completions: QuestCompletion[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data() as QuestCompletion;
    if (data.createdAt >= startOfDay.getTime()) {
      completions.push(data);
    }
  });
  return completions;
};

export const fetchUserCompletions = async (uid: string): Promise<QuestCompletion[]> => {
  const q = query(
    collection(db, 'questCompletions'),
    where('userId', '==', uid)
  );
  const querySnapshot = await getDocs(q);
  const completions: QuestCompletion[] = [];
  querySnapshot.forEach((doc) => {
    completions.push(doc.data() as QuestCompletion);
  });
  
  return completions.sort((a, b) => b.createdAt - a.createdAt);
};

export const getTopUsers = async (): Promise<UserProfile[]> => {
  const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(50));
  const querySnapshot = await getDocs(q);
  const users: UserProfile[] = [];
  querySnapshot.forEach((doc) => {
    users.push(doc.data() as UserProfile);
  });
  return users;
};
