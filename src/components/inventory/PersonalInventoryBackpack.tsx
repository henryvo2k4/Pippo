import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Shield,
  ShoppingBag,
  Check,
  Heart,
  Crown,
  Swords,
  Wand2,
  Gift,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import {
  SHOP_COSTUMES,
  PET_SHOP_CATALOG,
  STICKER_CATALOG,
  SkinSlot,
  ShopCostumeItem,
  PetShopItem,
  StickerCatalogItem,
} from '../../data/curriculumData';
import { useGameStore } from '../../store/useGameStore';
import { AvatarStudioCanvas } from '../three/Avatar3DScene';
import { sound } from '../../lib/sound';

type InventoryTab = 'all' | 'equipment' | 'pets' | 'stickers' | 'consumables';

interface ConsumableItem {
  id: string;
  name: string;
  vietnameseName: string;
  emoji: string;
  quantity: number;
  description: string;
  actionText: string;
  actionType: 'feed_pet' | 'open_gift' | 'boost_exp';
}

export const PersonalInventoryBackpack: React.FC<{
  onOpenWardrobe?: () => void;
  onOpenDiorama?: () => void;
}> = ({ onOpenWardrobe, onOpenDiorama }) => {
  const {
    nickname,
    currentFullName,
    level,
    stars,
    rainbowGems,
    streakDays,
    speakingScoreTotal,
    avatarBase,
    equippedSkin,
    petState,
    unlockedItems,
    equipSkinItem,
    feedAndTrainPet,
    changePetType,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<InventoryTab>('all');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [backpackMessage, setBackpackMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setBackpackMessage(msg);
    setTimeout(() => setBackpackMessage(null), 2500);
  };

  // 1. Danh sách Trang Bị đã sở hữu
  const ownedEquipments = SHOP_COSTUMES.filter(
    (item) => unlockedItems.includes(item.id) || item.priceGems === 0
  );

  // 2. Danh sách Thú Cưng đã sở hữu
  const ownedPets = PET_SHOP_CATALOG.filter(
    (pet) =>
      unlockedItems.includes(pet.id) ||
      pet.id === 'pet_dragon' ||
      pet.id === 'dragon_sky'
  );

  // 3. Danh sách Sticker đã thu thập
  const ownedStickers = STICKER_CATALOG.filter((stk) =>
    unlockedItems.includes(stk.id)
  );

  // 4. Danh sách Vật Phẩm Tiêu Hao / Quà Tặng
  const [consumables, setConsumables] = useState<ConsumableItem[]>([
    {
      id: 'star_candy',
      name: 'Star Candy for Pet',
      vietnameseName: 'Kẹo Ngôi Sao Thú Cưng',
      emoji: '🍬',
      quantity: 5,
      description: 'Cho thú cưng ăn để tăng +35 EXP tiến hóa và hồi phục 100% độ vui vẻ!',
      actionText: 'Cho Pet Ăn',
      actionType: 'feed_pet',
    },
    {
      id: 'double_star_ticket',
      name: '2x Star Booster Ticket',
      vietnameseName: 'Vé Nhân Đôi Ngôi Sao',
      emoji: '🎫',
      quantity: 2,
      description: 'Nhân đôi số sao nhận được trong 3 bài học tiếp theo trên bản đồ đảo!',
      actionText: 'Kích Hoạt',
      actionType: 'boost_exp',
    },
    {
      id: 'welcome_chest',
      name: 'Adventurer Mystery Chest',
      vietnameseName: 'Rương Thám Hiểm May Mắn',
      emoji: '🎁',
      quantity: 1,
      description: 'Mở ra cơ hội nhận thêm 50–150 Ngọc Cầu Vồng hoặc Sticker huyền thoại!',
      actionText: 'Mở Rương',
      actionType: 'open_gift',
    },
  ]);

  const totalItemCount =
    ownedEquipments.length + ownedPets.length + ownedStickers.length;

  const handleUseConsumable = (cons: ConsumableItem) => {
    if (cons.quantity <= 0) {
      sound.playGentleTryAgain();
      showNotification('Bạn đã dùng hết vật phẩm này rồi!');
      return;
    }

    if (cons.actionType === 'feed_pet') {
      sound.playSuccess();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      feedAndTrainPet(0);
      setConsumables((prev) =>
        prev.map((c) => (c.id === cons.id ? { ...c, quantity: c.quantity - 1 } : c))
      );
      showNotification(`🍬 Đã cho ${petState.name} ăn kẹo! Tăng +35 EXP tiến hóa!`);
    } else if (cons.actionType === 'boost_exp') {
      sound.playWinFanfare();
      confetti({ particleCount: 45, spread: 55, origin: { y: 0.6 } });
      setConsumables((prev) =>
        prev.map((c) => (c.id === cons.id ? { ...c, quantity: c.quantity - 1 } : c))
      );
      showNotification('🎫 Đã kích hoạt Vé Nhân Đôi Ngôi Sao cho 3 bài học!');
    } else if (cons.actionType === 'open_gift') {
      sound.playWinFanfare();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      useGameStore.setState((s) => ({ rainbowGems: s.rainbowGems + 100 }));
      setConsumables((prev) =>
        prev.map((c) => (c.id === cons.id ? { ...c, quantity: c.quantity - 1 } : c))
      );
      showNotification('🎁 Mở Rương thành công: Nhận được +100 💎 Ngọc Cầu Vồng!');
    }
  };

  const isGirl =
    avatarBase === 'girl' ||
    avatarBase === 'rabbit' ||
    avatarBase === 'cat' ||
    avatarBase === 'wizard';

  return (
    <div className="w-full h-full grid grid-cols-12 gap-5 p-5 overflow-hidden">
      {/* ================= CỘT TRÁI: NHÂN VẬT 3D & THÔNG TIN TRANG BỊ ĐANG MẶC ================= */}
      <div className="col-span-5 h-full bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl border-4 border-amber-300/40 p-4 flex flex-col justify-between relative shadow-2xl overflow-hidden">
        {/* Header Cột Trái */}
        <div className="flex items-center justify-between z-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full shadow font-display">
              🎒 Túi Đồ Cá Nhân
            </span>
            <h2 className="text-lg font-display font-extrabold text-white mt-1">
              {currentFullName || nickname}
            </h2>
          </div>
          <div className="bg-white/15 backdrop-blur-md text-amber-300 font-display font-extrabold px-3 py-1 rounded-2xl text-xs border border-white/20">
            Cấp Độ: Lv.{level}
          </div>
        </div>

        {/* Thông báo thao tác */}
        {backpackMessage && (
          <div className="bg-emerald-500 text-white font-display font-bold text-xs px-4 py-1.5 rounded-2xl text-center shadow-lg z-20 animate-bounce mt-1">
            {backpackMessage}
          </div>
        )}

        {/* Khung Sân Khấu 3D Nhân Vật & Pet */}
        <div className="flex-1 min-h-[220px]">
          <AvatarStudioCanvas
            avatarBase={avatarBase}
            equippedSkin={equippedSkin}
            petState={petState}
            isJumping={false}
            onClickCharacter={() => {
              sound.speakEnglish('Ready for adventure!');
              showNotification('Túi đồ của bạn có rất nhiều trang bị xịn xò!');
            }}
          />
        </div>

        {/* Bảng Tóm Tắt Trang Bị Đang Mặc (Equipped Slots) */}
        <div className="z-10 bg-slate-950/70 backdrop-blur-md p-3 rounded-2xl border border-white/15 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-bold border-b border-white/10 pb-1.5">
            <span>🛡️ Trang Bị Đang Dùng</span>
            {onOpenWardrobe && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenWardrobe();
                }}
                className="text-amber-300 hover:text-amber-200 text-[11px] flex items-center gap-1 cursor-pointer font-bold"
              >
                <span>Cửa Hàng 3D</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-[11px]">
            {/* Mũ */}
            <div className="bg-white/10 p-1.5 rounded-xl text-center">
              <div className="text-base">👑</div>
              <div className="text-[10px] text-slate-300 truncate">
                {equippedSkin.hat !== 'none'
                  ? SHOP_COSTUMES.find((c) => c.id === equippedSkin.hat)?.vietnameseName?.split(' ')[0] || 'Có nón'
                  : 'Trống'}
              </div>
            </div>

            {/* Giáp */}
            <div className="bg-white/10 p-1.5 rounded-xl text-center">
              <div className="text-base">🦸</div>
              <div className="text-[10px] text-slate-300 truncate">
                {equippedSkin.outfit !== 'none'
                  ? SHOP_COSTUMES.find((c) => c.id === equippedSkin.outfit)?.vietnameseName?.split(' ')[0] || 'Có giáp'
                  : 'Mặc định'}
              </div>
            </div>

            {/* Vũ khí */}
            <div className="bg-white/10 p-1.5 rounded-xl text-center">
              <div className="text-base">🗡️</div>
              <div className="text-[10px] text-slate-300 truncate">
                {equippedSkin.hand_item !== 'none'
                  ? SHOP_COSTUMES.find((c) => c.id === equippedSkin.hand_item)?.vietnameseName?.split(' ')[0] || 'Có vũ khí'
                  : 'Tay không'}
              </div>
            </div>

            {/* Khiên */}
            <div className="bg-white/10 p-1.5 rounded-xl text-center">
              <div className="text-base">🛡️</div>
              <div className="text-[10px] text-slate-300 truncate">
                {equippedSkin.shield && equippedSkin.shield !== 'none'
                  ? SHOP_COSTUMES.find((c) => c.id === equippedSkin.shield)?.vietnameseName?.split(' ')[0] || 'Có khiên'
                  : 'Trống'}
              </div>
            </div>
          </div>

          {/* Thú cưng đi cùng */}
          <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-400/30 px-3 py-1.5 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-emerald-200">
              <span className="text-base">🐾</span>
              <span className="font-bold">{petState.name}</span>
              <span className="text-[10px] bg-emerald-500/30 px-1.5 py-0.2 rounded-full text-white">
                Cấp {petState.stage}
              </span>
            </div>
            <span className="text-[11px] text-slate-300">Đi bên chân</span>
          </div>
        </div>
      </div>

      {/* ================= CỘT PHẢI: KHO CHỨA ĐỒ VÀ BỘ SƯU TẬP ================= */}
      <div className="col-span-7 h-full clay-card rounded-3xl p-5 flex flex-col justify-between overflow-hidden">
        {/* Header Kho Đồ */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎒</span>
            <div>
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                Túi Đồ & Bộ Sưu Tập Của Bé
              </h3>
              <p className="text-xs text-slate-500 font-bold">
                Đang chứa {totalItemCount} vật phẩm đã mở khóa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-amber-100 text-amber-900 font-display font-bold px-3 py-1 rounded-2xl text-xs flex items-center gap-1">
              <span>⭐ {stars} Sao</span>
            </div>
            <div className="bg-pink-100 text-pink-900 font-display font-bold px-3 py-1 rounded-2xl text-xs flex items-center gap-1">
              <span>💎 {rainbowGems} Ngọc</span>
            </div>
          </div>
        </div>

        {/* 5 Tab Phân Loại Túi Đồ */}
        <div className="flex gap-2 my-3">
          {[
            { id: 'all' as const, label: 'Tất Cả', count: totalItemCount },
            { id: 'equipment' as const, label: 'Trang Bị 3D', count: ownedEquipments.length },
            { id: 'pets' as const, label: 'Thú Cưng', count: ownedPets.length },
            { id: 'stickers' as const, label: 'Sticker', count: ownedStickers.length },
            { id: 'consumables' as const, label: 'Vật Phẩm Hỗ Trợ', count: consumables.reduce((acc, c) => acc + c.quantity, 0) },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Lưới Vật Phẩm Trong Túi */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* 1. HIỂN THỊ TRANG BỊ (NẾU CHỌN ALL HOẶC EQUIPMENT) */}
          {(activeTab === 'all' || activeTab === 'equipment') && (
            <div className="mb-4">
              <div className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
                <span>🛡️ Trang Bị 3D Đã Sở Hữu ({ownedEquipments.length}):</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {ownedEquipments.map((item) => {
                  const isEquipped = (equippedSkin as any)[item.slot] === item.id;
                  return (
                    <div
                      key={`eq-${item.slot}-${item.id}`}
                      onClick={() => {
                        sound.playPop();
                        equipSkinItem(item.slot, item.id);
                        sound.speakEnglish(item.name);
                        showNotification(`Đã trang bị "${item.vietnameseName}"!`);
                      }}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        isEquipped
                          ? 'bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-300'
                          : 'bg-white border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shadow-inner">
                          {item.emoji}
                        </div>
                        <div>
                          <div className="font-display font-bold text-xs text-slate-900">
                            {item.vietnameseName}
                          </div>
                          <div className="text-[10px] text-slate-500 italic">
                            {item.name}
                          </div>
                          <div className="text-[9px] font-bold text-indigo-600 uppercase">
                            Khe: {item.slot}
                          </div>
                        </div>
                      </div>

                      <div>
                        {isEquipped ? (
                          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
                            <Check className="w-3 h-3" /> Đang dùng
                          </span>
                        ) : (
                          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-lg hover:bg-indigo-200">
                            Trang bị
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. HIỂN THỊ THÚ CƯNG (NẾU CHỌN ALL HOẶC PETS) */}
          {(activeTab === 'all' || activeTab === 'pets') && (
            <div className="mb-4">
              <div className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
                <span>🐾 Thú Cưng Đã Sở Hữu ({ownedPets.length}):</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {ownedPets.map((pet) => {
                  const isCurrent = petState.pet_id === pet.id;
                  return (
                    <div
                      key={`pet-${pet.id}`}
                      onClick={() => {
                        sound.playPop();
                        changePetType(pet.id, pet.vietnameseName);
                        sound.speakEnglish(pet.name);
                        showNotification(`🐾 Bé "${pet.vietnameseName}" đã ra đồng hành bên chân bạn!`);
                      }}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-300'
                          : 'bg-white border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-2xl shadow-inner">
                          {pet.emoji}
                        </div>
                        <div>
                          <div className="font-display font-bold text-xs text-slate-900">
                            {pet.vietnameseName}
                          </div>
                          <div className="text-[10px] text-slate-500 leading-tight">
                            {pet.description}
                          </div>
                        </div>
                      </div>

                      <div>
                        {isCurrent ? (
                          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
                            <Check className="w-3 h-3" /> Đồng hành
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-lg hover:bg-emerald-200">
                            Gọi ra
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. HIỂN THỊ VẬT PHẨM HỖ TRỢ / TIÊU HAO (CONSUMABLES) */}
          {(activeTab === 'all' || activeTab === 'consumables') && (
            <div className="mb-4">
              <div className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
                <span>🧪 Vật Phẩm Hỗ Trợ & Quà Tặng:</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {consumables.map((cons) => (
                  <div
                    key={`cons-${cons.id}`}
                    className="p-3 rounded-2xl border-2 border-slate-200 bg-white flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-2xl shadow-inner relative">
                        {cons.emoji}
                        <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-extrabold text-[9px] px-1.5 rounded-full shadow">
                          x{cons.quantity}
                        </span>
                      </div>
                      <div>
                        <div className="font-display font-bold text-xs text-slate-900">
                          {cons.vietnameseName}
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight">
                          {cons.description}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUseConsumable(cons)}
                      disabled={cons.quantity <= 0}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                        cons.quantity > 0
                          ? 'btn-toy-yellow text-slate-900 shadow'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {cons.actionText}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. HIỂN THỊ STICKER ĐÃ THU THẬP */}
          {(activeTab === 'all' || activeTab === 'stickers') && (
            <div>
              <div className="text-xs font-bold text-slate-600 mb-2 flex items-center justify-between">
                <span>🏷️ Sticker Từ Vựng Thu Thập ({ownedStickers.length}):</span>
                {onOpenDiorama && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenDiorama();
                    }}
                    className="text-indigo-600 hover:text-indigo-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Mở Sổ Sa Bàn Dán Sticker</span>
                    <BookOpen className="w-3 h-3" />
                  </button>
                )}
              </div>

              {ownedStickers.length === 0 ? (
                <div className="bg-slate-50 p-4 rounded-2xl text-center text-xs text-slate-500">
                  Chưa có sticker nào. Hãy vượt qua các hòn đảo học tập để mở khóa sticker nhé!
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {ownedStickers.map((stk) => (
                    <div
                      key={`stk-${stk.id}`}
                      onClick={() => sound.speakEnglish(stk.name)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <div className="text-2xl">{stk.emoji}</div>
                      <div>
                        <div className="font-display font-bold text-xs text-slate-900 leading-tight">
                          {stk.vietnamese}
                        </div>
                        <div className="text-[10px] text-slate-500 italic">
                          {stk.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nút Chân Trang: Mở Cửa Hàng Trang Phục Để Sắm Thêm */}
        {onOpenWardrobe && (
          <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">
              Muốn tìm kiếm thêm nhiều trang phục huyền thoại & thú cưng mới?
            </span>
            <button
              onClick={() => {
                sound.playClick();
                onOpenWardrobe();
              }}
              className="btn-toy-pink text-white font-display font-extrabold px-4 py-2 rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Đến Cửa Hàng 3D & Pet</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
