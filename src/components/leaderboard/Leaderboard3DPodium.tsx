import React, { useState, useEffect } from 'react';
import { Trophy, Mic, Flame, Eye, RefreshCw, Crown } from 'lucide-react';
import { GradeTier, KINGDOMS, AVATAR_CHARACTERS } from '../../data/curriculumData';
import { useGameStore, LeaderboardCompetitor } from '../../store/useGameStore';
import { AvatarStudioCanvas } from '../three/Avatar3DScene';
import { getSupabaseClient } from '../../lib/supabase';
import { sound } from '../../lib/sound';

const MOCK_COMPETITORS: LeaderboardCompetitor[] = [
  {
    id: 'comp-1',
    nickname: 'Bé Bơ Siêu Cấp',
    grade_tier: 1,
    avatar_base: 'bear',
    level: 8,
    stars: 420,
    speaking_score_total: 310,
    streak_days: 12,
    total_collectibles: 14,
    equipped_skin: {
      hat: 'crown_gold',
      glasses: 'star_shades',
      outfit: 'cape_royal',
      wing: 'angel_wings',
      hand_item: 'magic_wand',
      aura: 'rainbow_ring',
    },
    pet_state: { pet_id: 'dragon_sky', name: 'Rồng Sữa', stage: 3, exp: 100, happiness: 100 },
  },
  {
    id: 'comp-2',
    nickname: 'Mimi Thỏ Hồng',
    grade_tier: 1,
    avatar_base: 'rabbit',
    level: 6,
    stars: 310,
    speaking_score_total: 265,
    streak_days: 9,
    total_collectibles: 11,
    equipped_skin: {
      hat: 'bunny_ears',
      glasses: 'none',
      outfit: 'dress_fairy',
      wing: 'angel_wings',
      hand_item: 'balloon_heart',
      aura: 'starlight',
    },
    pet_state: { pet_id: 'cloud_pet', name: 'Mây Kẹo', stage: 2, exp: 80, happiness: 95 },
  },
  {
    id: 'comp-3',
    nickname: 'Minh Khôi Lớp 2A',
    grade_tier: 2,
    avatar_base: 'dino',
    level: 11,
    stars: 590,
    speaking_score_total: 450,
    streak_days: 15,
    total_collectibles: 18,
    equipped_skin: {
      hat: 'astro_helmet',
      glasses: 'cyber_visor',
      outfit: 'knight_armor',
      wing: 'jetpack_3d',
      hand_item: 'laser_sword',
      aura: 'cyber_pulse',
    },
    pet_state: { pet_id: 'robo_pup', name: 'Cún Robo', stage: 3, exp: 100, happiness: 98 },
  },
  {
    id: 'comp-4',
    nickname: 'Bảo Ngọc Starters',
    grade_tier: 2,
    avatar_base: 'cat',
    level: 9,
    stars: 480,
    speaking_score_total: 390,
    streak_days: 10,
    total_collectibles: 15,
    equipped_skin: {
      hat: 'wizard_hat',
      glasses: 'star_shades',
      outfit: 'cape_royal',
      wing: 'angel_wings',
      hand_item: 'magic_wand',
      aura: 'starlight',
    },
    pet_state: { pet_id: 'dragon_sky', name: 'Meo Tinh Vân', stage: 2, exp: 75, happiness: 92 },
  },
  {
    id: 'comp-5',
    nickname: 'Hiệp Sĩ Leo Lớp 5',
    grade_tier: 3,
    avatar_base: 'knight',
    level: 16,
    stars: 840,
    speaking_score_total: 690,
    streak_days: 21,
    total_collectibles: 22,
    equipped_skin: {
      hat: 'crown_gold',
      glasses: 'cyber_visor',
      outfit: 'knight_armor',
      wing: 'dragon_wings',
      hand_item: 'laser_sword',
      aura: 'rainbow_ring',
    },
    pet_state: { pet_id: 'dragon_sky', name: 'Hỏa Long', stage: 3, exp: 100, happiness: 100 },
  },
  {
    id: 'comp-6',
    nickname: 'Luna Phù Thủy 6A',
    grade_tier: 4,
    avatar_base: 'wizard',
    level: 22,
    stars: 1250,
    speaking_score_total: 980,
    streak_days: 30,
    total_collectibles: 26,
    equipped_skin: {
      hat: 'wizard_hat',
      glasses: 'star_shades',
      outfit: 'wizard_robe',
      wing: 'angel_wings',
      hand_item: 'magic_wand',
      aura: 'rainbow_ring',
    },
    pet_state: { pet_id: 'dragon_sky', name: 'Thần Long Ngân Hà', stage: 3, exp: 100, happiness: 100 },
  },
  {
    id: 'comp-7',
    nickname: 'Hoàng Nam Lớp 7B',
    grade_tier: 4,
    avatar_base: 'cat',
    level: 19,
    stars: 960,
    speaking_score_total: 810,
    streak_days: 18,
    total_collectibles: 20,
    equipped_skin: {
      hat: 'astro_helmet',
      glasses: 'cyber_visor',
      outfit: 'knight_armor',
      wing: 'jetpack_3d',
      hand_item: 'laser_sword',
      aura: 'cyber_pulse',
    },
    pet_state: { pet_id: 'robo_pup', name: 'AI Bot', stage: 3, exp: 100, happiness: 95 },
  },
];

