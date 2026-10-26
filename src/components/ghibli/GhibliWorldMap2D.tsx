import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Crown,
  Lock,
  CheckCircle2,
  Play,
  ArrowLeft,
  Sparkles,
  MapPin,
  Volume2,
  Star,
  ChevronRight,
  Compass,
  Home,
  Shield,
  Flame,
} from 'lucide-react';
import { IslandLesson, IslandZoneMeta, KingdomInfo } from '../../data/curriculumData';
import { sound } from '../../lib/sound';
import { GhibliVillage1InteractiveMap } from './GhibliVillage1InteractiveMap';

interface GhibliWorldMap2DProps {
  islands: IslandLesson[]; // 80 bài học của cấp độ hiện tại
  completedLessons: string[];
  lessonStars: Record<string, number>;
  lessonMistakes?: Record<string, number>;
  selectedIslandId: string;
  onSelectIsland: (isl: IslandLesson, isUnlocked: boolean) => void;
  tierInfo: KingdomInfo;
  tierZones: IslandZoneMeta[];
  avatarBase?: string;
  nickname?: string;
}

// Bảng tên và kiến trúc cổ tích Ghibli cho 8 Ngôi Làng
const GHIBLI_VILLAGES_INFO: Record<
  number,
  {
    villageName: string;
    subName: string;
    description: string;
    vibeColor: string;
    bgGradient: string;
    bossName: string;
    bossDesc: string;
    icon: string;
  }
> = {
  1: {
    villageName: 'Làng Cỏ May & Mèo Con',
    subName: 'Sunny Meadow & Kitten Hamlet',
    description: 'Ngôi làng bình yên dưới bóng cây dẻ gai, nơi hai chú mèo Kuro & Shiro đón chào bé.',
    vibeColor: '#22c55e',
    bgGradient: 'from-emerald-900/40 via-teal-900/30 to-green-950/70',
    bossName: 'Cây Cổ Thụ Thần Rừng Ngàn Năm',
    bossDesc: 'Đánh thức thần cây bảo hộ để mở cổng sang vùng đất tiếp theo!',
    icon: '🐱',
  },
  2: {
    villageName: 'Thị Trấn Suối Nước & Bác Gấu',
    subName: 'Sweet Streamside Town',
    description: 'Thị trấn thơm lừng mùi bánh mì nóng hổi bên bờ suối trong vắt róc rách.',
    vibeColor: '#f59e0b',
    bgGradient: 'from-amber-950/40 via-orange-900/30 to-stone-900/70',
    bossName: 'Lâu Đài Cối Xay Gió Hoàng Gia',
    bossDesc: 'Giải mã cỗ máy gió khổng lồ cùng Bác Gấu thợ bánh!',
    icon: '🍞',
  },
  3: {
    villageName: 'Đồi Gió & Nông Trại Cổ Tích',
    subName: 'Windy Hillside Farm',
    description: 'Thảo nguyên lộng gió với những bầy cừu trắng muốt như mây và vườn dâu tây chín mọng.',
    vibeColor: '#10b981',
    bgGradient: 'from-green-950/50 via-emerald-950/40 to-slate-950/70',
    bossName: 'Điện Thờ Đá Rêu Phong Cổ Đại',
    bossDesc: 'Thử thách trí tuệ với các câu hỏi cổ ngữ của Thần Gió!',
    icon: '🌾',
  },
  4: {
    villageName: 'Thị Trấn Lồng Đèn Đom Đóm',
    subName: 'Firefly Lantern Borough',
    description: 'Khu phố cổ ngập tràn ánh đèn lồng vàng ấm áp, những tiệm sách và đồ chơi gỗ.',
    vibeColor: '#ec4899',
    bgGradient: 'from-pink-950/40 via-purple-950/30 to-slate-950/70',
    bossName: 'Tháp Chuông Đồng Hồ Bí Ẩn',
    bossDesc: 'Chinh phục bài tập thời gian và các thói quen hàng ngày!',
    icon: '🏮',
  },
  5: {
    villageName: 'Thung Lũng Bến Thuyền Ven Sông',
    subName: 'Riverbank Harbor Valley',
    description: 'Thung lũng thanh bình với những chiếc thuyền buồm gỗ nhỏ neo đậu dưới rặng liễu rủ.',
    vibeColor: '#0ea5e9',
    bgGradient: 'from-sky-950/40 via-blue-950/30 to-slate-950/70',
    bossName: 'Chiến Hạm Thần Bí Kiki',
    bossDesc: 'Vượt qua bài tập phương tiện và chỉ đường của thuyền trưởng!',
    icon: '⛵',
  },
  6: {
    villageName: 'Rừng Nấm Dạ Quang & Pha Lê',
    subName: 'Crystal & Glowing Mushroom Grove',
    description: 'Khu rừng huyền bí với những cây nấm khổng lồ phát sáng sắc xanh ngọc bích.',
    vibeColor: '#8b5cf6',
    bgGradient: 'from-indigo-950/40 via-purple-950/30 to-slate-950/70',
    bossName: 'Cổng Cổ Ngữ Không Gian',
    bossDesc: 'Kích hoạt viên đá pha lê hội tụ toàn bộ từ vựng đã học!',
    icon: '🍄',
  },
  7: {
    villageName: 'Làng Phù Thủy Trên Vách Đá',
    subName: 'Cliffside Witch Sanctuary',
    description: 'Ngôi làng cổ kính ngắm nhìn biển mây, nơi các pháp sư nhí cưỡi chổi dạo chơi.',
    vibeColor: '#f43f5e',
    bgGradient: 'from-rose-950/40 via-red-950/30 to-slate-950/70',
    bossName: 'Đền Thờ Rồng Thần Hộ Mệnh',
    bossDesc: 'Đấu trí cùng Rồng Thần trong bài thi so sánh & ngữ pháp nâng cao!',
    icon: '🪄',
  },
  8: {
    villageName: 'Kinh Thành Mây Trắng Pippo',
    subName: 'The Celestial Crown Capital',
    description: 'Đỉnh cao của hành trình tri thức, thành phố cổ tích lộng lẫy giữa trời mây vàng rực.',
    vibeColor: '#eab308',
    bgGradient: 'from-amber-950/50 via-yellow-950/30 to-slate-950/70',
    bossName: 'Đại Điện Ngai Vàng Vua Pippo',
    bossDesc: 'Vinh quang Đỉnh Cao! Chinh phục trùm cuối để nhận Vương Miện Thần Kỳ!',
    icon: '👑',
  },
};

