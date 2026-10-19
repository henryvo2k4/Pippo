import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AvatarBaseId, GradeTier, SkinSlot, ISLAND_DECOR_CATALOG } from '../data/curriculumData';
import { getSupabaseClient } from '../lib/supabase';

export interface EquippedSkin {
  hat: string;
  glasses: string;
  outfit: string;
  wing: string;
  hand_item: string;
  aura: string;
}

export interface PetState {
  pet_id: 'dragon_sky' | 'cloud_pet' | 'robo_pup';
  name: string;
  stage: 1 | 2 | 3; // 1: Trứng Thần, 2: Thú Con, 3: Thú Thần Tiến Hóa
  exp: number;
  happiness: number;
}

export interface PlacedSticker {
  uid: string;
  sceneId: string;
  stickerId: string;
  x: number; // % 5 to 92
  y: number; // % 12 to 85
  scale: number;
  rotation: number;
}

export interface PlacedIslandDecor {
  instanceId: string;
  decorId: string;
  slotIndex: number; // 0..15 trên Đảo Cá Nhân 3D
  rotationY: number; // góc xoay Radian
  scale: number; // tỉ lệ 0.7 -> 1.6
}

export type HomeIslandTheme = 'sunny' | 'sunset' | 'winter' | 'galaxy';

export interface SrsWordRecord {
  itemId: string;
  word: string;
  tier: GradeTier;
  mastery: number; // 0 - 100
  practicedCount: number;
  lastPracticed: string;
}

export interface LeaderboardCompetitor {
  id: string;
  nickname: string;
  grade_tier: GradeTier;
  avatar_base: AvatarBaseId;
  level: number;
  stars: number;
  speaking_score_total: number;
  streak_days: number;
  total_collectibles: number;
  equipped_skin: EquippedSkin;
  pet_state: PetState;
  isCurrentUser?: boolean;
}

interface GameState {
  studentId: string;
  nickname: string;
  gradeTier: GradeTier;
  avatarBase: AvatarBaseId;
  hasCompletedOnboarding: boolean;
  level: number;
  stars: number;
  rainbowGems: number;
  streakDays: number;
  speakingScoreTotal: number;
  equippedSkin: EquippedSkin;
  petState: PetState;
  unlockedItems: string[];
  completedLessons: string[];
  lessonStars: Record<string, number>; // lessonId -> 1 | 2 | 3 stars
  lessonMistakes: Record<string, number>; // lessonId -> số lỗi sai thấp nhất
  placedStickers: PlacedSticker[];
  unlockedDecorIds: string[];
  placedIslandDecors: PlacedIslandDecor[];
  homeIslandTheme: HomeIslandTheme;
  srsRecords: Record<string, SrsWordRecord>;
  screenTimeLimitMins: number;
  cloudSyncStatus: 'local' | 'syncing' | 'synced' | 'error';
  customGlbUrl: string | null;
  accessoryOffsets: Record<string, { y: number; z: number; scale: number }>;
  claimedDailyQuestIds: string[];

  // Actions
  setCustomGlbUrl: (url: string | null) => void;
  setAccessoryOffset: (avatarId: string, patch: Partial<{ y: number; z: number; scale: number }>) => void;
  equipCharacterSignatureSet: (base: AvatarBaseId) => void;
  completeOnboarding: (nickname: string, tier: GradeTier, avatarBase: AvatarBaseId) => void;
  setProfileInfo: (nickname: string, tier: GradeTier) => void;
  setGradeTier: (tier: GradeTier) => void;
  setAvatarBase: (base: AvatarBaseId) => void;
  equipSkinItem: (slot: SkinSlot, itemId: string) => void;
  buyOrUnlockItem: (itemId: string, priceGems: number) => boolean;
  feedAndTrainPet: (gemsCost: number) => void;
  changePetType: (petId: 'dragon_sky' | 'cloud_pet' | 'robo_pup', petName: string) => void;
  rewardLessonCompletion: (
    lessonId: string,
    starRating: 1 | 2 | 3,
    starsEarned: number,
    gemsEarned: number,
    mistakesCount: number,
    speakingBonus: number,
    unlockedStickerId?: string
  ) => void;
  recordWordPractice: (itemId: string, word: string, tier: GradeTier, isCorrect: boolean) => void;
  claimDailyQuest: (questId: string, rewardGems: number, rewardStars: number) => boolean;
  addStickerToScene: (sceneId: string, stickerId: string) => void;
  moveStickerInScene: (uid: string, x: number, y: number) => void;
  transformStickerInScene: (uid: string, deltaScale: number, deltaRotation: number) => void;
  removeStickerFromScene: (uid: string) => void;

