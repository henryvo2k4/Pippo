export type GradeTier = 1 | 2 | 3 | 4;

export type AvatarBaseId = 'boy' | 'girl' | 'bear' | 'rabbit' | 'dino' | 'cat' | 'knight' | 'wizard';

export interface LearningItem {
  id: string;
  word: string;
  phonetic: string;
  vietnamese: string;
  emoji: string;
  color: string;
  shape3d: 'sphere' | 'box' | 'torus' | 'cone' | 'cylinder' | 'octahedron' | 'star';
  glbModelUrl?: string;
  exampleSentence: string;
  exampleTranslation: string;
  grammarOrPhonicsNote: string;
  quizQuestion: string;
  quizOptions: string[];
  quizAnswer: string;
  sentenceTokens: string[];
  stickerRewardId: string;
}

export interface IslandZoneMeta {
  zoneIndex: number; // 1 to 8
  title: string;
  vietnameseTitle: string;
  islandRange: [number, number]; // e.g., [1, 10]
  emoji: string;
  themeColor: string;
  islandColor: string;
  landmarkGlb: string;
}

export type IslandExerciseType =
  | 'discover_bubble'
  | 'monster_feed'
  | 'sentence_gear'
  | 'detective_quiz'
  | 'voice_bridge'
  | 'boss_challenge';

export interface IslandLesson {
  id: string;
  tier: GradeTier;
  zoneIndex: number; // 1..8
  islandNumber: number; // 1..80 within each tier!
  difficulty: 1 | 2 | 3 | 4; // 1: Easy, 2: Medium, 3: Hard, 4: Boss Island
  isBossIsland: boolean;
  title: string;
  subtitle: string;
  badgeEmoji: string;
  themeColor: string;
  islandColor: string;
  islandGlbUrl: string;
  landmarkGlb?: string;
  exerciseType: IslandExerciseType;
  exerciseLabel: string;
  position3D: [number, number, number];
  recommendedGames: string[];
  items: LearningItem[];
}

export interface KingdomInfo {
  tier: GradeTier;
  name: string;
  vietnameseName: string;
  ageRange: string;
  standard: string;
  description: string;
  emoji: string;
  gradient: string;
  skyColor: string;
  totalIslands: number;
}

export const KINGDOMS: KingdomInfo[] = [
  {
    tier: 1,
    name: 'Sprout Kingdom',
    vietnameseName: 'Vương Quốc Mầm Xanh (Mầm Non)',
    ageRange: '4 – 6 Tuổi (Mẫu Giáo)',
    standard: '80 Đảo • Pre-Starters & Phonics A–Z',
    description: 'Lộ trình 80 Đảo tăng dần độ khó: Từ vựng con vật, trái cây, màu sắc, cơ thể đến 26 âm Phonics & ghép từ CVC.',
    emoji: '🌱',
    gradient: 'from-emerald-400 to-teal-600',
    skyColor: '#0284c7',
    totalIslands: 80,
  },
  {
    tier: 2,
    name: 'Explorer Kingdom',
    vietnameseName: 'Đảo Thám Hiểm (Lớp 1 – Lớp 3)',
    ageRange: '6 – 8 Tuổi (Lớp 1, 2, 3)',
    standard: '80 Đảo • Cambridge Starters & SGK 1–3',
    description: 'Lộ trình 80 Đảo: Đồ dùng học tập, Động từ hành động, Gia đình, Thời tiết, Địa điểm & Mẫu câu giao tiếp.',
    emoji: '🏝️',
    gradient: 'from-sky-400 to-blue-600',
    skyColor: '#1d4ed8',
    totalIslands: 80,
  },
  {
    tier: 3,
    name: 'Adventurer Kingdom',
    vietnameseName: 'Lâu Đài Hiệp Sĩ (Lớp 4 – Lớp 5)',
    ageRange: '9 – 10 Tuổi (Lớp 4, 5)',
    standard: '80 Đảo • Cambridge Movers & Flyers',
    description: 'Lộ trình 80 Đảo: Nghề nghiệp, Quá khứ đơn, So sánh hơn/nhất, Sức khỏe, Chỉ đường & Đọc hiểu Thám tử.',
    emoji: '🏰',
    gradient: 'from-purple-500 to-indigo-700',
    skyColor: '#4338ca',
    totalIslands: 80,
  },
  {
    tier: 4,
    name: 'Master Galaxy',
    vietnameseName: 'Hành Tinh Tri Thức (Lớp 6 – Lớp 7)',
    ageRange: '11 – 13 Tuổi (Lớp 6, 7)',
    standard: '80 Đảo • KET (A2) & Global Success 6–7',
    description: 'Lộ trình 80 Đảo: Môi trường, Năng lượng tái tạo, AI & Vũ trụ, Phrasal Verbs, Hiện tại hoàn thành & Câu điều kiện.',
    emoji: '🪐',
    gradient: 'from-fuchsia-500 to-rose-600',
    skyColor: '#2e1065',
    totalIslands: 80,
  },
];

// ============================================================================
// ĐỊNH NGHĨA 8 VÙNG ĐẤT (ZONES) × 10 ĐẢO = 80 ĐẢO CHO MỖI CẤP ĐỘ (TỔNG 320 ĐẢO!)
// ============================================================================
export const KINGDOM_ZONES: Record<GradeTier, IslandZoneMeta[]> = {
  1: [
    { zoneIndex: 1, title: 'Happy Farm & Pets', vietnameseTitle: 'Vùng 1: Nông Trại & Thú Cưng (Đảo 1–10)', islandRange: [1, 10], emoji: '🐮', themeColor: '#22c55e', islandColor: '#4ade80', landmarkGlb: '/models/Cottage.glb' },
    { zoneIndex: 2, title: 'Sweet Rainbow Fruits', vietnameseTitle: 'Vùng 2: Vườn Quả Ngọt Ngào (Đảo 11–20)', islandRange: [11, 20], emoji: '🍓', themeColor: '#f43f5e', islandColor: '#fb7185', landmarkGlb: '/models/VillageTree.glb' },
    { zoneIndex: 3, title: 'Colors & Magic Shapes', vietnameseTitle: 'Vùng 3: Màu Sắc & Hình Khối (Đảo 21–30)', islandRange: [21, 30], emoji: '🎨', themeColor: '#f59e0b', islandColor: '#fbbf24', landmarkGlb: '/models/SawMill.glb' },
    { zoneIndex: 4, title: 'My Body & Feelings', vietnameseTitle: 'Vùng 4: Cơ Thể & Cảm Xúc (Đảo 31–40)', islandRange: [31, 40], emoji: '😊', themeColor: '#ec4899', islandColor: '#f472b6', landmarkGlb: '/models/Heart.glb' },
    { zoneIndex: 5, title: 'Cozy Family & Toys', vietnameseTitle: 'Vùng 5: Gia Đình & Đồ Chơi (Đảo 41–50)', islandRange: [41, 50], emoji: '🧸', themeColor: '#3b82f6', islandColor: '#60a5fa', landmarkGlb: '/models/Cottage.glb' },
    { zoneIndex: 6, title: 'Phonics Forest A–M', vietnameseTitle: 'Vùng 6: Rừng Đánh Vần A–M (Đảo 51–60)', islandRange: [51, 60], emoji: '🔤', themeColor: '#10b981', islandColor: '#34d399', landmarkGlb: '/models/VillageTree.glb' },
    { zoneIndex: 7, title: 'Phonics Ocean N–Z', vietnameseTitle: 'Vùng 7: Biển Đánh Vần N–Z (Đảo 61–70)', islandRange: [61, 70], emoji: '🐳', themeColor: '#0ea5e9', islandColor: '#38bdf8', landmarkGlb: '/models/Duck.glb' },
    { zoneIndex: 8, title: 'Numbers 1–20 & CVC Boss', vietnameseTitle: 'Vùng 8: Số Đếm & Ghép Âm CVC (Đảo 71–80)', islandRange: [71, 80], emoji: '👑', themeColor: '#8b5cf6', islandColor: '#a78bfa', landmarkGlb: '/models/InnCastle.glb' },
  ],
  2: [
    { zoneIndex: 1, title: 'Super School Academy', vietnameseTitle: 'Vùng 1: Học Viện Trường Học (Đảo 1–10)', islandRange: [1, 10], emoji: '🎒', themeColor: '#3b82f6', islandColor: '#60a5fa', landmarkGlb: '/models/InnCastle.glb' },
    { zoneIndex: 2, title: 'Action Heroes (Can/Can’t)', vietnameseTitle: 'Vùng 2: Siêu Nhí Hành Động (Đảo 11–20)', islandRange: [11, 20], emoji: '🎸', themeColor: '#06b6d4', islandColor: '#22d3ee', landmarkGlb: '/models/Plane.glb' },
    { zoneIndex: 3, title: 'Cozy Rooms & Prepositions', vietnameseTitle: 'Vùng 3: Ngôi Nhà & Giới Từ Vị Trí (Đảo 21–30)', islandRange: [21, 30], emoji: '🏡', themeColor: '#10b981', islandColor: '#34d399', landmarkGlb: '/models/Cottage.glb' },
    { zoneIndex: 4, title: 'Fashion & Four Seasons', vietnameseTitle: 'Vùng 4: Trang Phục & Bốn Mùa (Đảo 31–40)', islandRange: [31, 40], emoji: '🧥', themeColor: '#f43f5e', islandColor: '#fb7185', landmarkGlb: '/models/Snowman.glb' },
    { zoneIndex: 5, title: 'Daily Routines & Clock', vietnameseTitle: 'Vùng 5: Thói Quen Hàng Ngày (Đảo 41–50)', islandRange: [41, 50], emoji: '⏰', themeColor: '#f59e0b', islandColor: '#fbbf24', landmarkGlb: '/models/SawMill.glb' },
    { zoneIndex: 6, title: 'Busy Town & Vehicles', vietnameseTitle: 'Vùng 6: Thành Phố & Giao Thông (Đảo 51–60)', islandRange: [51, 60], emoji: '🚗', themeColor: '#6366f1', islandColor: '#818cf8', landmarkGlb: '/models/Car.glb' },
    { zoneIndex: 7, title: 'Wild Safari & Deep Sea', vietnameseTitle: 'Vùng 7: Rừng Xanh & Đại Dương (Đảo 61–70)', islandRange: [61, 70], emoji: '🐬', themeColor: '#0ea5e9', islandColor: '#38bdf8', landmarkGlb: '/models/Fox.glb' },
    { zoneIndex: 8, title: 'Cambridge Starters Arena', vietnameseTitle: 'Vùng 8: Đấu Trường Starters (Đảo 71–80)', islandRange: [71, 80], emoji: '🏆', themeColor: '#9333ea', islandColor: '#a855f7', landmarkGlb: '/models/InnCastle.glb' },
  ],
  3: [
    { zoneIndex: 1, title: 'Dream Jobs & Careers', vietnameseTitle: 'Vùng 1: Nghề Nghiệp Tương Lai (Đảo 1–10)', islandRange: [1, 10], emoji: '👩‍🚀', themeColor: '#8b5cf6', islandColor: '#a855f7', landmarkGlb: '/models/Astronaut.glb' },
    { zoneIndex: 2, title: 'Time-Machine Past Simple', vietnameseTitle: 'Vùng 2: Cỗ Máy Thì Quá Khứ (Đảo 11–20)', islandRange: [11, 20], emoji: '⏳', themeColor: '#ec4899', islandColor: '#f472b6', landmarkGlb: '/models/InnCastle.glb' },
    { zoneIndex: 3, title: 'Nature & Superlatives', vietnameseTitle: 'Vùng 3: Kỳ Quan & So Sánh (Đảo 21–30)', islandRange: [21, 30], emoji: '🌋', themeColor: '#14b8a6', islandColor: '#2dd4bf', landmarkGlb: '/models/VillageTree.glb' },
    { zoneIndex: 4, title: 'Healthy Life & Hospital', vietnameseTitle: 'Vùng 4: Sức Khỏe & Lời Khuyên (Đảo 31–40)', islandRange: [31, 40], emoji: '🩺', themeColor: '#ef4444', islandColor: '#f87171', landmarkGlb: '/models/Heart.glb' },
    { zoneIndex: 5, title: 'Mystery Town Detective', vietnameseTitle: 'Vùng 5: Thám Tử Chỉ Đường (Đảo 41–50)', islandRange: [41, 50], emoji: '🕵️', themeColor: '#f59e0b', islandColor: '#fbbf24', landmarkGlb: '/models/SawMill.glb' },
    { zoneIndex: 6, title: 'World Festivals & Food', vietnameseTitle: 'Vùng 6: Lễ Hội Thế Giới (Đảo 51–60)', islandRange: [51, 60], emoji: '🎉', themeColor: '#06b6d4', islandColor: '#22d3ee', landmarkGlb: '/models/Cottage.glb' },
    { zoneIndex: 7, title: 'Space & Future Plans', vietnameseTitle: 'Vùng 7: Khám Phá Không Gian (Đảo 61–70)', islandRange: [61, 70], emoji: '🚀', themeColor: '#3b82f6', islandColor: '#60a5fa', landmarkGlb: '/models/Plane.glb' },
    { zoneIndex: 8, title: 'Movers & Flyers Grand Boss', vietnameseTitle: 'Vùng 8: Đỉnh Cao Tiểu Học (Đảo 71–80)', islandRange: [71, 80], emoji: '🐉', themeColor: '#7e22ce', islandColor: '#9333ea', landmarkGlb: '/models/InnCastle.glb' },
  ],
  4: [
    { zoneIndex: 1, title: 'Green Planet & Eco-Warriors', vietnameseTitle: 'Vùng 1: Hành Tinh Xanh & Điều Kiện Loại 1 (Đảo 1–10)', islandRange: [1, 10], emoji: '🌍', themeColor: '#10b981', islandColor: '#34d399', landmarkGlb: '/models/VillageTree.glb' },
    { zoneIndex: 2, title: 'Future Smart City & AI', vietnameseTitle: 'Vùng 2: Thành Phố AI & Tương Lai (Đảo 11–20)', islandRange: [11, 20], emoji: '🤖', themeColor: '#6366f1', islandColor: '#818cf8', landmarkGlb: '/models/RobotExpressive.glb' },
    { zoneIndex: 3, title: 'Alchemy Lab: Phrasal Verbs', vietnameseTitle: 'Vùng 3: Phòng Thí Nghiệm Cụm Động Từ (Đảo 21–30)', islandRange: [21, 30], emoji: '🧪', themeColor: '#d946ef', islandColor: '#e879f9', landmarkGlb: '/models/InnCastle.glb' },
    { zoneIndex: 4, title: 'Present Perfect Experiences', vietnameseTitle: 'Vùng 4: Hiện Tại Hoàn Thành & Trải Nghiệm (Đảo 31–40)', islandRange: [31, 40], emoji: '🧭', themeColor: '#f59e0b', islandColor: '#fbbf24', landmarkGlb: '/models/Plane.glb' },
    { zoneIndex: 5, title: 'Renewable Energy & Passive', vietnameseTitle: 'Vùng 5: Năng Lượng Sạch & Câu Bị Động (Đảo 41–50)', islandRange: [41, 50], emoji: '☀️', themeColor: '#0ea5e9', islandColor: '#38bdf8', landmarkGlb: '/models/SawMill.glb' },
    { zoneIndex: 6, title: 'Global Tourism & Wonders', vietnameseTitle: 'Vùng 6: Du Lịch & Kỳ Quan Thế Giới (Đảo 51–60)', islandRange: [51, 60], emoji: '🗽', themeColor: '#ec4899', islandColor: '#f472b6', landmarkGlb: '/models/Cottage.glb' },
    { zoneIndex: 7, title: 'Cinema, Music & Connectors', vietnameseTitle: 'Vùng 7: Điện Ảnh & Liên Từ Phức (Đảo 61–70)', islandRange: [61, 70], emoji: '🎬', themeColor: '#8b5cf6', islandColor: '#a78bfa', landmarkGlb: '/models/Car.glb' },
    { zoneIndex: 8, title: 'Cambridge KET (A2) Champion', vietnameseTitle: 'Vùng 8: Đấu Trường Cấp 2 KET A2 (Đảo 71–80)', islandRange: [71, 80], emoji: '👑', themeColor: '#e11d48', islandColor: '#f43f5e', landmarkGlb: '/models/InnCastle.glb' },
  ],
};