// 10 Công trình cổ tích Ghibli đặc sắc trong mỗi ngôi làng
const HOUSE_ARCHETYPES = [
  { name: 'Tiệm Bánh Mì Nướng Thơm Lừng', emoji: '🥐', roofColor: '#b45309' },
  { name: 'Ngôi Nhà Mái Ngói Máng Xối', emoji: '🏡', roofColor: '#9a3412' },
  { name: 'Quán Trà Thảo Mộc Bên Suối', emoji: '🍵', roofColor: '#047857' },
  { name: 'Xưởng Mộc Bác Gấu Hiền Lành', emoji: '🪵', roofColor: '#78350f' },
  { name: 'Tiệm Sách Cổ & Bản Đồ Bí Mật', emoji: '📚', roofColor: '#1d4ed8' },
  { name: 'Cối Xay Gió Đón Nắng Sớm', emoji: '🌾', roofColor: '#c2410c' },
  { name: 'Vườn Hoa Cúc & Tổ Chim Thần', emoji: '🌼', roofColor: '#15803d' },
  { name: 'Cây Cầu Gỗ Rêu Phong Lấp Lánh', emoji: '🪵', roofColor: '#6b21a8' },
  { name: 'Đài Thiên Văn Nấm Phát Sáng', emoji: '✨', roofColor: '#be185d' },
  { name: 'ĐẠI CÔNG TRÌNH TRÙM CUỐI', emoji: '👑', roofColor: '#eab308' }, // Level 10
];