  // Actions cho Đảo Cá Nhân 3D (Personal 3D Home Island)
  buyOrUnlockDecor: (decorId: string, priceGems: number) => boolean;
  placeIslandDecor: (decorId: string, slotIndex: number) => void;
  updatePlacedDecor: (instanceId: string, patch: Partial<PlacedIslandDecor>) => void;
  removePlacedDecor: (instanceId: string) => void;
  setHomeIslandTheme: (theme: HomeIslandTheme) => void;

  setScreenTimeLimit: (mins: number) => void;
  syncToSupabaseCloud: () => Promise<boolean>;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      studentId: 'student-local-hero-01',
      nickname: 'Bé Henry Siêu Cấp',
      gradeTier: 1,
      avatarBase: 'bear',
      hasCompletedOnboarding: false,
      level: 5,
      stars: 260,
      rainbowGems: 650,
      streakDays: 7,
      speakingScoreTotal: 210,
      equippedSkin: {
        hat: 'crown_gold',
        glasses: 'none',
        outfit: 'knight_armor',
        wing: 'jetpack_3d',
        hand_item: 'laser_sword',
        aura: 'cyber_pulse',
      },
      petState: {
        pet_id: 'dragon_sky',
        name: 'Poko Rồng Con',
        stage: 2,
        exp: 60,
        happiness: 95,
      },
      unlockedItems: [
        'none',
        'crown_gold',
        'bunny_ears',
        'astro_helmet',
        'star_shades',
        'cape_royal',
        'knight_armor',
        'wizard_robe',
        'angel_wings',
        'jetpack_3d',
        'dragon_wings',
        'magic_wand',
        'laser_sword',
        'balloon_heart',
        'starlight',
        'rainbow_ring',
        'cyber_pulse',
        'sticker_cow',
        'sticker_duck',
        'sticker_rabbit',
        'sticker_apple',
        'sticker_banana',
        'sticker_rocket',
        'sticker_dragon',
        'sticker_rainbow',
      ],
      completedLessons: ['k1-u1'],
      lessonStars: {
        'k1-u1': 3,
      },
      lessonMistakes: {
        'k1-u1': 0,
      },
      placedStickers: [
        { uid: 'st-init-1', sceneId: 'sunny_farm', stickerId: 'sticker_cow', x: 28, y: 68, scale: 1.15, rotation: -5 },
        { uid: 'st-init-2', sceneId: 'sunny_farm', stickerId: 'sticker_duck', x: 52, y: 74, scale: 1.05, rotation: 6 },
        { uid: 'st-init-3', sceneId: 'sunny_farm', stickerId: 'sticker_rainbow', x: 50, y: 25, scale: 1.35, rotation: 0 },
        { uid: 'st-init-4', sceneId: 'ocean_palace', stickerId: 'sticker_dragon', x: 46, y: 54, scale: 1.25, rotation: 0 },
      ],
      // Các vật phẩm trang trí Đảo Cá Nhân 3D được tặng sẵn ban đầu
      unlockedDecorIds: [
        'decor_gate_rainbow',
        'decor_gate_torii',
        'decor_statue_yeti',
        'decor_statue_crystal',
        'decor_bldg_cottage',
        'decor_nature_tree',
        'decor_nature_lamp',
      ],
      // Bố cục mẫu ban đầu trên Đảo Cá Nhân 3D của bé
      placedIslandDecors: [
        { instanceId: 'isl-init-1', decorId: 'decor_gate_torii', slotIndex: 0, rotationY: 0, scale: 1.2 },
        { instanceId: 'isl-init-2', decorId: 'decor_bldg_cottage', slotIndex: 5, rotationY: 0.35, scale: 1.3 },
        { instanceId: 'isl-init-3', decorId: 'decor_statue_yeti', slotIndex: 2, rotationY: -0.25, scale: 1.0 },
        { instanceId: 'isl-init-4', decorId: 'decor_nature_tree', slotIndex: 8, rotationY: 0, scale: 1.2 },
        { instanceId: 'isl-init-5', decorId: 'decor_statue_crystal', slotIndex: 1, rotationY: 0, scale: 1.1 },
      ],
      homeIslandTheme: 'sunny',
      srsRecords: {
        'k1-cow': { itemId: 'k1-cow', word: 'Cow', tier: 1, mastery: 90, practicedCount: 4, lastPracticed: 'Hôm nay' },
        'k1-duck': { itemId: 'k1-duck', word: 'Duck', tier: 1, mastery: 85, practicedCount: 3, lastPracticed: 'Hôm nay' },
        'k1-apple': { itemId: 'k1-apple', word: 'Apple', tier: 1, mastery: 75, practicedCount: 2, lastPracticed: 'Hôm qua' },
        'k2-backpack': { itemId: 'k2-backpack', word: 'Backpack', tier: 2, mastery: 80, practicedCount: 3, lastPracticed: 'Hôm nay' },
        'k4-renewable': { itemId: 'k4-renewable', word: 'Renewable energy', tier: 4, mastery: 70, practicedCount: 2, lastPracticed: 'Hôm nay' },
      },
      screenTimeLimitMins: 30,
      cloudSyncStatus: 'local',
      customGlbUrl: null,
      accessoryOffsets: {},
      claimedDailyQuestIds: [],

