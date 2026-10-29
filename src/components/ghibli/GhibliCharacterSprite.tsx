import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export interface GhibliCharacterSpriteProps {
  nickname?: string;
  action?: 'idle' | 'walk' | 'celebrate' | 'cast';
  size?: 'sm' | 'md' | 'lg';
  showDialogue?: boolean;
  dialogueText?: string;
  onClick?: () => void;
  className?: string;
  // Khi cậu chủ dùng Agent Sprite Forge xuất sprite atlas / webm, có thể truyền vào đây
  spriteSheetUrl?: string;
  videoWebmUrl?: string;
}

export const GhibliCharacterSprite: React.FC<GhibliCharacterSpriteProps> = ({
  nickname = 'Bé cưng',
  action = 'idle',
  size = 'md',
  showDialogue = true,
  dialogueText,
  onClick,
  className = '',
  videoWebmUrl,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isCheering, setIsCheering] = useState(false);
  const [sparkleList, setSparkleList] = useState<{ id: number; x: number; y: number }[]>([]);

  // Hiệu ứng chớp mắt tự nhiên kiểu anime Ghibli
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3200 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  const handleClick = () => {
    setIsCheering(true);
    // Bắn hạt lấp lánh quanh nhân vật
    const newSparkles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: -Math.random() * 50 - 20,
    }));
    setSparkleList(newSparkles);

    setTimeout(() => {
      setIsCheering(false);
      setSparkleList([]);
    }, 1200);

    if (onClick) onClick();
  };

  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.25 : 1;

  // Nếu có video WebM trong suốt được tạo từ Agent Sprite Forge (VP9 Alpha)
  if (videoWebmUrl) {
    return (
      <div
        className={`relative inline-block cursor-pointer select-none ${className}`}
        style={{ transform: `scale(${scale})` }}
        onClick={handleClick}
      >
        <video
          src={videoWebmUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-28 h-28 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex flex-col items-center cursor-pointer select-none group ${className}`}
      style={{ transform: `scale(${scale})` }}
      onClick={handleClick}
    >
      {/* 1. BẢNG THOẠI LƠ LỬNG (FLOATING GHIBLI SPEECH BUBBLE) */}
      <AnimatePresence>
        {showDialogue && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="absolute -top-12 z-40 whitespace-nowrap pointer-events-none"
          >
            <div className="bg-[#fffdf7] text-stone-800 font-display font-extrabold text-[11px] px-3 py-1 rounded-2xl border-2 border-[#8da378] shadow-[0_6px_20px_rgba(0,0,0,0.25)] flex items-center gap-1.5 backdrop-blur-xs">
              <span className="text-amber-500 animate-spin text-[10px]">✨</span>
              <span>{dialogueText || `${nickname} ở đây nè!`}</span>
              <span className="text-rose-400 text-[10px]">🌱</span>
            </div>
            {/* Đuôi bóng thoại mềm mại */}
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[7px] border-t-[#8da378] border-l-transparent border-r-transparent mx-auto -mt-[1px]" />
            <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-t-[#fffdf7] border-l-transparent border-r-transparent mx-auto -mt-[7px]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CÁC HẠT BỤI PHÉP THUẬT KHI NHẤP CHUỘT (CLICK SPARKLES BURST) */}
      {sparkleList.map((sp) => (
        <motion.div
          key={sp.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.4 }}
          animate={{ opacity: 0, x: sp.x, y: sp.y, scale: 1.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 z-50 pointer-events-none text-yellow-300"
        >
          <Sparkles className="w-4 h-4 fill-yellow-200" />
        </motion.div>
      ))}

      {/* 3. BÓNG ĐỔ MẶT ĐẤT MỀM (SOFT GROUND SHADOW) */}
      <div className="absolute bottom-1 w-16 h-3.5 bg-black/35 rounded-full filter blur-[2px] transition-transform duration-300 group-hover:scale-110" />

      {/* 4. HỆ THỐNG RENDER NHÂN VẬT GIBLI (VECTOR ANIMATED RIG) */}
      <motion.div
        animate={
          isCheering || action === 'celebrate'
            ? { y: [-2, -14, -2], rotate: [0, -4, 4, 0] }
            : action === 'walk'
            ? { y: [0, -4, 0], rotate: [-2, 2, -2] }
            : { y: [0, -2.5, 0] }
        }
        transition={
          isCheering || action === 'celebrate'
            ? { duration: 0.6, repeat: 1, ease: 'easeInOut' }
            : action === 'walk'
            ? { duration: 0.45, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
        }
        className="relative w-20 h-24 flex items-center justify-center filter drop-shadow-[0_6px_12px_rgba(20,30,20,0.35)]"
      >
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradient màu nước Ghibli đặc trưng */}
            <linearGradient id="witchHatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c3e50" />
              <stop offset="50%" stopColor="#1e2b37" />
              <stop offset="100%" stopColor="#131a22" />
            </linearGradient>

            <linearGradient id="witchCoatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3d6b5e" />
              <stop offset="70%" stopColor="#2a4c42" />
              <stop offset="100%" stopColor="#1e362f" />
            </linearGradient>

            <linearGradient id="witchRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>

            <linearGradient id="woodBroomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a16207" />
              <stop offset="100%" stopColor="#713f12" />
            </linearGradient>

            <radialGradient id="magicOrbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="60%" stopColor="#fde047" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* A. CÂY CHỔI PHÉP THẦN KỲ (MAGICAL BROOMSTICK) */}
          <g className="transition-transform duration-500 group-hover:rotate-6 origin-center">
            {/* Cán chổi gỗ cong tự nhiên */}
            <path
              d="M 18,92 Q 40,70 82,32"
              stroke="url(#woodBroomGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Đầu chổi rơm ấm áp */}
            <path
              d="M 16,92 C 10,95 6,105 10,110 C 14,114 26,108 26,96 Z"
              fill="#eab308"
              stroke="#ca8a04"
              strokeWidth="1.2"
            />
            {/* Dây buộc chổi màu đỏ */}
            <path d="M 18,93 L 23,97" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
            {/* Đốm sáng phép thuật ở đuôi chổi */}
            <circle cx="82" cy="32" r="5" fill="url(#magicOrbGlow)" />
            <circle cx="82" cy="32" r="2" fill="#ffffff" />
          </g>

          {/* B. THÂN BÉ PHÙ THỦY (COAT & LEGS) */}
          {/* Đôi chân bé xíu bước đi */}
          <rect x="42" y="94" width="5" height="14" rx="2.5" fill="#78350f" />
          <rect x="53" y="94" width="5" height="14" rx="2.5" fill="#78350f" />
          {/* Giày da nâu cổ tích */}
          <ellipse cx="43" cy="108" rx="4.5" ry="3" fill="#451a03" />
          <ellipse cx="56" cy="108" rx="4.5" ry="3" fill="#451a03" />

          {/* Áo choàng màu xanh rêu Ghibli ấm áp */}
          <path
            d="M 36,66 C 34,75 32,88 34,96 C 45,99 55,99 66,96 C 68,88 66,75 64,66 Z"
            fill="url(#witchCoatGrad)"
            stroke="#1b3027"
            strokeWidth="1.2"
          />
          {/* Cổ áo len màu kem ấm */}
          <path
            d="M 42,65 Q 50,71 58,65 Q 54,62 46,62 Z"
            fill="#fef3c7"
            stroke="#d97706"
            strokeWidth="0.8"
          />

          {/* Cặp da đeo chéo màu nâu hạt dẻ */}
          <path
            d="M 37,70 Q 56,86 63,88"
            stroke="#92400e"
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
          />
          <rect
            x="58"
            y="82"
            width="12"
            height="10"
            rx="2.5"
            fill="#b45309"
            stroke="#78350f"
            strokeWidth="1"
          />
          <circle cx="64" cy="86" r="1.2" fill="#fef08a" />

          {/* C. MÈO SHIRO (BẠCH MIÊU TÍ HON NGỒI TRONG TÚI) */}
          <g transform="translate(60, 77)">
            {/* Đầu mèo trắng nhô ra */}
            <circle cx="5" cy="4" r="4.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
            {/* Tai tam giác hồng */}
            <polygon points="1,2 2,-2 5,1" fill="#ffffff" />
            <polygon points="2,1 3,-1 4,1" fill="#f472b6" />
            <polygon points="5,1 8,-2 9,2" fill="#ffffff" />
            <polygon points="6,1 7,-1 8,1" fill="#f472b6" />
            {/* Mắt nhắm tít cười tươi */}
            <path d="M 3,4 Q 4,3 5,4" stroke="#334155" strokeWidth="0.8" fill="none" />
            <path d="M 6,4 Q 7,3 8,4" stroke="#334155" strokeWidth="0.8" fill="none" />
          </g>

          {/* D. KHUÔN MẶT BÉ PHÙ THỦY (ANIME GHIBLI FACE) */}
          {/* Tóc sau gáy mềm mại */}
          <path
            d="M 36,44 Q 30,62 36,72 Q 50,68 64,72 Q 70,62 64,44 Z"
            fill="#451a03"
          />

          {/* Khuôn mặt bầu bĩnh đáng yêu */}
          <ellipse cx="50" cy="53" rx="14" ry="12" fill="#ffe4d6" />

          {/* Má hồng hào tươi tắn */}
          <ellipse cx="40" cy="57" rx="3.5" ry="2" fill="#fb7185" opacity="0.65" />
          <ellipse cx="60" cy="57" rx="3.5" ry="2" fill="#fb7185" opacity="0.65" />

          {/* Đôi mắt to tròn long lanh */}
          {isBlinking ? (
            // Mắt nhắm chớp
            <>
              <path d="M 40,52 Q 44,55 46,52" stroke="#1f2937" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M 54,52 Q 56,55 60,52" stroke="#1f2937" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </>
          ) : (
            // Mắt mở tròn xoe long lanh
            <>
              {/* Mắt trái */}
              <circle cx="43" cy="52" r="3.2" fill="#1e1b4b" />
              <circle cx="42" cy="51" r="1.2" fill="#ffffff" />
              <circle cx="44.2" cy="53.2" r="0.6" fill="#ffffff" />

              {/* Mắt phải */}
              <circle cx="57" cy="52" r="3.2" fill="#1e1b4b" />
              <circle cx="56" cy="51" r="1.2" fill="#ffffff" />
              <circle cx="58.2" cy="53.2" r="0.6" fill="#ffffff" />
            </>
          )}

          {/* Nụ cười mỉm nhỏ xinh */}
          <path d="M 48,59 Q 50,62 52,59" stroke="#991b1b" strokeWidth="1.4" strokeLinecap="round" fill="none" />

          {/* Tóc mái bằng bồng bềnh */}
          <path
            d="M 36,46 C 40,51 45,46 50,50 C 55,46 60,51 64,46 C 65,42 62,38 50,38 C 38,38 35,42 36,46 Z"
            fill="#5c2605"
          />

          {/* E. NÓN PHÙ THỦY CHÓP NHỌN ĐẶC TRƯNG GHIBLI */}
          {/* Vành nón rộng uốn cong */}
          <ellipse
            cx="50"
            cy="42"
            rx="27"
            ry="7.5"
            fill="url(#witchHatGrad)"
            stroke="#131a22"
            strokeWidth="1.2"
          />

          {/* Thân nón nhọn cong điệu đà */}
          <path
            d="M 33,40 C 37,28 42,16 58,10 C 53,18 57,26 67,40 Z"
            fill="url(#witchHatGrad)"
            stroke="#131a22"
            strokeWidth="1.2"
          />

          {/* Ruy băng vàng quanh vành nón */}
          <path
            d="M 34,40 C 40,43 60,43 66,40 L 65,37 C 59,40 41,40 35,37 Z"
            fill="url(#witchRibbonGrad)"
          />

          {/* Bông hoa cúc trắng cài trên nón */}
          <circle cx="40" cy="38" r="3.5" fill="#ffffff" />
          <circle cx="40" cy="38" r="1.5" fill="#facc15" />

          {/* F. MÈO KURO (HẮC MIÊU HUYỀN BÍ ĐỨNG CẠNH CHÂN) */}
          <g transform="translate(18, 86)">
            {/* Đuôi mèo ngoe nguẩy */}
            <motion.path
              d="M 5,16 Q 1,12 2,6 Q 3,2 6,4"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Thân mèo đen mập mạp */}
            <ellipse cx="10" cy="16" rx="6" ry="7" fill="#0f172a" />
            {/* Đầu mèo */}
            <circle cx="10" cy="9" r="5" fill="#0f172a" />
            {/* Tai mèo nhọn */}
            <polygon points="6,6 7,2 10,6" fill="#0f172a" />
            <polygon points="10,6 13,2 14,6" fill="#0f172a" />
            {/* Đôi mắt vàng to tròn sáng rực */}
            <circle cx="8.5" cy="8.5" r="1.6" fill="#facc15" />
            <circle cx="8.5" cy="8.5" r="0.7" fill="#000000" />
            <circle cx="12" cy="8.5" r="1.6" fill="#facc15" />
            <circle cx="12" cy="8.5" r="0.7" fill="#000000" />
            {/* Mũi hồng tí hon */}
            <circle cx="10.2" cy="10.5" r="0.5" fill="#f43f5e" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
};