export const GhibliWorldMap2D: React.FC<GhibliWorldMap2DProps> = ({
  islands,
  completedLessons,
  lessonStars,
  lessonMistakes,
  selectedIslandId,
  onSelectIsland,
  tierInfo,
  tierZones,
  nickname = 'Bé Yêu',
}) => {
  // Tìm bài học đang học hiện tại (Frontier)
  const frontierIsland = useMemo(() => {
    for (let i = 0; i < islands.length; i++) {
      if (!completedLessons.includes(islands[i].id)) {
        return islands[i];
      }
    }
    return islands[islands.length - 1] || islands[0];
  }, [islands, completedLessons]);

  const frontierZoneIndex = frontierIsland ? frontierIsland.zoneIndex : 1;

  // State: 'overworld' (Bản đồ con đường 8 Làng) | 'village' (Chi tiết 10 Ngôi nhà trong Làng)
  const [viewMode, setViewMode] = useState<'overworld' | 'village'>('overworld');
  const [currentVillageIndex, setCurrentVillageIndex] = useState<number>(frontierZoneIndex);
  const [hoveredLocation, setHoveredLocation] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Nhóm 80 bài học theo 8 Vùng Làng (10 bài/làng)
  const villageLessonsMap = useMemo(() => {
    const map: Record<number, IslandLesson[]> = {};
    for (let z = 1; z <= 8; z++) {
      map[z] = islands.filter((isl) => isl.zoneIndex === z).sort((a, b) => a.islandNumber - b.islandNumber);
    }
    return map;
  }, [islands]);

  // Kiểm tra Làng nào đã được mở khóa
  // Làng 1 luôn mở. Làng N mở khi đã vượt qua Boss (Level 10) của Làng N-1
  const isVillageUnlocked = (zoneIdx: number) => {
    if (zoneIdx === 1) return true;
    const prevVillageLessons = villageLessonsMap[zoneIdx - 1] || [];
    const prevBossLesson = prevVillageLessons[prevVillageLessons.length - 1];
    if (!prevBossLesson) return false;
    return completedLessons.includes(prevBossLesson.id);
  };

  // Tính số nhà và số sao đã đạt trong 1 ngôi làng
  const getVillageProgress = (zoneIdx: number) => {
    const lessons = villageLessonsMap[zoneIdx] || [];
    let completedCount = 0;
    let starsCount = 0;
    lessons.forEach((l) => {
      if (completedLessons.includes(l.id)) {
        completedCount++;
        starsCount += lessonStars[l.id] || 3;
      }
    });
    return {
      completedCount,
      totalCount: lessons.length || 10,
      starsCount,
      maxStars: (lessons.length || 10) * 3,
      isFullyCompleted: completedCount === (lessons.length || 10),
    };
  };

  // Khi bấm chọn một Làng trên Bản Đồ Đại Lộ
  const handleEnterVillage = (zoneIdx: number) => {
    sound.playClick();
    if (!isVillageUnlocked(zoneIdx)) {
      sound.playGentleTryAgain();
      return;
    }
    setCurrentVillageIndex(zoneIdx);
    setViewMode('village');
    const villageInfo = GHIBLI_VILLAGES_INFO[zoneIdx];
    sound.speakEnglish(villageInfo.villageName);
  };

  const currentVillageData = GHIBLI_VILLAGES_INFO[currentVillageIndex] || GHIBLI_VILLAGES_INFO[1];
  const currentVillageLessons = villageLessonsMap[currentVillageIndex] || [];
  const currentZoneMeta = tierZones.find((z) => z.zoneIndex === currentVillageIndex) || tierZones[0];

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col justify-between bg-[#112316] select-none">
      {/* =========================================================================
          LỚP ÁNH SÁNG & KHÔNG KHÍ GHIBLI (KOMOREBI SUNLIGHT & DAPPLED SHADOWS)
          ========================================================================= */}
      {/* 1. Nắng chiếu xiên qua kẽ lá (Komorebi light rays) */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-30 mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse at 15% 10%, rgba(254, 240, 138, 0.45) 0%, rgba(253, 224, 71, 0.25) 30%, transparent 70%), linear-gradient(125deg, rgba(254, 240, 138, 0.2) 0%, transparent 60%)',
          animation: 'ghibli-komorebi 8s ease-in-out infinite',
        }}
      />

      {/* 2. Dải bóng lá râm mát đung đưa trên đỉnh màn hình */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-28 z-10 opacity-70 bg-gradient-to-b from-[#091b0f]/90 via-[#0d2818]/40 to-transparent" />

      {/* =========================================================================
          HEADER GHIBLI: THANH ĐIỀU HƯỚNG VÀ HUY HIỆU VÙNG ĐẤT
          ========================================================================= */}
      <header className="relative z-30 px-4 sm:px-6 pt-3 flex items-center justify-between gap-3 pointer-events-auto">
        {viewMode === 'village' ? (
          /* Nút Quay Lại Đại Lộ Lớn */
          <button
            onClick={() => {
              sound.playClick();
              setViewMode('overworld');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-950/80 hover:bg-amber-900 border-2 border-amber-300/70 text-amber-100 font-display font-extrabold text-xs shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-amber-300" />
            <span>⬅ Quay Về Đại Lộ Liên Làng</span>
          </button>
        ) : (
          /* Thẻ Chào Mừng & Biểu Tượng Làng Cổ Tích */
          <div className="flex items-center gap-2.5 bg-emerald-950/80 backdrop-blur-md border-2 border-emerald-400/50 px-4 py-2 rounded-2xl shadow-xl">
            <span className="text-2xl animate-ghibli-sway inline-block">🌿</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xs sm:text-sm text-emerald-200">
                  Đại Lộ Cổ Tích Pippo
                </span>
                <span className="text-[10px] font-extrabold bg-amber-400/90 text-amber-950 px-2 py-0.2 rounded-full">
                  8 Ngôi Làng
                </span>
              </div>
              <div className="text-[10px] font-bold text-emerald-300/80 flex items-center gap-1">
                <span>{tierInfo.vietnameseName}</span>
                <span>•</span>
                <span>80 Ngôi Nhà Khám Phá</span>
              </div>
            </div>
          </div>
        )}

        {/* Khung Tranh 2 Bé Mèo Kuro & Shiro Thập Thò Đáng Yêu (Reference Photo Banner) */}
        <div className="flex items-center gap-2 bg-[#2a1e17]/85 backdrop-blur-md border-2 border-[#b48d56]/70 px-3 py-1.5 rounded-2xl shadow-xl">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-300/60 shadow shrink-0 relative">
            <img
              src="/images/ghibli_cats.jpg"
              alt="Mèo Kuro & Shiro"
              className="w-full h-full object-cover object-top hover:scale-110 transition-transform"
            />
          </div>
          <div className="text-left hidden xs:block">
            <div className="text-[11px] font-display font-extrabold text-amber-200 flex items-center gap-1">
              <span>Kuro & Shiro</span>
              <span className="text-[9px] bg-rose-500/80 text-white px-1.5 py-0.2 rounded-full">
                Bạn Đồng Hành
              </span>
            </div>
            <div className="text-[9px] font-bold text-amber-100/70">
              "Cùng bé chinh phục 80 ngôi nhà!"
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          NỘI DUNG CHÍNH (MAIN BODY): 2 TẦNG BẢN ĐỒ
          ========================================================================= */}
      <div
        ref={scrollRef}
        className="flex-1 w-full overflow-x-auto overflow-y-hidden relative z-20 flex items-center px-4 py-2 scroll-smooth"
      >
        {/* =======================================================================
            TẦNG 1: ĐẠI LỘ CỔ TÍCH NGOÀI CÙNG (OVERWORLD MAP - 8 NGÔI LÀNG)
            ======================================================================= */}
        {viewMode === 'overworld' && (
          <div className="min-w-[1720px] h-full flex items-center justify-between relative px-12">
            {/* Con đường mòn lát sỏi đá uốn lượn xuyên qua 8 Ngôi Làng */}
            <svg
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full h-44 pointer-events-none z-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8d6e63" stopOpacity="0.8" />
                  <stop offset="30%" stopColor="#a1887f" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#795548" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#5d4037" stopOpacity="0.9" />
                </linearGradient>
                <filter id="roadGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#1b4332" floodOpacity="0.6" />
                </filter>
              </defs>
              {/* Nền cỏ xanh đậm dưới đường */}
              <path
                d="M 50 110 Q 250 40, 480 110 T 920 110 T 1360 110 T 1680 90"
                fill="none"
                stroke="#1b4332"
                strokeWidth="56"
                strokeLinecap="round"
                filter="url(#roadGlow)"
              />
              {/* Con đường sỏi đá lát vàng nâu Ghibli */}
              <path
                d="M 50 110 Q 250 40, 480 110 T 920 110 T 1360 110 T 1680 90"
                fill="none"
                stroke="url(#roadGrad)"
                strokeWidth="38"
                strokeLinecap="round"
              />
              {/* Họa tiết đá sỏi chấm phá trên đường */}
              <path
                d="M 50 110 Q 250 40, 480 110 T 920 110 T 1360 110 T 1680 90"
                fill="none"
                stroke="#fef3c7"
                strokeWidth="4"
                strokeDasharray="14 26"
                strokeLinecap="round"
                opacity="0.45"
              />
            </svg>

            {/* 8 Cột Mốc Ngôi Làng & Thị Trấn Lớn */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((zoneIdx) => {
              const village = GHIBLI_VILLAGES_INFO[zoneIdx];
              const zoneMeta = tierZones.find((z) => z.zoneIndex === zoneIdx) || tierZones[0];
              const isUnlocked = isVillageUnlocked(zoneIdx);
              const isCurrent = zoneIdx === frontierZoneIndex;
              const { completedCount, totalCount, starsCount, isFullyCompleted } =
                getVillageProgress(zoneIdx);

              // Tọa độ uốn lượn nhấp nhô theo hình sin nhẹ
              const translateY = Math.sin(zoneIdx * 1.3) * 32;

              return (
                <div
                  key={zoneIdx}
                  style={{ transform: `translateY(${translateY}px)` }}
                  className="relative z-10 flex flex-col items-center group"
                >
                  {/* Huy Hiệu Chỉ Dẫn: "Bé Đang Ở Đây!" */}
                  {isCurrent && (
                    <div className="absolute -top-14 z-30 flex flex-col items-center animate-bounce">
                      <div className="bg-amber-400 text-amber-950 font-display font-black text-xs px-3 py-1 rounded-full border-2 border-white shadow-2xl flex items-center gap-1">
                        <span>🐱</span>
                        <span>{nickname} đang ở đây!</span>
                      </div>
                      <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-t-amber-400 border-l-transparent border-r-transparent" />
                    </div>
                  )}

                  {/* THẺ NGÔI LÀNG CỔ TÍCH CHÍNH */}
                  <div
                    onClick={() => handleEnterVillage(zoneIdx)}
                    className={`w-44 sm:w-48 rounded-3xl p-4 transition-all duration-300 relative cursor-pointer ${
                      isUnlocked
                        ? 'ghibli-parchment-card hover:scale-105 hover:-translate-y-2 shadow-2xl'
                        : 'bg-stone-900/80 border-2 border-stone-700/60 opacity-60 grayscale'
                    }`}
                  >
                    {/* Ổ Khóa khi Làng Chưa Mở */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 rounded-3xl bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-1 z-20">
                        <div className="w-12 h-12 rounded-2xl bg-stone-800 border-2 border-amber-600/50 flex items-center justify-center text-amber-200 shadow-xl">
                          <Lock className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-extrabold text-amber-200 bg-stone-900/90 px-2 py-0.5 rounded-full mt-1">
                          Khóa • Cần qua Làng {zoneIdx - 1}
                        </span>
                      </div>
                    )}

                    {/* Huy Hiệu Trạng Thái Hoàn Thành */}
                    {isFullyCompleted && (
                      <div className="absolute -top-3 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow animate-pulse z-20">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}

                    {/* Mái Nhà & Biểu Tượng Ngôi Làng */}
                    <div className="w-full h-24 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300/80 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                      {/* Lớp bóng nắng Ghibli */}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent" />
                      <span className="text-4xl filter drop-shadow relative z-10 group-hover:scale-110 transition-transform">
                        {village.icon}
                      </span>
                      <span className="text-[10px] font-extrabold text-amber-900/90 bg-white/70 px-2.5 py-0.5 rounded-full mt-1 relative z-10 shadow-xs">
                        Làng Số {zoneIdx}
                      </span>
                    </div>

                    {/* Tên & Mô Tả Ngôi Làng */}
                    <div className="mt-3 text-center">
                      <h3 className="font-display font-black text-sm text-amber-950 leading-snug group-hover:text-emerald-800 transition-colors">
                        {village.villageName}
                      </h3>
                      <p className="text-[10px] font-bold text-amber-800/80 line-clamp-1 mt-0.5">
                        {zoneMeta.vietnameseTitle.split(':')[1] || zoneMeta.title}
                      </p>

                      {/* Tiến Độ Số Nhà & Số Sao */}
                      <div className="mt-2.5 pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px] font-extrabold">
                        <span className="text-emerald-800 flex items-center gap-0.5">
                          <span>🏠</span>
                          <span>
                            {completedCount}/{totalCount}
                          </span>
                        </span>
                        <span className="text-amber-700 flex items-center gap-0.5">
                          <span>⭐</span>
                          <span>{starsCount}</span>
                        </span>
                      </div>

                      {/* Nút Bước Vào Làng */}
                      <button
                        type="button"
                        className={`w-full mt-2.5 py-2 px-3 rounded-xl font-display font-black text-xs flex items-center justify-center gap-1 transition-all ${
                          isUnlocked
                            ? 'btn-ghibli-leaf text-white'
                            : 'bg-stone-700 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        <span>{isUnlocked ? 'Bước Vào Làng' : 'Đang Khóa'}</span>
                        {isUnlocked && <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Cột mốc số làng cắm trên đường */}
                  <div className="mt-2 text-center">
                    <span className="font-display font-black text-xs text-amber-200/80 bg-stone-900/80 px-2.5 py-1 rounded-full border border-amber-400/30">
                      Chặng {zoneIdx}/8
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =======================================================================
            TẦNG 2: BÊN TRONG NGÔI LÀNG (INNER VILLAGE - 10 LEVELS CHI TIẾT)
            ======================================================================= */}
        {viewMode === 'village' && (
          <div className="w-full h-full flex flex-col justify-between py-2">
            {/* BANNER THÔNG TIN NGÔI LÀNG HIỆN TẠI */}
            <div className="w-full max-w-4xl mx-auto ghibli-parchment-card rounded-2xl px-5 py-3 flex items-center justify-between shadow-xl mb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow">
                  {currentVillageData.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-black text-base sm:text-lg text-emerald-950">
                      {currentVillageData.villageName}
                    </h2>
                    <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      Làng #{currentVillageIndex}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-amber-900/80 mt-0.5">
                    {currentVillageData.description}
                  </p>
                </div>
              </div>

              {/* Tiến độ chi tiết trong làng */}
              <div className="hidden sm:flex items-center gap-3 bg-amber-100/80 border border-amber-300 px-3.5 py-1.5 rounded-xl">
                <div className="text-right">
                  <div className="text-[11px] font-extrabold text-amber-950">Tiến Độ Làng</div>
                  <div className="text-xs font-black text-emerald-700">
                    {getVillageProgress(currentVillageIndex).completedCount}/10 Ngôi Nhà
                  </div>
                </div>
                <div className="text-2xl">🏡</div>
              </div>
            </div>

            {/* NẾU LÀ LÀNG 1: HIỂN THỊ BẢN ĐỒ TRANH VẼ TƯƠNG TÁC ĐỈNH CAO GHIBLI CÓ ANIMATION */}
            {currentVillageIndex === 1 ? (
              <div className="flex-1 w-full h-full min-h-[580px] flex items-center justify-center p-1 sm:p-2">
                <GhibliVillage1InteractiveMap
                  lessons={currentVillageLessons}
                  completedLessons={completedLessons}
                  lessonStars={lessonStars}
                  lessonMistakes={lessonMistakes}
                  frontierLessonId={frontierIsland?.id}
                  onSelectLesson={onSelectIsland}
                  nickname={nickname}
                />
              </div>
            ) : (
              /* CÁC LÀNG TIẾP THEO: CON ĐƯỜNG LÀNG TIÊU CHUẨN */
              <div className="flex-1 w-full overflow-x-auto overflow-y-hidden flex items-center px-6 py-2">
                <div className="min-w-[1380px] h-full flex items-center justify-between relative px-8">
                  {/* Con đường lát đá nhỏ trong làng */}
                  <svg
                    className="absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full h-28 pointer-events-none z-0"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M 40 60 Q 200 15, 380 60 T 700 60 T 1020 60 T 1340 50"
                      fill="none"
                      stroke="#8d6e63"
                      strokeWidth="28"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                    <path
                      d="M 40 60 Q 200 15, 380 60 T 700 60 T 1020 60 T 1340 50"
                      fill="none"
                      stroke="#fef3c7"
                      strokeWidth="3"
                      strokeDasharray="10 20"
                      strokeLinecap="round"
                      opacity="0.4"
                    />
                  </svg>

                  {/* 10 Địa Điểm: 9 Ngôi Nhà + 1 Công Trình Boss Cuối */}
                  {currentVillageLessons.map((lesson, idx) => {
                    const levelNum = idx + 1; // 1 đến 10
                    const isBoss = levelNum === 10;
                    const houseArchetype = HOUSE_ARCHETYPES[idx] || HOUSE_ARCHETYPES[0];
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isCurrent = lesson.id === frontierIsland?.id;
                    const stars = lessonStars[lesson.id] || (isCompleted ? 3 : 0);

                    const prevLesson = currentVillageLessons[idx - 1];
                    const isUnlocked = idx === 0 ? true : completedLessons.includes(prevLesson.id);
                    const waveY = Math.sin(idx * 1.2) * 24;

                    return (
                      <div
                        key={lesson.id}
                        style={{ transform: `translateY(${waveY}px)` }}
                        className="relative z-10 flex flex-col items-center group"
                        onMouseEnter={() => setHoveredLocation(levelNum)}
                        onMouseLeave={() => setHoveredLocation(null)}
                      >
                        {/* Bảng chỉ dẫn: Bé đang học nhà này */}
                        {isCurrent && (
                          <div className="absolute -top-12 z-30 flex flex-col items-center animate-bounce">
                            <div className="bg-amber-400 text-amber-950 font-display font-black text-[11px] px-3 py-0.5 rounded-full border-2 border-white shadow-xl flex items-center gap-1">
                              <span>📍</span>
                              <span>Nhà số {levelNum}</span>
                            </div>
                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-5 border-t-amber-400 border-l-transparent border-r-transparent" />
                          </div>
                        )}

                        {/* THẺ NGÔI NHÀ / CÔNG TRÌNH BOSS */}
                        <div
                          onClick={() => {
                            sound.playClick();
                            onSelectIsland(lesson, isUnlocked);
                          }}
                          className={`w-32 sm:w-36 rounded-2xl p-3 transition-all duration-200 relative cursor-pointer ${
                            isBoss
                              ? isUnlocked
                                ? 'ghibli-parchment-card border-3 border-amber-400 shadow-2xl animate-ghibli-boss'
                                : 'bg-stone-900 border-2 border-stone-700 opacity-60'
                              : isUnlocked
                              ? 'ghibli-parchment-card hover:scale-110 hover:-translate-y-2 shadow-xl'
                              : 'bg-stone-900/80 border-2 border-stone-800 opacity-50 grayscale'
                          }`}
                        >
                          {!isUnlocked && (
                            <div className="absolute inset-0 rounded-2xl bg-black/50 backdrop-blur-xs flex items-center justify-center z-20">
                              <Lock className="w-5 h-5 text-amber-200" />
                            </div>
                          )}

                          {isBoss && (
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-display font-black px-2.5 py-0.5 rounded-full border border-white shadow-lg flex items-center gap-1 z-20 whitespace-nowrap">
                              <Crown className="w-3.5 h-3.5 text-yellow-200" />
                              <span>TRÙM CUỐI</span>
                            </div>
                          )}

                          <div
                            className={`w-full h-18 rounded-xl flex flex-col items-center justify-center relative shadow-inner ${
                              isBoss
                                ? 'bg-gradient-to-br from-amber-200 via-rose-100 to-amber-300'
                                : 'bg-gradient-to-br from-amber-50 to-amber-100'
                            }`}
                          >
                            <span
                              className={`text-3xl filter drop-shadow transition-transform group-hover:scale-110 ${
                                isBoss ? 'text-4xl' : ''
                              }`}
                            >
                              {isBoss ? '🏰' : houseArchetype.emoji}
                            </span>
                            <span className="text-[9px] font-extrabold text-amber-900/90 bg-white/80 px-2 py-0.2 rounded-full mt-1">
                              {isBoss ? 'Cửa Ải Boss 👑' : `Lv.${levelNum}`}
                            </span>
                          </div>

                          <div className="mt-2 text-center">
                            <h4 className="font-display font-extrabold text-xs text-amber-950 line-clamp-1">
                              {isBoss ? currentVillageData.bossName : lesson.title.replace(/^Đảo #\d+:\s*/, '')}
                            </h4>

                            <div className="flex items-center justify-center gap-0.5 mt-1">
                              {[1, 2, 3].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= stars
                                      ? 'fill-amber-400 text-amber-500'
                                      : 'fill-stone-300 text-stone-400'
                                  }`}
                                />
                              ))}
                            </div>

                            <button
                              type="button"
                              className={`w-full mt-1.5 py-1 px-2 rounded-lg font-display font-extrabold text-[10px] flex items-center justify-center gap-1 transition-all ${
                                isUnlocked
                                  ? isBoss
                                    ? 'btn-ghibli-amber text-amber-950 font-black'
                                    : 'btn-ghibli-leaf text-white'
                                  : 'bg-stone-700 text-stone-400 cursor-not-allowed'
                              }`}
                            >
                              <Play className="w-2.5 h-2.5 fill-current" />
                              <span>{isCompleted ? 'Học Lại' : isUnlocked ? 'Vào Học' : 'Khóa'}</span>
                            </button>
                          </div>
                        </div>

                        <span className="mt-1.5 text-[10px] font-bold text-amber-100/80 bg-stone-900/80 px-2 py-0.5 rounded-full border border-amber-300/20 max-w-[130px] truncate">
                          {isBoss ? 'Cửa Ải Cuối' : houseArchetype.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          FOOTER GHIBLI: THANH HƯỚNG DẪN BÉ
          ========================================================================= */}
      <footer className="relative z-30 px-5 pb-3 pt-1 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-200/90 bg-emerald-950/70 backdrop-blur-sm border border-emerald-400/30 px-3.5 py-1.5 rounded-xl shadow">
          <span>🍃</span>
          <span>
            {viewMode === 'overworld'
              ? 'Bé hãy bấm vào một Ngôi Làng đã mở khóa để vào khám phá các ngôi nhà nhé!'
              : `Bé đang ở ${currentVillageData.villageName}. Vượt qua 9 Ngôi Nhà để chinh phục Trùm Cuối!`}
          </span>
        </div>

        {/* Nút cuộn nhanh hoặc đổi chế độ */}
        {viewMode === 'village' && (
          <button
            onClick={() => {
              sound.playClick();
              setViewMode('overworld');
            }}
            className="btn-ghibli-amber text-amber-950 font-display font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg hover:scale-105 transition-all"
          >
            <span>Bản Đồ 8 Làng</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </footer>
    </div>
  );
};
