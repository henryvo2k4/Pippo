import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Gift, Heart, Check, Lock, Shield, Wand2, Swords, Compass } from 'lucide-react';
import {
  AVATAR_CHARACTERS,
  SHOP_COSTUMES,
  PET_SHOP_CATALOG,
  STICKER_CATALOG,
  SkinSlot,
  ShopCostumeItem,
  PetShopItem,
} from '../../data/curriculumData';
import { useGameStore, EquippedSkin } from '../../store/useGameStore';
import { AvatarStudioCanvas } from '../three/Avatar3DScene';
import { sound } from '../../lib/sound';

const SLOT_TABS: { slot: SkinSlot; label: string; emoji: string }[] = [
  { slot: 'hat', label: 'Mũ & Nón', emoji: '👑' },
  { slot: 'outfit', label: 'Trang Phục', emoji: '🦸' },
  { slot: 'hand_item', label: 'Vũ Khí & Gậy', emoji: '🗡️' },
  { slot: 'shield', label: 'Khiên Chiến', emoji: '🛡️' },
  { slot: 'wing', label: 'Cánh & Balo', emoji: '🪽' },
  { slot: 'glasses', label: 'Kính & Visor', emoji: '🕶️' },
  { slot: 'aura', label: 'Hào Quang', emoji: '🌟' },
];

