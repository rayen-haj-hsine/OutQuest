const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

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

const mockCompletions = [
  {
    userId: "mock_user_1",
    questTitle: "The Council of Benches",
    difficulty: "Common",
    xpEarned: 65,
    proofTypes: ["written", "photo"],
    reportPreview: "Found a weathered bench near the old oak tree. It felt ancient.",
    reportFull: "Found a weathered bench near the old oak tree. It felt ancient, like it had seen centuries of whispers. I sat for 10 minutes in silence.",
    photoUrl: "https://images.unsplash.com/photo-1513694490325-c4d720afc9c7?q=80&w=800&auto=format&fit=crop",
    createdAt: Date.now() - 86400000 * 2
  },
  {
    userId: "mock_user_1",
    questTitle: "The Mythic Dawn",
    difficulty: "Mythic",
    xpEarned: 1050,
    proofTypes: ["photo"],
    reportPreview: "The sun rose over the mist, turning the city into gold.",
    reportFull: "The sun rose over the mist, turning the city into gold. I swear I saw the dragon of the East in the clouds.",
    photoUrl: "https://images.unsplash.com/photo-1470252649358-969409756702?q=80&w=800&auto=format&fit=crop",
    createdAt: Date.now() - 86400000
  },
  {
    userId: "mock_user_2",
    questTitle: "The Ancient Tome",
    difficulty: "Common",
    xpEarned: 85,
    proofTypes: ["photo", "written"],
    reportPreview: "Discovered a book on herbalism from the 18th century.",
    reportFull: "Discovered a book on herbalism from the 18th century in the hidden corner of the library. The knowledge within is priceless.",
    photoUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    createdAt: Date.now() - 86400000 * 3
  },
  {
    userId: "mock_user_3",
    questTitle: "Urban Relic Hunt",
    difficulty: "Rare",
    xpEarned: 125,
    proofTypes: ["photo"],
    reportPreview: "Found a faded neon sign of an old apothecary.",
    reportFull: "Found a faded neon sign of an old apothecary. It flickered as if trying to tell me a secret from the past.",
    photoUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
    createdAt: Date.now() - 86400000 * 5
  },
  {
    userId: "mock_user_4",
    questTitle: "The Ghostly Transit",
    difficulty: "Epic",
    xpEarned: 275,
    proofTypes: ["photo"],
    reportPreview: "Rode the last train to the end of the line.",
    reportFull: "Rode the last train to the end of the line. The carriage was empty, save for the echoes of commuters long gone.",
    photoUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=800&auto=format&fit=crop",
    createdAt: Date.now() - 86400000 * 4
  }
];

async function seed() {
  console.log("Seeding mock completions...");
  for (const comp of mockCompletions) {
    try {
      await addDoc(collection(db, 'questCompletions'), comp);
      console.log(`Added completion for ${comp.userId}: ${comp.questTitle}`);
    } catch (error) {
      console.error(`Error adding completion:`, error);
    }
  }
  console.log("Seeding complete!");
  process.exit(0);
}

seed();