// Tọa độ S-Curve 3D cho 10 Đảo trong mỗi Vùng Đất để tạo Con Đường Đảo Bay Uốn Lượn
const ZONE_10_POSITIONS: [number, number, number][] = [
  [-6.2, 0.1, 1.8],
  [-4.6, 0.35, -0.8],
  [-3.1, 0.55, 1.5],
  [-1.6, 0.25, -1.1],
  [-0.1, 0.65, 1.2],
  [1.4, 0.35, -1.0],
  [2.9, 0.6, 1.4],
  [4.4, 0.3, -0.9],
  [5.8, 0.55, 1.2],
  [7.3, 0.85, -0.3], // Đảo số 10: Đảo Trùm (Boss Island) cao & nổi bật
];

// Kho Ngân Hàng Học Liệu Phong Phú Cho Từng Cấp Độ (Được phân bổ & nâng cấp độ khó qua 80 Đảo)
const TIER_VOCAB_BANKS: Record<GradeTier, LearningItem[]> = {
  1: [
    {
      id: 'k1-duck',
      word: 'Duck',
      phonetic: '/dʌk/',
      vietnamese: 'Con vịt vàng',
      emoji: '🦆',
      color: '#facc15',
      shape3d: 'sphere',
      glbModelUrl: '/models/Duck.glb',
      exampleSentence: 'A yellow duck can swim in the pond.',
      exampleTranslation: 'Chú vịt màu vàng biết bơi trong ao.',
      grammarOrPhonicsNote: 'Phonics: Âm đầu /d/ - Letter D (D - /d/ - Duck)',
      quizQuestion: 'Listen & Find: Which cute yellow bird says "Quack, quack"?',
      quizOptions: ['Duck', 'Horse', 'Apple', 'Robot'],
      quizAnswer: 'Duck',
      sentenceTokens: ['Yellow', 'duck', 'can', 'swim'],
      stickerRewardId: 'sticker_duck',
    },
    {
      id: 'k1-horse',
      word: 'Horse',
      phonetic: '/hɔːs/',
      vietnamese: 'Con ngựa phi nhanh',
      emoji: '🐴',
      color: '#d97706',
      shape3d: 'box',
      glbModelUrl: '/models/Horse.glb',
      exampleSentence: 'The brown horse runs very fast!',
      exampleTranslation: 'Chú ngựa nâu chạy rất nhanh!',
      grammarOrPhonicsNote: 'Phonics: Âm đầu /h/ - Letter H (H - /h/ - Horse)',
      quizQuestion: 'Which strong farm animal loves eating grass and galloping fast?',
      quizOptions: ['Horse', 'Duck', 'Fish', 'Bee'],
      quizAnswer: 'Horse',
      sentenceTokens: ['The', 'brown', 'horse', 'runs'],
      stickerRewardId: 'sticker_cow',
    },
    {
      id: 'k1-parrot',
      word: 'Parrot',
      phonetic: '/ˈpær.ət/',
      vietnamese: 'Chú vẹt sặc sỡ',
      emoji: '🦜',
      color: '#ef4444',
      shape3d: 'cone',
      glbModelUrl: '/models/Parrot.glb',
      exampleSentence: 'The colorful parrot can fly and talk!',
      exampleTranslation: 'Chú vẹt sặc sỡ biết bay và biết nói!',
      grammarOrPhonicsNote: 'Phonics: Âm đầu /p/ - Letter P (P - /p/ - Parrot)',
      quizQuestion: 'Which colorful bird can fly high and repeat your English words?',
      quizOptions: ['Parrot', 'Cow', 'Rabbit', 'Car'],
      quizAnswer: 'Parrot',
      sentenceTokens: ['Colorful', 'parrot', 'can', 'fly'],
      stickerRewardId: 'sticker_duck',
    },
    {
      id: 'k1-fox',
      word: 'Clever Fox',
      phonetic: '/ˈklev.ər fɒks/',
      vietnamese: 'Chú cáo thông minh',
      emoji: '🦊',
      color: '#f97316',
      shape3d: 'octahedron',
      glbModelUrl: '/models/Fox.glb',
      exampleSentence: 'The clever orange fox has a fluffy tail.',
      exampleTranslation: 'Chú cáo cam thông minh có cái đuôi bông xù.',
      grammarOrPhonicsNote: 'Phonics: Âm cuối /ks/ - Letter X (Fox, Box, Six)',
      quizQuestion: 'Which orange forest animal has a big fluffy tail and is very clever?',
      quizOptions: ['Clever Fox', 'Duck', 'Fish', 'Apple'],
      quizAnswer: 'Clever Fox',
      sentenceTokens: ['Look', 'at', 'the', 'clever', 'fox'],
      stickerRewardId: 'sticker_lion',
    },
    {
      id: 'k1-bee',
      word: 'Pink Flamingo',
      phonetic: '/pɪŋk fləˈmɪŋ.ɡəʊ/',
      vietnamese: 'Chim hồng hạc đáng yêu',
      emoji: '🦩',
      color: '#ec4899',
      shape3d: 'sphere',
      glbModelUrl: '/models/Flamingo.glb',
      exampleSentence: 'The pink flamingo flies across the blue sky.',
      exampleTranslation: 'Chú chim hồng hạc bay qua bầu trời xanh.',
      grammarOrPhonicsNote: 'Phonics: Âm đầu /fl/ - Flamingo, Fly, Flower',
      quizQuestion: 'Which lovely pink bird has long legs and beautiful wings?',
      quizOptions: ['Pink Flamingo', 'Horse', 'Train', 'Apple'],
      quizAnswer: 'Pink Flamingo',
      sentenceTokens: ['Pink', 'flamingo', 'can', 'fly', 'high'],
      stickerRewardId: 'sticker_rabbit',
    },
    {
      id: 'k1-apple',
      word: 'Apple',
      phonetic: '/ˈæp.əl/',
      vietnamese: 'Quả táo đỏ',
      emoji: '🍎',
      color: '#ef4444',
      shape3d: 'sphere',
      exampleSentence: 'I like yummy red apples!',
      exampleTranslation: 'Bé thích những quả táo đỏ ngon tuyệt!',
      grammarOrPhonicsNote: 'Phonics: Âm /æ/ - Letter A (A - /æ/ - Apple)',
      quizQuestion: 'Hungry Monster wants a round, crunchy RED fruit!',
      quizOptions: ['Apple', 'Banana', 'Fish', 'Milk'],
      quizAnswer: 'Apple',
      sentenceTokens: ['I', 'like', 'red', 'apples'],
      stickerRewardId: 'sticker_apple',
    },
    {
      id: 'k1-banana',
      word: 'Banana',
      phonetic: '/bəˈnæn.ə/',
      vietnamese: 'Quả chuối vàng',
      emoji: '🍌',
      color: '#fde047',
      shape3d: 'cylinder',
      exampleSentence: 'Monkeys love sweet yellow bananas.',
      exampleTranslation: 'Những chú khỉ rất mê chuối vàng ngọt.',
      grammarOrPhonicsNote: 'Phonics: Âm /b/ - Letter B (B - /b/ - Banana)',
      quizQuestion: 'Which long YELLOW fruit do little monkeys love to peel?',
      quizOptions: ['Banana', 'Apple', 'Watermelon', 'Orange'],
      quizAnswer: 'Banana',
      sentenceTokens: ['Eat', 'a', 'yellow', 'banana'],
      stickerRewardId: 'sticker_banana',
    },
    {
      id: 'k1-fish',
      word: 'Sea Gull',
      phonetic: '/ˈsiː.ɡʌl/',
      vietnamese: 'Chim hải âu biển',
      emoji: '🕊️',
      color: '#0ea5e9',
      shape3d: 'torus',
      glbModelUrl: '/models/Seagull.glb',
      exampleSentence: 'The white seagull flies over the blue ocean.',
      exampleTranslation: 'Chú chim hải âu trắng bay lượn trên biển xanh.',
      grammarOrPhonicsNote: 'Phonics: Âm /s/ - Sea, Sun, Star',
      quizQuestion: 'Which white bird loves flying over the ocean waves?',
      quizOptions: ['Sea Gull', 'Horse', 'Apple', 'Fox'],
      quizAnswer: 'Sea Gull',
      sentenceTokens: ['White', 'seagull', 'flies', 'over', 'sea'],
      stickerRewardId: 'sticker_dolphin',
    },
    {
      id: 'k1-heart',
      word: 'Happy Heart',
      phonetic: '/ˈhæp.i hɑːt/',
      vietnamese: 'Trái tim yêu thương',
      emoji: '❤️',
      color: '#f43f5e',
      shape3d: 'sphere',
      glbModelUrl: '/models/Heart.glb',
      exampleSentence: 'I love my family with a big happy heart!',
      exampleTranslation: 'Bé yêu gia đình với một trái tim thật lớn!',
      grammarOrPhonicsNote: 'Phonics: Âm /h/ - Happy, Heart, Hug',
      quizQuestion: 'Which red symbol means love and caring for your family?',
      quizOptions: ['Happy Heart', 'Banana', 'Horse', 'Duck'],
      quizAnswer: 'Happy Heart',
      sentenceTokens: ['I', 'have', 'a', 'happy', 'heart'],
      stickerRewardId: 'sticker_rainbow',
    },
    {
      id: 'k1-crown',
      word: 'Golden Crown',
      phonetic: '/ˈɡəʊl.dən kraʊn/',
      vietnamese: 'Vương miện vàng lấp lánh',
      emoji: '👑',
      color: '#facc15',
      shape3d: 'star',
      glbModelUrl: '/models/Crown3D.glb',
      exampleSentence: 'The little prince wears a shiny golden crown.',
      exampleTranslation: 'Hoàng tử nhỏ đội chiếc vương miện vàng lấp lánh.',
      grammarOrPhonicsNote: 'Phonics: Âm /k/ - Letter C (Crown, Cat, Cake)',
      quizQuestion: 'What shiny gold item does a king or queen wear on their head?',
      quizOptions: ['Golden Crown', 'Apple', 'Duck', 'Shoe'],
      quizAnswer: 'Golden Crown',
      sentenceTokens: ['Wear', 'a', 'shiny', 'gold', 'crown'],
      stickerRewardId: 'sticker_crown',
    },
  ],
  2: [
    {
      id: 'k2-robot',
      word: 'Smart Robot',
      phonetic: '/smɑːt ˈrəʊ.bɒt/',
      vietnamese: 'Người máy thông minh',
      emoji: '🤖',
      color: '#38bdf8',
      shape3d: 'box',
      glbModelUrl: '/models/RobotExpressive.glb',
      exampleSentence: 'I have got a smart robot that can dance and wave!',
      exampleTranslation: 'Mình có một chú robot thông minh biết nhảy múa và vẫy tay!',
      grammarOrPhonicsNote: 'Ngữ pháp Lớp 2–3: "I have got + a/an..." & "can + V"',
      quizQuestion: 'What cool toy has glowing eyes, metal arms, and can dance?',
      quizOptions: ['Smart Robot', 'Eraser', 'Notebook', 'Crayon'],
      quizAnswer: 'Smart Robot',
      sentenceTokens: ['My', 'smart', 'robot', 'can', 'dance'],
      stickerRewardId: 'sticker_robot',
    },
    {
      id: 'k2-plane',
      word: 'Airplane',
      phonetic: '/ˈeə.pleɪn/',
      vietnamese: 'Máy bay trên bầu trời',
      emoji: '✈️',
      color: '#ef4444',
      shape3d: 'cone',
      glbModelUrl: '/models/Plane.glb',
      exampleSentence: 'Look! The red airplane is flying above the white clouds.',
      exampleTranslation: 'Nhìn kìa! Chiếc máy bay màu đỏ đang bay phía trên những đám mây trắng.',
      grammarOrPhonicsNote: 'Thì Hiện tại tiếp diễn: S + am/is/are + V-ing (is flying).',
      quizQuestion: 'Which fast vehicle has two big wings and flies high in the sky?',
      quizOptions: ['Airplane', 'Submarine', 'Bicycle', 'Skateboard'],
      quizAnswer: 'Airplane',
      sentenceTokens: ['The', 'airplane', 'is', 'flying', 'high'],
      stickerRewardId: 'sticker_rocket',
    },
    {
      id: 'k2-car',
      word: 'Sports Car',
      phonetic: '/spɔːts kɑːr/',
      vietnamese: 'Ô tô thể thao',
      emoji: '🚗',
      color: '#3b82f6',
      shape3d: 'box',
      glbModelUrl: '/models/Car.glb',
      exampleSentence: 'My father drives a blue car to work every morning.',
      exampleTranslation: 'Bố mình lái chiếc ô tô màu xanh đi làm vào mỗi buổi sáng.',
      grammarOrPhonicsNote: 'Hiện tại đơn ngôi thứ 3 số ít: drive -> drives.',
      quizQuestion: 'What has four wheels, a steering wheel, and drives on the road?',
      quizOptions: ['Sports Car', 'Airplane', 'Dolphin', 'Snowman'],
      quizAnswer: 'Sports Car',
      sentenceTokens: ['He', 'drives', 'a', 'fast', 'blue', 'car'],
      stickerRewardId: 'sticker_ufo',
    },
    {
      id: 'k2-snowman',
      word: 'Winter Snowman',
      phonetic: '/ˈwɪn.tər ˈsnəʊ.mæn/',
      vietnamese: 'Người tuyết mùa đông',
      emoji: '⛄',
      color: '#f8fafc',
      shape3d: 'sphere',
      glbModelUrl: '/models/Snowman.glb',
      exampleSentence: 'In winter, it is cold and we build a happy snowman!',
      exampleTranslation: 'Vào mùa đông, trời lạnh và chúng mình đắp một người tuyết vui vẻ!',
      grammarOrPhonicsNote: 'Từ vựng Thời tiết & 4 Mùa: Sunny, Rainy, Snowy, Windy.',
      quizQuestion: 'What do children build out of white snow with a carrot nose in winter?',
      quizOptions: ['Winter Snowman', 'Sandcastle', 'Rainbow', 'Volcano'],
      quizAnswer: 'Winter Snowman',
      sentenceTokens: ['We', 'build', 'a', 'white', 'snowman'],
      stickerRewardId: 'sticker_star',
    },
    {
      id: 'k2-shark',
      word: 'Yeti Monster',
      phonetic: '/ˈjet.i ˈmɒn.stər/',
      vietnamese: 'Quái thú tuyết hiền lành',
      emoji: '👾',
      color: '#38bdf8',
      shape3d: 'cone',
      glbModelUrl: '/models/Yeti.glb',
      exampleSentence: 'The friendly snow yeti can jump and wave its big hands.',
      exampleTranslation: 'Chú quái thú tuyết thân thiện biết nhảy và vẫy đôi bàn tay lớn.',
      grammarOrPhonicsNote: 'Động từ khuyết thiếu: Can / Cannot (Can’t) + V nguyên mẫu.',
      quizQuestion: 'Who lives in the snowy mountains and has fluffy white-blue fur?',
      quizOptions: ['Yeti Monster', 'Rabbit', 'Parrot', 'Horse'],
      quizAnswer: 'Yeti Monster',
      sentenceTokens: ['Friendly', 'yeti', 'can', 'jump', 'high'],
      stickerRewardId: 'sticker_dolphin',
    },
    {
      id: 'k2-flamingo',
      word: 'Pink Flamingo',
      phonetic: '/pɪŋk fləˈmɪŋ.ɡəʊ/',
      vietnamese: 'Chim hồng hạc',
      emoji: '🦩',
      color: '#ec4899',
      shape3d: 'cylinder',
      glbModelUrl: '/models/Flamingo.glb',
      exampleSentence: 'There is a pink flamingo standing on one long leg.',
      exampleTranslation: 'Có một chú chim hồng hạc đang đứng bằng một chân dài.',
      grammarOrPhonicsNote: 'Cấu trúc miêu tả: There is / There are + Noun + V-ing.',
      quizQuestion: 'Which beautiful pink bird has long legs and loves standing in the lake?',
      quizOptions: ['Pink Flamingo', 'Snowman', 'Shark', 'Robot'],
      quizAnswer: 'Pink Flamingo',
      sentenceTokens: ['The', 'pink', 'flamingo', 'has', 'long', 'legs'],
      stickerRewardId: 'sticker_rainbow',
    },
    {
      id: 'k2-treasure',
      word: 'Treasure Chest',
      phonetic: '/ˈtreʒ.ər tʃest/',
      vietnamese: 'Rương kho báu bí ẩn',
      emoji: '🧰',
      color: '#f59e0b',
      shape3d: 'box',
      glbModelUrl: '/models/TreasureChest3D.glb',
      exampleSentence: 'The treasure chest is under the big green tree.',
      exampleTranslation: 'Chiếc rương kho báu nằm ở dưới gốc cây xanh lớn.',
      grammarOrPhonicsNote: 'Giới từ chỉ vị trí: in, on, under, next to, behind.',
      quizQuestion: 'Where do pirates keep their shiny gold coins and gems?',
      quizOptions: ['Treasure Chest', 'Pencil Case', 'Umbrella', 'Shoes'],
      quizAnswer: 'Treasure Chest',
      sentenceTokens: ['Open', 'the', 'golden', 'treasure', 'chest'],
      stickerRewardId: 'sticker_crown',
    },
    {
      id: 'k2-cottage',
      word: 'Cozy House',
      phonetic: '/ˈkəʊ.zi haʊs/',
      vietnamese: 'Ngôi nhà ấm cúng',
      emoji: '🏡',
      color: '#10b981',
      shape3d: 'box',
      glbModelUrl: '/models/Cottage.glb',
      exampleSentence: 'There are two bedrooms and a garden in my cozy house.',
      exampleTranslation: 'Có hai phòng ngủ và một khu vườn trong ngôi nhà ấm cúng của mình.',
      grammarOrPhonicsNote: 'Số nhiều: There are + danh từ số nhiều (two bedrooms).',
      quizQuestion: 'Where do you live happily with your parents, brother, and sister?',
      quizOptions: ['Cozy House', 'Bus Stop', 'Playground', 'Cloud'],
      quizAnswer: 'Cozy House',
      sentenceTokens: ['I', 'live', 'in', 'a', 'cozy', 'house'],
      stickerRewardId: 'sticker_castle',
    },
  ],
  3: [
    {
      id: 'k3-astronaut',
      word: 'Space Astronaut',
      phonetic: '/speɪs ˈæs.trə.nɔːt/',
      vietnamese: 'Phi hành gia vũ trụ',
      emoji: '👩‍🚀',
      color: '#38bdf8',
      shape3d: 'sphere',
      glbModelUrl: '/models/Astronaut.glb',
      exampleSentence: 'An astronaut wears a spacesuit and explores planets in zero gravity.',
      exampleTranslation: 'Phi hành gia mặc đồ bảo hộ và khám phá các hành tinh trong môi trường không trọng lực.',
      grammarOrPhonicsNote: 'Mệnh đề quan hệ chỉ người: An astronaut is a person WHO travels into space.',
      quizQuestion: 'Detective Clue: "I work in a space station far above the Earth. Who am I?"',
      quizOptions: ['Space Astronaut', 'Firefighter', 'Architect', 'Chef'],
      quizAnswer: 'Space Astronaut',
      sentenceTokens: ['She', 'wants', 'to', 'be', 'an', 'astronaut'],
      stickerRewardId: 'sticker_astronaut',
    },
    {
      id: 'k3-dragon',
      word: 'Magic Castle Inn',
      phonetic: '/ˈmædʒ.ɪk ˈkɑː.səl/',
      vietnamese: 'Lâu đài hiệp sĩ cổ đại',
      emoji: '🏰',
      color: '#22c55e',
      shape3d: 'octahedron',
      glbModelUrl: '/models/InnCastle.glb',
      exampleSentence: 'In the storybook, the brave knights gathered at the grand castle on the highest hill.',
      exampleTranslation: 'Trong cuốn truyện, các hiệp sĩ dũng cảm đã tập hợp tại tòa lâu đài lớn trên ngọn đồi cao nhất.',
      grammarOrPhonicsNote: 'So sánh hơn & nhất: higher than / the highest hill in the kingdom.',
      quizQuestion: 'Time-Machine Past Tense: "The brave knight ___ the ancient castle in the story yesterday."',
      quizOptions: ['visited (visit -> visited)', 'visiting', 'visits', 'to visit'],
      quizAnswer: 'visited (visit -> visited)',
      sentenceTokens: ['The', 'knights', 'protected', 'the', 'grand', 'castle'],
      stickerRewardId: 'sticker_dragon',
    },
    {
      id: 'k3-cottage',
      word: 'Village Cottage',
      phonetic: '/ˈvɪl.ɪdʒ ˈkɒt.ɪdʒ/',
      vietnamese: 'Ngôi nhà gỗ miền quê',
      emoji: '🏡',
      color: '#f59e0b',
      shape3d: 'box',
      glbModelUrl: '/models/Cottage.glb',
      exampleSentence: 'Last summer, we stayed in a peaceful cottage opposite the green forest.',
      exampleTranslation: 'Mùa hè năm ngoái, chúng mình đã ở tại một ngôi nhà nhỏ yên bình đối diện khu rừng xanh.',
      grammarOrPhonicsNote: 'Quá khứ đơn & Giới từ chỉ đường: opposite, between, next to, behind.',
      quizQuestion: 'Where did the family stay during their countryside holiday last summer?',
      quizOptions: ['Village Cottage', 'Space Station', 'Submarine', 'Airport'],
      quizAnswer: 'Village Cottage',
      sentenceTokens: ['We', 'stayed', 'in', 'a', 'cozy', 'cottage'],
      stickerRewardId: 'sticker_castle',
    },
    {
      id: 'k3-solar',
      word: 'Water Sawmill',
      phonetic: '/ˈwɔː.tər ˈsɔː.mɪl/',
      vietnamese: 'Xưởng cối xay nước cổ',
      emoji: '⚙️',
      color: '#6366f1',
      shape3d: 'sphere',
      glbModelUrl: '/models/SawMill.glb',
      exampleSentence: 'The old watermill is one of the most famous landmarks in our village.',
      exampleTranslation: 'Chiếc cối xay nước cổ là một trong những địa danh nổi tiếng nhất ở làng mình.',
      grammarOrPhonicsNote: 'So sánh nhất với tính từ dài: THE MOST + adj (the most famous).',
      quizQuestion: 'Superlatives Check: "This ancient watermill is ___ building in the valley."',
      quizOptions: ['the oldest', 'older than', 'more old', 'old'],
      quizAnswer: 'the oldest',
      sentenceTokens: ['This', 'watermill', 'is', 'the', 'oldest', 'building'],
      stickerRewardId: 'sticker_earth',
    },
    {
      id: 'k3-sword',
      word: 'Legendary Sword',
      phonetic: '/ˈledʒ.ən.dər.i sɔːd/',
      vietnamese: 'Thanh kiếm huyền thoại',
      emoji: '⚔️',
      color: '#38bdf8',
      shape3d: 'cylinder',
      glbModelUrl: '/models/RuneSword.glb',
      exampleSentence: 'King Arthur pulled the legendary sword out of the magic stone.',
      exampleTranslation: 'Vua Arthur đã rút thanh kiếm huyền thoại ra khỏi tảng đá phép thuật.',
      grammarOrPhonicsNote: 'Thì Quá khứ đơn (Past Simple): pull -> pulled | find -> found.',
      quizQuestion: 'What shining weapon did the brave knight carry to protect the kingdom?',
      quizOptions: ['Legendary Sword', 'Plastic Spoon', 'Paper Airplane', 'Umbrella'],
      quizAnswer: 'Legendary Sword',
      sentenceTokens: ['The', 'knight', 'found', 'a', 'magic', 'sword'],
      stickerRewardId: 'sticker_crown',
    },
    {
      id: 'k3-crystal',
      word: 'Glowing Crystal',
      phonetic: '/ˈɡləʊ.ɪŋ ˈkrɪs.təl/',
      vietnamese: 'Tinh thể pha lê phát sáng',
      emoji: '💎',
      color: '#06b6d4',
      shape3d: 'octahedron',
      glbModelUrl: '/models/Crystal3D.glb',
      exampleSentence: 'The explorers discovered a glowing crystal deeper inside the mountain cave.',
      exampleTranslation: 'Các nhà thám hiểm đã phát hiện một viên pha lê phát sáng sâu hơn trong hang núi.',
      grammarOrPhonicsNote: 'So sánh hơn của tính từ ngắn: deep -> deeper than | bright -> brighter than.',
      quizQuestion: 'Comparative Check: "This magic blue crystal is ___ than a normal rock."',
      quizOptions: ['brighter', 'more bright', 'brightest', 'as bright'],
      quizAnswer: 'brighter',
      sentenceTokens: ['This', 'blue', 'crystal', 'shines', 'very', 'brightly'],
      stickerRewardId: 'sticker_star',
    },
    {
      id: 'k3-hoverboard',
      word: 'Sky Hoverboard',
      phonetic: '/skaɪ ˈhɒv.ə.bɔːd/',
      vietnamese: 'Ván trượt bay tương lai',
      emoji: '🛹',
      color: '#ec4899',
      shape3d: 'box',
      glbModelUrl: '/models/Hoverboard3D.glb',
      exampleSentence: 'Tomorrow, we are going to test our new sky hoverboard at the science fair.',
      exampleTranslation: 'Ngày mai, chúng mình dự định thử nghiệm chiếc ván trượt bay mới tại hội chợ khoa học.',
      grammarOrPhonicsNote: 'Tương lai gần (Near Future): S + am/is/are + GOING TO + V.',
      quizQuestion: 'Future Plan Check: "Next weekend, they ___ going to ride hoverboards in the park."',
      quizOptions: ['are', 'is', 'was', 'did'],
      quizAnswer: 'are',
      sentenceTokens: ['We', 'are', 'going', 'to', 'fly', 'tomorrow'],
      stickerRewardId: 'sticker_rocket',
    },
  ],
  4: [
    {
      id: 'k4-ufo',
      word: 'Aerobatic Jet Plane',
      phonetic: '/ˌeə.rəˈbæt.ɪk dʒet pleɪn/',
      vietnamese: 'Máy bay phản lực hàng không',
      emoji: '✈️',
      color: '#38bdf8',
      shape3d: 'torus',
      glbModelUrl: '/models/Plane.glb',
      exampleSentence: 'By 2050, people will travel across smart cities in eco-friendly autonomous aircraft.',
      exampleTranslation: 'Đến năm 2050, con người sẽ di chuyển qua các thành phố thông minh bằng máy bay tự hành xanh.',
      grammarOrPhonicsNote: 'Tiếng Anh Lớp 7 (Future Transport): Will + V / Hậu tố "-less" (driverless, wireless).',
      quizQuestion: 'Word Formation (Grade 7): A high-tech aircraft that operates without a human pilot is called:',
      quizOptions: ['Pilotless / Autonomous aircraft', 'Pilotful craft', 'Un-drove vehicle', 'Drivingless car'],
      quizAnswer: 'Pilotless / Autonomous aircraft',
      sentenceTokens: ['Future', 'cities', 'will', 'use', 'eco-friendly', 'flying', 'crafts'],
      stickerRewardId: 'sticker_ufo',
    },
    {
      id: 'k4-windmill',
      word: 'Renewable Wind & Water Energy',
      phonetic: '/rɪˈnjuː.ə.bəl ˈen.ə.dʒi/',
      vietnamese: 'Năng lượng tái tạo tự nhiên',
      emoji: '🌬️',
      color: '#10b981',
      shape3d: 'octahedron',
      glbModelUrl: '/models/SawMill.glb',
      exampleSentence: 'If we invest in renewable energy, we will reduce greenhouse gas emissions.',
      exampleTranslation: 'Nếu chúng ta đầu tư vào năng lượng tái tạo, chúng ta sẽ giảm khí thải nhà kính.',
      grammarOrPhonicsNote: 'Câu điều kiện Loại 1 (First Conditional): If + Present Simple, S + WILL + V.',
      quizQuestion: 'First Conditional (Grade 6–7): "If we ___ renewable energy, our planet ___ become cleaner."',
      quizOptions: ['use / will', 'will use / will', 'used / would', 'using / is'],
      quizAnswer: 'use / will',
      sentenceTokens: ['If', 'we', 'use', 'clean', 'power', 'we', 'save', 'energy'],
      stickerRewardId: 'sticker_earth',
    },
    {
      id: 'k4-ai-bot',
      word: 'Autonomous AI Assistant',
      phonetic: '/ɔːˈtɒn.ə.məs ˌeɪˈaɪ əˈsɪs.tənt/',
      vietnamese: 'Trợ lý Trí tuệ Nhân tạo tự chủ',
      emoji: '🤖',
      color: '#a855f7',
      shape3d: 'box',
      glbModelUrl: '/models/RobotExpressive.glb',
      exampleSentence: 'Scientists have developed autonomous AI robots to look after elderly people at home.',
      exampleTranslation: 'Các nhà khoa học đã phát triển robot AI tự chủ để chăm sóc người cao tuổi tại nhà.',
      grammarOrPhonicsNote: 'Hiện tại hoàn thành (have developed) + Phrasal Verb "look after" (= take care of).',
      quizQuestion: 'Phrasal Verb & Tense Check: Which phrasal verb in the sentence means "take care of"?',
      quizOptions: ['Look after', 'Look for', 'Give up', 'Turn off'],
      quizAnswer: 'Look after',
      sentenceTokens: ['AI', 'robots', 'can', 'look', 'after', 'people', 'well'],
      stickerRewardId: 'sticker_robot',
    },
    {
      id: 'k4-ecosystem',
      word: 'Forest Biodiversity',
      phonetic: '/ˈfɒr.ɪst ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/',
      vietnamese: 'Đa dạng sinh học rừng xanh',
      emoji: '🌳',
      color: '#22c55e',
      shape3d: 'sphere',
      glbModelUrl: '/models/VillageTree.glb',
      exampleSentence: 'Although deforestation is a global problem, planting trees helps restore forest biodiversity.',
      exampleTranslation: 'Mặc dù nạn phá rừng là vấn đề toàn cầu, việc trồng cây giúp khôi phục đa dạng sinh học rừng.',
      grammarOrPhonicsNote: 'Liên từ nhượng bộ Lớp 7: Although / Though + Clause, Main Clause.',
      quizQuestion: 'Connector Grammar: "___ plastic is cheap, we should recycle it to protect biodiversity."',
      quizOptions: ['Although', 'Because of', 'Despite', 'However'],
      quizAnswer: 'Although',
      sentenceTokens: ['We', 'must', 'protect', 'our', 'forest', 'ecosystem', 'now'],
      stickerRewardId: 'sticker_dolphin',
    },
    {
      id: 'k4-galaxy',
      word: 'Interplanetary Astronaut',
      phonetic: '/ˌɪn.təˈplæn.ɪ.tər.i ˈæs.trə.nɔːt/',
      vietnamese: 'Phi hành gia liên hành tinh',
      emoji: '👩‍🚀',
      color: '#f43f5e',
      shape3d: 'sphere',
      glbModelUrl: '/models/Astronaut.glb',
      exampleSentence: 'Astronauts have conducted hundreds of experiments aboard the international space station.',
      exampleTranslation: 'Các phi hành gia đã thực hiện hàng trăm thí nghiệm trên trạm vũ trụ quốc tế.',
      grammarOrPhonicsNote: 'Thì Hiện tại hoàn thành (Present Perfect): have/has + V3/ed (have conducted).',
      quizQuestion: 'Reading Comprehension: Why do astronauts work aboard the space station?',
      quizOptions: [
        'For interplanetary exploration and scientific discovery',
        'To waste electricity and fuel',
        'To build a wooden cottage on the Sun',
        'To turn off all computers on Earth',
      ],
      quizAnswer: 'For interplanetary exploration and scientific discovery',
      sentenceTokens: ['Astronauts', 'have', 'explored', 'distant', 'planets', 'in', 'space'],
      stickerRewardId: 'sticker_astronaut',
    },
    {
      id: 'k4-heritage',
      word: 'Ancient Stone Monument',
      phonetic: '/ˈeɪn.ʃənt stəʊn ˈmɒn.jə.mənt/',
      vietnamese: 'Di sản tượng đài đá cổ đại',
      emoji: '🗿',
      color: '#f59e0b',
      shape3d: 'cylinder',
      glbModelUrl: '/models/Obelisk3D.glb',
      exampleSentence: 'This ancient stone monument was built centuries ago and is protected by UNESCO.',
      exampleTranslation: 'Tượng đài đá cổ đại này đã được xây dựng từ nhiều thế kỷ trước và được UNESCO bảo vệ.',
      grammarOrPhonicsNote: 'Câu Bị Động (Passive Voice): S + be + V3/ed (was built / is protected).',
      quizQuestion: 'Passive Voice (Grade 7): "The ancient stone monument ___ by thousands of tourists every year."',
      quizOptions: ['is visited', 'visits', 'visited', 'visiting'],
      quizAnswer: 'is visited',
      sentenceTokens: ['Ancient', 'monuments', 'are', 'protected', 'around', 'the', 'world'],
      stickerRewardId: 'sticker_castle',
    },
    {
      id: 'k4-jetpack',
      word: 'Zero-Emission Jetpack',
      phonetic: '/ˈzɪə.rəʊ ɪˈmɪʃ.ən ˈdʒet.pæk/',
      vietnamese: 'Động cơ phản lực không khí thải',
      emoji: '🚀',
      color: '#06b6d4',
      shape3d: 'cylinder',
      glbModelUrl: '/models/Jetpack3D.glb',
      exampleSentence: 'Solar-powered jetpacks will allow commuters to fly over traffic jams without pollution.',
      exampleTranslation: 'Động cơ đeo lưng chạy năng lượng mặt trời sẽ giúp người đi làm bay qua cảnh tắc đường mà không gây ô nhiễm.',
      grammarOrPhonicsNote: 'Cấu trúc: allow + someone + TO V (allow commuters to fly).',
      quizQuestion: 'What is the main advantage of a zero-emission solar jetpack?',
      quizOptions: [
        'It reduces traffic congestion and air pollution',
        'It produces more smoke than coal',
        'It only works underwater',
        'It cannot fly above the ground',
      ],
      quizAnswer: 'It reduces traffic congestion and air pollution',
      sentenceTokens: ['Solar', 'jetpacks', 'will', 'reduce', 'city', 'traffic', 'jams'],
      stickerRewardId: 'sticker_rocket',
    },
  ],
};