// 4 Bộ Trang Bị Chuẩn Theo Bản Vẽ 2D
const CLASS_PRESETS: {
  id: string;
  name: string;
  classTitle: string;
  emoji: string;
  gradient: string;
  skin: EquippedSkin;
}[] = [
  {
    id: 'warrior',
    name: 'Hiệp Sĩ Quả Cảm',
    classTitle: 'Warrior (Hiệp Sĩ)',
    emoji: '⚔️',
    gradient: 'from-blue-600 to-indigo-700',
    skin: {
      hat: 'hat_warrior_helmet',
      glasses: 'none',
      outfit: 'outfit_warrior',
      wing: 'back_backpack',
      hand_item: 'hand_warrior_sword',
      shield: 'shield_warrior',
      aura: 'none',
    },
  },
  {
    id: 'mage',
    name: 'Phù Thủy Ma Pháp',
    classTitle: 'Mage (Phù Thủy)',
    emoji: '🧙‍♀️',
    gradient: 'from-purple-600 to-pink-600',
    skin: {
      hat: 'hat_mage_witch',
      glasses: 'none',
      outfit: 'outfit_mage',
      wing: 'wing_angel',
      hand_item: 'hand_mage_staff',
      shield: 'none',
      aura: 'starlight',
    },
  },
  {
    id: 'cleric',
    name: 'Tư Tế Thánh Điện',
    classTitle: 'Cleric (Nữ Tu / Tư Tế)',
    emoji: '✨',
    gradient: 'from-amber-500 to-yellow-600',
    skin: {
      hat: 'hat_cleric_tiara',
      glasses: 'none',
      outfit: 'outfit_cleric',
      wing: 'angel_wings',
      hand_item: 'hand_cleric_scepter',
      shield: 'shield_holy',
      aura: 'starlight',
    },
  },
  {
    id: 'archer',
    name: 'Cung Thủ Rừng Xanh',
    classTitle: 'Archer (Cung Thủ)',
    emoji: '🏹',
    gradient: 'from-emerald-600 to-teal-700',
    skin: {
      hat: 'hat_archer_cap',
      glasses: 'none',
      outfit: 'outfit_archer',
      wing: 'back_quiver',
      hand_item: 'hand_archer_bow',
      shield: 'none',
      aura: 'none',
    },
  },
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

  const isGirl =
    avatarBase === 'girl' ||
    avatarBase === 'rabbit' ||
    avatarBase === 'cat' ||
    avatarBase === 'wizard';

  const triggerJump = (msg?: string) => {
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 900);
    if (msg) {
      setStatusMessage(msg);
      setTimeout(() => setStatusMessage(null), 2500);
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
        triggerJump(
          `Cần thêm ${item.priceGems - rainbowGems} 💎 Ngọc Cầu Vồng để mở khóa món này!`
        );
        return;
      }
      const ok = buyOrUnlockItem(item.id, item.priceGems);
      if (ok) {
        sound.playWinFanfare();
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
        equipSkinItem(item.slot, item.id);
        sound.speakEnglish(`Awesome! ${item.name}!`);
        triggerJump(`🎉 Đã mở khóa & mặc ngay "${item.vietnameseName}"!`);
      }
    }
  };

  const handlePetAction = (pet: PetShopItem) => {
    const isUnlocked = unlockedItems.includes(pet.id) || pet.id === 'pet_dragon' || pet.id === 'dragon_sky';
    if (isUnlocked) {
      sound.playPop();
      changePetType(pet.id, pet.vietnameseName);
      sound.speakEnglish(`My pet ${pet.name}!`);
      triggerJump(`🐾 Bé "${pet.vietnameseName}" đang lon ton đi dưới chân bạn!`);
    } else {
      if (rainbowGems < pet.priceGems) {
        sound.playGentleTryAgain();
        triggerJump(`Cần thêm ${pet.priceGems - rainbowGems} 💎 Ngọc Cầu Vồng để nhận nuôi bé này!`);
        return;
      }
      const ok = buyOrUnlockItem(pet.id, pet.priceGems);
      if (ok) {
        sound.playWinFanfare();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        changePetType(pet.id, pet.vietnameseName);
        sound.speakEnglish(`Welcome ${pet.name}!`);
        triggerJump(`🎉 Chúc mừng bạn đã nhận nuôi bé "${pet.vietnameseName}"!`);
      }
    }
  };

  const handleEquipClassPreset = (preset: typeof CLASS_PRESETS[0]) => {
    sound.playWinFanfare();
    confetti({ particleCount: 65, spread: 60, origin: { y: 0.6 } });
    Object.entries(preset.skin).forEach(([slot, itemId]) => {
      if (itemId) {
        equipSkinItem(slot as SkinSlot, itemId);
      }
    });
    sound.speakEnglish(preset.classTitle);
    triggerJump(`✨ Đã trang bị trọn bộ 3D "${preset.name}" khớp 100% bản vẽ 2D!`);
  };

  const handleOpenBlindBox = () => {
    const boxCost = 60;
    if (rainbowGems < boxCost) {
      sound.playGentleTryAgain();
      triggerJump('Bạn cần 60 💎 Ngọc Cầu Vồng để đập Hộp Mù!');
      return;
    }

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
      <div className="col-span-5 h-full bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 rounded-3xl border-4 border-white/35 p-3.5 flex flex-col justify-between relative shadow-2xl overflow-hidden">
        {/* Header trên sàn diễn 3D */}
        <div className="flex items-center justify-between z-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-600 text-white px-3 py-0.5 rounded-full shadow font-display">
              ✨ Nhân Vật 3D Mặc Định (.glb)
            </span>
            <h2 className="text-lg font-display font-extrabold text-white mt-1 flex items-center gap-2">
              <span className="text-2xl">🧙‍♀️</span>
              <span>Bé Phù Thủy Pippo (PhuThuy.glb)</span>
            </h2>
          </div>
          <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-display font-extrabold px-3 py-1 rounded-2xl text-sm shadow-lg flex items-center gap-1">
            <span>💎</span>
            <span>{rainbowGems}</span>
          </div>
        </div>

        {/* Thông báo trạng thái mô hình */}
        <div className="z-10 mt-2 bg-purple-900/60 backdrop-blur-md p-2.5 rounded-2xl border border-purple-400/30 text-xs text-purple-200">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-300">🔮 Mô Hình Gốc: PhuThuy.glb</span>
            <button
              onClick={() => {
                sound.playPop();
                setAvatarBase('phuthuy');
                equipCharacterSignatureSet('phuthuy');
                triggerJump('Đã đặt lại trang phục phù thủy mặc định!');
              }}
              className="px-2 py-0.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-extrabold text-[10px] rounded-lg cursor-pointer"
            >
              🔄 Mặc Định Gốc
            </button>
          </div>
          <p className="text-[10px] text-purple-300/90 mt-1 leading-tight">
            Đã tô màu Anime Chibi kẹo ngọt (Nón tím, tóc hồng, má phấn, váy phép thuật). Các vị trí socket phụ kiện sẵn sàng để bạn thêm file .glb sau!
          </p>
        </div>

        {statusMessage && (
          <div className="bg-emerald-500 text-white font-display font-bold text-xs px-4 py-1.5 rounded-2xl text-center shadow-lg z-20 animate-bounce mt-1">
            {statusMessage}
          </div>
        )}

        {/* Khung Sân Khấu 3D R3F */}
        <div className="flex-1 min-h-[220px]">
          <AvatarStudioCanvas
            avatarBase={avatarBase}
            equippedSkin={equippedSkin}
            petState={petState}
            isJumping={isJumping}
            onClickCharacter={() => {
              sound.speakEnglish('Looking super cute and cool!');
              triggerJump('Bé 3D nhún nhảy đáng yêu quá!');
            }}
          />
        </div>

        {/* Thông tin thú cưng đang đi dưới chân */}
        <div className="z-10 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/15 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Thú Cưng Đi Dưới Chân:</div>
              <div className="font-extrabold text-amber-300">{petState.name}</div>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setStudioTab('pet');
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-[11px] px-3 py-1 rounded-xl cursor-pointer transition-colors shadow"
          >
            Đổi Thú Cưng 🐕
          </button>
        </div>
      </div>

      {/* ================= CỘT PHẢI: TỦ ĐỒ 3D, CỬA HÀNG PET & HỘP QUÀ MÙ ================= */}
      <div className="col-span-7 h-full clay-card rounded-3xl p-5 flex flex-col justify-between overflow-hidden">
        {/* 3 Tab Điều Hướng Lớn */}
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
              👗 Tủ Đồ Thời Trang 3D ({SHOP_COSTUMES.length})
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
              🐾 Thú Cưng Nhỏ ({PET_SHOP_CATALOG.length})
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
              🎁 Đập Hộp Mù (Blind Box)
            </button>
          </div>
        </div>

        {/* ================= TAB 1: TỦ ĐỒ THỜI TRANG 3D ================= */}
        {studioTab === 'wardrobe' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden mt-3">
            {/* 7 Khe Trang Bị */}
            <div className="grid grid-cols-7 gap-1.5 mb-3">
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
                const isEquipped = (equippedSkin as any)[item.slot] === item.id;

                const rarityBadge =
                  item.rarity === 'Mythic'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : item.rarity === 'Legendary'
                    ? 'bg-amber-200 text-amber-900'
                    : item.rarity === 'Epic'
                    ? 'bg-purple-200 text-purple-900'
                    : item.rarity === 'Rare'
                    ? 'bg-sky-200 text-sky-900'
                    : 'bg-slate-200 text-slate-800';

                return (
                  <div
                    key={`${item.slot}-${item.id}`}
                    onClick={() => handleCostumeAction(item)}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      isEquipped
                        ? 'bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-400/30'
                        : isOwned
                        ? 'bg-white border-slate-200 hover:border-indigo-300'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-13 h-13 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl shadow-inner relative">
                        {item.emoji}
                        {item.rarity === 'Mythic' && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-display font-bold text-sm text-slate-900">
                            {item.vietnameseName}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${rarityBadge}`}>
                            {item.rarity}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 italic mt-0.5">
                          {item.name}
                        </div>
                        {item.effectDescription && (
                          <div className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-0.5">
                            <Sparkles className="w-3 h-3" />
                            <span>{item.effectDescription}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      {isEquipped ? (
                        <span className="bg-emerald-500 text-white text-xs font-display font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow">
                          <Check className="w-3.5 h-3.5" /> Đang mặc
                        </span>
                      ) : isOwned ? (
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-indigo-200">
                          Mặc thử
                        </span>
                      ) : (
                        <span className="btn-toy-yellow text-slate-900 text-xs font-display font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow">
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

        {/* ================= TAB 2: THÚ CƯNG 3D ĐI DƯỚI CHÂN ================= */}
        {studioTab === 'pet' && (
          <div className="flex-1 flex flex-col justify-between mt-3 overflow-hidden">
            {/* Box Tiến Hóa Thú Cưng Đang Đồng Hành */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="text-5xl bg-white p-3 rounded-3xl shadow">
                  {petState.stage === 1 ? '🥚' : petState.stage === 2 ? '🐣' : '🐉'}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-200 px-2.5 py-0.5 rounded-full">
                    Cấp {petState.stage} / 3 • Đang Đồng Hành
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
                  triggerJump('🐾 Thú cưng rất vui và tăng +35 EXP tiến hóa!');
                }}
                className="btn-toy-green text-white font-display font-bold px-5 py-3 rounded-2xl text-sm flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Heart className="w-4 h-4" />
                Cho Ăn & Tiến Hóa (💎 30)
              </button>
            </div>

            {/* Danh Mục Thú Cưng Nhỏ Chạy Dưới Chân (Pet Shop) */}
            <div className="mt-3 flex-1 overflow-y-auto">
              <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <span>🐾 Cửa Hàng Thú Cưng Nhỏ (Đi Dưới Chân Nhân Vật):</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pr-1">
                {PET_SHOP_CATALOG.map((pet) => {
                  const isOwned =
                    unlockedItems.includes(pet.id) ||
                    pet.id === 'pet_dragon' ||
                    pet.id === 'dragon_sky';
                  const isEquipped = petState.pet_id === pet.id;

                  return (
                    <div
                      key={pet.id}
                      onClick={() => handlePetAction(pet)}
                      className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        isEquipped
                          ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-400/30'
                          : isOwned
                          ? 'bg-white border-slate-200 hover:border-emerald-300'
                          : 'bg-slate-50 border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-13 h-13 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-3xl shadow-inner">
                          {pet.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-bold text-sm text-slate-900">
                              {pet.vietnameseName}
                            </span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                              {pet.rarity}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            {pet.description}
                          </div>
                        </div>
                      </div>

                      <div className="ml-2 flex-shrink-0">
                        {isEquipped ? (
                          <span className="bg-emerald-500 text-white text-xs font-display font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow">
                            <Check className="w-3.5 h-3.5" /> Đi cùng
                          </span>
                        ) : isOwned ? (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-200">
                            Đồng hành
                          </span>
                        ) : (
                          <span className="btn-toy-yellow text-slate-900 text-xs font-display font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow">
                            <Lock className="w-3 h-3" /> 💎 {pet.priceGems}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ĐẬP TÚI MÙ (BLIND BOX GACHA) ================= */}
        {studioTab === 'gacha' && (
          <div className="flex-1 flex flex-col items-center justify-between text-center p-4 bg-gradient-to-b from-pink-50 via-purple-50 to-amber-50 rounded-3xl border-2 border-pink-200 mt-3">
            <div>
              <span className="px-3 py-1 rounded-full bg-pink-200 text-pink-900 font-bold text-xs">
                🎁 Máy Bóc Túi Mù 3D (Blind Box Surprise)
              </span>
              <h3 className="text-2xl font-display font-extrabold text-slate-900 mt-2">
                Mở Hộp Quà Bí Ẩn – Sưu Tầm Trang Phục Hiếm & Thú Cưng!
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
              className="btn-toy-pink text-white font-display font-extrabold px-8 py-4 rounded-3xl text-lg flex items-center gap-2 cursor-pointer shadow-lg"
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
