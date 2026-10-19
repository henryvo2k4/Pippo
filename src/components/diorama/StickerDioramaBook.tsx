import React, { useState, useRef } from 'react';
import { Volume2, ZoomIn, ZoomOut, RotateCw, Trash2, Plus, Lock, Sparkles } from 'lucide-react';
import { DIORAMA_SCENES, STICKER_CATALOG, StickerCatalogItem } from '../../data/curriculumData';
import { useGameStore } from '../../store/useGameStore';
import { sound } from '../../lib/sound';

export const StickerDioramaBook: React.FC = () => {
  const {
    unlockedItems,
    rainbowGems,
    placedStickers,
    addStickerToScene,
    moveStickerInScene,
    transformStickerInScene,
    removeStickerFromScene,
    buyOrUnlockItem,
  } = useGameStore();

  const [activeSceneId, setActiveSceneId] = useState(DIORAMA_SCENES[0].id);
  const [selectedPlacedUid, setSelectedPlacedUid] = useState<string | null>(null);
  const [activeStickerInfo, setActiveStickerInfo] = useState<StickerCatalogItem>(STICKER_CATALOG[0]);
  const [draggingUid, setDraggingUid] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentScene = DIORAMA_SCENES.find((s) => s.id === activeSceneId) || DIORAMA_SCENES[0];
  const sceneStickers = placedStickers.filter((st) => st.sceneId === activeSceneId);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingUid || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    moveStickerInScene(draggingUid, xPercent, yPercent);
  };

  const handleCatalogStickerClick = (item: StickerCatalogItem) => {
    const isUnlocked = unlockedItems.includes(item.id);
    setActiveStickerInfo(item);
    sound.speakEnglish(`${item.name}. ${item.sentence}`, 0.9);

    if (isUnlocked) {
      sound.playPop();
      addStickerToScene(activeSceneId, item.id);
    } else {
      const unlockPrice = item.rarity === 'Legendary' ? 90 : item.rarity === 'Epic' ? 65 : 40;
      if (rainbowGems >= unlockPrice) {
        const ok = buyOrUnlockItem(item.id, unlockPrice);
        if (ok) {
          sound.playSuccess();
          addStickerToScene(activeSceneId, item.id);
        }
      } else {
        sound.playGentleTryAgain();
      }
    }
  };

  return (
    <div className="w-full h-full grid grid-cols-12 gap-5 p-5 overflow-hidden">
      {/* ================= CỘT TRÁI (7 CỘT): KHUNG TRANH SA BÀN KÉO THẢ STICKER ================= */}
      <div className="col-span-7 h-full flex flex-col justify-between gap-3">
        {/* Thanh chọn 4 Bối cảnh Sa bàn */}
        <div className="flex items-center justify-between bg-white/15 backdrop-blur-md border-2 border-white/30 rounded-3xl px-4 py-2">
          <div className="flex items-center gap-2">
            {DIORAMA_SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => {
                  sound.playClick();
                  setActiveSceneId(scene.id);
                  setSelectedPlacedUid(null);
                }}
                className={`px-3.5 py-1.5 rounded-2xl font-display font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSceneId === scene.id
                    ? 'bg-amber-400 text-slate-900 shadow-lg scale-105'
                    : 'bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                <span className="text-base">{scene.emoji}</span>
                <span>{scene.vietnameseName}</span>
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-white/90">
            👆 Kéo thả Sticker & Bấm để nghe phát âm!
          </span>
        </div>

        {/* Bức Tranh Sa Bàn Tương Tác */}
        <div
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerUp={() => setDraggingUid(null)}
          onPointerLeave={() => setDraggingUid(null)}
          style={{ background: currentScene.bgGradient }}
          className="flex-1 rounded-3xl border-4 border-white/80 shadow-2xl relative overflow-hidden select-none"
        >
          {/* Chi tiết trang trí nền Sa bàn */}
          {currentScene.decorEmojis.map((dec, idx) => (
            <div
              key={idx}
              style={{ left: dec.left, top: dec.top, fontSize: dec.size }}
              className="absolute pointer-events-none opacity-85 filter drop-shadow-md select-none"
            >
              {dec.emoji}
            </div>
          ))}

          {/* Các Sticker Bé Đã Dán Lên Sa Bàn */}
          {sceneStickers.map((placed) => {
            const meta = STICKER_CATALOG.find((s) => s.id === placed.stickerId);
            if (!meta) return null;
            const isSelected = selectedPlacedUid === placed.uid;

            return (
              <div
                key={placed.uid}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setSelectedPlacedUid(placed.uid);
                  setActiveStickerInfo(meta);
                  setDraggingUid(placed.uid);
                  sound.playPop();
                  sound.speakEnglish(meta.name);
                }}
                style={{
                  left: `${placed.x}%`,
                  top: `${placed.y}%`,
                  transform: `translate(-50%, -50%) scale(${placed.scale}) rotate(${placed.rotation}deg)`,
                }}
                className={`absolute cursor-grab active:cursor-grabbing transition-shadow flex flex-col items-center group ${
                  isSelected ? 'z-30' : 'z-20'
                }`}
              >
                <div
                  className={`text-6xl filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.35)] transition-transform group-hover:scale-110 ${
                    isSelected ? 'ring-4 ring-amber-300 bg-white/30 rounded-3xl p-1' : ''
                  }`}
                >
                  {meta.emoji}
                </div>
                <span className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white font-display font-bold text-xs shadow whitespace-nowrap">
                  {meta.name}
                </span>
              </div>
            );
          })}

          {/* Thanh công cụ chỉnh kích thước / xoay Sticker đang chọn */}
          {selectedPlacedUid && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-white/25 flex items-center gap-3 shadow-xl">
              <span className="text-xs font-bold text-amber-300">Chỉnh Sticker:</span>
              <button
                onClick={() => transformStickerInScene(selectedPlacedUid, 0.15, 0)}
                className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => transformStickerInScene(selectedPlacedUid, -0.15, 0)}
                className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => transformStickerInScene(selectedPlacedUid, 0, 15)}
                className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 cursor-pointer"
                title="Xoay góc"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  removeStickerFromScene(selectedPlacedUid);
                  setSelectedPlacedUid(null);
                }}
                className="p-1.5 rounded-xl bg-rose-500/80 hover:bg-rose-500 cursor-pointer"
                title="Cất khỏi tranh"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= CỘT PHẢI (5 CỘT): SỔ SƯU TẬP STICKER & PHÁT ÂM TỪ VỰNG ================= */}
      <div className="col-span-5 h-full clay-card rounded-3xl p-5 flex flex-col justify-between overflow-hidden">
        {/* Thẻ phát âm chi tiết của Sticker đang chọn */}
        <div className="bg-gradient-to-r from-amber-50 to-sky-50 border-2 border-amber-300 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-5xl bg-white p-2.5 rounded-2xl shadow">{activeStickerInfo.emoji}</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-display font-extrabold text-slate-900">
                  {activeStickerInfo.name}
                </h3>
                <span className="text-xs font-mono text-indigo-600 font-bold">
                  {activeStickerInfo.phonetic}
                </span>
              </div>
              <div className="text-xs font-bold text-emerald-700">{activeStickerInfo.vietnamese}</div>
              <p className="text-xs text-slate-600 mt-0.5 italic">“{activeStickerInfo.sentence}”</p>
            </div>
          </div>

          <button
            onClick={() => sound.speakEnglish(`${activeStickerInfo.name}. ${activeStickerInfo.sentence}`, 0.9)}
            className="btn-toy-yellow p-3 rounded-2xl text-slate-900 cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between my-2.5">
          <h4 className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Kho Sticker Động ({STICKER_CATALOG.filter((s) => unlockedItems.includes(s.id)).length}/
            {STICKER_CATALOG.length} Đã mở)
          </h4>
          <span className="text-[11px] font-bold text-indigo-600">Bấm vào để dán lên tranh!</span>
        </div>

        {/* Lưới danh sách 20 Sticker */}
        <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-2.5 pr-1">
          {STICKER_CATALOG.map((st) => {
            const isUnlocked = unlockedItems.includes(st.id);
            const unlockCost = st.rarity === 'Legendary' ? 90 : st.rarity === 'Epic' ? 65 : 40;
            return (
              <button
                key={st.id}
                onClick={() => handleCatalogStickerClick(st)}
                className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                  isUnlocked
                    ? 'bg-white border-sky-200 hover:border-amber-400 hover:scale-105 shadow-sm'
                    : 'bg-slate-100/80 border-slate-200 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="text-4xl my-1">{st.emoji}</div>
                <div className="font-display font-bold text-xs text-slate-800 leading-tight">{st.name}</div>
                <div className="text-[10px] text-slate-500">{st.vietnamese}</div>
                <div className="mt-1.5 w-full">
                  {isUnlocked ? (
                    <span className="w-full py-1 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center gap-1">
                      <Plus className="w-3 h-3" /> Dán vào tranh
                    </span>
                  ) : (
                    <span className="w-full py-1 rounded-xl bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" /> 💎 {unlockCost}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