// Danh sách 5 mẫu Hòn Đảo Bay 3D (.GLB) thực tế trong thư mục public/models để phối hợp đa dạng trên Bản Đồ
export const WORLD_MAP_ISLAND_GLB_POOL: string[] = [
  '/models/floating_island_expanse_v7.glb',
  '/models/andrews_floating_island_unity_v2.glb',
  '/models/floating_island.glb',
  '/models/floating_island_with_roots_and_rocks.glb',
  '/models/floating_island_peak.glb',
];

// Danh sách Công Trình 3D (.GLB) phong phú đặt trên các đảo để mỗi đảo có diện mạo riêng biệt
const ISLAND_LANDMARK_GLB_POOL: string[] = [
  '/models/Cottage.glb',
  '/models/VillageTree.glb',
  '/models/SawMill.glb',
  '/models/Gate3D.glb',
  '/models/Obelisk3D.glb',
  '/models/Crystal3D.glb',
  '/models/TreasureChest3D.glb',
  '/models/Snowman.glb',
  '/models/Car.glb',
  '/models/InnCastle.glb',
];

// Hàm sinh tự động 80 Đảo / Cấp Độ × 4 Cấp Độ = 320 Đảo Bài Học Tăng Dần Độ Khó
function buildAll320Islands(): IslandLesson[] {
  const allIslands: IslandLesson[] = [];
  const tiers: GradeTier[] = [1, 2, 3, 4];

  const STAGE_TYPES: {
    suffix: string;
    diff: 1 | 2 | 3 | 4;
    badge: string;
    exerciseType: IslandExerciseType;
    exerciseLabel: string;
  }[] = [
    {
      suffix: 'Khám Phá 3D & Phản Xạ Nghe',
      diff: 1,
      badge: '🫧',
      exerciseType: 'discover_bubble',
      exerciseLabel: 'Bài Tập: Nghe Phát Âm & Đập Bong Bóng Từ Vựng',
    },
    {
      suffix: 'Tư Duy Từ Vựng & Nghĩa Tiếng Việt',
      diff: 1,
      badge: '🦖',
      exerciseType: 'monster_feed',
      exerciseLabel: 'Bài Tập: Cho Khủng Long Ăn Đúng Từ Tiếng Anh',
    },
    {
      suffix: 'Ghép Từ & Cấu Trúc Câu',
      diff: 1,
      badge: '⚙️',
      exerciseType: 'sentence_gear',
      exerciseLabel: 'Bài Tập: Sắp Xếp Bánh Răng Câu Hoàn Chỉnh',
    },
    {
      suffix: 'Thám Tử Đọc Hiểu Ngữ Cảnh',
      diff: 2,
      badge: '🕵️',
      exerciseType: 'detective_quiz',
      exerciseLabel: 'Bài Tập: Thám Tử Nhí Giải Đố Đọc Hiểu',
    },
    {
      suffix: 'Luyện Phát Âm Chuẩn AI Mic',
      diff: 2,
      badge: '🎤',
      exerciseType: 'voice_bridge',
      exerciseLabel: 'Bài Tập: Xây Cầu Giọng Nói AI Microphone',
    },
    {
      suffix: 'Phản Xạ Nghe Nhanh Cấp Tốc',
      diff: 2,
      badge: '🎧',
      exerciseType: 'discover_bubble',
      exerciseLabel: 'Bài Tập: Nghe Nhanh Bắt Từ Trong Bong Bóng',
    },
    {
      suffix: 'Phân Loại Từ Vựng Nâng Cao',
      diff: 3,
      badge: '🦖',
      exerciseType: 'monster_feed',
      exerciseLabel: 'Bài Tập: Thử Thách Nuôi Thần Thú Từ Vựng',
    },
    {
      suffix: 'Ngữ Pháp Ứng Dụng & Ghép Câu',
      diff: 3,
      badge: '⚔️',
      exerciseType: 'sentence_gear',
      exerciseLabel: 'Bài Tập: Ghép Câu Ngữ Pháp Đánh Quái Slime',
    },
    {
      suffix: 'Suy Luận Tình Huống & Ngữ Pháp',
      diff: 3,
      badge: '🔍',
      exerciseType: 'detective_quiz',
      exerciseLabel: 'Bài Tập: Phá Án Ngữ Pháp & Đọc Hiểu Nâng Cao',
    },
    {
      suffix: 'ĐẤU TRÙM TỔNG HỢP VÙNG (BOSS ISLAND)',
      diff: 4,
      badge: '👑',
      exerciseType: 'boss_challenge',
      exerciseLabel: 'ĐẠI CHIẾN TRÙM VÙNG: Bài Kiểm Tra Tổng Hợp 3 Chặng',
    },
  ];

  for (const tier of tiers) {
    const zones = KINGDOM_ZONES[tier];
    const bank = TIER_VOCAB_BANKS[tier];

    for (const zone of zones) {
      for (let i = 0; i < 10; i++) {
        const islandNumber = (zone.zoneIndex - 1) * 10 + (i + 1); // 1 to 80
        const stageMeta = STAGE_TYPES[i];
        const isBoss = i === 9;

        // Xoay vòng bộ từ vựng đảm bảo 100% không trùng từ trong cùng 1 đảo & giữ nguyên ID chuẩn cho SRS
        const rotatedItems: LearningItem[] = [];
        const itemCount = Math.min(bank.length, isBoss ? 5 : 4);
        const startOffset = (islandNumber * 2 + zone.zoneIndex) % bank.length;
        for (let k = 0; k < itemCount; k++) {
          const baseItem = bank[(startOffset + k) % bank.length];
          rotatedItems.push({
            ...baseItem,
          });
        }

        // Phối hợp cả 6 mẫu đảo 3D .GLB người dùng đã tải về để bản đồ đa dạng, sống động
        let islandGlbUrl = WORLD_MAP_ISLAND_GLB_POOL[(islandNumber - 1) % 4];
        if (isBoss) {
          // Các Đảo Trùm sử dụng luân phiên các mẫu đảo hùng vĩ nhất (Peak, Roots & Rocks, Expanse, Floating Island)
          const bossGlbPool = [
            '/models/floating_island.glb',
            '/models/floating_island_with_roots_and_rocks.glb',
            '/models/floating_island_peak.glb',
            '/models/floating_island_expanse_v7.glb',
          ];
          islandGlbUrl = bossGlbPool[(zone.zoneIndex - 1) % bossGlbPool.length];
        } else if (i === 4) {
          // Đảo giữa vùng (Đảo 5, 15, 25...) dùng thêm mẫu đảo Peak / Roots & Rocks
          islandGlbUrl =
            zone.zoneIndex % 2 === 0
              ? '/models/floating_island_peak.glb'
              : '/models/floating_island_with_roots_and_rocks.glb';
        }

        const landmarkGlb = isBoss
          ? '/models/InnCastle.glb'
          : ISLAND_LANDMARK_GLB_POOL[(islandNumber + zone.zoneIndex) % ISLAND_LANDMARK_GLB_POOL.length];

        // Tọa độ 3D trải dài liên hoàn từ Đảo 1 -> Đảo 80, khoảng cách rộng rãi (6.8m mỗi đảo + khoảng nghỉ 3.6m giữa mỗi vùng)
        const worldX = (islandNumber - 1) * 6.8 + (zone.zoneIndex - 1) * 3.6;
        const worldY = Number((Math.cos(islandNumber * 0.65) * 0.55 + (isBoss ? 0.75 : 0)).toFixed(2));
        const worldZ = Number((Math.sin(islandNumber * 0.85) * 3.6).toFixed(2));

        allIslands.push({
          id: `k${tier}-u${islandNumber}`,
          tier,
          zoneIndex: zone.zoneIndex,
          islandNumber,
          difficulty: stageMeta.diff,
          isBossIsland: isBoss,
          title: isBoss ? `👑 ĐẢO TRÙM #${islandNumber}: ${zone.title}` : `Đảo #${islandNumber}: ${zone.title}`,
          subtitle: `${stageMeta.exerciseLabel}`,
          badgeEmoji: isBoss ? '👑' : stageMeta.badge,
          themeColor: isBoss ? '#facc15' : zone.themeColor,
          islandColor: isBoss ? '#f43f5e' : zone.islandColor,
          islandGlbUrl,
          landmarkGlb,
          exerciseType: stageMeta.exerciseType,
          exerciseLabel: stageMeta.exerciseLabel,
          position3D: [worldX, worldY, worldZ],
          recommendedGames: [stageMeta.exerciseType],
          items: rotatedItems,
        });
      }
    }
  }

  return allIslands;
}

