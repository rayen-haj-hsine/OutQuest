import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, signInAnonymously } from 'firebase/auth';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, limit, getDocs, initializeFirestore } from 'firebase/firestore';
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

// Use standard getFirestore for now
export const db = getFirestore(app);

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

export const getTopUsers = async (): Promise<UserProfile[]> => {
  const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(50));
  const querySnapshot = await getDocs(q);
  const users: UserProfile[] = [];
  querySnapshot.forEach((doc) => {
    users.push(doc.data() as UserProfile);
  });
  return users;
};
