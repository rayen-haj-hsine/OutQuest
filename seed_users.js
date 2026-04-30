const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAyEFfiYvgogcqv88-QcLLkx1qriNxpxN0",
  authDomain: "fire-tp8-5cef2.firebaseapp.com",
  projectId: "fire-tp8-5cef2",
  storageBucket: "fire-tp8-5cef2.firebasestorage.app",
  messagingSenderId: "89126745276",
  appId: "1:89126745276:web:fdbf578ba8f7a216898cb9",
  measurementId: "G-76T1QNRDK6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mockUsers = [
  {
    uid: "mock_user_1",
    username: "Arthur Pendragon",
    avatarPreset: "👑",
    xp: 5000,
    level: 51,
    title: "High King",
    completedQuestCount: 42,
    mythicQuestCount: 5,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    uid: "mock_user_2",
    username: "Merlin the Wise",
    avatarPreset: "🧙‍♂️",
    xp: 4200,
    level: 43,
    title: "Grand Archmage",
    completedQuestCount: 38,
    mythicQuestCount: 3,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    uid: "mock_user_3",
    username: "Guinevere",
    avatarPreset: "🧝‍♀️",
    xp: 2500,
    level: 26,
    title: "Eldritch Queen",
    completedQuestCount: 20,
    mythicQuestCount: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    uid: "mock_user_4",
    username: "Lancelot",
    avatarPreset: "⚔️",
    xp: 1800,
    level: 19,
    title: "First Knight",
    completedQuestCount: 15,
    mythicQuestCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    uid: "mock_user_5",
    username: "Galahad",
    avatarPreset: "🛡️",
    xp: 900,
    level: 10,
    title: "Holy Knight",
    completedQuestCount: 8,
    mythicQuestCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

async function seed() {
  console.log("Seeding mock users...");
  for (const user of mockUsers) {
    try {
      await setDoc(doc(db, 'users', user.uid), user);
      console.log(`Added ${user.username}`);
    } catch (error) {
      console.error(`Error adding ${user.username}:`, error);
    }
  }
  console.log("Seeding complete!");
  process.exit(0);
}

seed();