export const ISLAND_LESSONS: IslandLesson[] = buildAll320Islands();

// ================= DANH MỤC NHÂN VẬT 3D GỐC (KÈM FILE .GLB CÓ ANIMATION THẬT) =================
export interface AvatarCharacterMeta {
  id: AvatarBaseId;
  name: string;
  title: string;
  emoji: string;
  primaryColor: string;
  secondaryColor: string;
  recommendedAge: string;
  description: string;
  glbUrl: string;
  glbScale: number;
  glbYOffset: number;
  signatureSetName: string;
  signatureSkin: {
    hat: string;
    glasses: string;
    outfit: string;
    wing: string;
    hand_item: string;
    aura: string;
  };
}

export const AVATAR_CHARACTERS: AvatarCharacterMeta[] = [
  {
    id: 'boy',
    name: 'Bé Trai Dũng Cảm',
    title: 'Hiệp Sĩ Nhí Pippo (Boy Hero)',
    emoji: '👦',
    primaryColor: '#3b82f6',
    secondaryColor: '#dbeafe',
    recommendedAge: 'Mọi lứa tuổi',
    description: 'Cậu bé dũng cảm với mái tóc nâu lãng tử và tinh thần phiêu lưu bất tận!',
    glbUrl: '',
    glbScale: 1,
    glbYOffset: 0,
    signatureSetName: 'Bộ Hiệp Sĩ Quả Cảm',
    signatureSkin: {
      hat: 'hat_warrior_helmet',
      glasses: 'none',
      outfit: 'outfit_warrior',
      wing: 'back_backpack',
      hand_item: 'hand_warrior_sword',
      aura: 'none',
    },
  },
  {
    id: 'girl',
    name: 'Bé Gái Đáng Yêu',
    title: 'Pháp Sư Nhí Pippo (Girl Hero)',
    emoji: '👧',
    primaryColor: '#ec4899',
    secondaryColor: '#fce7f3',
    recommendedAge: 'Mọi lứa tuổi',
    description: 'Cô bé thông minh với mái tóc thắt bím san hô kẹo ngọt và phép thuật tiếng Anh!',
    glbUrl: '',
    glbScale: 1,
    glbYOffset: 0,
    signatureSetName: 'Bộ Phù Thủy Ma Pháp',
    signatureSkin: {
      hat: 'hat_mage_witch',
      glasses: 'none',
      outfit: 'outfit_mage',
      wing: 'wing_angel',
      hand_item: 'hand_mage_staff',
      aura: 'starlight',
    },
  },
  {
    id: 'bear',
    name: 'Robo Buddy',
    title: 'Robot Biểu Cảm 3D (.glb)',
    emoji: '🤖',
    primaryColor: '#f59e0b',
    secondaryColor: '#fef3c7',
    recommendedAge: 'Mọi lứa tuổi',
    description: 'Mô hình 3D chuẩn Pixar có 13 hoạt ảnh xương (Vẫy tay, Nhảy múa, Chạy, Thumbs Up)!',
    glbUrl: '/models/RobotExpressive.glb',
    glbScale: 0.42,
    glbYOffset: -0.68,
    signatureSetName: 'Bộ Giáp Cyber Robot Tương Lai',
    signatureSkin: {
      hat: 'crown_gold',
      glasses: 'none',
      outfit: 'knight_armor',
      wing: 'jetpack_3d',
      hand_item: 'laser_sword',
      aura: 'cyber_pulse',
    },
  },
  {
    id: 'rabbit',
    name: 'Foxy Wilder',
    title: 'Cáo Thần Rừng Xanh 3D (.glb)',
    emoji: '🦊',
    primaryColor: '#f97316',
    secondaryColor: '#ffedd5',
    recommendedAge: 'Mầm non – Lớp 5',
    description: 'Chú cáo thần 3D sống động với bộ trang bị Tinh Linh Rừng Xanh bám khớp cơ thể.',
    glbUrl: '/models/Fox.glb',
    glbScale: 0.018,
    glbYOffset: -0.68,
    signatureSetName: 'Bộ Tinh Linh Cáo Thần Rừng Xanh',
    signatureSkin: {
      hat: 'crown_gold',
      glasses: 'none',
      outfit: 'wizard_robe',
      wing: 'angel_wings',
      hand_item: 'balloon_heart',
      aura: 'starlight',
    },
  },
  {
    id: 'dino',
    name: 'Yeti Guardian',
    title: 'Vệ Thần Tuyết Yeti 3D (.glb)',
    emoji: '👾',
    primaryColor: '#38bdf8',
    secondaryColor: '#e0f2fe',
    recommendedAge: 'Mầm non – Lớp 7',
    description: 'Vệ thần Yeti 3D khổng lồ với Vương miện, Kính & Thanh đại đao gắn chuẩn xác theo khung xương.',
    glbUrl: '/models/Yeti.glb',
    glbScale: 1.0,
    glbYOffset: -0.68,
    signatureSetName: 'Bộ Vệ Thần Băng Giá Bắc Cực',
    signatureSkin: {
      hat: 'crown_gold',
      glasses: 'star_shades',
      outfit: 'knight_armor',
      wing: 'dragon_wings',
      hand_item: 'magic_wand',
      aura: 'rainbow_ring',
    },
  },
  {
    id: 'cat',
    name: 'Arthur Paladin',
    title: 'Hiệp Sĩ Hoàng Gia 3D (.glb)',
    emoji: '⚔️',
    primaryColor: '#ef4444',
    secondaryColor: '#fef08a',
    recommendedAge: 'Mầm non – Lớp 7',
    description: 'Chàng Hiệp sĩ Hoàng gia 3D khoác giáp rồng, đội mũ trụ và cầm thanh kiếm phép thuật.',
    glbUrl: '/models/KnightHero.glb',
    glbScale: 0.35,
    glbYOffset: -0.68,
    signatureSetName: 'Bộ Thánh Kỵ Sĩ Rồng Vàng',
    signatureSkin: {
      hat: 'bunny_ears',
      glasses: 'none',
      outfit: 'cape_royal',
      wing: 'dragon_wings',
      hand_item: 'laser_sword',
      aura: 'starlight',
    },
  },
  {
    id: 'knight',
    name: 'Astro Hero',
    title: 'Phi Hành Gia Ngân Hà 3D (.glb)',
    emoji: '👩‍🚀',
    primaryColor: '#38bdf8',
    secondaryColor: '#e0f2fe',
    recommendedAge: 'Lớp 2 – Lớp 7',
    description: 'Nhà du hành vũ trụ 3D trang bị Động cơ phản lực Jetpack và Ván bay không gian.',
    glbUrl: '/models/Astronaut.glb',
    glbScale: 0.72,
    glbYOffset: -0.68,
    signatureSetName: 'Bộ Chiến Binh Ngân Hà Sci-Fi',
    signatureSkin: {
      hat: 'astro_helmet',
      glasses: 'none',
      outfit: 'knight_armor',
      wing: 'jetpack_3d',
      hand_item: 'magic_wand',
      aura: 'cyber_pulse',
    },
  },
  {
    id: 'wizard',
    name: 'Mustang Stallion',
    title: 'Chiến Mã Thần Tốc 3D (.glb)',
    emoji: '🐴',
    primaryColor: '#a855f7',
    secondaryColor: '#f3e8ff',
    recommendedAge: 'Lớp 1 – Lớp 7',
    description: 'Chiến mã thần thoại 3D phi nước đại cùng vương miện vàng và vòng phép thuật rực rỡ.',
    glbUrl: '/models/Horse.glb',
    glbScale: 0.0095,
    glbYOffset: -0.68,
    signatureSetName: 'Bộ Chiến Mã Hoàng Kim',
    signatureSkin: {
      hat: 'crown_gold',
      glasses: 'none',
      outfit: 'cape_royal',
      wing: 'angel_wings',
      hand_item: 'magic_wand',
      aura: 'rainbow_ring',
    },
  },
];

