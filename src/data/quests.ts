import { Quest } from '../types';

export const STARTER_QUESTS: Quest[] = [
  {
    id: "q_1",
    title: "The Council of Benches",
    difficulty: "Common",
    estimatedTime: "15 min",
    description: "Find a park bench that looks like it has a story to tell. Sit on it for 5 minutes without looking at your phone.",
    proofRequired: "Photo of the bench from a respectful distance.",
    baseXp: 50,
    category: "Exploration",
    safetyNotes: "Stay in well-lit public parks."
  },
  {
    id: "q_2",
    title: "The Forgotten Merchant",
    difficulty: "Common",
    estimatedTime: "20 min",
    description: "Visit a small local shop you have walked past but never entered. Browse for 5 minutes.",
    proofRequired: "Photo of the storefront.",
    baseXp: 50,
    bonusXpRules: "+15 XP for photo proof",
    category: "Urban",
    safetyNotes: "Be polite, no need to buy anything if you don't want to."
  },
  {
    id: "q_3",
    title: "Urban Relic Hunt",
    difficulty: "Rare",
    estimatedTime: "45 min",
    description: "Locate a piece of obsolete technology in public (e.g., a payphone, old mail chute, or faded neon sign).",
    proofRequired: "Photo of the relic.",
    baseXp: 100,
    category: "Discovery"
  },
  {
    id: "q_4",
    title: "The 10-Photo Evidence Run",
    difficulty: "Rare",
    estimatedTime: "1 hr",
    description: "Take 10 photos of objects of a specific color around your neighborhood.",
    proofRequired: "Written report of the chosen color and the most interesting object.",
    baseXp: 120,
    bonusXpRules: "+10 XP for written report",
    category: "Challenge"
  },
  {
    id: "q_5",
    title: "The NPC Interview",
    difficulty: "Epic",
    estimatedTime: "2 hrs",
    description: "Strike up a brief, polite conversation with a local service worker (barista, librarian) when they are not busy. Ask them how their day is going.",
    proofRequired: "Written summary of the interaction.",
    baseXp: 200,
    category: "Social",
    safetyNotes: "Respect their time and boundaries. Do not film them."
  },
  {
    id: "q_6",
    title: "The Fake Documentary",
    difficulty: "Epic",
    estimatedTime: "2 hrs",
    description: "Walk around a neighborhood you don't usually visit and narrate its 'history' in your head as if you are a documentarian.",
    proofRequired: "Write a 3-sentence excerpt of your documentary script.",
    baseXp: 250,
    category: "Creative"
  },
  {
    id: "q_7",
    title: "The Reverse Heist",
    difficulty: "Rare",
    estimatedTime: "1 hr",
    description: "Leave a tiny, harmless, positive note in a public space (like inside a library book or on a bulletin board).",
    proofRequired: "Photo of the note before you leave it.",
    baseXp: 150,
    category: "Wholesome"
  },
  {
    id: "q_8",
    title: "The Local Legend Speedrun",
    difficulty: "Rare",
    estimatedTime: "1.5 hrs",
    description: "Visit 3 different statues, monuments, or historical plaques in your town.",
    proofRequired: "Photo of one of the monuments.",
    baseXp: 150,
    category: "Exploration"
  },
  {
    id: "q_9",
    title: "The Public Side Quest Board",
    difficulty: "Common",
    estimatedTime: "30 min",
    description: "Find a public bulletin board (at a cafe or community center) and read at least 5 flyers.",
    proofRequired: "Photo of the most interesting flyer.",
    baseXp: 60,
    category: "Discovery"
  },
  {
    id: "q_10",
    title: "The Lost Artifact",
    difficulty: "Legendary",
    estimatedTime: "3 hrs",
    description: "With a friend, use a physical map or printed directions (no GPS allowed) to find a specific local landmark.",
    proofRequired: "Photo of you and your friend at the location.",
    baseXp: 400,
    bonusXpRules: "+20 XP for friend witness",
    category: "Challenge",
    titleReward: "Wayfinder"
  },
  {
    id: "q_11",
    title: "The Mythic Dawn",
    difficulty: "Mythic",
    estimatedTime: "Variable",
    description: "Wake up before sunrise. Walk to a safe vantage point and watch the sun come up over your city.",
    proofRequired: "Photo of the sunrise.",
    baseXp: 1000,
    bonusXpRules: "+25 XP for Mythic completion",
    category: "Epic",
    titleReward: "Dawnbreaker",
    safetyNotes: "Ensure the area is safe to visit in the early morning."
  },
  {
    id: "q_12",
    title: "The Stray Familiar",
    difficulty: "Common",
    estimatedTime: "30 min",
    description: "Spot a local neighborhood cat or dog. Admire them from a distance.",
    proofRequired: "A written description of the animal.",
    baseXp: 50,
    category: "Observation"
  },
  {
    id: "q_13",
    title: "The Ancient Tome",
    difficulty: "Common",
    estimatedTime: "30 min",
    description: "Go to a local library and find a book on a subject you know nothing about. Read the first page.",
    proofRequired: "Photo of the book cover.",
    baseXp: 70,
    category: "Knowledge"
  },
  {
    id: "q_14",
    title: "The Alchemist's Brew",
    difficulty: "Common",
    estimatedTime: "20 min",
    description: "Order a drink you have never tried before from a local cafe.",
    proofRequired: "Photo of the drink.",
    baseXp: 60,
    category: "Culinary"
  },
  {
    id: "q_15",
    title: "The Shadow Walk",
    difficulty: "Rare",
    estimatedTime: "45 min",
    description: "Take a walk at dusk. Focus entirely on the sounds of the evening.",
    proofRequired: "Written report of 3 distinct sounds you heard.",
    baseXp: 110,
    category: "Mindfulness",
    safetyNotes: "Stay in well-lit, familiar areas."
  },
  {
    id: "q_16",
    title: "The Guild Meeting",
    difficulty: "Legendary",
    estimatedTime: "2 hrs",
    description: "Attend a local free public event, meetup, or gallery opening.",
    proofRequired: "Photo of the event space.",
    baseXp: 350,
    category: "Social"
  },
  {
    id: "q_17",
    title: "The Hidden Oasis",
    difficulty: "Epic",
    estimatedTime: "1.5 hrs",
    description: "Find a quiet, green space in the middle of a busy urban area.",
    proofRequired: "Photo of the oasis.",
    baseXp: 220,
    category: "Exploration"
  },
  {
    id: "q_18",
    title: "The Oracle's Message",
    difficulty: "Common",
    estimatedTime: "15 min",
    description: "Find an interesting piece of street art or graffiti. Interpret what it means to you.",
    proofRequired: "Written report of your interpretation.",
    baseXp: 50,
    category: "Art"
  },
  {
    id: "q_19",
    title: "The Courier's Route",
    difficulty: "Rare",
    estimatedTime: "1 hr",
    description: "Take a completely new route to a familiar destination.",
    proofRequired: "Written report of something new you noticed.",
    baseXp: 130,
    category: "Exploration"
  },
  {
    id: "q_20",
    title: "The Silent Watcher",
    difficulty: "Epic",
    estimatedTime: "1.5 hrs",
    description: "People-watch in a busy area for 20 minutes. Invent a backstory for one stranger.",
    proofRequired: "Written backstory.",
    baseXp: 200,
    category: "Creative",
    safetyNotes: "Be discreet and respectful. Do not stare or make anyone uncomfortable."
  },
  {
    id: "q_21",
    title: "The Bard's Performance",
    difficulty: "Rare",
    estimatedTime: "45 min",
    description: "Listen to a street musician or public performer for at least 3 songs.",
    proofRequired: "Photo of the performance (if permitted).",
    baseXp: 140,
    category: "Cultural"
  },
  {
    id: "q_22",
    title: "The Time Capsule",
    difficulty: "Legendary",
    estimatedTime: "2.5 hrs",
    description: "Find a building that has been repurposed (e.g., a bank turned into a restaurant). Research its original purpose.",
    proofRequired: "Written report of the building's history.",
    baseXp: 300,
    category: "History"
  },
  {
    id: "q_23",
    title: "The Forager's Bounty",
    difficulty: "Rare",
    estimatedTime: "1 hr",
    description: "Identify 3 different species of wild plants or trees in your neighborhood.",
    proofRequired: "Photos of the 3 plants.",
    baseXp: 150,
    category: "Nature"
  },
  {
    id: "q_24",
    title: "The Spectral Train",
    difficulty: "Epic",
    estimatedTime: "2 hrs",
    description: "Ride a public transit line from end to end just for the experience.",
    proofRequired: "Photo of the transit ticket or view from the window.",
    baseXp: 250,
    category: "Journey"
  },
  {
    id: "q_25",
    title: "The Hero's Feast",
    difficulty: "Legendary",
    estimatedTime: "3 hrs",
    description: "Cook a meal using an ingredient you bought from a local market you've never been to before.",
    proofRequired: "Photo of the finished meal.",
    baseXp: 400,
    category: "Culinary"
  }
];