export const Leaderboard3DPodium: React.FC = () => {
  const {
    studentId,
    nickname,
    gradeTier,
    avatarBase,
    level,
    stars,
    speakingScoreTotal,
    streakDays,
    unlockedItems,
    equippedSkin,
    petState,
  } = useGameStore();

  const [filterTier, setFilterTier] = useState<'all' | GradeTier>('all');
  const [rankingCategory, setRankingCategory] = useState<'stars' | 'speaking' | 'collector'>('stars');
  const [remoteCompetitors, setRemoteCompetitors] = useState<LeaderboardCompetitor[]>([]);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);

  const currentUserEntry: LeaderboardCompetitor = {
    id: studentId,
    nickname: `${nickname} (Bạn)`,
    grade_tier: gradeTier,
    avatar_base: avatarBase,
    level,
    stars,
    speaking_score_total: speakingScoreTotal,
    streak_days: streakDays,
    total_collectibles: unlockedItems.length,
    equipped_skin: equippedSkin,
    pet_state: petState,
    isCurrentUser: true,
  };

  const [inspectedPlayer, setInspectedPlayer] = useState<LeaderboardCompetitor>(currentUserEntry);
  const activeInspectedPlayer = inspectedPlayer.isCurrentUser ? currentUserEntry : inspectedPlayer;

  const fetchSupabaseLeaderboard = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setIsLoadingCloud(true);
    try {
      const { data } = await supabase
        .from('student_profiles')
        .select('*')
        .order('stars', { ascending: false })
        .limit(20);
      if (data && data.length > 0) {
        const mapped: LeaderboardCompetitor[] = data.map((row: any) => ({
          id: row.id,
          nickname: row.nickname,
          grade_tier: row.grade_tier || 1,
          avatar_base: row.avatar_base || 'bear',
          level: row.level || 1,
          stars: row.stars || 100,
          speaking_score_total: row.speaking_score_total || 50,
          streak_days: row.streak_days || 1,
          total_collectibles: Array.isArray(row.unlocked_items) ? row.unlocked_items.length : 8,
          equipped_skin: row.equipped_skin || equippedSkin,
          pet_state: row.pet_state || petState,
        }));
        setRemoteCompetitors(mapped);
      }
    } catch {
      // Fallback to mock competitors
    } finally {
      setIsLoadingCloud(false);
    }
  };

  useEffect(() => {
    fetchSupabaseLeaderboard();
  }, []);

  const baseList = remoteCompetitors.length > 0 ? remoteCompetitors : MOCK_COMPETITORS;
  const combined = [
    currentUserEntry,
    ...baseList.filter((c) => !c.nickname.includes(nickname)),
  ];

  const filteredByTier =
    filterTier === 'all' ? combined : combined.filter((c) => c.grade_tier === filterTier);

  const sortedRankings = [...filteredByTier].sort((a, b) => {
    if (rankingCategory === 'stars') return b.stars - a.stars;
    if (rankingCategory === 'speaking') return b.speaking_score_total - a.speaking_score_total;
    return b.total_collectibles - a.total_collectibles;
  });

  return (
    <div className="w-full h-full grid grid-cols-12 gap-5 p-5 overflow-hidden">
      {/* ================= CỘT TRÁI (5 CỘT): BỤC VINH DANH 3D & THĂM NHÂN VẬT BẠN BÈ ================= */}
      <div className="col-span-5 h-full bg-gradient-to-b from-amber-500/25 via-indigo-900/80 to-slate-950 rounded-3xl border-4 border-amber-300/60 p-4 flex flex-col justify-between relative shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <div>
            <span className="text-xs font-bold uppercase bg-amber-400 text-slate-900 px-3 py-1 rounded-full">
              🏆 Sân Khấu Vinh Danh 3D
            </span>
            <h2 className="text-xl font-display font-extrabold text-white mt-1">
              {activeInspectedPlayer.nickname}
            </h2>
            <p className="text-xs text-amber-200">
              Cấp {activeInspectedPlayer.level} •{' '}
              {KINGDOMS.find((k) => k.tier === activeInspectedPlayer.grade_tier)?.vietnameseName}
            </p>
          </div>
          <div className="text-4xl">👑</div>
        </div>

        {/* Khung 3D Hiển Thị Đúng Bộ Đồ Của Bạn Được Chọn */}
        <div className="flex-1 min-h-[240px]">
          <AvatarStudioCanvas
            avatarBase={activeInspectedPlayer.avatar_base}
            equippedSkin={activeInspectedPlayer.equipped_skin}
            petState={activeInspectedPlayer.pet_state}
          />
        </div>

        {/* Thông số thành tích của học sinh đang xem */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center z-10">
          <div>
            <div className="text-xs text-slate-400">Tổng Sao Học</div>
            <div className="font-display font-extrabold text-amber-400 text-base">
              ⭐ {activeInspectedPlayer.stars}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Điểm Phát Âm</div>
            <div className="font-display font-extrabold text-cyan-300 text-base">
              🎤 {activeInspectedPlayer.speaking_score_total}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Chuỗi Ngày & Đồ</div>
            <div className="font-display font-extrabold text-pink-400 text-base">
              🔥 {activeInspectedPlayer.streak_days} ngày
            </div>
          </div>
        </div>
      </div>

      {/* ================= CỘT PHẢI (7 CỘT): BẢNG XẾP HẠNG PHÂN THEO KHỐI LỚP ================= */}
      <div className="col-span-7 h-full clay-card rounded-3xl p-5 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-extrabold text-slate-900 flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500" />
              Bảng Xếp Hạng Giải Đấu Tuần (Mầm Non – Lớp 7)
            </h3>
            <button
              onClick={() => {
                sound.playClick();
                fetchSupabaseLeaderboard();
              }}
              className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCloud ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
          </div>

          {/* Bộ lọc 3 Hạng mục vinh danh */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <button
              onClick={() => {
                sound.playClick();
                setRankingCategory('stars');
              }}
              className={`py-2 px-3 rounded-2xl font-display font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                rankingCategory === 'stars'
                  ? 'bg-amber-400 text-slate-900 shadow'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Trophy className="w-4 h-4" /> Siêu Sao Học Tập (⭐)
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setRankingCategory('speaking');
              }}
              className={`py-2 px-3 rounded-2xl font-display font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                rankingCategory === 'speaking'
                  ? 'bg-cyan-500 text-white shadow'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Mic className="w-4 h-4" /> Chiến Thần Phát Âm (🎤)
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setRankingCategory('collector');
              }}
              className={`py-2 px-3 rounded-2xl font-display font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                rankingCategory === 'collector'
                  ? 'bg-pink-500 text-white shadow'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Flame className="w-4 h-4" /> Nhà Sưu Tập Đồ & Sticker
            </button>
          </div>

          {/* Bộ lọc theo Khối lớp / Vương quốc */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterTier('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                filterTier === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              🌐 Toàn Trường
            </button>
            {KINGDOMS.map((k) => (
              <button
                key={k.tier}
                onClick={() => setFilterTier(k.tier)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                  filterTier === k.tier ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {k.emoji} {k.ageRange}
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách Xếp Hạng */}
        <div className="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1">
          {sortedRankings.map((player, index) => {
            const rank = index + 1;
            const charMeta =
              AVATAR_CHARACTERS.find((c) => c.id === player.avatar_base) || AVATAR_CHARACTERS[0];
            const isSelected = inspectedPlayer.id === player.id && inspectedPlayer.nickname === player.nickname;

            return (
              <div
                key={`${player.id}-${index}`}
                onClick={() => {
                  sound.playClick();
                  setInspectedPlayer(player);
                }}
                className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                  player.isCurrentUser
                    ? 'bg-amber-50 border-amber-400 shadow-md'
                    : isSelected
                    ? 'bg-indigo-50 border-indigo-400'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl font-display font-extrabold flex items-center justify-center text-sm ${
                      rank === 1
                        ? 'bg-amber-400 text-slate-900 shadow'
                        : rank === 2
                        ? 'bg-slate-300 text-slate-900'
                        : rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                  </div>

                  <div className="text-3xl bg-slate-100 p-1.5 rounded-2xl">{charMeta.emoji}</div>

                  <div>
                    <div className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <span>{player.nickname}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        Lv.{player.level}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {KINGDOMS.find((k) => k.tier === player.grade_tier)?.ageRange} • Pet:{' '}
                      {player.pet_state.name} (Cấp {player.pet_state.stage})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-display font-extrabold text-base text-slate-900">
                      {rankingCategory === 'stars' && `⭐ ${player.stars}`}
                      {rankingCategory === 'speaking' && `🎤 ${player.speaking_score_total}`}
                      {rankingCategory === 'collector' && `🎁 ${player.total_collectibles} món`}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                      <Eye className="w-3 h-3" /> Xem 3D
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