// ================= KHO TRANG PHỤC & PHỤ KIỆN 3D .GLB (WARDROBE SHOP) =================
export type SkinSlot = 'hat' | 'glasses' | 'outfit' | 'shield' | 'wing' | 'hand_item' | 'aura';

export interface ShopCostumeItem {
  id: string;
  slot: SkinSlot;
  name: string;
  vietnameseName: string;
  emoji: string;
  priceGems: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  color: string;
  glbPreviewUrl?: string;
  effectDescription?: string;
}

export const SHOP_COSTUMES: ShopCostumeItem[] = [
  // --- 1. MŨ & VƯƠNG MIỆN & NÓN (HATS) ---
  { id: 'none', slot: 'hat', name: 'No Headgear', vietnameseName: 'Đầu Mặc Định', emoji: '✨', priceGems: 0, rarity: 'Common', color: '#94a3b8' },
  { id: 'hat_archer_cap', slot: 'hat', name: 'Robin Hood Feathered Cap', vietnameseName: 'Mũ Cung Thủ Lông Vũ Xanh', emoji: '🏹', priceGems: 300, rarity: 'Rare', color: '#16a34a', effectDescription: 'Lông vũ tinh linh nhẹ nhàng lay động' },
  { id: 'hat_mage_witch', slot: 'hat', name: 'Mystic Witch Hat', vietnameseName: 'Mũ Phù Thủy Ma Pháp', emoji: '🧙‍♀️', priceGems: 450, rarity: 'Epic', color: '#9333ea', effectDescription: 'Khóa vàng ma thuật & chóp xoắn bí ẩn' },
  { id: 'hat_warrior_helmet', slot: 'hat', name: 'Crimson Plume Knight Helmet', vietnameseName: 'Mũ Trụ Hiệp Sĩ Lông Vũ Đỏ', emoji: '🪖', priceGems: 550, rarity: 'Epic', color: '#ef4444', effectDescription: 'Lông vũ đỏ rực rỡ hiên ngang' },
  { id: 'hat_cleric_tiara', slot: 'hat', name: 'Angelic Ruby Tiara', vietnameseName: 'Vương Miện Cánh Thánh Điện', emoji: '👑', priceGems: 700, rarity: 'Epic', color: '#f59e0b', effectDescription: 'Ngọc đỏ hoàng gia & đôi cánh vàng' },
  { id: 'crown_gold', slot: 'hat', name: 'Royal Golden Crown', vietnameseName: 'Vương Miện Hoàng Gia', emoji: '👑', priceGems: 600, rarity: 'Epic', color: '#facc15' },
  { id: 'wizard_hat', slot: 'hat', name: 'Arcane Mage Cap', vietnameseName: 'Mũ Nón Thể Thao Phép', emoji: '🧢', priceGems: 250, rarity: 'Rare', color: '#3b82f6' },
  { id: 'astro_helmet', slot: 'hat', name: 'Sci-Fi Battle Helmet', vietnameseName: 'Mũ Giáp Không Gian Tương Lai', emoji: '👩‍🚀', priceGems: 950, rarity: 'Legendary', color: '#38bdf8', effectDescription: 'Kính hiển thị HUD tương lai' },
  { id: 'bunny_ears', slot: 'hat', name: 'Dragon Knight Helm', vietnameseName: 'Mũ Trụ Chiến Binh Rồng', emoji: '🐉', priceGems: 400, rarity: 'Rare', color: '#f59e0b' },

  // --- 2. KÍNH MẮT & VISOR (GLASSES) ---
  { id: 'none', slot: 'glasses', name: 'No Glasses', vietnameseName: 'Không Đeo Kính', emoji: '👀', priceGems: 0, rarity: 'Common', color: '#94a3b8' },
  { id: 'star_shades', slot: 'glasses', name: 'Star shades 3D', vietnameseName: 'Kính Mát Ngôi Sao Hồng', emoji: '🕶️', priceGems: 220, rarity: 'Rare', color: '#f43f5e' },
  { id: 'cyber_visor', slot: 'glasses', name: 'Cyber Neon Visor', vietnameseName: 'Kính Điện Tử Ma Trận Neon', emoji: '🥽', priceGems: 650, rarity: 'Epic', color: '#06b6d4', effectDescription: 'Quét dữ liệu không gian 3D' },

  // --- 3. TRANG PHỤC & GIÁP TOÀN THÂN (OUTFITS) ---
  { id: 'none', slot: 'outfit', name: 'Default Adventurer Clothes', vietnameseName: 'Đồ Mặc Định', emoji: '👕', priceGems: 0, rarity: 'Common', color: '#94a3b8' },
  { id: 'outfit_archer', slot: 'outfit', name: 'Elven Forest Hunter Tunic', vietnameseName: 'Áo Tunic Rừng Xanh Đai Da', emoji: '🌲', priceGems: 500, rarity: 'Rare', color: '#22c55e', effectDescription: 'Gọn gàng nhanh nhẹn giữa rừng xanh' },
  { id: 'outfit_mage', slot: 'outfit', name: 'Mystic Violet Cape & Gown', vietnameseName: 'Áo Choàng Tím & Váy Hồng Ma Pháp', emoji: '🔮', priceGems: 800, rarity: 'Epic', color: '#a855f7', effectDescription: 'Viên ngọc ngực phát sáng bí ẩn' },
  { id: 'outfit_warrior', slot: 'outfit', name: 'Steel Knight Cuirass & Pauldrons', vietnameseName: 'Đại Giáp Thép Chiến Binh Đai Da', emoji: '🛡️', priceGems: 950, rarity: 'Epic', color: '#64748b', effectDescription: 'Giáp thép sáng bóng chống đỡ mọi đòn đánh' },
  { id: 'outfit_cleric', slot: 'outfit', name: 'Sacred White & Gold Clergy Robe', vietnameseName: 'Lễ Phục Thánh Điện Trắng Hoàng Kim', emoji: '✨', priceGems: 1200, rarity: 'Legendary', color: '#e2e8f0', effectDescription: 'Váy tà dài hoàng kim & ngọc thánh bảo hộ' },
  { id: 'cape_royal', slot: 'outfit', name: 'Ruby Heart Royal Cape', vietnameseName: 'Áo Choàng Hoàng Gia Đỏ', emoji: '💖', priceGems: 450, rarity: 'Rare', color: '#ef4444' },
  { id: 'knight_armor', slot: 'outfit', name: 'Paladin Crystal Battle Armor', vietnameseName: 'Đại Giáp Pha Lê Paladin', emoji: '💎', priceGems: 1100, rarity: 'Legendary', color: '#38bdf8' },
  { id: 'wizard_robe', slot: 'outfit', name: 'Emerald Archmage Robe', vietnameseName: 'Pháp Y Đại Sư Lục Bảo', emoji: '🌿', priceGems: 750, rarity: 'Epic', color: '#10b981' },
  { id: 'dress_fairy', slot: 'outfit', name: 'Sweet Candy Fairy Dress', vietnameseName: 'Váy Tinh Linh Kẹo Ngọt', emoji: '🧚', priceGems: 400, rarity: 'Rare', color: '#f472b6' },

  // --- 4. KHIÊN PHÒNG THỦ (SHIELDS) ---
  { id: 'none', slot: 'shield', name: 'No Shield', vietnameseName: 'Không Khiên', emoji: '✋', priceGems: 0, rarity: 'Common', color: '#94a3b8' },
  { id: 'shield_warrior', slot: 'shield', name: 'Royal Heraldic Kite Shield', vietnameseName: 'Khiên Hiệp Sĩ Xanh Đính Pha Lê', emoji: '🛡️', priceGems: 500, rarity: 'Rare', color: '#2563eb', effectDescription: 'Huy hiệu hoàng gia & đá quý hộ mệnh' },
  { id: 'shield_holy', slot: 'shield', name: 'Divine Golden Sun Shield', vietnameseName: 'Khiên Thái Dương Hoàng Kim', emoji: '☀️', priceGems: 850, rarity: 'Epic', color: '#eab308', effectDescription: 'Ánh sáng thánh xua tan bóng tối' },

  // --- 5. CÁNH & TRANG BỊ ĐEO LƯNG (WINGS & BACK GEAR) ---
  { id: 'none', slot: 'wing', name: 'No Back Gear', vietnameseName: 'Không Đeo Lưng', emoji: '🍃', priceGems: 0, rarity: 'Common', color: '#94a3b8' },
  { id: 'back_backpack', slot: 'wing', name: 'Traveler Leather Backpack', vietnameseName: 'Balo Thám Hiểm Rừng Xanh', emoji: '🎒', priceGems: 250, rarity: 'Common', color: '#78350f', effectDescription: 'Đựng đầy từ vựng tiếng Anh kỳ diệu' },
  { id: 'back_quiver', slot: 'wing', name: 'Elven Arrow Quiver', vietnameseName: 'Bao Đựng Tên Lông Vũ Tinh Linh', emoji: '🏹', priceGems: 380, rarity: 'Rare', color: '#15803d', effectDescription: 'Mũi tên bọc lông vũ xanh biếc' },
  { id: 'wing_angel', slot: 'wing', name: 'Luminous Seraph Wings', vietnameseName: 'Đôi Cánh Thiên Thần Ánh Sáng', emoji: '🪽', priceGems: 1400, rarity: 'Legendary', color: '#f8fafc', effectDescription: 'Đôi cánh trắng muốt viền vàng lấp lánh' },
  { id: 'angel_wings', slot: 'wing', name: 'Pure White Wings', vietnameseName: 'Cánh Thiên Sứ Trắng', emoji: '🪽', priceGems: 950, rarity: 'Epic', color: '#ffffff' },
  { id: 'wing_dragon', slot: 'wing', name: 'Inferno Dragon Wings', vietnameseName: 'Đôi Cánh Rồng Lửa Địa Ngục', emoji: '🔥', priceGems: 1600, rarity: 'Legendary', color: '#dc2626', effectDescription: 'Tỏa hơi nóng và tàn lửa rực đỏ' },
  { id: 'dragon_wings', slot: 'wing', name: 'Dragon Wings', vietnameseName: 'Cánh Rồng Huyền Thoại', emoji: '🐉', priceGems: 1200, rarity: 'Legendary', color: '#ea580c' },
  { id: 'jetpack_3d', slot: 'wing', name: 'Twin Turbine Galaxy Jetpack', vietnameseName: 'Động Cơ Tên Lửa Không Gian', emoji: '🚀', priceGems: 1100, rarity: 'Legendary', color: '#0ea5e9', effectDescription: 'Tia lửa phản lực bay vút lên bầu trời' },

  // --- 6. VŨ KHÍ TAY PHẢI (WEAPONS & HAND ITEMS) ---
  { id: 'none', slot: 'hand_item', name: 'Empty Hand', vietnameseName: 'Tay Không', emoji: '✋', priceGems: 0, rarity: 'Common', color: '#94a3b8' },
  { id: 'balloon_heart', slot: 'hand_item', name: 'Heart Balloons', vietnameseName: 'Chùm Bóng Bay Trái Tim', emoji: '🎈', priceGems: 150, rarity: 'Common', color: '#fb7185' },
  { id: 'hand_archer_bow', slot: 'hand_item', name: 'Elven Recurve Bow & Arrow', vietnameseName: 'Cung Gỗ Tinh Linh & Mũi Tên', emoji: '🏹', priceGems: 480, rarity: 'Rare', color: '#15803d', effectDescription: 'Bắn trúng mọi câu hỏi tiếng Anh' },
  { id: 'hand_warrior_sword', slot: 'hand_item', name: 'Royal Steel Broadsword', vietnameseName: 'Thanh Kiếm Thép Hoàng Gia', emoji: '🗡️', priceGems: 600, rarity: 'Rare', color: '#475569', effectDescription: 'Lưỡi kiếm sáng lóa & đốc kiếm bọc vàng' },
  { id: 'hand_mage_staff', slot: 'hand_item', name: 'Spiral Wood Magic Staff', vietnameseName: 'Gậy Phép Xoắn Ốc Ngọc Tím', emoji: '🪄', priceGems: 850, rarity: 'Epic', color: '#9333ea', effectDescription: 'Viên ngọc tím lơ lửng xoay vần ma lực' },
  { id: 'hand_cleric_scepter', slot: 'hand_item', name: 'Winged Divine Scepter', vietnameseName: 'Vương Trượng Thánh Cánh Vàng', emoji: '🔱', priceGems: 1250, rarity: 'Legendary', color: '#f59e0b', effectDescription: 'Cánh vàng xòe rộng & ngọc thánh xanh ngọc' },
  { id: 'magic_wand', slot: 'hand_item', name: 'Starlight Crystal Wand', vietnameseName: 'Đũa Phép Ngôi Sao Pha Lê', emoji: '⭐', priceGems: 420, rarity: 'Rare', color: '#facc15' },
  { id: 'laser_sword', slot: 'hand_item', name: 'Cyber Laser Katana', vietnameseName: 'Thanh Kiếm Ánh Sáng Cyber', emoji: '⚔️', priceGems: 1350, rarity: 'Legendary', color: '#06b6d4', effectDescription: 'Lưỡi kiếm năng lượng plasma rực cháy' },

  // --- 7. HIỆU ỨNG HÀO QUANG AURA (AURA VFX) ---
  { id: 'none', slot: 'aura', name: 'No Aura', vietnameseName: 'Không Vòng Phép', emoji: '⭕', priceGems: 0, rarity: 'Common', color: '#94a3b8' },
  { id: 'starlight', slot: 'aura', name: 'Starlight Glitter Field', vietnameseName: 'Hào Quang Bụi Sao Hoàng Kim', emoji: '🌟', priceGems: 750, rarity: 'Epic', color: '#facc15', effectDescription: 'Các đốm sao vàng lấp lánh bay quanh người' },
  { id: 'cyber_pulse', slot: 'aura', name: 'Cyber Matrix Wave', vietnameseName: 'Sóng Ma Trận Tương Lai', emoji: '⚡', priceGems: 1100, rarity: 'Legendary', color: '#06b6d4', effectDescription: 'Xung điện kỹ thuật số xoay vòng 3D' },
  { id: 'rainbow_ring', slot: 'aura', name: 'Mythic Rainbow Stardust Ring', vietnameseName: 'Vòng Phép Cầu Vồng Thần Thoại', emoji: '🌈', priceGems: 2200, rarity: 'Mythic', color: '#ec4899', effectDescription: 'Bão hạt sao cầu vồng xoay 360 độ cực đại' },
];

