import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Gift, Heart, Check, Lock } from 'lucide-react';
import {
  AVATAR_CHARACTERS,
  SHOP_COSTUMES,
  STICKER_CATALOG,
  SkinSlot,
  ShopCostumeItem,
} from '../../data/curriculumData';
import { useGameStore } from '../../store/useGameStore';
import { AvatarStudioCanvas } from '../three/Avatar3DScene';
import { sound } from '../../lib/sound';

const SLOT_TABS: { slot: SkinSlot; label: string; emoji: string }[] = [
  { slot: 'hat', label: 'Mũ & Vương Miện', emoji: '👑' },
  { slot: 'outfit', label: 'Trang Phục & Giáp', emoji: '🦸' },
  { slot: 'wing', label: 'Cánh & Tên Lửa', emoji: '🪽' },
  { slot: 'hand_item', label: 'Đũa Phép & Kiếm', emoji: '🪄' },
  { slot: 'glasses', label: 'Kính Thời Trang', emoji: '🕶️' },
  { slot: 'aura', label: 'Hào Quang Aura', emoji: '🌟' },
];

export const WardrobePetStudio: React.FC = () => {
  const {
    avatarBase,
    equippedSkin,
    petState,
    rainbowGems,
    unlockedItems,
    accessoryOffsets,
    setAvatarBase,
    equipSkinItem,
    equipCharacterSignatureSet,
    setAccessoryOffset,
    buyOrUnlockItem,
    feedAndTrainPet,
    changePetType,
  } = useGameStore();

  const [activeSlot, setActiveSlot] = useState<SkinSlot>('hat');
  const [studioTab, setStudioTab] = useState<'wardrobe' | 'pet' | 'gacha'>('wardrobe');
  const [isJumping, setIsJumping] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [gachaPrize, setGachaPrize] = useState<{ name: string; emoji: string; rarity: string } | null>(null);

  const currentCharMeta =
    AVATAR_CHARACTERS.find((c) => c.id === avatarBase) || AVATAR_CHARACTERS[0];
  const currentOffset = accessoryOffsets?.[avatarBase] || { y: 0, z: 0, scale: 1 };

  const triggerJump = (msg?: string) => {
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 900);
    if (msg) {
      setStatusMessage(msg);
      setTimeout(() => setStatusMessage(null), 2400);
    }
  };

  const handleCostumeAction = (item: ShopCostumeItem) => {
    const isUnlocked = unlockedItems.includes(item.id) || item.priceGems === 0;
    if (isUnlocked) {
      sound.playPop();
      equipSkinItem(item.slot, item.id);
      sound.speakEnglish(item.name);
      triggerJump(`Đã mặc "${item.vietnameseName}" lên nhân vật 3D!`);
    } else {
      if (rainbowGems < item.priceGems) {
        sound.playGentleTryAgain();
        triggerJump(`Cần thêm ${item.priceGems - rainbowGems} 💎 Ngọc Cầu Vồng để mở khóa món này! Hãy chơi thêm bài học nhé!`);
        return;
      }
      const ok = buyOrUnlockItem(item.id, item.priceGems);
      if (ok) {
        sound.playWinFanfare();
        confetti({ particleCount: 65, spread: 60, origin: { y: 0.6 } });
        equipSkinItem(item.slot, item.id);
        sound.speakEnglish(`Awesome! ${item.name}!`);
        triggerJump(`🎉 Đã mở khóa & mặc ngay "${item.vietnameseName}"!`);
      }
    }
  };

  const handleOpenBlindBox = () => {
    const boxCost = 60;
    if (rainbowGems < boxCost) {
      sound.playGentleTryAgain();
      triggerJump('Bạn cần 60 💎 Ngọc Cầu Vồng để đập Hộp Mù!');
      return;
    }

    // Tìm các sticker hoặc trang phục chưa mở khóa
    const lockedCostumes = SHOP_COSTUMES.filter((c) => !unlockedItems.includes(c.id) && c.priceGems > 0);
    const lockedStickers = STICKER_CATALOG.filter((s) => !unlockedItems.includes(s.id));

    sound.playWinFanfare();
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.55 } });

    if (lockedCostumes.length > 0 && Math.random() > 0.45) {
      const randomCostume = lockedCostumes[Math.floor(Math.random() * lockedCostumes.length)];
      buyOrUnlockItem(randomCostume.id, boxCost);
      equipSkinItem(randomCostume.slot, randomCostume.id);
      setGachaPrize({
        name: `Trang phục 3D: ${randomCostume.vietnameseName} (${randomCostume.name})`,
        emoji: randomCostume.emoji,
        rarity: randomCostume.rarity,
      });
      sound.speakEnglish(randomCostume.name);
    } else if (lockedStickers.length > 0) {
      const randomSticker = lockedStickers[Math.floor(Math.random() * lockedStickers.length)];
      buyOrUnlockItem(randomSticker.id, boxCost);
      setGachaPrize({
        name: `Sticker Động: ${randomSticker.vietnamese} (${randomSticker.name})`,
        emoji: randomSticker.emoji,
        rarity: randomSticker.rarity,
      });
      sound.speakEnglish(randomSticker.name);
    } else {
      // Đã mở hết đồ -> Thưởng EXP Tiến Hóa Thú Cưng & Siêu Phẩm Sưu Tầm
      feedAndTrainPet(boxCost);
      const bonus = STICKER_CATALOG[Math.floor(Math.random() * STICKER_CATALOG.length)];
      setGachaPrize({
        name: `Siêu Phẩm Sưu Tầm: ${bonus.vietnamese} (+35 EXP Tiến Hóa Pet!)`,
        emoji: bonus.emoji,
        rarity: 'Legendary',
      });
    }
  };

  const filteredItems = SHOP_COSTUMES.filter((item) => item.slot === activeSlot);

  return (
    <div className="w-full h-full grid grid-cols-12 gap-5 p-5 overflow-hidden">
      {/* ================= CỘT TRÁI: SÂN KHẤU NHÂN VẬT 3D XOAY 360 ĐỘ ================= */}
      <div className="col-span-5 h-full bg-gradient-to-b from-indigo-900/80 via-purple-900/70 to-slate-900/90 rounded-3xl border-4 border-white/35 p-3.5 flex flex-col justify-between relative shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-pink-500 text-white px-2.5 py-0.5 rounded-full">
              ✨ Phòng Thay Đồ 3D Tương Tác
            </span>
            <h2 className="text-lg font-display font-extrabold text-white mt-0.5">
              {currentCharMeta.emoji} {currentCharMeta.title}
            </h2>
          </div>
          <div className="bg-amber-400 text-slate-900 font-display font-extrabold px-3 py-1 rounded-2xl text-sm shadow">
            💎 {rainbowGems}
          </div>
        </div>

        {/* Nút Mặc Ngay Bộ Trang Phục Độc Quyền Thiết Kế Riêng Cho Từng Nhân Vật */}
        {currentCharMeta.signatureSetName && (
          <div className="z-10 mt-1.5 flex items-center justify-between bg-indigo-950/80 border border-amber-300/50 rounded-2xl px-3 py-1.5 gap-2">
            <div className="text-[11px] text-amber-200 font-bold truncate">
              🛡️ Bộ Riêng: <span className="text-white font-extrabold">{currentCharMeta.signatureSetName}</span>
            </div>
            <button
              onClick={() => {
                sound.playWinFanfare();
                equipCharacterSignatureSet(avatarBase);
                triggerJump(`✨ Đã trang bị trọn bộ "${currentCharMeta.signatureSetName}" khớp 100%!`);
              }}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-extrabold text-[10px] px-2.5 py-1 rounded-xl whitespace-nowrap cursor-pointer shadow"
            >
              ⚡ Mặc Bộ Chuẩn
            </button>
          </div>
        )}

        {statusMessage && (
          <div className="bg-emerald-500 text-white font-display font-bold text-xs px-4 py-1.5 rounded-2xl text-center shadow-lg z-20 animate-bounce mt-1">
            {statusMessage}
          </div>
        )}

        {/* Khung 3D R3F */}
        <div className="flex-1 min-h-[205px]">
          <AvatarStudioCanvas
            avatarBase={avatarBase}
            equippedSkin={equippedSkin}
            petState={petState}
            isJumping={isJumping}
            onClickCharacter={() => {
              sound.speakEnglish('Looking super cool!');
              triggerJump('Nhân vật 3D của bạn trông thật ngầu!');
            }}
          />
        </div>

        {/* Thanh Tinh Chỉnh Khớp Phụ Kiện 3D Theo Ý Thích (Cao/Thấp • Trước/Sau • Độ Lớn) */}
        <div className="z-10 mb-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-white/15 flex items-center justify-between gap-1.5 text-[10px] text-white">
          <span className="font-bold text-amber-300 whitespace-nowrap">🎯 Khớp Phụ Kiện:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                sound.playClick();
                setAccessoryOffset(avatarBase, {
                  ...currentOffset,
                  y: Number((currentOffset.y + 0.05).toFixed(2)),
                });
              }}
              className="px-1.5 py-0.5 rounded bg-white/15 hover:bg-white/25 font-bold cursor-pointer"
              title="Nâng cao Mũ & Kính"
            >
              ⬆️ Cao
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setAccessoryOffset(avatarBase, {
                  ...currentOffset,
                  y: Number((currentOffset.y - 0.05).toFixed(2)),
                });
              }}
              className="px-1.5 py-0.5 rounded bg-white/15 hover:bg-white/25 font-bold cursor-pointer"
              title="Hạ thấp Mũ & Kính"
            >
              ⬇️ Thấp
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setAccessoryOffset(avatarBase, {
                  ...currentOffset,
                  z: Number((currentOffset.z + 0.05).toFixed(2)),
                });
              }}
              className="px-1.5 py-0.5 rounded bg-white/15 hover:bg-white/25 font-bold cursor-pointer"
              title="Đẩy phụ kiện ra phía trước mặt"
            >
              ⏩ Trước
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setAccessoryOffset(avatarBase, {
                  ...currentOffset,
                  z: Number((currentOffset.z - 0.05).toFixed(2)),
                });
              }}
              className="px-1.5 py-0.5 rounded bg-white/15 hover:bg-white/25 font-bold cursor-pointer"
              title="Lùi phụ kiện ra phía sau"
            >
              ⏪ Sau
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setAccessoryOffset(avatarBase, {
                  ...currentOffset,
                  scale: Number(Math.min(1.5, currentOffset.scale + 0.08).toFixed(2)),
                });
              }}
              className="px-1.5 py-0.5 rounded bg-white/15 hover:bg-white/25 font-bold cursor-pointer"
              title="Phóng to trang phục"
            >
              ➕ Cỡ
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setAccessoryOffset(avatarBase, {
                  ...currentOffset,
                  scale: Number(Math.max(0.6, currentOffset.scale - 0.08).toFixed(2)),
                });
              }}
              className="px-1.5 py-0.5 rounded bg-white/15 hover:bg-white/25 font-bold cursor-pointer"
              title="Thu nhỏ trang phục"
            >
              ➖ Cỡ
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setAccessoryOffset(avatarBase, { y: 0, z: 0, scale: 1 });
              }}
              className="px-1.5 py-0.5 rounded bg-rose-500/80 hover:bg-rose-500 font-bold cursor-pointer"
              title="Đặt lại vị trí chuẩn mặc định"
            >
              🔄 Chuẩn
            </button>
          </div>
        </div>

        {/* Chọn Nhân Vật Gốc 3D (6 Loài) + Nút Nạp File .GLB Thực Tế */}
        <div className="z-10 bg-slate-950/60 backdrop-blur-md p-2 rounded-2xl border border-white/15">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[11px] font-bold text-sky-200">
              🎭 Chọn Nhân Vật 3D (Tự động mặc Bộ Trang Bị Riêng):
            </span>
            <label className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-[10px] px-2.5 py-0.5 rounded-lg cursor-pointer transition-colors">
              📦 Tải File .GLB
              <input
                type="file"
                accept=".glb,.gltf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const objectUrl = URL.createObjectURL(file);
                    useGameStore.getState().setCustomGlbUrl(objectUrl);
                    triggerJump(`Đã nạp mô hình 3D "${file.name}"!`);
                  }
                }}
              />
            </label>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {AVATAR_CHARACTERS.map((char) => (
              <button
                key={char.id}
                onClick={() => {
                  sound.playClick();
                  useGameStore.getState().setCustomGlbUrl(null);
                  setAvatarBase(char.id);
                  sound.speakEnglish(char.name);
                  triggerJump(
                    `Đã chọn ${char.title} & mặc "${char.signatureSetName || 'Bộ Trang Bị Riêng'}"!`
                  );
                }}
                className={`py-1.5 rounded-xl flex flex-col items-center transition-all cursor-pointer ${
                  avatarBase === char.id
                    ? 'bg-amber-400 text-slate-900 font-extrabold scale-105 shadow'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span className="text-xl">{char.emoji}</span>
                <span className="text-[10px] font-bold mt-0.5 truncate max-w-full px-1">
                  {char.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= CỘT PHẢI: TỦ ĐỒ 3D, TIẾN HÓA PET & ĐẬP TÚI MÙ ================= */}
      <div className="col-span-7 h-full clay-card rounded-3xl p-5 flex flex-col justify-between overflow-hidden">
        {/* 3 Tab Chức Năng Lớn */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setStudioTab('wardrobe');
              }}
              className={`px-4 py-2 rounded-2xl font-display font-bold text-sm flex items-center gap-2 cursor-pointer transition-all ${
                studioTab === 'wardrobe'
                  ? 'bg-indigo-600 text-white shadow-md scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              👗 Tủ Đồ 3D .GLB ({SHOP_COSTUMES.length})
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setStudioTab('pet');
              }}
              className={`px-4 py-2 rounded-2xl font-display font-bold text-sm flex items-center gap-2 cursor-pointer transition-all ${
                studioTab === 'pet'
                  ? 'bg-emerald-600 text-white shadow-md scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🐉 Tiến Hóa Thú Cưng 3D
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setStudioTab('gacha');
              }}
              className={`px-4 py-2 rounded-2xl font-display font-bold text-sm flex items-center gap-2 cursor-pointer transition-all ${
                studioTab === 'gacha'
                  ? 'bg-pink-600 text-white shadow-md scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🎁 Đập Túi Mù (Blind Box)
            </button>
          </div>
        </div>

        {/* TAB 1: TỦ ĐỒ THỜI TRANG 3D */}
        {studioTab === 'wardrobe' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden mt-3">
            {/* 6 Khe Trang Bị */}
            <div className="grid grid-cols-6 gap-1.5 mb-3">
              {SLOT_TABS.map((t) => (
                <button
                  key={t.slot}
                  onClick={() => {
                    sound.playClick();
                    setActiveSlot(t.slot);
                  }}
                  className={`p-2 rounded-2xl font-display font-bold text-xs flex flex-col items-center gap-1 border-2 transition-all cursor-pointer ${
                    activeSlot === t.slot
                      ? 'bg-amber-100 border-amber-400 text-slate-900 shadow'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xl">{t.emoji}</span>
                  <span className="text-[11px] text-center leading-tight">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Danh sách vật phẩm trong khe đang chọn */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-3 pr-1">
              {filteredItems.map((item) => {
                const isOwned = unlockedItems.includes(item.id) || item.priceGems === 0;
                const isEquipped = equippedSkin[item.slot] === item.id;
                const isSignatureForCurrent =
                  currentCharMeta.signatureSkin?.[item.slot] === item.id && item.id !== 'none';

                return (
                  <div
                    key={`${item.slot}-${item.id}`}
                    onClick={() => handleCostumeAction(item)}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      isEquipped
                        ? 'bg-indigo-50 border-indigo-500 shadow-md'
                        : isSignatureForCurrent
                        ? 'bg-amber-50/70 border-amber-400 hover:border-amber-500'
                        : isOwned
                        ? 'bg-white border-slate-200 hover:border-indigo-300'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl shadow-inner relative">
                        {item.emoji}
                        {item.glbPreviewUrl && (
                          <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-full shadow">
                            3D .GLB
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-display font-bold text-sm text-slate-900">
                            {item.vietnameseName}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              item.rarity === 'Legendary'
                                ? 'bg-amber-200 text-amber-900'
                                : item.rarity === 'Epic'
                                ? 'bg-purple-200 text-purple-900'
                                : item.rarity === 'Rare'
                                ? 'bg-sky-200 text-sky-900'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {item.rarity}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">{item.name}</div>
                        {isSignatureForCurrent && (
                          <div className="text-[10px] font-extrabold text-amber-700 mt-0.5">
                            ⭐ Trang bị chuẩn của {currentCharMeta.name.split(' ')[0]}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      {isEquipped ? (
                        <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Đang mặc
                        </span>
                      ) : isOwned ? (
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-xl">
                          Mặc thử
                        </span>
                      ) : (
                        <span className="btn-toy-yellow text-slate-900 text-xs font-display font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                          <Lock className="w-3 h-3" /> 💎 {item.priceGems}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ẤP TRỨNG & TIẾN HÓA THÚ CƯNG 3D */}
        {studioTab === 'pet' && (
          <div className="flex-1 flex flex-col justify-between mt-3">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-6xl bg-white p-3 rounded-3xl shadow">
                  {petState.stage === 1 ? '🥚' : petState.stage === 2 ? '🐣' : '🐉'}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-200 px-2.5 py-0.5 rounded-full">
                    Hình thái Tiến Hóa Cấp {petState.stage} / 3
                  </span>
                  <h3 className="text-2xl font-display font-extrabold text-slate-900 mt-1">
                    {petState.name}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Độ thân thiết: ❤️ {petState.happiness}% • Kinh nghiệm tiến hóa: {petState.exp}/100 EXP
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (rainbowGems < 30) {
                    sound.playGentleTryAgain();
                    triggerJump('Cần 30 💎 để cho Thú cưng ăn Kẹo Ngôi Sao!');
                    return;
                  }
                  sound.playSuccess();
                  feedAndTrainPet(30);
                  confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                  triggerJump('🐉 Thú cưng 3D rất vui và tăng +35 EXP tiến hóa!');
                }}
                className="btn-toy-green text-white font-display font-bold px-5 py-3 rounded-2xl text-sm flex items-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4" />
                Cho Ăn & Tiến Hóa (💎 30)
              </button>
            </div>

            {/* Thanh tiến trình Tiến hóa 3 Cấp */}
            <div className="grid grid-cols-3 gap-3 my-3">
              {[
                { stage: 1, title: 'Cấp 1: Trứng Thần Kỳ', icon: '🥚', desc: 'Quả trứng phát sáng bay cạnh nhân vật' },
                { stage: 2, title: 'Cấp 2: Thú Cưng Nhí', icon: '🐣', desc: 'Nở thành người bạn nhỏ đáng yêu' },
                { stage: 3, title: 'Cấp 3: Thần Thú Vương Miện', icon: '🐉', desc: 'Mọc đôi cánh thiên thần & đội vương miện vàng' },
              ].map((s) => (
                <div
                  key={s.stage}
                  className={`p-3.5 rounded-2xl border-2 text-center ${
                    petState.stage >= s.stage
                      ? 'bg-amber-50 border-amber-400 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="text-3xl">{s.icon}</div>
                  <div className="font-display font-bold text-xs mt-1">{s.title}</div>
                  <div className="text-[11px] mt-0.5">{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Chọn dòng Thú Cưng */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-slate-600 mb-2">
                🌟 Đổi Dòng Thú Cưng Đi Cùng Nhân Vật 3D:
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'dragon_sky' as const, name: 'Rồng Tinh Vân', emoji: '🐉' },
                  { id: 'cloud_pet' as const, name: 'Mây Kẹo Bông', emoji: '☁️' },
                  { id: 'robo_pup' as const, name: 'Cún Công Nghệ AI', emoji: '🤖' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      sound.playClick();
                      changePetType(p.id, p.name);
                      triggerJump(`Đã gọi ${p.name} bay bên cạnh!`);
                    }}
                    className={`p-2.5 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-2 border-2 cursor-pointer ${
                      petState.pet_id === p.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="text-xl">{p.emoji}</span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ĐẬP TÚI MÙ (BLIND BOX GACHA) */}
        {studioTab === 'gacha' && (
          <div className="flex-1 flex flex-col items-center justify-between text-center p-4 bg-gradient-to-b from-pink-50 via-purple-50 to-amber-50 rounded-3xl border-2 border-pink-200 mt-3">
            <div>
              <span className="px-3 py-1 rounded-full bg-pink-200 text-pink-900 font-bold text-xs">
                🎁 Máy Bóc Túi Mù 3D (Blind Box Surprise)
              </span>
              <h3 className="text-2xl font-display font-extrabold text-slate-900 mt-2">
                Mở Hộp Quà Bí Ẩn – Sưu Tầm Sticker & Đồ Hiếm!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                Dùng Ngọc Cầu Vồng 💎 tích lũy từ các trò chơi tiếng Anh để mở ngẫu nhiên Trang phục Legendary hoặc Sticker Động!
              </p>
            </div>

            {gachaPrize ? (
              <div className="bg-white p-5 rounded-3xl border-4 border-amber-400 shadow-xl max-w-md w-full animate-bounce">
                <div className="text-6xl mb-2">{gachaPrize.emoji}</div>
                <span className="px-3 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold text-xs">
                  {gachaPrize.rarity}
                </span>
                <div className="text-lg font-display font-extrabold text-slate-900 mt-2">
                  {gachaPrize.name}
                </div>
              </div>
            ) : (
              <div className="text-8xl animate-bounce my-2 select-none">🎁</div>
            )}

            <button
              onClick={handleOpenBlindBox}
              className="btn-toy-pink text-white font-display font-extrabold px-8 py-4 rounded-3xl text-lg flex items-center gap-2 cursor-pointer"
            >
              <Gift className="w-6 h-6" />
              Đập Hộp Mù Ngay (💎 60)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
