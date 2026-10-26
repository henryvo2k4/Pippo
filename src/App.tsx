import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Settings,
  Play,
  Sparkles,
  X,
  Crown,
  Lock,
  ArrowLeft,
  UserCheck,
  MapPin,
  CheckCircle2,
  Gift,
  Brain,
  LogOut,
  KeyRound,
} from 'lucide-react';
import {
  KINGDOMS,
  KINGDOM_ZONES,
  ISLAND_LESSONS,
  AVATAR_CHARACTERS,
  IslandLesson,
  GradeTier,
  AvatarBaseId,
} from './data/curriculumData';
import { useGameStore } from './store/useGameStore';
import { KingdomWorldMap3D } from './components/three/Avatar3DScene';
import { GhibliWorldMap2D } from './components/ghibli/GhibliWorldMap2D';
import { ThreeErrorBoundary } from './components/three/ThreeErrorBoundary';
import { MiniGameArena } from './components/games/MiniGameArena';
import { WardrobePetStudio } from './components/wardrobe/WardrobePetStudio';
import { StickerDioramaBook } from './components/diorama/StickerDioramaBook';
import { Leaderboard3DPodium } from './components/leaderboard/Leaderboard3DPodium';
import { ParentSupabaseModal } from './components/parent/ParentSupabaseModal';
import { PersonalInventoryBackpack } from './components/inventory/PersonalInventoryBackpack';
import { StudentLoginModal } from './components/auth/StudentLoginModal';
import { WelcomeGiftModal } from './components/auth/WelcomeGiftModal';
import { ChangePasswordModal } from './components/auth/ChangePasswordModal';
import { sound } from './lib/sound';

type MainSection = 'map' | 'arena' | 'inventory' | 'wardrobe' | 'diorama' | 'leaderboard';
type AvatarHubTab = 'world_quests' | 'vocab_srs' | 'profile_settings';