// ================= DANH MỤC THÚ CƯNG 3D ĐI DƯỚI CHÂN (GROUND PET SHOP) =================
export interface PetShopItem {
  id: string;
  name: string;
  vietnameseName: string;
  emoji: string;
  priceGems: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  color: string;
  description: string;
}

export const PET_SHOP_CATALOG: PetShopItem[] = [
  {
    id: 'pet_bunny',
    name: 'Fluffy White Bunny',
    vietnameseName: 'Thỏ Trắng Bông Gòn',
    emoji: '🐰',
    priceGems: 380,
    rarity: 'Rare',
    color: '#f472b6',
    description: 'Thỏ con tai dài đáng yêu, ôm củ cà rốt mini bên mình chạy lon ton!',
  },
  {
    id: 'pet_cat',
    name: 'Sweet Persian Kitten',
    vietnameseName: 'Mèo Ba Tư Kẹo Ngọt',
    emoji: '🐱',
    priceGems: 480,
    rarity: 'Rare',
    color: '#ec4899',
    description: 'Mèo con lông trắng muốt với chuông vàng leng keng ở cổ vui nhộn!',
  },
  {
    id: 'pet_corgi',
    name: 'Playful Corgi Puppy',
    vietnameseName: 'Cún Corgi Tinh Nghịch',
    emoji: '🐶',
    priceGems: 550,
    rarity: 'Rare',
    color: '#f59e0b',
    description: 'Chú cún tai to lông vàng, luôn chạy lon ton trung thành bên chân bé!',
  },
  {
    id: 'pet_penguin',
    name: 'Mini Emperor Penguin',
    vietnameseName: 'Cánh Cụt Hoàng Đế Mini',
    emoji: '🐧',
    priceGems: 700,
    rarity: 'Epic',
    color: '#0ea5e9',
    description: 'Bé cánh cụt quàng khăn ấm, lắc lư từng bước đi siêu ngộ nghĩnh dưới chân!',
  },
  {
    id: 'pet_fox',
    name: 'Mystic Fennec Fox',
    vietnameseName: 'Cáo Lửa Thần Rừng',
    emoji: '🦊',
    priceGems: 850,
    rarity: 'Epic',
    color: '#ea580c',
    description: 'Chú cáo tai to với chiếc đuôi xù cam đỏ bồng bềnh thần kỳ mang lại may mắn!',
  },
  {
    id: 'pet_dragon',
    name: 'Baby Fire Dragon',
    vietnameseName: 'Rồng Con Lửa Đỏ',
    emoji: '🐉',
    priceGems: 1200,
    rarity: 'Legendary',
    color: '#ef4444',
    description: 'Bé rồng lon ton dưới chân, biết vẫy cánh và ngúng nguẩy đuôi bảo vệ bé!',
  },
];

