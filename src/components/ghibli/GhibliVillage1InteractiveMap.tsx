import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Lock, CheckCircle2, Play, Volume2, Sparkles, X, ChevronRight } from 'lucide-react';
import { IslandLesson } from '../../data/curriculumData';
import { sound } from '../../lib/sound';

interface Village1MapProps {
  lessons: IslandLesson[]; // 10 lessons of Village 1
  completedLessons: string[];
  lessonStars: Record<string, number>;
  lessonMistakes?: Record<string, number>;
  frontierLessonId?: string;
  onSelectLesson: (isl: IslandLesson, isUnlocked: boolean) => void;
  nickname?: string;
}

// Tọa độ % chính xác trên bức tranh bản đồ Làng Cỏ May & Mèo Con
// Con đường lát đá dẫn từ Cổng làng (dưới) ➔ Cầu đá ➔ Giếng nước ➔ Đồi cỏ ➔ Cây Đại Thụ (đỉnh)
const VILLAGE_1_NODE_COORDINATES: { x: number; y: number; name: string; icon: string }[] = [
  { x: 48.5, y: 81.0, name: 'Nhà Nướng Bánh Cạnh Vườn', icon: '🥐' },    // Lv 1
  { x: 28.5, y: 61.5, name: 'Nhà Ngói Nung Hoa Tử Đằng', icon: '🏡' },    // Lv 2
  { x: 46.0, y: 65.0, name: 'Cầu Đá Vắt Qua Suối Nhỏ', icon: '🪵' },     // Lv 3
  { x: 77.0, y: 67.5, name: 'Xưởng Cối Xay Nước Cổ', icon: '🌾' },       // Lv 4
  { x: 64.0, y: 59.0, name: 'Nhà Hàng Xóm Bác Gấu', icon: '🪑' },        // Lv 5
  { x: 57.5, y: 46.5, name: 'Giếng Đá Cổ Tích Làng', icon: '⛲' },        // Lv 6
  { x: 44.0, y: 50.0, name: 'Quán Trà Thảo Mộc Rêu Phong', icon: '🍵' },  // Lv 7
  { x: 51.5, y: 42.5, name: 'Tiệm Sách Cổ Nguyện Ước', icon: '📚' },     // Lv 8
  { x: 72.0, y: 46.0, name: 'Ngôi Nhà Đón Gió Ven Đồi', icon: '🌼' },    // Lv 9
  { x: 69.5, y: 18.0, name: 'CÂY ĐẠI THỤ THẦN RỪNG', icon: '👑' },       // Lv 10 (TRÙM CUỐI 👑)
];

// Vị trí các ống khói để tạo khói bếp bốc lên
const CHIMNEY_COORDINATES = [
  { x: 51.5, y: 68.5 }, // Nhà Lv 1
  { x: 29.5, y: 48.0 }, // Nhà Lv 2
  { x: 52.8, y: 36.5 }, // Nhà Lv 8
  { x: 72.8, y: 38.0 }, // Nhà Lv 9
  { x: 19.8, y: 32.5 }, // Nhà xa góc trái
];

