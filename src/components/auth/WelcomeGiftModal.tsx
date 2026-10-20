import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { WELCOME_GIFT_REWARD } from '../../data/studentAccounts';
import { sound } from '../../lib/sound';
import { Sparkles, Gift, Shirt, MapPin } from 'lucide-react';

interface WelcomeGiftModalProps {
  isOpen: boolean;
  onOpenWardrobe?: () => void;
  onClose?: () => void;
}

export const WelcomeGiftModal: React.FC<WelcomeGiftModalProps> = ({
  isOpen,
  onOpenWardrobe,
  onClose,
}) => {
  const [hasOpened, setHasOpened] = useState(false);
  const nickname = useGameStore((state) => state.nickname);
  const claimWelcomeGift = useGameStore((state) => state.claimWelcomeGift);

  if (!isOpen) return null;

  const handleOpenGift = () => {
    sound.playWinFanfare();
    claimWelcomeGift();
    setHasOpened(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="clay-card w-full max-w-lg rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl bg-gradient-to-b from-amber-50 via-white to-sky-50 text-center relative overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Bong bóng trang trí */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/50 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-200/50 rounded-full blur-xl pointer-events-none" />

        {!hasOpened ? (
          <div>
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 flex items-center justify-center text-5xl shadow-xl border-4 border-white animate-bounce">
              🎁
            </div>

            <div className="mt-4">
              <span className="text-[11px] font-extrabold uppercase bg-amber-400 text-slate-900 px-3 py-1 rounded-full tracking-wider">
                Món Quà Đặc Biệt Khởi Đầu
              </span>
              <h2 className="text-2xl font-display font-extrabold text-slate-900 mt-2">
                Chào Mừng {nickname} Đến Với Pippo English!
              </h2>
              <p className="text-xs font-bold text-slate-600 mt-2 leading-relaxed">
                Thầy/Cô và các bạn nhỏ đã chuẩn bị một rương báu tân thủ bí mật để bé thỏa thích sắm trang phục hoàng gia, thú cưng và đồ trang trí cho hòn đảo của riêng mình!
              </p>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleOpenGift}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-display font-extrabold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-6 h-6 text-yellow-200 animate-spin" />
                <span>Mở Hộp Quà Tân Thủ Ngay!</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-5xl shadow-xl border-4 border-white animate-pulse">
              🎉
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase bg-emerald-500 text-white px-3 py-1 rounded-full tracking-wider">
                Đã Nhận Thành Công!
              </span>
              <h2 className="text-2xl font-display font-extrabold text-slate-900 mt-2">
                {WELCOME_GIFT_REWARD.title}
              </h2>
              <p className="text-xs font-bold text-slate-600 mt-1">
                Phần quà tân thủ đã được cộng vào tài khoản của bé:
              </p>
            </div>

            {/* Thẻ phần thưởng */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto my-3">
              <div className="bg-pink-50 border-2 border-pink-300 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
                <span className="text-3xl">💎</span>
                <span className="font-display font-black text-xl text-pink-600 mt-1">
                  +{WELCOME_GIFT_REWARD.gems}
                </span>
                <span className="text-[11px] font-extrabold text-slate-600">Ngọc Cầu Vồng</span>
              </div>

              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
                <span className="text-3xl">⭐</span>
                <span className="font-display font-black text-xl text-amber-600 mt-1">
                  +{WELCOME_GIFT_REWARD.stars}
                </span>
                <span className="text-[11px] font-extrabold text-slate-600">Sao Khởi Đầu</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-bold">
              Bé có thể dùng số Ngọc này trong <strong>Cửa Hàng 3D</strong> để sắm trang phục, kiếm, khiên, cánh thiên thần hoặc nhận nuôi <strong>Thú Cưng Đồng Hành</strong>!
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              {onOpenWardrobe && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onOpenWardrobe();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-extrabold text-xs shadow flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Shirt className="w-4 h-4" />
                  <span>Vào Tủ Đồ Sắm Quần Áo</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  if (onClose) onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-display font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Khám Phá Bản Đồ Đảo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