      setCustomGlbUrl: (url) => set({ customGlbUrl: url }),

      setAccessoryOffset: (avatarId, patch) =>
        set((state) => {
          const prev = state.accessoryOffsets[avatarId] || { y: 0, z: 0, scale: 1 };
          return {
            accessoryOffsets: {
              ...state.accessoryOffsets,
              [avatarId]: { ...prev, ...patch },
            },
          };
        }),

      equipCharacterSignatureSet: (base) => {
        const signatureMap: Record<AvatarBaseId, EquippedSkin> = {
          bear: { hat: 'crown_gold', glasses: 'none', outfit: 'knight_armor', wing: 'jetpack_3d', hand_item: 'laser_sword', aura: 'cyber_pulse' },
          rabbit: { hat: 'crown_gold', glasses: 'none', outfit: 'wizard_robe', wing: 'angel_wings', hand_item: 'balloon_heart', aura: 'starlight' },
          dino: { hat: 'crown_gold', glasses: 'star_shades', outfit: 'knight_armor', wing: 'dragon_wings', hand_item: 'magic_wand', aura: 'rainbow_ring' },
          cat: { hat: 'bunny_ears', glasses: 'none', outfit: 'cape_royal', wing: 'dragon_wings', hand_item: 'laser_sword', aura: 'starlight' },
          knight: { hat: 'astro_helmet', glasses: 'none', outfit: 'knight_armor', wing: 'jetpack_3d', hand_item: 'magic_wand', aura: 'cyber_pulse' },
          wizard: { hat: 'crown_gold', glasses: 'none', outfit: 'cape_royal', wing: 'angel_wings', hand_item: 'magic_wand', aura: 'rainbow_ring' },
        };
        set({
          avatarBase: base,
          equippedSkin: signatureMap[base] || signatureMap.bear,
        });
        get().syncToSupabaseCloud();
      },