export interface StickerCatalogItem {
  id: string;
  name: string;
  vietnamese: string;
  phonetic: string;
  sentence: string;
  emoji: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  category: 'Animals' | 'Food' | 'Space & Tech' | 'Fantasy & Eco';
}

export const STICKER_CATALOG: StickerCatalogItem[] = [
  { id: 'sticker_cow', name: 'Happy Cow', vietnamese: 'Bò Sữa Vui Vẻ', phonetic: '/ˈhæp.i kaʊ/', sentence: 'The friendly cow gives us fresh milk!', emoji: '🐮', rarity: 'Common', category: 'Animals' },
  { id: 'sticker_duck', name: 'Golden Duck', vietnamese: 'Vịt Vàng Bơi Lội', phonetic: '/ˈɡəʊl.dən dʌk/', sentence: 'Look at the little duck swimming in the pond!', emoji: '🦆', rarity: 'Common', category: 'Animals' },
  { id: 'sticker_rabbit', name: 'Jumping Rabbit', vietnamese: 'Thỏ Trắng Nhảy Cao', phonetic: '/ˈdʒʌm.pɪŋ ˈræb.ɪt/', sentence: 'The white rabbit hops over the green grass.', emoji: '🐰', rarity: 'Common', category: 'Animals' },
  { id: 'sticker_lion', name: 'Brave Lion King', vietnamese: 'Sư Tử Dũng Mãnh', phonetic: '/breɪv ˈlaɪ.ən kɪŋ/', sentence: 'The lion is the brave king of the jungle!', emoji: '🦁', rarity: 'Rare', category: 'Animals' },
  { id: 'sticker_dolphin', name: 'Ocean Dolphin', vietnamese: 'Cá Heo Đại Dương', phonetic: '/ˈəʊ.ʃən ˈdɒl.fɪn/', sentence: 'Intelligent dolphins leap high above the waves.', emoji: '🐬', rarity: 'Rare', category: 'Animals' },
  { id: 'sticker_panda', name: 'Bamboo Panda', vietnamese: 'Gấu Trúc Quý Hiếm', phonetic: '/bæmˈbuː ˈpæn.də/', sentence: 'We must protect endangered giant pandas!', emoji: '🐼', rarity: 'Epic', category: 'Animals' },
  { id: 'sticker_apple', name: 'Crunchy Apple', vietnamese: 'Táo Đỏ Giòn Tan', phonetic: '/ˈkrʌn.tʃi ˈæp.əl/', sentence: 'An apple a day keeps the doctor away!', emoji: '🍎', rarity: 'Common', category: 'Food' },
  { id: 'sticker_banana', name: 'Sweet Banana', vietnamese: 'Chuối Vàng Ngọt Lịm', phonetic: '/swiːt bəˈnæn.ə/', sentence: 'Bananas give you energy for sports!', emoji: '🍌', rarity: 'Common', category: 'Food' },
  { id: 'sticker_strawberry', name: 'Berry Queen', vietnamese: 'Nữ Hoàng Dâu Tây', phonetic: '/ˈstrɔː.bər.i/', sentence: 'Fresh strawberries taste delicious on cakes.', emoji: '🍓', rarity: 'Rare', category: 'Food' },
  { id: 'sticker_orange', name: 'Sunny Orange', vietnamese: 'Cam Tươi Mọng Nước', phonetic: '/ˈsʌn.i ˈɒr.ɪndʒ/', sentence: 'Orange juice has lots of Vitamin C.', emoji: '🍊', rarity: 'Common', category: 'Food' },
  { id: 'sticker_robot', name: 'AI Helper Bot', vietnamese: 'Robot AI Thông Minh', phonetic: '/ˈrəʊ.bɒt/', sentence: 'My AI robot helps me practice English speaking!', emoji: '🤖', rarity: 'Epic', category: 'Space & Tech' },
  { id: 'sticker_rocket', name: 'Galaxy Rocket', vietnamese: 'Tên Lửa Ngân Hà', phonetic: '/ˈɡæl.ək.si ˈrɒk.ɪt/', sentence: 'The rocket blasts off to explore Mars!', emoji: '🚀', rarity: 'Rare', category: 'Space & Tech' },
  { id: 'sticker_astronaut', name: 'Space Explorer', vietnamese: 'Phi Hành Gia Vũ Trụ', phonetic: '/ˈæs.trə.nɔːt/', sentence: 'The astronaut floats outside the space station.', emoji: '👩‍🚀', rarity: 'Epic', category: 'Space & Tech' },
  { id: 'sticker_ufo', name: 'Flying Car UFO', vietnamese: 'Đĩa Bay & Xe Tự Lái', phonetic: '/ˈflaɪ.ɪŋ kɑːr/', sentence: 'Driverless flying cars will travel across the sky.', emoji: '🛸', rarity: 'Legendary', category: 'Space & Tech' },
  { id: 'sticker_dragon', name: 'Mythic Dragon', vietnamese: 'Rồng Thần Huyền Thoại', phonetic: '/ˈmɪθ.ɪk ˈdræɡ.ən/', sentence: 'The friendly dragon guards the English treasure!', emoji: '🐉', rarity: 'Legendary', category: 'Fantasy & Eco' },
  { id: 'sticker_castle', name: 'Magic Kingdom', vietnamese: 'Lâu Đài Phép Thuật', phonetic: '/ˈmædʒ.ɪk ˈkɑː.səl/', sentence: 'Welcome to the grand castle of knowledge!', emoji: '🏰', rarity: 'Epic', category: 'Fantasy & Eco' },
  { id: 'sticker_rainbow', name: 'Double Rainbow', vietnamese: 'Cầu Vồng Đôi Rực Rỡ', phonetic: '/ˈreɪn.bəʊ/', sentence: 'A colorful rainbow shines after the summer rain.', emoji: '🌈', rarity: 'Rare', category: 'Fantasy & Eco' },
  { id: 'sticker_earth', name: 'Green Planet Earth', vietnamese: 'Trái Đất Xanh Sạch', phonetic: '/ɡriːn ˈplæn.ɪt/', sentence: 'If we use renewable energy, we will save our Earth!', emoji: '🌍', rarity: 'Legendary', category: 'Fantasy & Eco' },
  { id: 'sticker_crown', name: 'Champion Crown', vietnamese: 'Vương Miện Quán Quân', phonetic: '/ˈtʃæm.pi.ən kraʊn/', sentence: 'Speaking English fluently is a piece of cake!', emoji: '👑', rarity: 'Legendary', category: 'Fantasy & Eco' },
  { id: 'sticker_gem', name: 'Rainbow Crystal', vietnamese: 'Pha Lê Cầu Vồng', phonetic: '/ˈkrɪs.təl dʒem/', sentence: 'We found a sparkling crystal inside the cave!', emoji: '💎', rarity: 'Epic', category: 'Fantasy & Eco' },
];

export interface DioramaSceneMeta {
  id: string;
  name: string;
  vietnameseName: string;
  emoji: string;
  bgGradient: string;
  decorEmojis: { emoji: string; left: string; top: string; size: string }[];
}

export const DIORAMA_SCENES: DioramaSceneMeta[] = [
  {
    id: 'sunny_farm',
    name: 'Sunny Rainbow Farm',
    vietnameseName: 'Nông Trại Cầu Vồng',
    emoji: '🌻',
    bgGradient: 'linear-gradient(180deg, #38bdf8 0%, #bae6fd 52%, #4ade80 53%, #16a34a 100%)',
    decorEmojis: [
      { emoji: '☀️', left: '10%', top: '12%', size: '3.5rem' },
      { emoji: '☁️', left: '35%', top: '16%', size: '3rem' },
      { emoji: '☁️', left: '75%', top: '10%', size: '2.8rem' },
      { emoji: '🏡', left: '82%', top: '42%', size: '4rem' },
      { emoji: '🌳', left: '12%', top: '44%', size: '4rem' },
      { emoji: '🌻', left: '22%', top: '78%', size: '2.4rem' },
      { emoji: '🌷', left: '88%', top: '82%', size: '2.4rem' },
    ],
  },
  {
    id: 'ocean_palace',
    name: 'Atlantis Ocean Reef',
    vietnameseName: 'Thủy Cung Đại Dương',
    emoji: '🐚',
    bgGradient: 'linear-gradient(180deg, #0284c7 0%, #0369a1 60%, #fde68a 82%, #f59e0b 100%)',
    decorEmojis: [
      { emoji: '🫧', left: '18%', top: '20%', size: '2.5rem' },
      { emoji: '🫧', left: '78%', top: '25%', size: '2.8rem' },
      { emoji: '🪸', left: '12%', top: '76%', size: '3.5rem' },
      { emoji: '🐚', left: '48%', top: '86%', size: '2.5rem' },
      { emoji: '⚓', left: '84%', top: '75%', size: '3.2rem' },
    ],
  },
  {
    id: 'magic_castle',
    name: 'Starlight Magic Kingdom',
    vietnameseName: 'Vương Quốc Phép Thuật',
    emoji: '🏰',
    bgGradient: 'linear-gradient(180deg, #3b0764 0%, #6b21a8 55%, #c084fc 80%, #4ade80 81%, #15803d 100%)',
    decorEmojis: [
      { emoji: '🌙', left: '12%', top: '14%', size: '3.5rem' },
      { emoji: '✨', left: '45%', top: '15%', size: '2.5rem' },
      { emoji: '🏰', left: '78%', top: '36%', size: '4.5rem' },
      { emoji: '🍄', left: '15%', top: '78%', size: '2.8rem' },
    ],
  },
  {
    id: 'space_station',
    name: 'Future Galaxy Orbit',
    vietnameseName: 'Trạm Vũ Trụ Tương Lai',
    emoji: '🪐',
    bgGradient: 'linear-gradient(180deg, #090d16 0%, #1e1b4b 55%, #312e81 78%, #475569 79%, #1e293b 100%)',
    decorEmojis: [
      { emoji: '🪐', left: '15%', top: '16%', size: '4rem' },
      { emoji: '🌍', left: '80%', top: '18%', size: '3.8rem' },
      { emoji: '⭐', left: '50%', top: '12%', size: '2.2rem' },
      { emoji: '🛰️', left: '35%', top: '28%', size: '3rem' },
    ],
  },
];