export const GhibliVillage1InteractiveMap: React.FC<Village1MapProps> = ({
  lessons,
  completedLessons,
  lessonStars,
  lessonMistakes,
  frontierLessonId,
  onSelectLesson,
  nickname = 'Bé Yêu',
}) => {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);
  const [catsChatBubble, setCatsChatBubble] = useState<string>(
    'Chào mừng bé! Cùng vượt qua 9 ngôi nhà để đến Cây Đại Thụ nhé!'
  );
  const [isCatsBouncing, setIsCatsBouncing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hiệu ứng hạt Canvas (Lá rơi, bụi nắng Komorebi, ánh nước lấp lánh)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 900);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', onResize);

    // 1. Danh sách lá cây và cánh hoa rơi
    interface Leaf {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotSpeed: number;
      color: string;
      opacity: number;
    }
    const leaves: Leaf[] = Array.from({ length: 24 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: Math.random() * 1.2 + 0.6,
      speedY: Math.random() * 0.9 + 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      color: Math.random() > 0.4 ? '#68a33c' : '#fbcfe8',
      opacity: Math.random() * 0.6 + 0.3,
    }));

    // 2. Danh sách bụi nắng vàng (Sun motes / Komorebi sparkles)
    interface SunMote {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      phase: number;
      maxAlpha: number;
    }
    const sunMotes: SunMote[] = Array.from({ length: 38 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1.2,
      speedY: -(Math.random() * 0.35 + 0.15),
      phase: Math.random() * Math.PI * 2,
      maxAlpha: Math.random() * 0.5 + 0.3,
    }));

    let t = 0;
    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      // A. Vẽ các đốm bụi nắng vàng bồng bềnh
      sunMotes.forEach((mote) => {
        mote.y += mote.speedY;
        mote.x += Math.sin(t + mote.phase) * 0.4;
        if (mote.y < -10) {
          mote.y = height + 10;
          mote.x = Math.random() * width;
        }

        const alpha = Math.abs(Math.sin(t + mote.phase)) * mote.maxAlpha;
        const grad = ctx.createRadialGradient(mote.x, mote.y, 0, mote.x, mote.y, mote.radius * 2);
        grad.addColorStop(0, `rgba(254, 240, 138, ${alpha})`);
        grad.addColorStop(0.5, `rgba(253, 224, 71, ${alpha * 0.6})`);
        grad.addColorStop(1, 'rgba(253, 224, 71, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // B. Vẽ lá cây & cánh hoa bay lượn
      leaves.forEach((leaf) => {
        leaf.x += leaf.speedX;
        leaf.y += leaf.speedY;
        leaf.rotation += leaf.rotSpeed;

        if (leaf.x > width + 20) leaf.x = -20;
        if (leaf.y > height + 20) leaf.y = -20;

        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rotation);
        ctx.fillStyle = leaf.color;
        ctx.globalAlpha = leaf.opacity;

        ctx.beginPath();
        ctx.ellipse(0, 0, leaf.size, leaf.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // C. Lớp ánh nắng Komorebi thở nhẹ ở góc trên bên trái
      const sunbeamAlpha = Math.sin(t * 0.8) * 0.08 + 0.16;
      const beamGrad = ctx.createLinearGradient(0, 0, width * 0.7, height);
      beamGrad.addColorStop(0, `rgba(254, 240, 138, ${sunbeamAlpha})`);
      beamGrad.addColorStop(0.4, `rgba(253, 224, 71, ${sunbeamAlpha * 0.4})`);
      beamGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Âm thanh khi click vào hai bé mèo
  const handleCatClick = () => {
    setIsCatsBouncing(true);
    sound.playPop();
    const catQuotes = [
      'Meow~ Kuro và Shiro chúc bé học thật giỏi!',
      'Meow! Bạn đã vượt qua bao nhiêu ngôi nhà rồi?',
      'Trùm Cuối ở Cây Đại Thụ đang đợi bạn đấy, cố lên!',
      'Meow meow~ Học tiếng Anh cùng Pippo vui quá đi!',
    ];
    const quote = catQuotes[Math.floor(Math.random() * catQuotes.length)];
    setCatsChatBubble(quote);
    sound.speakEnglish('Meow! Good luck on your adventure!');
    setTimeout(() => setIsCatsBouncing(false), 800);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-auto bg-[#1b3420] flex items-center justify-center select-none"
    >
      {/* KHUNG BẢN ĐỒ 16:9 CHUẨN ĐIỆN ẢNH GHIBLI */}
      <div className="relative w-full max-w-[1580px] aspect-[16/9] min-h-[620px] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#8d6e63]/70">
        {/* 1. BỨC TRANH BẢN ĐỒ GỐC VẼ TAY THỦ CÔNG */}
        <img
          src="/images/village_1_rpg_map.jpg"
          alt="Bản đồ Làng Cỏ May & Mèo Con - Ghibli"
          className="w-full h-full object-cover"
        />

        {/* 2. CANVAS HIỆU ỨNG ÁNH NẮNG, LÁ BAY & BỤI TIÊN */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

        {/* 3. HIỆU ỨNG KHÓI BẾP BỐC LÊN TỪ CÁC ỐNG KHÓI (CHIMNEY SMOKE ANIMATION) */}
        {CHIMNEY_COORDINATES.map((c, i) => (
          <div
            key={i}
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
            className="absolute pointer-events-none z-15 -translate-x-1/2 -translate-y-full"
          >
            <div className="relative w-8 h-16 overflow-hidden opacity-75">
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white/70 blur-xs"
                style={{
                  animation: `ghibli-smoke ${2.8 + i * 0.4}s ease-out infinite`,
                  animationDelay: `${i * 0.6}s`,
                }}
              />
            </div>
          </div>
        ))}

        {/* 4. HIỆU ỨNG GUỒNG NƯỚC GỖ XOAY TRÒN BÊN SUỐI */}
        <div
          style={{ left: '76.6%', top: '71.2%' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-15"
        >
          <div
            className="w-7 h-7 rounded-full border-2 border-amber-950/70 border-dashed animate-spin opacity-80"
            style={{ animationDuration: '6s' }}
          />
          {/* Bọt nước trắng lấp lánh chân guồng nước */}
          <div className="absolute -bottom-1 -left-1 w-3 h-1.5 rounded-full bg-white/75 blur-2xs animate-pulse" />
        </div>

        {/* 5. CẶP ĐÔI MÈO KURO & SHIRO Ở CỔNG LÀNG (INTERACTIVE MASCOTS) */}
        <div
          style={{ left: '20.5%', top: '72.5%' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-25 cursor-pointer group"
          onClick={handleCatClick}
        >
          {/* Bong bóng trò chuyện của 2 bé mèo */}
          <AnimatePresence>
            {catsChatBubble && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border-2 border-amber-400 px-3 py-1.5 rounded-2xl shadow-xl whitespace-nowrap z-40 pointer-events-none"
              >
                <div className="text-[11px] font-display font-extrabold text-amber-950 flex items-center gap-1">
                  <span>🐱</span>
                  <span>{catsChatBubble}</span>
                </div>
                {/* Mũi tên tam giác chỉ xuống */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-t-white border-l-transparent border-r-transparent" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vùng bấm phúng phính tương tác hai bé mèo */}
          <motion.div
            animate={isCatsBouncing ? { y: [-4, -18, 0, -8, 0], scale: [1, 1.15, 1] } : { y: [0, -3, 0] }}
            transition={{
              duration: isCatsBouncing ? 0.6 : 3.5,
              repeat: isCatsBouncing ? 0 : Infinity,
              ease: 'easeInOut',
            }}
            className="w-16 h-14 rounded-2xl bg-amber-400/20 hover:bg-amber-400/40 border border-amber-400/50 flex items-center justify-center relative shadow-lg"
          >
            <span className="text-2xl filter drop-shadow">🐾</span>
            <span className="absolute -bottom-2 bg-amber-400 text-amber-950 font-display font-black text-[9px] px-2 py-0.2 rounded-full border border-white shadow">
              Chạm Meow!
            </span>
          </motion.div>
        </div>

        {/* 6. CON ĐƯỜNG NĂNG LƯỢNG CHẠY SÁNG (GOLDEN PULSE TRAIL) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-12" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="magicPathGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#facc15" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
            </linearGradient>
            <filter id="pathGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#fde047" floodOpacity="0.8" />
            </filter>
          </defs>
          {/* Đường nét đứt phát sáng vàng nối qua các vị trí */}
          <polyline
            points={VILLAGE_1_NODE_COORDINATES.map((c) => `${c.x * 15.8},${c.y * 8.9}`).join(' ')}
            fill="none"
            stroke="url(#magicPathGrad)"
            strokeWidth="3.5"
            strokeDasharray="8 12"
            strokeLinecap="round"
            filter="url(#pathGlow)"
            className="opacity-75"
          />
        </svg>

        {/* 7. HỆ THỐNG 10 CỘT MỐC TƯƠNG TÁC (10 INTERACTIVE STAGE NODES) */}
        {lessons.map((lesson, idx) => {
          const coord = VILLAGE_1_NODE_COORDINATES[idx] || VILLAGE_1_NODE_COORDINATES[0];
          const levelNum = idx + 1;
          const isBoss = levelNum === 10;
          const isCompleted = completedLessons.includes(lesson.id);
          const isCurrent = lesson.id === frontierLessonId;
          const prevLesson = lessons[idx - 1];
          const isUnlocked = idx === 0 ? true : completedLessons.includes(prevLesson?.id);
          const stars = lessonStars[lesson.id] || (isCompleted ? 3 : 0);

          return (
            <div
              key={lesson.id}
              style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-25 group"
            >
              {/* CHỈ DẪN BÉ ĐANG Ở ĐÂY */}
              {isCurrent && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-35 flex flex-col items-center pointer-events-none animate-bounce">
                  <div className="bg-amber-400 text-amber-950 font-display font-black text-[11px] px-3 py-0.5 rounded-full border-2 border-white shadow-xl whitespace-nowrap flex items-center gap-1">
                    <span>🐱</span>
                    <span>{nickname} đang học ở đây!</span>
                  </div>
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-5 border-t-amber-400 border-l-transparent border-r-transparent" />
                </div>
              )}

              {/* NÚT CỘT MỐC NẢY PHÚNG PHÍNH (SQUASH & STRETCH SPRING PHYSICS) */}
              <motion.button
                whileHover={{ scale: 1.18, y: -4 }}
                whileTap={{ scale: 0.92, y: 2 }}
                onClick={() => {
                  sound.playClick();
                  onSelectLesson(lesson, isUnlocked);
                }}
                className={`relative rounded-3xl p-2.5 transition-all cursor-pointer shadow-2xl flex flex-col items-center ${
                  isBoss
                    ? isUnlocked
                      ? 'bg-gradient-to-br from-amber-300 via-rose-400 to-amber-500 border-3 border-yellow-200 shadow-amber-400/80 animate-ghibli-boss'
                      : 'bg-stone-800 border-2 border-stone-600 opacity-60'
                    : isUnlocked
                    ? isCompleted
                      ? 'bg-gradient-to-br from-emerald-100 to-amber-100 border-2 border-amber-300/90'
                      : 'bg-gradient-to-br from-amber-400 to-orange-400 border-2 border-white'
                    : 'bg-stone-900/80 border-2 border-stone-700 opacity-50 grayscale'
                }`}
              >
                {/* Huy hiệu Vương Miện cho Boss 10 */}
                {isBoss && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white font-display font-black text-[9px] px-2 py-0.2 rounded-full border border-white shadow-md flex items-center gap-1 whitespace-nowrap">
                    <Crown className="w-3 h-3 text-yellow-300" />
                    <span>TRÙM CUỐI</span>
                  </div>
                )}

                {/* Khóa khi chưa mở */}
                {!isUnlocked && (
                  <div className="absolute inset-0 rounded-3xl bg-black/60 backdrop-blur-xs flex items-center justify-center z-10">
                    <Lock className="w-4 h-4 text-amber-200" />
                  </div>
                )}

                {/* Biểu Tượng Cột Mốc */}
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl filter drop-shadow">
                  {isBoss ? '🌳' : coord.icon}
                </div>

                {/* Số Thứ Tự Cột Mốc */}
                <span
                  className={`text-[10px] font-display font-black px-2 py-0.2 rounded-full mt-0.5 ${
                    isBoss
                      ? 'bg-amber-950 text-amber-200'
                      : isCompleted
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-900 text-amber-300'
                  }`}
                >
                  {isBoss ? 'BOSS' : `Lv.${levelNum}`}
                </span>

                {/* Đánh giá Sao (★ ★ ★) */}
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${
                        s <= stars ? 'fill-amber-400 text-amber-500' : 'fill-stone-300/40 text-stone-400/40'
                      }`}
                    />
                  ))}
                </div>
              </motion.button>

              {/* BẢNG TÊN CÔNG TRÌNH CỔ TÍCH XINH XẮN DƯỚI CHÂN NÚT */}
              <div className="mt-1.5 text-center pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-display font-extrabold text-amber-100 bg-[#1b2a1e]/90 px-2 py-0.5 rounded-full border border-amber-300/30 whitespace-nowrap shadow-sm">
                  {isBoss ? 'Đại Thụ Thần Rừng 👑' : coord.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