      completeOnboarding: (nickname, tier, avatarBase) => {
        set({
          nickname: nickname.trim() || 'Bé Ngoan Siêu Cấp',
          gradeTier: tier,
          hasCompletedOnboarding: true,
        });
        get().equipCharacterSignatureSet(avatarBase);
      },

      setProfileInfo: (nickname, tier) => {
        set({ nickname, gradeTier: tier, hasCompletedOnboarding: true });
        get().syncToSupabaseCloud();
      },

      setGradeTier: (tier) => {
        set({ gradeTier: tier });
      },

      setAvatarBase: (base) => {
        get().equipCharacterSignatureSet(base);
      },

      equipSkinItem: (slot, itemId) => {
        set((state) => ({
          equippedSkin: {
            ...state.equippedSkin,
            [slot]: itemId,
          },
        }));
        get().syncToSupabaseCloud();
      },

      buyOrUnlockItem: (itemId, priceGems) => {
        const state = get();
        if (state.unlockedItems.includes(itemId)) return true;
        if (state.rainbowGems < priceGems) return false;
        set({
          rainbowGems: state.rainbowGems - priceGems,
          unlockedItems: [...state.unlockedItems, itemId],
        });
        get().syncToSupabaseCloud();
        return true;
      },

      feedAndTrainPet: (gemsCost) => {
        const state = get();
        if (state.rainbowGems < gemsCost) return;
        const newExp = state.petState.exp + 35;
        let newStage = state.petState.stage;
        if (newExp >= 100 && state.petState.stage < 3) {
          newStage = (state.petState.stage + 1) as 1 | 2 | 3;
        }
        set({
          rainbowGems: state.rainbowGems - gemsCost,
          petState: {
            ...state.petState,
            stage: newStage,
            exp: newExp >= 100 && state.petState.stage < 3 ? newExp - 100 : Math.min(100, newExp),
            happiness: Math.min(100, state.petState.happiness + 10),
          },
        });
        get().syncToSupabaseCloud();
      },

      changePetType: (petId, petName) => {
        set((state) => ({
          petState: {
            ...state.petState,
            pet_id: petId,
            name: petName,
          },
        }));
      },