// ============================================================================
// KHO VẬT PHẨM TRANG TRÍ & KIẾN TRÚC ĐẢO CÁ NHÂN 3D (PERSONAL 3D HOME ISLAND)
// ============================================================================
export type IslandDecorCategory = 'gate' | 'statue' | 'building' | 'nature' | 'vehicle';

export interface IslandDecorItem {
  id: string;
  category: IslandDecorCategory;
  name: string;
  vietnameseName: string;
  phonetic: string;
  englishSentence: string;
  emoji: string;
  priceGems: number;
  unlockByIslandNumber?: number; // Mở khóa miễn phí khi vượt qua Đảo Boss tương ứng!
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  glbUrl?: string;
  sculptType?: 'rainbow_gate' | 'stone_torii' | 'crystal_fountain' | 'golden_trophy' | 'starlight_lamp';
  pedestal?: boolean; // Đặt trên bệ đá tượng đài
  defaultScale?: number;
}

export const ISLAND_DECOR_CATALOG: IslandDecorItem[] = [
  // 1. CỔNG CHÀO & ĐÀI PHUN NƯỚC (GATES & FOUNTAINS)
  {
    id: 'decor_gate_rainbow',
    category: 'gate',
    name: 'Rainbow Welcome Arch',
    vietnameseName: 'Cổng Chào Cầu Vồng 3D',
    phonetic: '/ˈreɪn.bəʊ ˈwel.kəm ɑːtʃ/',
    englishSentence: 'Welcome through the magical rainbow arch of my island!',
    emoji: '🌈',
    priceGems: 0,
    rarity: 'Epic',
    sculptType: 'rainbow_gate',
    defaultScale: 1.1,
  },
  {
    id: 'decor_gate_torii',
    category: 'gate',
    name: 'Ancient Stone Gate (.glb)',
    vietnameseName: 'Cổng Đá Cổ Đại 3D (.glb)',
    phonetic: '/ˈeɪn.ʃənt stəʊn ɡeɪt/',
    englishSentence: 'The ancient stone gate glows with mysterious runes.',
    emoji: '⛩️',
    priceGems: 120,
    unlockByIslandNumber: 10,
    rarity: 'Epic',
    glbUrl: '/models/Gate3D.glb',
    defaultScale: 1.25,
  },
  {
    id: 'decor_fountain_crystal',
    category: 'gate',
    name: 'Crystal Magic Fountain',
    vietnameseName: 'Đài Phun Nước Pha Lê 3D',
    phonetic: '/ˈkrɪs.təl ˈfaʊn.tɪn/',
    englishSentence: 'Sparkling water dances in the crystal fountain!',
    emoji: '⛲',
    priceGems: 150,
    unlockByIslandNumber: 20,
    rarity: 'Legendary',
    sculptType: 'crystal_fountain',
    defaultScale: 1.1,
  },
  {
    id: 'decor_gate_obelisk',
    category: 'gate',
    name: 'Mystic Stone Obelisk (.glb)',
    vietnameseName: 'Trụ Đá Phương尖 Cổ Ngữ (.glb)',
    phonetic: '/ˈɒb.əl.ɪsk/',
    englishSentence: 'The tall stone obelisk points toward the constellations.',
    emoji: '🗼',
    priceGems: 140,
    rarity: 'Epic',
    glbUrl: '/models/Obelisk3D.glb',
    defaultScale: 1.3,
  },

  // 2. TƯỢNG ĐÁ & CÚP VINH QUANG (STATUES & MONUMENTS)
  {
    id: 'decor_statue_yeti',
    category: 'statue',
    name: 'Guardian Yeti Statue',
    vietnameseName: 'Tượng Đá Vệ Thần Yeti (.glb)',
    phonetic: '/ˈɡɑː.di.ən ˈjet.i ˈstætʃ.uː/',
    englishSentence: 'The mighty Yeti statue guards our island treasure!',
    emoji: '🗿',
    priceGems: 0,
    rarity: 'Rare',
    glbUrl: '/models/Yeti.glb',
    pedestal: true,
    defaultScale: 1.0,
  },
  {
    id: 'decor_statue_dragon',
    category: 'statue',
    name: 'Ancient Dragon Statue (.glb)',
    vietnameseName: 'Tượng Rồng Thần Hộ Đảo (.glb)',
    phonetic: '/ˈdræɡ.ən ˈstætʃ.uː/',
    englishSentence: 'The ancient dragon statue watches over the floating island!',
    emoji: '🐉',
    priceGems: 210,
    rarity: 'Legendary',
    glbUrl: '/models/DragonPet3D.glb',
    pedestal: true,
    defaultScale: 1.15,
  },
  {
    id: 'decor_statue_crystal',
    category: 'statue',
    name: 'Giant Mana Crystal (.glb)',
    vietnameseName: 'Pha Lê Năng Lượng Khổng Lồ (.glb)',
    phonetic: '/ˈkrɪs.təl/',
    englishSentence: 'A giant glowing crystal gives magical energy to the island!',
    emoji: '💎',
    priceGems: 165,
    rarity: 'Epic',
    glbUrl: '/models/Crystal3D.glb',
    pedestal: true,
    defaultScale: 1.15,
  },
  {
    id: 'decor_statue_chest',
    category: 'statue',
    name: 'Royal Treasure Chest (.glb)',
    vietnameseName: 'Rương Kho Báu Hoàng Gia (.glb)',
    phonetic: '/ˈtreʒ.ər tʃest/',
    englishSentence: 'Open the royal treasure chest to discover golden coins!',
    emoji: '🧰',
    priceGems: 135,
    rarity: 'Rare',
    glbUrl: '/models/TreasureChest3D.glb',
    pedestal: true,
    defaultScale: 1.05,
  },
  {
    id: 'decor_statue_trophy',
    category: 'statue',
    name: 'Golden Champion Trophy',
    vietnameseName: 'Tượng Cúp Vàng Quán Quân',
    phonetic: '/ˈɡəʊl.dən ˈtʃæm.pi.ən ˈtrəʊ.fi/',
    englishSentence: 'I won the golden champion trophy by mastering English!',
    emoji: '🏆',
    priceGems: 180,
    unlockByIslandNumber: 30,
    rarity: 'Legendary',
    sculptType: 'golden_trophy',
    defaultScale: 1.15,
  },
  {
    id: 'decor_statue_sword',
    category: 'statue',
    name: 'Sword in the Stone',
    vietnameseName: 'Thanh Kiếm Trong Đá Cổ Ngữ (.glb)',
    phonetic: '/sɔːd ɪn ðə stəʊn/',
    englishSentence: 'Only a true hero can pull the rune sword from the stone!',
    emoji: '⚔️',
    priceGems: 160,
    unlockByIslandNumber: 40,
    rarity: 'Epic',
    glbUrl: '/models/RuneSword.glb',
    pedestal: true,
    defaultScale: 1.15,
  },
  {
    id: 'decor_statue_snowman',
    category: 'statue',
    name: 'Happy Snowman Statue',
    vietnameseName: 'Tượng Người Tuyết Bắc Cực (.glb)',
    phonetic: '/ˈsnəʊ.mæn ˈstætʃ.uː/',
    englishSentence: 'This magical snowman never melts in the summer sun!',
    emoji: '⛄',
    priceGems: 110,
    rarity: 'Rare',
    glbUrl: '/models/Snowman.glb',
    pedestal: true,
    defaultScale: 1.05,
  },
  {
    id: 'decor_statue_astronaut',
    category: 'statue',
    name: 'Space Hero Monument',
    vietnameseName: 'Tượng Đài Phi Hành Gia (.glb)',
    phonetic: '/speɪs ˈhɪə.rəʊ ˈmɒn.jə.mənt/',
    englishSentence: 'The astronaut monument inspires us to reach for the stars!',
    emoji: '👩‍🚀',
    priceGems: 220,
    unlockByIslandNumber: 60,
    rarity: 'Legendary',
    glbUrl: '/models/Astronaut.glb',
    pedestal: true,
    defaultScale: 1.1,
  },
  {
    id: 'decor_statue_heart',
    category: 'statue',
    name: 'Ruby Heart Monument',
    vietnameseName: 'Đài Pha Lê Trái Tim Hồng (.glb)',
    phonetic: '/ˈruː.bi hɑːt/',
    englishSentence: 'A giant ruby heart shines brightly in the center of my island.',
    emoji: '💖',
    priceGems: 130,
    rarity: 'Epic',
    glbUrl: '/models/Heart.glb',
    pedestal: true,
    defaultScale: 1.0,
  },

  // 3. LÂU ĐÀI & NHÀ CỬA KIẾN TRÚC (BUILDINGS & LANDMARKS)
  {
    id: 'decor_bldg_cottage',
    category: 'building',
    name: 'Cozy Country Cottage',
    vietnameseName: 'Biệt Thự Gỗ Nông Trại (.glb)',
    phonetic: '/ˈkəʊ.zi ˈkɒt.ɪdʒ/',
    englishSentence: 'My cozy cottage has a warm chimney and a lovely roof.',
    emoji: '🏡',
    priceGems: 0,
    rarity: 'Common',
    glbUrl: '/models/Cottage.glb',
    defaultScale: 1.35,
  },
  {
    id: 'decor_bldg_sawmill',
    category: 'building',
    name: ' Timber Watermill House',
    vietnameseName: 'Xưởng Cối Xay Gió Cổ Điển (.glb)',
    phonetic: '/ˈwɔː.tə.mɪl haʊs/',
    englishSentence: 'The wooden mill turns smoothly by the island river.',
    emoji: '🛖',
    priceGems: 160,
    unlockByIslandNumber: 50,
    rarity: 'Epic',
    glbUrl: '/models/SawMill.glb',
    defaultScale: 1.35,
  },
  {
    id: 'decor_bldg_castle',
    category: 'building',
    name: 'Grand Royal Castle',
    vietnameseName: 'Lâu Đài Hiệp Sĩ Hoàng Gia (.glb)',
    phonetic: '/ɡrænd ˈrɔɪ.əl ˈkɑː.səl/',
    englishSentence: 'The grand royal castle stands proudly on my personal island!',
    emoji: '🏰',
    priceGems: 280,
    unlockByIslandNumber: 80,
    rarity: 'Legendary',
    glbUrl: '/models/InnCastle.glb',
    defaultScale: 1.55,
  },

  // 4. CÂY CỐI, HOA & SINH VẬT CẢNH (NATURE & GARDEN)
  {
    id: 'decor_nature_tree',
    category: 'nature',
    name: 'Ancient Wishing Tree',
    vietnameseName: 'Cây Cổ Thụ Ước Nguyện (.glb)',
    phonetic: '/ˈwɪʃ.ɪŋ triː/',
    englishSentence: 'Make a wish under the green leaves of the ancient tree!',
    emoji: '🌳',
    priceGems: 0,
    rarity: 'Common',
    glbUrl: '/models/VillageTree.glb',
    defaultScale: 1.25,
  },
  {
    id: 'decor_nature_flamingo',
    category: 'nature',
    name: 'Flamingo Sanctuary',
    vietnameseName: 'Vườn Hồng Hạc Sống Động (.glb)',
    phonetic: '/fləˈmɪŋ.ɡəʊ/',
    englishSentence: 'Pink flamingos love dancing near the tropical flowers.',
    emoji: '🦩',
    priceGems: 95,
    rarity: 'Rare',
    glbUrl: '/models/Flamingo.glb',
    defaultScale: 0.95,
  },
  {
    id: 'decor_nature_duckpond',
    category: 'nature',
    name: 'Golden Duck Sculpture',
    vietnameseName: 'Vịt Vàng May Mắn (.glb)',
    phonetic: '/ˈɡəʊl.dən dʌk/',
    englishSentence: 'The cheerful yellow duck brings good luck to visitors!',
    emoji: '🦆',
    priceGems: 90,
    rarity: 'Common',
    glbUrl: '/models/Duck.glb',
    defaultScale: 0.9,
  },
  {
    id: 'decor_nature_lamp',
    category: 'nature',
    name: 'Starlight Garden Lamp',
    vietnameseName: 'Trụ Đèn Đường Ánh Sao 3D',
    phonetic: '/ˈstɑː.laɪt læmp/',
    englishSentence: 'Golden street lamps light up the stone path at night.',
    emoji: '🏮',
    priceGems: 75,
    rarity: 'Common',
    sculptType: 'starlight_lamp',
    defaultScale: 1.0,
  },

  // 5. SIÊU XE & CHUYÊN CƠ TRƯNG BÀY (VEHICLES & TECH)
  {
    id: 'decor_veh_car',
    category: 'vehicle',
    name: 'Super Racing Car',
    vietnameseName: 'Siêu Xe Đua Thể Thao (.glb)',
    phonetic: '/ˈreɪ.sɪŋ kɑːr/',
    englishSentence: 'I parked my red racing car right in front of my cottage!',
    emoji: '🏎️',
    priceGems: 190,
    rarity: 'Epic',
    glbUrl: '/models/Car.glb',
    defaultScale: 1.15,
  },
  {
    id: 'decor_veh_plane',
    category: 'vehicle',
    name: 'Island Explorer Plane',
    vietnameseName: 'Chuyên Cơ Thám Hiểm Đảo (.glb)',
    phonetic: '/ɪkˈsplɔː.rər pleɪn/',
    englishSentence: 'Hop on my airplane to fly across all eighty islands!',
    emoji: '✈️',
    priceGems: 240,
    unlockByIslandNumber: 70,
    rarity: 'Legendary',
    glbUrl: '/models/Plane.glb',
    defaultScale: 1.25,
  },
];