export function App() {
  const {
    currentUsername,
    currentFullName,
    hasClaimedWelcomeGift,
    nickname,
    gradeTier,
    avatarBase,
    hasCompletedOnboarding,
    level,
    stars,
    rainbowGems,
    streakDays,
    equippedSkin,
    petState,
    completedLessons,
    lessonStars,
    lessonMistakes,
    placedIslandDecors,
    srsRecords,
    claimedDailyQuestIds,
    completeOnboarding,
    setProfileInfo,
    setAvatarBase,
    recordWordPractice,
    claimDailyQuest,
    logoutStudentAccount,
  } = useGameStore();

  const [activeSection, setActiveSection] = useState<MainSection>('map');
  const [avatarHubTab, setAvatarHubTab] = useState<AvatarHubTab>('world_quests');
  const [isMuted, setIsMuted] = useState(false);
  const [showParentModal, setShowParentModal] = useState(false);
  const [showAvatarHubModal, setShowAvatarHubModal] = useState(false);
  const [showIslandMissionCard, setShowIslandMissionCard] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [mapNoticeToast, setMapNoticeToast] = useState<string | null>(null);

  // State cho form Đăng Ký / Chỉnh Sửa Hồ Sơ Cá Nhân & Độ Tuổi
  const [formNickname, setFormNickname] = useState(nickname);
  const [formTier, setFormTier] = useState<GradeTier>(gradeTier);
  const [formAvatar, setFormAvatar] = useState<AvatarBaseId>(avatarBase);

  useEffect(() => {
    setFormNickname(nickname);
    setFormTier(gradeTier);
    setFormAvatar(avatarBase);
  }, [nickname, gradeTier, avatarBase]);

  const triggerMapToast = (msg: string) => {
    setMapNoticeToast(msg);
    setTimeout(() => setMapNoticeToast(null), 3200);
  };

  const kingdomInfo = KINGDOMS.find((k) => k.tier === gradeTier) || KINGDOMS[0];
  const zonesForTier = KINGDOM_ZONES[gradeTier] || KINGDOM_ZONES[1];

  // Tất cả 80 đảo của cấp độ hiện tại
  const allTierIslands = useMemo(
    () => ISLAND_LESSONS.filter((l) => l.tier === gradeTier),
    [gradeTier]
  );

  // Tìm Đảo Đang Học Hiện Tại (Frontier Island: đảo mở khóa mới nhất chưa hoàn thành)
  const frontierIsland = useMemo(() => {
    for (let i = 0; i < allTierIslands.length; i++) {
      const isl = allTierIslands[i];
      if (!completedLessons.includes(isl.id)) {
        return isl;
      }
    }
    return allTierIslands[allTierIslands.length - 1] || allTierIslands[0];
  }, [allTierIslands, completedLessons]);

  const [selectedIsland, setSelectedIsland] = useState<IslandLesson>(
    frontierIsland || allTierIslands[0]
  );
  const [cameraTargetX, setCameraTargetX] = useState<number>(
    (frontierIsland || allTierIslands[0])?.position3D[0] || 0
  );

  // Khi đổi cấp lớp hoặc vừa hoàn thành bài tập, tự động đưa nhân vật tới Đảo Đang Mở Khóa Tiếp Theo
  useEffect(() => {
    if (frontierIsland) {
      setSelectedIsland(frontierIsland);
      setCameraTargetX(frontierIsland.position3D[0]);
    }
  }, [gradeTier, frontierIsland?.id]);

  const avatarMeta = AVATAR_CHARACTERS.find((a) => a.id === avatarBase) || AVATAR_CHARACTERS[0];

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.isMuted = next;
  };

  const completedInTierCount = allTierIslands.filter((i) =>
    completedLessons.includes(i.id)
  ).length;

  const totalStarsInTier = allTierIslands.reduce(
    (sum, isl) => sum + (lessonStars[isl.id] || (completedLessons.includes(isl.id) ? 3 : 0)),
    0
  );

  const maxMapX =
    allTierIslands.length > 0
      ? allTierIslands[allTierIslands.length - 1].position3D[0]
      : 1092;

  // Xác định Vùng (Zone 1..8) đang hiển thị ở vị trí camera hiện tại để đổi màu bầu trời mượt mà
  const currentViewedZone = useMemo(() => {
    const approxIslandIdx = Math.max(
      0,
      Math.min(allTierIslands.length - 1, Math.round(cameraTargetX / 13.8))
    );
    const islAtCam = allTierIslands[approxIslandIdx] || selectedIsland;
    return (
      zonesForTier.find((z) => z.zoneIndex === islAtCam?.zoneIndex) ||
      zonesForTier[0]
    );
  }, [cameraTargetX, allTierIslands, zonesForTier, selectedIsland]);

  // Danh sách từ vựng độc nhất của cấp lớp hiện tại kết hợp chỉ số SRS
  const uniqueTierVocabList = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        word: string;
        ipa: string;
        vietnamese: string;
        emoji: string;
        exampleSentence: string;
        mastery: number;
        practicedCount: number;
        lastPracticed: string;
      }
    >();
    allTierIslands.forEach((isl) => {
      isl.items.forEach((item) => {
        if (!map.has(item.id)) {
          const srs = srsRecords[item.id];
          map.set(item.id, {
            id: item.id,
            word: item.word,
            ipa: item.phonetic,
            vietnamese: item.vietnamese,
            emoji: item.emoji,
            exampleSentence: item.exampleSentence,
            mastery: srs ? srs.mastery : 0,
            practicedCount: srs ? srs.practicedCount : 0,
            lastPracticed: srs ? srs.lastPracticed : 'Chưa học',
          });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => b.mastery - a.mastery);
  }, [allTierIslands, srsRecords]);

  const practicedWordsCount = Object.keys(srsRecords).length;
  const threeStarIslandsCount = Object.values(lessonStars).filter((s) => s >= 3).length;

  // Hệ thống Nhiệm Vụ Hàng Ngày (Daily Quests) khích lệ bé học tập
  const dailyQuests = useMemo(
    () => [
      {
        id: 'quest_complete_2_islands',
        title: 'Nhà Thám Hiểm Chăm Chỉ',
        desc: 'Chinh phục ít nhất 2 Hòn Đảo bài tập tiếng Anh',
        emoji: '🏝️',
        current: Math.min(2, completedLessons.length),
        target: 2,
        rewardGems: 60,
        rewardStars: 20,
      },
      {
        id: 'quest_master_5_words',
        title: 'Siêu Trí Nhớ Từ Vựng',
        desc: 'Luyện tập & ghi nhớ ít nhất 5 từ vựng trong Sổ Từ Vựng SRS',
        emoji: '🧠',
        current: Math.min(5, practicedWordsCount),
        target: 5,
        rewardGems: 80,
        rewardStars: 25,
      },
      {
        id: 'quest_3stars_or_decor',
        title: 'Kiến Trúc Sư & Ngôi Sao Vàng',
        desc: 'Đạt 3 Sao (★★★) ở 2 Đảo và đặt ít nhất 5 công trình trên Đảo Cá Nhân',
        emoji: '👑',
        current: Math.min(
          2,
          threeStarIslandsCount + (placedIslandDecors.length >= 5 ? 1 : 0)
        ),
        target: 2,
        rewardGems: 100,
        rewardStars: 35,
      },
    ],
    [completedLessons.length, practicedWordsCount, threeStarIslandsCount, placedIslandDecors.length]
  );

  const unclaimedReadyQuestsCount = dailyQuests.filter(
    (q) => q.current >= q.target && !claimedDailyQuestIds.includes(q.id)
  ).length;

  // Khi người chơi bấm vào 1 Ngôi Nhà / Cột Mốc Cổ Tích
  const handleSelectIslandOn3DMap = (isl: IslandLesson, isUnlocked: boolean) => {
    if (!isUnlocked) {
      sound.playGentleTryAgain();
      triggerMapToast(
        isl.isBossIsland
          ? `👑 Trùm Cuối Làng #${isl.zoneIndex} đang khóa! Bé hãy vượt qua 9 ngôi nhà trước đó nhé!`
          : `🔒 Ngôi Nhà #${isl.islandNumber} đang khóa! Bé hãy hoàn thành Ngôi Nhà #${isl.islandNumber - 1} trước nhé!`
      );
      if (frontierIsland) {
        setSelectedIsland(frontierIsland);
      }
      return;
    }

    setSelectedIsland(isl);
    setShowIslandMissionCard(true);
    sound.speakEnglish(isl.isBossIsland ? `Boss Level: ${isl.title}` : `House ${isl.islandNumber}: ${isl.title}`);
  };

  const currentZoneOfSelected =
    zonesForTier.find((z) => z.zoneIndex === selectedIsland.zoneIndex) || zonesForTier[0];
  const selectedIslandStars =
    lessonStars[selectedIsland.id] ||
    (completedLessons.includes(selectedIsland.id) ? 3 : 0);
  const selectedIslandMistakes = lessonMistakes[selectedIsland.id];

  // Bất kỳ khi nào có Modal đang mở, ẩn các nhãn <Html> 3D để không bao giờ bị đè chữ lên Popup
  const isAnyModalOpen =
    !hasCompletedOnboarding ||
    !currentUsername ||
    !hasClaimedWelcomeGift ||
    showChangePasswordModal ||
    showAvatarHubModal ||
    showIslandMissionCard ||
    showParentModal;

  return (
    <div
      style={{
        background: `radial-gradient(circle at 50% 18%, ${
          currentViewedZone?.themeColor || kingdomInfo.skyColor
        }, #0f172a 85%)`,
      }}
      className="w-screen h-screen flex flex-col justify-between overflow-hidden select-none relative transition-colors duration-700"
    >
      {/* Thông báo nổi trên Bản Đồ 3D */}
      {mapNoticeToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-slate-950 font-display font-extrabold text-sm px-6 py-3 rounded-3xl shadow-2xl border-2 border-white flex items-center gap-2 animate-bounce">
          <Lock className="w-4 h-4 shrink-0" />
          <span>{mapNoticeToast}</span>
        </div>
      )}

      {/* ================= 1. TRANG CHÍNH: BẢN ĐỒ CỔ TÍCH 2D GHIBLI (8 LÀNG & 80 NGÔI NHÀ) ================= */}
      {activeSection === 'map' && (
        <div className="w-full h-full relative overflow-hidden">
          {/* Không gian 2D Ghibli: Đại lộ 8 Làng & Bản đồ chi tiết 10 Ngôi nhà */}
          <div className="absolute inset-0 w-full h-full">
            <GhibliWorldMap2D
              islands={allTierIslands}
              completedLessons={completedLessons}
              lessonStars={lessonStars}
              lessonMistakes={lessonMistakes}
              selectedIslandId={selectedIsland.id}
              onSelectIsland={handleSelectIslandOn3DMap}
              tierInfo={kingdomInfo}
              tierZones={zonesForTier}
              avatarBase={avatarBase}
              nickname={nickname}
            />
          </div>

          {/* THANH HUD NỔI PHÍA TRÊN: CỰC KỲ TINH GỌN (TRÁI: AVATAR HUB • PHẢI: ĐIỂM SỐ & ÂM THANH) */}
          <header className="absolute top-0 left-0 right-0 px-5 pt-3 flex items-center justify-between pointer-events-none z-30">
            {/* Nút Avatar Của Bé -> Bấm vào mở Hồ Sơ, Chọn Độ Tuổi, Đảo Cá Nhân, Tủ Đồ, Sổ Từ Vựng, Nhiệm Vụ Ngày */}
            <button
              onClick={() => {
                sound.playClick();
                setAvatarHubTab('world_quests');
                setShowAvatarHubModal(true);
              }}
              className="pointer-events-auto bg-slate-900/85 hover:bg-slate-900 backdrop-blur-xl border-2 border-amber-300/80 rounded-3xl p-2 pr-4 shadow-2xl flex items-center gap-3 cursor-pointer hover:scale-105 transition-all group relative"
              title="Bấm vào Avatar để mở Túi Đồ, Cửa Hàng, Sổ Từ Vựng, Nhiệm Vụ Ngày và Cài Đặt Độ Tuổi"
            >
              {unclaimedReadyQuestsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white font-display font-extrabold text-[10px] px-2 py-0.5 rounded-full border-2 border-white shadow animate-bounce">
                  🎁 {unclaimedReadyQuestsCount} Quà!
                </span>
              )}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 via-orange-400 to-pink-500 flex items-center justify-center text-3xl shadow-inner border-2 border-white relative">
                {avatarMeta.emoji}
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[9px] font-extrabold px-1.5 rounded-full border border-white">
                  Lv.{level}
                </span>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                    {nickname}
                  </span>
                  <span className="text-[10px] font-bold bg-white/15 text-amber-200 px-2 py-0.5 rounded-full">
                    {kingdomInfo.emoji} {kingdomInfo.ageRange}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-sky-300 flex items-center gap-1.5 mt-0.5">
                  <span>🎒 Túi Đồ</span>
                  <span>•</span>
                  <span>👗 Cửa Hàng</span>
                  <span>•</span>
                  <span>🧠 Từ Vựng</span>
                  <span>•</span>
                  <span>⚙️ Hồ Sơ</span>
                </div>
              </div>
            </button>

            {/* Cụm Chỉ Số Thưởng & Âm Thanh Gọn Gàng Góc Phải */}
            <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl border-2 border-white/20 px-3.5 py-2 rounded-3xl shadow-2xl">
              <div
                className="px-2.5 py-1 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center gap-1 font-display font-extrabold text-xs text-orange-300"
                title="Chuỗi ngày học liên tiếp"
              >
                🔥 {streakDays}
              </div>
              <div
                className="px-3 py-1 rounded-2xl bg-amber-400/20 border border-amber-300/50 flex items-center gap-1 font-display font-extrabold text-xs text-amber-300"
                title="Tổng Sao Đạt Được Trên Bản Đồ"
              >
                ⭐ {stars} <span className="text-[10px] text-amber-200/80">({totalStarsInTier}/240★)</span>
              </div>
              <div
                className="px-3 py-1 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center gap-1 font-display font-extrabold text-xs text-pink-300"
                title="Ngọc Cầu Vồng Mua Trang Phục & Thú Cưng"
              >
                💎 {rainbowGems}
              </div>

              <button
                onClick={toggleSound}
                className="p-2 rounded-2xl bg-white/15 hover:bg-white/25 text-white cursor-pointer transition-colors"
                title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-sky-300" />
                )}
              </button>

              {/* Nút Đổi Tài Khoản / Đăng Xuất Bé Khác */}
              <button
                onClick={() => {
                  sound.playClick();
                  logoutStudentAccount();
                }}
                className="p-2 rounded-2xl bg-white/15 hover:bg-rose-500/80 text-white cursor-pointer transition-colors"
                title="Đổi Bạn Nhỏ Khác / Đăng Xuất"
              >
                <LogOut className="w-4 h-4 text-amber-200 hover:text-white" />
              </button>
            </div>
          </header>

          {/* POPUP THẺ NHIỆM VỤ NGÔI NHÀ CỔ TÍCH (CHỈ HIỆN KHI BẤM VÀO 1 ĐỊA ĐIỂM ĐÃ MỞ KHÓA) */}
          {showIslandMissionCard && (
            <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="ghibli-parchment-card w-full max-w-lg rounded-3xl p-6 border-3 border-amber-300 shadow-2xl relative animate-bounce-once">
                <button
                  onClick={() => setShowIslandMissionCard(false)}
                  className="absolute top-4 right-4 p-2 rounded-2xl bg-amber-100 hover:bg-rose-100 text-amber-900 hover:text-rose-600 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Nhãn Làng & Đánh Giá Sao */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-display font-extrabold text-xs border border-emerald-300">
                    {currentZoneOfSelected.emoji} Làng #{selectedIsland.zoneIndex} • Ngôi Nhà #{selectedIsland.islandNumber}/80
                  </span>
                  {selectedIsland.isBossIsland && (
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white font-display font-black text-xs flex items-center gap-1 shadow-md">
                      <Crown className="w-3.5 h-3.5 text-yellow-200" /> TRÙM CUỐI LÀNG #{selectedIsland.zoneIndex}
                    </span>
                  )}
                  <div className="flex items-center gap-1 bg-stone-900 text-white px-3 py-0.5 rounded-full text-sm">
                    {[1, 2, 3].map((s) => (
                      <span
                        key={s}
                        className={s <= selectedIslandStars ? 'text-amber-300' : 'text-stone-600'}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-[10px] font-bold text-amber-200 ml-1">
                      {selectedIslandStars > 0
                        ? `(${selectedIslandStars}/3 Sao${
                            selectedIslandMistakes !== undefined
                              ? ` • ${selectedIslandMistakes} lỗi`
                              : ''
                          })`
                        : '(Chưa vượt qua)'}
                    </span>
                  </div>
                </div>

                {/* Tiêu đề Ngôi Nhà & Nhiệm Vụ */}
                <div className="mt-3 flex items-center gap-3.5">
                  <div className="text-5xl bg-amber-100/90 p-3 rounded-3xl border-2 border-amber-300 shadow-sm shrink-0">
                    {selectedIsland.badgeEmoji}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-black text-amber-950 leading-tight">
                      {selectedIsland.title}
                    </h2>
                    <div className="text-xs font-extrabold text-emerald-800 mt-1 bg-emerald-50 inline-block px-2.5 py-1 rounded-xl border border-emerald-300">
                      🎯 {selectedIsland.exerciseLabel}
                    </div>
                  </div>
                </div>

                {/* Danh sách từ vựng trong bài tập của Ngôi Nhà này */}
                <div className="mt-4">
                  <div className="text-[11px] font-extrabold uppercase text-amber-900/80 mb-2 flex items-center gap-1">
                    <span>📚</span>
                    <span>Từ vựng & Mẫu câu trong ngôi nhà (Chạm để nghe thử):</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-[190px] overflow-y-auto pr-1">
                    {selectedIsland.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          sound.playClick();
                          sound.speakEnglish(`${item.word}. ${item.exampleSentence}`);
                        }}
                        className="p-2.5 rounded-2xl bg-white/80 hover:bg-emerald-50 border border-amber-200/80 flex items-center justify-between cursor-pointer transition-colors shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{item.emoji}</span>
                          <div>
                            <div className="font-display font-black text-xs text-amber-950">
                              {item.word}
                            </div>
                            <div className="text-[10px] text-amber-800/80 font-bold">{item.vietnamese}</div>
                          </div>
                        </div>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setShowIslandMissionCard(false);
                      sound.speakEnglish(
                        selectedIsland.isBossIsland
                          ? `Let's conquer the Boss of Village ${selectedIsland.zoneIndex}!`
                          : `Let's explore House ${selectedIsland.islandNumber}!`
                      );
                      setActiveSection('arena');
                    }}
                    className={`flex-1 font-display font-black py-3.5 rounded-2xl text-base flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
                      selectedIsland.isBossIsland
                        ? 'btn-ghibli-amber text-amber-950'
                        : 'btn-ghibli-leaf text-white'
                    }`}
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>
                      {selectedIsland.isBossIsland
                        ? `Chinh Phục Trùm Cuối Làng #${selectedIsland.zoneIndex}! 👑`
                        : `Vào Học Ngôi Nhà #${selectedIsland.islandNumber}!`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= 2. MÀN HÌNH LÀM BÀI TẬP CỦA ĐẢO ĐANG CHỌN ================= */}
      {activeSection === 'arena' && (
        <MiniGameArena
          lesson={selectedIsland}
          onExit={() => {
            setActiveSection('map');
          }}
        />
      )}

      {/* ================= 3. CÁC TRANG CÁ NHÂN MỞ TỪ AVATAR CỦA BÉ (TÚI ĐỒ, CỬA HÀNG 3D, STICKER, BXH) ================= */}
      {(activeSection === 'inventory' ||
        activeSection === 'wardrobe' ||
        activeSection === 'diorama' ||
        activeSection === 'leaderboard') && (
        <div className="w-full h-full flex flex-col justify-between overflow-hidden">
          {/* Thanh điều hướng gọn nhẹ để quay về Bản Đồ Chính hoặc chuyển nhanh giữa các phòng cá nhân */}
          <div className="px-5 pt-3 pb-1 flex items-center justify-between gap-3 z-30">
            <button
              onClick={() => {
                sound.playClick();
                setActiveSection('map');
              }}
              className="btn-toy-blue text-white font-display font-extrabold px-4 py-2 rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Về Bản Đồ Đảo 3D</span>
            </button>

            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-2xl p-1 flex items-center gap-1.5">
              {[
                { id: 'inventory' as const, label: 'Túi Đồ Cá Nhân', emoji: '🎒' },
                { id: 'wardrobe' as const, label: 'Cửa Hàng 3D & Pet', emoji: '👗' },
                { id: 'diorama' as const, label: 'Sổ Sticker', emoji: '📒' },
                { id: 'leaderboard' as const, label: 'Bảng Xếp Hạng', emoji: '🏆' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveSection(tab.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                    activeSection === tab.id
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  sound.playClick();
                  setAvatarHubTab('profile_settings');
                  setShowAvatarHubModal(true);
                }}
                className="px-3 py-1.5 rounded-xl font-display font-bold text-xs text-amber-300 hover:bg-white/10 flex items-center gap-1 cursor-pointer"
              >
                <span>⚙️ Hồ Sơ & Độ Tuổi</span>
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-2xl border border-white/20 text-xs font-display font-extrabold text-white">
              <span className="text-amber-300">⭐ {stars}</span>
              <span>•</span>
              <span className="text-pink-300">💎 {rainbowGems}</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeSection === 'inventory' && (
              <PersonalInventoryBackpack
                onOpenWardrobe={() => setActiveSection('wardrobe')}
                onOpenDiorama={() => setActiveSection('diorama')}
              />
            )}
            {activeSection === 'wardrobe' && <WardrobePetStudio />}
            {activeSection === 'diorama' && <StickerDioramaBook />}
            {activeSection === 'leaderboard' && <Leaderboard3DPodium />}
          </div>
        </div>
      )}

      {/* ================= MODAL ĐĂNG NHẬP HỌC SINH (CHỈ ADMIN MỚI ĐƯỢC TẠO TÀI KHOẢN) ================= */}
      {(!hasCompletedOnboarding || !currentUsername) && (
        <StudentLoginModal
          isOpen={true}
          onSuccess={() => {
            // Đăng nhập xong
          }}
        />
      )}

      {/* ================= HỘP QUÀ TÂN THỦ CHO BÉ ĐĂNG NHẬP LẦN ĐẦU ================= */}
      {currentUsername && !hasClaimedWelcomeGift && (
        <WelcomeGiftModal
          isOpen={true}
          onOpenWardrobe={() => {
            setActiveSection('wardrobe');
          }}
          onClose={() => {
            // Đóng hộp quà
          }}
        />
      )}

      {/* ================= MODAL ĐỔI MẬT KHẨU CÁ NHÂN ================= */}
      {showChangePasswordModal && (
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}

      {/* ================= MODAL TRUNG TÂM AVATAR CỦA BÉ ================= */}
      {hasCompletedOnboarding && currentUsername && showAvatarHubModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="clay-card w-full max-w-4xl max-h-[92vh] rounded-3xl p-6 border-4 border-amber-300 shadow-2xl flex flex-col justify-between overflow-y-auto">
            {/* Tiêu đề Modal */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 flex items-center justify-center text-4xl shadow">
                  {AVATAR_CHARACTERS.find((c) => c.id === formAvatar)?.emoji || '🤖'}
                </div>
                <div>
                  <h2 className="text-2xl font-display font-extrabold text-slate-900">
                    🎒 Trung Tâm Cá Nhân Của {nickname}
                  </h2>
                  <p className="text-xs font-bold text-slate-500">
                    Khám phá Đảo Cá Nhân 3D, Tủ Đồ .GLB, nhận thưởng Nhiệm Vụ Hàng Ngày, ôn Sổ Từ Vựng SRS hoặc đổi Độ Tuổi
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAvatarHubModal(false)}
                className="p-2 rounded-2xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Thanh chuyển Tab trong Trung Tâm Avatar */}
            <div className="flex items-center gap-2 mt-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  onClick={() => {
                    sound.playClick();
                    setAvatarHubTab('world_quests');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl font-display font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    avatarHubTab === 'world_quests'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  <span>🌟 Thế Giới Riêng & Nhiệm Vụ Ngày</span>
                  {unclaimedReadyQuestsCount > 0 && (
                    <span className="bg-amber-300 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px]">
                      {unclaimedReadyQuestsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setAvatarHubTab('vocab_srs');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl font-display font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    avatarHubTab === 'vocab_srs'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>🧠 Sổ Từ Vựng Thông Minh ({practicedWordsCount} từ)</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setAvatarHubTab('profile_settings');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl font-display font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    avatarHubTab === 'profile_settings'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>⚙️ Hồ Sơ, Độ Tuổi & Nhân Vật 3D</span>
                </button>
              </div>

            {/* ================= TAB 1: THẾ GIỚI RIÊNG & NHIỆM VỤ HÀNG NGÀY ================= */}
            {avatarHubTab === 'world_quests' && (
              <div className="my-4 space-y-4">
                <div>
                  <div className="text-xs font-extrabold uppercase text-slate-500 mb-2">
                    🌟 Thế Giới Riêng & Bộ Sưu Tập Của Bé (Bấm để vào):
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setShowAvatarHubModal(false);
                        setActiveSection('inventory');
                      }}
                      className="p-4 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-left shadow-lg hover:scale-105 transition-transform cursor-pointer border-2 border-indigo-200"
                    >
                      <div className="text-4xl mb-2">🎒</div>
                      <div className="font-display font-extrabold text-sm">Túi Đồ Cá Nhân</div>
                      <div className="text-[11px] text-indigo-100 mt-0.5">
                        Quản lý toàn bộ trang bị 3D, thú cưng & vật phẩm hỗ trợ
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setShowAvatarHubModal(false);
                        setActiveSection('wardrobe');
                      }}
                      className="p-4 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 text-white text-left shadow-lg hover:scale-105 transition-transform cursor-pointer border-2 border-pink-200"
                    >
                      <div className="text-4xl mb-2">👗</div>
                      <div className="font-display font-extrabold text-sm">Tủ Đồ 3D & Pet</div>
                      <div className="text-[11px] text-pink-100 mt-0.5">
                        Mặc trang phục .GLB 3D, tiến hóa Pet & đập Hộp Mù
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setShowAvatarHubModal(false);
                        setActiveSection('diorama');
                      }}
                      className="p-4 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-left shadow-lg hover:scale-105 transition-transform cursor-pointer border-2 border-purple-200"
                    >
                      <div className="text-4xl mb-2">📒</div>
                      <div className="font-display font-extrabold text-sm">Sa Bàn Sticker</div>
                      <div className="text-[11px] text-purple-100 mt-0.5">
                        Dán Sticker động sưu tầm từ các đảo học tập
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setShowAvatarHubModal(false);
                        setActiveSection('leaderboard');
                      }}
                      className="p-4 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 text-left shadow-lg hover:scale-105 transition-transform cursor-pointer border-2 border-amber-200"
                    >
                      <div className="text-4xl mb-2">🏆</div>
                      <div className="font-display font-extrabold text-sm">Bảng Xếp Hạng 3D</div>
                      <div className="text-[11px] text-slate-900/80 font-semibold mt-0.5">
                        Đua Top Sao & Huy hiệu phát âm tiếng Anh
                      </div>
                    </button>
                  </div>
                </div>

                {/* Bảng Nhiệm Vụ Hàng Ngày (Daily Quests) */}
                <div className="bg-amber-50/90 border-2 border-amber-200 rounded-3xl p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-600" />
                      <span>🎯 Nhiệm Vụ Hàng Ngày Của Bé (Nhận Ngọc & Sao Thưởng)</span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                      Chuỗi học: 🔥 {streakDays} ngày liên tiếp
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {dailyQuests.map((q) => {
                      const isClaimed = claimedDailyQuestIds.includes(q.id);
                      const isReady = q.current >= q.target;
                      const pct = Math.min(100, Math.round((q.current / q.target) * 100));

                      return (
                        <div
                          key={q.id}
                          className={`p-3.5 rounded-2xl border-2 flex flex-col justify-between ${
                            isClaimed
                              ? 'bg-emerald-50/70 border-emerald-200'
                              : isReady
                              ? 'bg-white border-amber-400 shadow-md'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl">{q.emoji}</span>
                              <span className="text-[11px] font-display font-extrabold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                                +{q.rewardGems} 💎 • +{q.rewardStars} ⭐
                              </span>
                            </div>
                            <div className="font-display font-extrabold text-xs text-slate-900 mt-1.5">
                              {q.title}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                              {q.desc}
                            </p>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1">
                              <span>Tiến độ</span>
                              <span>
                                {q.current}/{q.target}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2.5">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>

                            {isClaimed ? (
                              <div className="w-full py-1.5 rounded-xl bg-emerald-500/15 text-emerald-700 font-display font-extrabold text-xs flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Đã Nhận Thưởng
                              </div>
                            ) : isReady ? (
                              <button
                                onClick={() => {
                                  const ok = claimDailyQuest(q.id, q.rewardGems, q.rewardStars);
                                  if (ok) {
                                    sound.playWinFanfare();
                                    confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
                                  }
                                }}
                                className="w-full btn-toy-yellow text-slate-950 py-1.5 rounded-xl font-display font-extrabold text-xs cursor-pointer animate-bounce"
                              >
                                🎁 Nhận +{q.rewardGems} 💎 Ngay!
                              </button>
                            ) : (
                              <div className="w-full py-1.5 rounded-xl bg-slate-100 text-slate-400 font-display font-bold text-[11px] text-center">
                                Đang thực hiện...
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: SỔ TỪ VỰNG THÔNG MINH & ÔN TẬP NHANH (SRS FLASHCARDS) ================= */}
            {avatarHubTab === 'vocab_srs' && (
              <div className="my-4 bg-slate-50 rounded-3xl p-4 border-2 border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-display font-extrabold text-base text-slate-900">
                      🧠 Sổ Từ Vựng Thông Minh Của {nickname} ({kingdomInfo.ageRange})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Bấm vào loa để nghe phát âm chuẩn bản xứ hoặc bấm <strong>"⚡ Ôn Nhanh"</strong> để tăng độ thuộc lòng (SRS Mastery)!
                    </p>
                  </div>
                  <div className="bg-indigo-100 text-indigo-800 font-display font-extrabold text-xs px-3 py-1.5 rounded-2xl">
                    Đã học: {practicedWordsCount} từ
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[370px] overflow-y-auto pr-1">
                  {uniqueTierVocabList.map((v) => (
                    <div
                      key={v.id}
                      className="p-3 rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-300 flex items-center justify-between gap-2 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shrink-0">
                          {v.emoji}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-extrabold text-sm text-slate-900 truncate">
                              {v.word}
                            </span>
                            <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                              {v.ipa}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-600">{v.vietnamese}</div>
                          <div className="text-[10px] text-slate-400 italic truncate">
                            "{v.exampleSentence}"
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              sound.playClick();
                              sound.speakEnglish(`${v.word}. ${v.exampleSentence}`);
                            }}
                            className="p-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 cursor-pointer"
                            title="Nghe phát âm & câu ví dụ"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              sound.playSuccess();
                              sound.speakEnglish(`${v.word}! ${v.exampleSentence}`);
                              recordWordPractice(v.id, v.word, gradeTier, true);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-display font-extrabold text-[10px] cursor-pointer shadow-sm"
                          >
                            ⚡ Ôn Nhanh
                          </button>
                        </div>
                        <div className="w-24">
                          <div className="flex justify-between text-[9px] font-bold text-slate-500">
                            <span>Thuộc lòng</span>
                            <span className="text-emerald-600">{v.mastery}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                            <div
                              className="h-full bg-emerald-500 transition-all duration-300"
                              style={{ width: `${v.mastery}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 3: HỒ SƠ, ĐỘ TUỔI & NHÂN VẬT 3D ================= */}
            {avatarHubTab === 'profile_settings' && (
              <div className="my-4 bg-slate-50 rounded-3xl p-4 border-2 border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    <span>Cài Đặt Thông Tin Bé, Độ Tuổi Học Tập & Nhân Vật 3D</span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setShowAvatarHubModal(false);
                      setShowParentModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Góc Phụ Huynh & Kết Nối Supabase DB</span>
                  </button>
                </div>

                {/* Thông tin tài khoản chính thức & nút đổi mật khẩu */}
                <div className="bg-indigo-50/90 border border-indigo-200 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <div className="font-display font-extrabold text-xs text-indigo-950 flex items-center gap-2">
                      <span>Tài khoản chính thức:</span>
                      <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-mono">
                        @{currentUsername}
                      </span>
                      {currentFullName && (
                        <span className="text-slate-600 font-bold">• {currentFullName}</span>
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                      🔒 Tài khoản bảo mật • Chỉ quản trị viên mới được tạo tài khoản
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setShowChangePasswordModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Đổi Mật Khẩu</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setShowAvatarHubModal(false);
                        logoutStudentAccount();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-display font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đổi Bé Khác</span>
                    </button>
                  </div>
                </div>

                {/* 1. Nhập Biệt Danh Của Bé */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 mb-1">
                    1️⃣ Tên / Biệt danh của bé:
                  </label>
                  <input
                    type="text"
                    value={formNickname}
                    onChange={(e) => setFormNickname(e.target.value)}
                    placeholder="Nhập tên của bé..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-slate-300 focus:border-indigo-500 font-display font-bold text-sm text-slate-900 outline-none"
                  />
                </div>

                {/* 2. Chọn Độ Tuổi / Cấp Lớp (Mỗi cấp lớp có 80 Đảo tăng dần độ khó) */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 mb-1.5">
                    2️⃣ Chọn Độ Tuổi / Cấp Lớp Học Tập (Lộ trình 80 Đảo riêng cho từng độ tuổi):
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {KINGDOMS.map((k) => {
                      const isPicked = formTier === k.tier;
                      return (
                        <button
                          key={k.tier}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setFormTier(k.tier);
                          }}
                          className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                            isPicked
                              ? 'bg-indigo-600 text-white border-amber-300 shadow-lg scale-102'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{k.emoji}</div>
                          <div className="font-display font-extrabold text-xs">{k.ageRange}</div>
                          <div
                            className={`text-[10px] mt-0.5 ${
                              isPicked ? 'text-indigo-100' : 'text-slate-500'
                            }`}
                          >
                            {k.standard}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Chọn Nhân Vật 3D Đồng Hành */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 mb-1.5">
                    3️⃣ Chọn Nhân Vật 3D Đồng Hành (Mỗi nhân vật có Bộ Trang Bị .GLB Riêng):
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {AVATAR_CHARACTERS.map((char) => {
                      const isPicked = formAvatar === char.id;
                      return (
                        <button
                          key={char.id}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setFormAvatar(char.id);
                          }}
                          className={`p-2.5 rounded-2xl border-2 flex flex-col items-center text-center transition-all cursor-pointer ${
                            isPicked
                              ? 'bg-amber-400 text-slate-950 border-amber-600 font-extrabold scale-105 shadow'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                          }`}
                        >
                          <span className="text-3xl">{char.emoji}</span>
                          <span className="text-[11px] font-display font-bold mt-1">
                            {char.name}
                          </span>
                          <span className="text-[9px] opacity-75 line-clamp-1">
                            {char.signatureSetName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Nút Lưu Cài Đặt */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAvatarHubModal(false)}
                className="px-5 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 font-display font-bold text-xs text-slate-700 cursor-pointer"
              >
                Đóng
              </button>
              {avatarHubTab === 'profile_settings' && (
                <button
                  onClick={() => {
                    sound.playWinFanfare();
                    completeOnboarding(formNickname, formTier, formAvatar);
                    setProfileInfo(formNickname.trim() || 'Bé Ngoan Siêu Cấp', formTier);
                    setAvatarBase(formAvatar);
                    setShowAvatarHubModal(false);
                  }}
                  className="btn-toy-green text-white font-display font-extrabold px-8 py-3 rounded-2xl text-sm flex items-center gap-2 cursor-pointer shadow-xl"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>💾 Lưu Thông Tin & Độ Tuổi</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Phụ Huynh & Supabase */}
      {showParentModal && <ParentSupabaseModal onClose={() => setShowParentModal(false)} />}
    </div>
  );
}

export default App;