      rewardLessonCompletion: (
        lessonId,
        starRating,
        starsEarned,
        gemsEarned,
        mistakesCount,
        speakingBonus,
        unlockedStickerId
      ) => {
        set((state) => {
          const isAlreadyCompleted = state.completedLessons.includes(lessonId);
          const prevStarRating = state.lessonStars[lessonId] || 0;
          const nextStarRating = Math.max(prevStarRating, starRating);
          const starUpgradeDiff = Math.max(0, nextStarRating - prevStarRating);

          // Chống cày điểm vô hạn trên 1 đảo cũ:
          // - Lần đầu vượt đảo: nhận 100% Sao & Ngọc thưởng
          // - Chơi lại đảo cũ nhưng nâng cấp Sao (VD: 1★ -> 3★): thưởng phần chênh lệch + quà ôn tập
          // - Chơi lại đảo đã đạt 3★: thưởng quà ôn tập nhẹ (+5⭐, +15💎)
          const effectiveStarsEarned = !isAlreadyCompleted
            ? starsEarned
            : starUpgradeDiff > 0
            ? starUpgradeDiff * 15 + 5
            : 5;
          const effectiveGemsEarned = !isAlreadyCompleted
            ? gemsEarned
            : starUpgradeDiff > 0
            ? Math.round(gemsEarned * 0.6)
            : 15;

          const newStars = state.stars + effectiveStarsEarned;
          const newLevel = Math.max(state.level, Math.floor(newStars / 50) + 1);
          const updatedUnlocked =
            unlockedStickerId && !state.unlockedItems.includes(unlockedStickerId)
              ? [...state.unlockedItems, unlockedStickerId]
              : state.unlockedItems;
          const updatedLessons = isAlreadyCompleted
            ? state.completedLessons
            : [...state.completedLessons, lessonId];

          const prevMistakes = state.lessonMistakes[lessonId];
          const nextMistakes =
            prevMistakes !== undefined ? Math.min(prevMistakes, mistakesCount) : mistakesCount;

          // Nếu người chơi vượt qua Đảo Boss (ví dụ k1-u10, k2-u20...), tự động mở khóa Tượng/Kiến trúc Đảo tương ứng!
          const matchNum = lessonId.match(/-u(\d+)$/) || lessonId.match(/-isl-(\d+)$/);
          const islandNum = matchNum ? parseInt(matchNum[1], 10) : 0;
          let updatedDecors = state.unlockedDecorIds;
          if (islandNum > 0) {
            const rewardDecor = ISLAND_DECOR_CATALOG.find((d) => d.unlockByIslandNumber === islandNum);
            if (rewardDecor && !updatedDecors.includes(rewardDecor.id)) {
              updatedDecors = [...updatedDecors, rewardDecor.id];
            }
          }

          return {
            stars: newStars,
            level: newLevel,
            rainbowGems: state.rainbowGems + effectiveGemsEarned,
            speakingScoreTotal: state.speakingScoreTotal + speakingBonus,
            unlockedItems: updatedUnlocked,
            unlockedDecorIds: updatedDecors,
            completedLessons: updatedLessons,
            lessonStars: {
              ...state.lessonStars,
              [lessonId]: nextStarRating,
            },
            lessonMistakes: {
              ...state.lessonMistakes,
              [lessonId]: nextMistakes,
            },
          };
        });
        get().syncToSupabaseCloud();
      },

      recordWordPractice: (itemId, word, tier, isCorrect) => {
        set((state) => {
          const existing = state.srsRecords[itemId] || {
            itemId,
            word,
            tier,
            mastery: 30,
            practicedCount: 0,
            lastPracticed: 'Vừa xong',
          };
          const delta = isCorrect ? 20 : -10;
          const nextMastery = Math.max(10, Math.min(100, existing.mastery + delta));
          return {
            srsRecords: {
              ...state.srsRecords,
              [itemId]: {
                ...existing,
                mastery: nextMastery,
                practicedCount: existing.practicedCount + 1,
                lastPracticed: 'Vừa xong',
              },
            },
          };
        });
      },

      claimDailyQuest: (questId, rewardGems, rewardStars) => {
        const state = get();
        if (state.claimedDailyQuestIds.includes(questId)) return false;
        const newStars = state.stars + rewardStars;
        const newLevel = Math.max(state.level, Math.floor(newStars / 50) + 1);
        set({
          claimedDailyQuestIds: [...state.claimedDailyQuestIds, questId],
          rainbowGems: state.rainbowGems + rewardGems,
          stars: newStars,
          level: newLevel,
        });
        get().syncToSupabaseCloud();
        return true;
      },

      addStickerToScene: (sceneId, stickerId) => {
        const randomX = Math.floor(22 + Math.random() * 55);
        const randomY = Math.floor(28 + Math.random() * 48);
        const newPlaced: PlacedSticker = {
          uid: `st-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          sceneId,
          stickerId,
          x: randomX,
          y: randomY,
          scale: 1.15,
          rotation: Math.floor(Math.random() * 16 - 8),
        };
        set((state) => ({
          placedStickers: [...state.placedStickers, newPlaced],
        }));
      },

      moveStickerInScene: (uid, x, y) => {
        set((state) => ({
          placedStickers: state.placedStickers.map((st) =>
            st.uid === uid
              ? { ...st, x: Math.max(6, Math.min(92, x)), y: Math.max(10, Math.min(88, y)) }
              : st
          ),
        }));
      },

      transformStickerInScene: (uid, deltaScale, deltaRotation) => {
        set((state) => ({
          placedStickers: state.placedStickers.map((st) =>
            st.uid === uid
              ? {
                  ...st,
                  scale: Math.max(0.65, Math.min(2.2, Number((st.scale + deltaScale).toFixed(2)))),
                  rotation: (st.rotation + deltaRotation) % 360,
                }
              : st
          ),
        }));
      },

      removeStickerFromScene: (uid) => {
        set((state) => ({
          placedStickers: state.placedStickers.filter((st) => st.uid !== uid),
        }));
      },

      // ================= ACTIONS ĐẢO CÁ NHÂN 3D (PERSONAL 3D HOME ISLAND) =================
      buyOrUnlockDecor: (decorId, priceGems) => {
        const state = get();
        if (state.unlockedDecorIds.includes(decorId)) return true;
        if (state.rainbowGems < priceGems) return false;
        set({
          rainbowGems: state.rainbowGems - priceGems,
          unlockedDecorIds: [...state.unlockedDecorIds, decorId],
        });
        get().syncToSupabaseCloud();
        return true;
      },

      placeIslandDecor: (decorId, slotIndex) => {
        const meta = ISLAND_DECOR_CATALOG.find((d) => d.id === decorId);
        const defaultScale = meta?.defaultScale || 1.0;
        set((state) => {
          // Nếu ô đất slotIndex đã có vật phẩm, thay thế bằng vật phẩm mới
          const filtered = state.placedIslandDecors.filter((p) => p.slotIndex !== slotIndex);
          const newItem: PlacedIslandDecor = {
            instanceId: `decor-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            decorId,
            slotIndex,
            rotationY: 0,
            scale: defaultScale,
          };
          return {
            placedIslandDecors: [...filtered, newItem],
          };
        });
        get().syncToSupabaseCloud();
      },

      updatePlacedDecor: (instanceId, patch) => {
        set((state) => ({
          placedIslandDecors: state.placedIslandDecors.map((item) =>
            item.instanceId === instanceId ? { ...item, ...patch } : item
          ),
        }));
        get().syncToSupabaseCloud();
      },

      removePlacedDecor: (instanceId) => {
        set((state) => ({
          placedIslandDecors: state.placedIslandDecors.filter((item) => item.instanceId !== instanceId),
        }));
        get().syncToSupabaseCloud();
      },

      setHomeIslandTheme: (theme) => {
        set({ homeIslandTheme: theme });
        get().syncToSupabaseCloud();
      },

      setScreenTimeLimit: (mins) => set({ screenTimeLimitMins: mins }),

      syncToSupabaseCloud: async () => {
        const supabase = getSupabaseClient();
        if (!supabase) {
          set({ cloudSyncStatus: 'local' });
          return false;
        }
        try {
          set({ cloudSyncStatus: 'syncing' });
          const state = get();
          const { error } = await supabase.from('student_profiles').upsert(
            {
              nickname: state.nickname,
              grade_tier: state.gradeTier,
              avatar_base: state.avatarBase,
              level: state.level,
              stars: state.stars,
              rainbow_gems: state.rainbowGems,
              streak_days: state.streakDays,
              speaking_score_total: state.speakingScoreTotal,
              equipped_skin: state.equippedSkin,
              pet_state: state.petState,
              unlocked_items: state.unlockedItems,
              completed_lessons: state.completedLessons,
              unlocked_decor_ids: state.unlockedDecorIds,
              placed_island_decors: state.placedIslandDecors,
              home_island_theme: state.homeIslandTheme,
              screen_time_limit_mins: state.screenTimeLimitMins,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'nickname' }
          );
          if (error) {
            set({ cloudSyncStatus: 'error' });
            return false;
          }
          set({ cloudSyncStatus: 'synced' });
          return true;
        } catch {
          set({ cloudSyncStatus: 'error' });
          return false;
        }
      },
    }),
    {
      name: 'wonderverse-3d-english-storage-v4',
    }
  )
);
