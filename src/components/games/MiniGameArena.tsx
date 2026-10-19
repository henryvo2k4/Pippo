import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Mic, Sparkles, ArrowLeft, CheckCircle2, Trophy, Sword, Search, Utensils, HelpCircle } from 'lucide-react';
import { IslandLesson, LearningItem } from '../../data/curriculumData';
import { useGameStore } from '../../store/useGameStore';
import { sound, calculatePronunciationScore } from '../../lib/sound';
import { ToyObject3DCanvas, AvatarStudioCanvas } from '../three/Avatar3DScene';

export type MiniGameMode = 'discover' | 'bubble' | 'monster' | 'boss' | 'detective' | 'voice';

interface MiniGameArenaProps {
  lesson: IslandLesson;
  onExit: () => void;
}

const GAME_MODES_META: { id: MiniGameMode; label: string; sub: string; emoji: string; color: string }[] = [
  { id: 'discover', label: '1. Khám Phá 3D', sub: 'Nghe & Xoay 3D', emoji: '🔍', color: 'from-amber-400 to-orange-500' },
  { id: 'bubble', label: '2. Đập Bong Bóng', sub: 'Phản xạ Nghe', emoji: '🫧', color: 'from-sky-400 to-blue-600' },
  { id: 'monster', label: '3. Quái Vật Ăn', sub: 'Tư duy & Chọn', emoji: '🦖', color: 'from-emerald-400 to-green-600' },
  { id: 'boss', label: '4. Đấu Trùm Slime', sub: 'Ghép Từ & Câu', emoji: '⚔️', color: 'from-purple-500 to-indigo-600' },
  { id: 'detective', label: '5. Thám Tử Nhí', sub: 'Đọc Hiểu & Logic', emoji: '🕵️', color: 'from-pink-500 to-rose-600' },
  { id: 'voice', label: '6. Xây Cầu Giọng Nói', sub: 'Phát âm AI Mic', emoji: '🎤', color: 'from-cyan-400 to-teal-600' },
];

export const MiniGameArena: React.FC<MiniGameArenaProps> = ({ lesson, onExit }) => {
  const {
    avatarBase,
    equippedSkin,
    petState,
    rewardLessonCompletion,
    recordWordPractice,
  } = useGameStore();

  // Map từng loại bài tập riêng của Đảo sang chế độ tương ứng
  const primaryExerciseMode: MiniGameMode =
    lesson.exerciseType === 'discover_bubble'
      ? 'bubble'
      : lesson.exerciseType === 'monster_feed'
      ? 'monster'
      : lesson.exerciseType === 'sentence_gear'
      ? 'boss'
      : lesson.exerciseType === 'detective_quiz'
      ? 'detective'
      : lesson.exerciseType === 'voice_bridge'
      ? 'voice'
      : 'bubble'; // Đảo Boss bắt đầu từ chặng 1 (bubble -> boss -> detective)

  // Khi mới vào Đảo: bắt đầu ngay với Bài Tập Chính của Đảo (kèm nút "📖 Xem Từ Vựng 3D" nếu bé muốn ôn trước)
  const [activeMode, setActiveMode] = useState<MiniGameMode>(primaryExerciseMode);
  const [bossStage, setBossStage] = useState<1 | 2 | 3>(1); // Dành riêng cho Đảo Trùm (3 chặng liên hoàn)
  const [itemIndex, setItemIndex] = useState(0);
  const [sessionStars, setSessionStars] = useState(0);
  const [sessionGems, setSessionGems] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'good' | 'try' } | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [earnedStarRating, setEarnedStarRating] = useState<1 | 2 | 3>(3);

  // State cho Game 2: Bubble Pop
  const [bubbleTargetIndex, setBubbleTargetIndex] = useState(0);
  const [poppedIds, setPoppedIds] = useState<string[]>([]);

  // State cho Game 3: Hungry Monster
  const [monsterMood, setMonsterMood] = useState<'hungry' | 'happy' | 'yuck'>('hungry');
  const [monsterFedCount, setMonsterFedCount] = useState(0);

  // State cho Game 4: Slime Boss Raid (Ghép câu / Đánh vần)
  const [bossHp, setBossHp] = useState(100);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [shuffledTokens, setShuffledTokens] = useState<string[]>([]);

  // State cho Game 5: Mystery Detective
  const [detectiveSelected, setDetectiveSelected] = useState<string | null>(null);

  // State cho Game 6: Magic Voice Bridge
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [bridgeProgress, setBridgeProgress] = useState(0);

  const currentItem: LearningItem = lesson.items[itemIndex] || lesson.items[0];
  const targetBubbleItem = lesson.items[bubbleTargetIndex] || lesson.items[0];

  // Tính số sao dự kiến theo thời gian thực dựa trên số lỗi sai (mistakesCount)
  const liveStarRating: 1 | 2 | 3 = mistakesCount <= 1 ? 3 : mistakesCount <= 3 ? 2 : 1;

  // Khởi tạo lại câu ghép cho Boss mode khi đổi câu
  useEffect(() => {
    const tokens = [...currentItem.sentenceTokens];
    const shuffled = tokens.sort(() => Math.random() - 0.5);
    setShuffledTokens(shuffled);
    setSelectedTokens([]);
    setDetectiveSelected(null);
    setPronunciationScore(null);
    setSpokenText('');
    setIsTransitioning(false);
  }, [itemIndex, activeMode, currentItem]);

  // Tự động đọc phát âm câu hỏi/từ mục tiêu khi chuyển câu mới để hỗ trợ các bé nhỏ chưa đọc nhanh
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeMode === 'bubble') {
        sound.speakEnglish(targetBubbleItem.word, 0.92);
      } else if (activeMode === 'monster') {
        sound.speakEnglish(`Feed me ${currentItem.word}`, 0.92);
      } else if (activeMode === 'boss') {
        sound.speakEnglish(currentItem.sentenceTokens.join(' '), 0.9);
      } else if (activeMode === 'detective') {
        sound.speakEnglish(currentItem.quizQuestion, 0.92);
      } else if (activeMode === 'voice') {
        sound.speakEnglish(currentItem.word, 0.9);
      }
    }, 320);
    return () => clearTimeout(timer);
  }, [activeMode, itemIndex, bubbleTargetIndex]);

  const showToast = (text: string, type: 'good' | 'try') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 2200);
  };

  const addReward = (
    stars: number,
    gems: number,
    isCorrect: boolean,
    targetItem: LearningItem = currentItem
  ) => {
    if (isCorrect) {
      setSessionStars((s) => s + stars);
      setSessionGems((g) => g + gems);
      setCompletedCount((c) => c + 1);
      recordWordPractice(targetItem.id, targetItem.word, lesson.tier, true);
    } else {
      setMistakesCount((m) => m + 1);
      recordWordPractice(targetItem.id, targetItem.word, lesson.tier, false);
    }
  };

  // Gợi ý thông minh giúp bé vượt qua câu khó mà không bị trừ sao
  const handleSmartHint = () => {
    sound.playClick();
    if (activeMode === 'bubble') {
      sound.speakEnglish(targetBubbleItem.word, 0.85);
      showToast(
        `💡 Gợi ý: "${targetBubbleItem.word}" có nghĩa là "${targetBubbleItem.vietnamese}" (${targetBubbleItem.emoji})!`,
        'good'
      );
    } else if (activeMode === 'monster') {
      sound.speakEnglish(currentItem.word, 0.85);
      showToast(
        `💡 Gợi ý: Khủng long đang thèm "${currentItem.word}" – ${currentItem.vietnamese} (${currentItem.emoji})!`,
        'good'
      );
    } else if (activeMode === 'boss') {
      const nextWordNeeded = currentItem.sentenceTokens[selectedTokens.length];
      sound.speakEnglish(currentItem.sentenceTokens.join(' '), 0.85);
      if (nextWordNeeded) {
        showToast(`💡 Gợi ý: Từ tiếp theo cần chọn là "${nextWordNeeded}"!`, 'good');
      } else {
        showToast(`💡 Gợi ý câu chuẩn: "${currentItem.sentenceTokens.join(' ')}"`, 'good');
      }
    } else if (activeMode === 'detective') {
      sound.speakEnglish(currentItem.quizAnswer, 0.88);
      showToast(
        `💡 Manh mối vàng: Đáp án liên quan đến "${currentItem.vietnamese}" (${currentItem.emoji})!`,
        'good'
      );
    } else {
      sound.speakEnglish(currentItem.word, 0.85);
      showToast(`💡 Gợi ý: Hãy đọc to từ "${currentItem.word}" (${currentItem.phonetic})!`, 'good');
    }
  };

  const handleFinishAll = (overrideMistakes?: number) => {
    const finalMistakes = overrideMistakes !== undefined ? overrideMistakes : mistakesCount;
    const finalStarRating: 1 | 2 | 3 = finalMistakes <= 1 ? 3 : finalMistakes <= 3 ? 2 : 1;
    setEarnedStarRating(finalStarRating);

    sound.playWinFanfare();
    confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
    const unlockedSticker = lesson.items[0]?.stickerRewardId;
    const bonusStars = finalStarRating * 10 + sessionStars;
    const bonusGems = finalStarRating * 18 + sessionGems;

    rewardLessonCompletion(
      lesson.id,
      finalStarRating,
      bonusStars,
      bonusGems,
      finalMistakes,
      25,
      unlockedSticker
    );
    setShowVictoryModal(true);
  };

  const handleRetryFor3Stars = () => {
    sound.playClick();
    setShowVictoryModal(false);
    setMistakesCount(0);
    setCompletedCount(0);
    setSessionStars(0);
    setSessionGems(0);
    setItemIndex(0);
    setBubbleTargetIndex(0);
    setPoppedIds([]);
    setMonsterFedCount(0);
    setBossHp(100);
    setBridgeProgress(0);
    setBossStage(1);
    setIsTransitioning(false);
    setActiveMode(primaryExerciseMode);
  };

  // ================= XỬ LÝ GAME 2: ĐẬP BONG BÓNG 3D =================
  const handleBubbleClick = (clickedItem: LearningItem) => {
    if (isTransitioning || poppedIds.includes(clickedItem.id)) return;

    if (clickedItem.id === targetBubbleItem.id) {
      setIsTransitioning(true);
      sound.playPop();
      sound.playSuccess();
      sound.speakEnglish(clickedItem.word);
      setPoppedIds((prev) => [...prev, clickedItem.id]);
      addReward(5, 10, true, clickedItem);
      showToast(`Chính xác! "${clickedItem.word}" (${clickedItem.vietnamese})! +10 💎`, 'good');

      setTimeout(() => {
        setIsTransitioning(false);
        if (bubbleTargetIndex + 1 < lesson.items.length) {
          setBubbleTargetIndex((prev) => prev + 1);
        } else {
          setBubbleTargetIndex(0);
          setPoppedIds([]);
          if (lesson.exerciseType === 'boss_challenge' && bossStage === 1) {
            setBossStage(2);
            setItemIndex(0);
            setActiveMode('boss');
            showToast('Qua Chặng 1! Tiếp tục Chặng 2: Ghép Câu Đánh Boss nhé!', 'good');
          } else {
            handleFinishAll();
          }
        }
      }, 850);
    } else {
      sound.playGentleTryAgain();
      addReward(0, 0, false, targetBubbleItem);
      sound.speakEnglish(`Try again! Find ${targetBubbleItem.word}`);
      showToast(`Oop! Chưa đúng (+1 lỗi sai). Hãy tìm quả bóng "${targetBubbleItem.word}" nhé!`, 'try');
    }
  };

  // ================= XỬ LÝ GAME 3: QUÁI VẬT HÁU ĂN =================
  const handleFeedMonster = (pickedItem: LearningItem) => {
    if (isTransitioning) return;

    if (pickedItem.id === currentItem.id) {
      setIsTransitioning(true);
      sound.playMonsterChomp();
      sound.playSuccess();
      sound.speakEnglish(`Yummy! ${pickedItem.word}!`);
      setMonsterMood('happy');
      setMonsterFedCount((c) => c + 1);
      addReward(5, 12, true);
      showToast(`Nom nom! Chính xác "${pickedItem.word}"! +12 💎`, 'good');

      setTimeout(() => {
        setIsTransitioning(false);
        setMonsterMood('hungry');
        if (itemIndex + 1 < lesson.items.length) {
          setItemIndex((i) => i + 1);
        } else {
          handleFinishAll();
        }
      }, 950);
    } else {
      sound.playGentleTryAgain();
      addReward(0, 0, false);
      setMonsterMood('yuck');
      showToast(`Chưa đúng (+1 lỗi sai)! Khủng long đang thèm "${currentItem.word}" cơ!`, 'try');
      setTimeout(() => setMonsterMood('hungry'), 900);
    }
  };

  // ================= XỬ LÝ GAME 4: ĐẤU TRÙM SLIME (GHÉP CÂU NGỮ PHÁP) =================
  const handleUnselectToken = (tok: string, selectedIdx: number) => {
    if (isTransitioning) return;
    sound.playClick();
    setSelectedTokens((prev) => prev.filter((_, i) => i !== selectedIdx));
    setShuffledTokens((prev) => [...prev, tok]);
  };

  const handleSelectToken = (token: string, idx: number) => {
    if (isTransitioning) return;
    sound.playClick();
    sound.speakEnglish(token, 1.0);
    const nextSelected = [...selectedTokens, token];
    const remaining = shuffledTokens.filter((_, i) => i !== idx);
    setSelectedTokens(nextSelected);
    setShuffledTokens(remaining);

    if (nextSelected.length === currentItem.sentenceTokens.length) {
      const built = nextSelected.join(' ');
      const target = currentItem.sentenceTokens.join(' ');
      if (built.toLowerCase() === target.toLowerCase()) {
        setIsTransitioning(true);
        sound.playSuccess();
        sound.speakEnglish(target, 0.92);
        const hpStep = Math.ceil(100 / Math.max(1, lesson.items.length));
        const newHp = Math.max(0, bossHp - hpStep);
        setBossHp(newHp);
        addReward(8, 18, true);
        showToast(`⚡ Câu hoàn hảo: "${target}"! +18 💎`, 'good');

        setTimeout(() => {
          setIsTransitioning(false);
          if (itemIndex + 1 >= lesson.items.length) {
            if (lesson.exerciseType === 'boss_challenge' && bossStage === 2) {
              setBossStage(3);
              setItemIndex(0);
              setActiveMode('detective');
              showToast('Qua Chặng 2! Chặng Cuối: Giải Đố Thám Tử Nhí!', 'good');
            } else {
              handleFinishAll();
            }
          } else {
            setItemIndex((i) => i + 1);
          }
        }, 1150);
      } else {
        setIsTransitioning(true);
        sound.playGentleTryAgain();
        addReward(0, 0, false);
        showToast('Thứ tự từ chưa chuẩn (+1 lỗi sai), thử xếp lại câu nhé!', 'try');
        setTimeout(() => {
          setIsTransitioning(false);
          setShuffledTokens([...currentItem.sentenceTokens].sort(() => Math.random() - 0.5));
          setSelectedTokens([]);
        }, 900);
      }
    }
  };

  // ================= XỬ LÝ GAME 5: THÁM TỬ ĐỌC HIỂU =================
  const handleDetectiveOption = (option: string) => {
    if (isTransitioning) return;
    setDetectiveSelected(option);
    if (option === currentItem.quizAnswer) {
      setIsTransitioning(true);
      sound.playSuccess();
      sound.speakEnglish(currentItem.quizAnswer);
      addReward(8, 15, true);
      showToast('🕵️ Phá án chính xác! +15 💎', 'good');
      setTimeout(() => {
        setIsTransitioning(false);
        if (itemIndex + 1 < lesson.items.length) {
          setItemIndex((i) => i + 1);
        } else {
          handleFinishAll();
        }
      }, 1050);
    } else {
      sound.playGentleTryAgain();
      addReward(0, 0, false);
      showToast('Manh mối này chưa khớp (+1 lỗi sai), đọc kỹ lại một chút nhé!', 'try');
    }
  };

  // ================= XỬ LÝ GAME 6: XÂY CẦU GIỌNG NÓI AI (MICROPHONE) =================
  const startVoiceRecognition = () => {
    if (isTransitioning) return;
    sound.playClick();
    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      simulateVoicePronunciation();
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpokenText(transcript);
        const score = calculatePronunciationScore(currentItem.word, transcript);
        setPronunciationScore(score);
        setIsListening(false);

        if (score >= 60) {
          setIsTransitioning(true);
          sound.playSuccess();
          const stepBridge = Math.ceil(100 / Math.max(1, lesson.items.length));
          const nextBridge = Math.min(100, bridgeProgress + stepBridge);
          setBridgeProgress(nextBridge);
          addReward(10, 20, true);
          showToast(`🎤 Phát âm đạt ${score}%! Xây thêm 1 nhịp cầu Cầu Vồng!`, 'good');
          if (itemIndex + 1 >= lesson.items.length) {
            setTimeout(() => {
              setIsTransitioning(false);
              handleFinishAll();
            }, 1100);
          } else {
            setTimeout(() => {
              setIsTransitioning(false);
              setItemIndex((i) => i + 1);
            }, 1100);
          }
        } else {
          sound.playGentleTryAgain();
          addReward(0, 0, false);
          showToast(`Hệ thống nghe được "${transcript}" (${score}%). Hãy đọc to "${currentItem.word}" lần nữa nhé!`, 'try');
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        simulateVoicePronunciation();
      };
    } catch {
      setIsListening(false);
      simulateVoicePronunciation();
    }
  };

  const simulateVoicePronunciation = () => {
    if (isTransitioning) return;
    setIsListening(true);
    sound.speakEnglish(currentItem.word, 0.9);
    setTimeout(() => {
      setIsListening(false);
      setIsTransitioning(true);
      setSpokenText(currentItem.word);
      const simulatedScore = Math.floor(92 + Math.random() * 8);
      setPronunciationScore(simulatedScore);
      sound.playSuccess();
      const stepBridge = Math.ceil(100 / Math.max(1, lesson.items.length));
      const nextBridge = Math.min(100, bridgeProgress + stepBridge);
      setBridgeProgress(nextBridge);
      addReward(10, 20, true);
      showToast(`🎤 Tuyệt đỉnh! Giọng đọc "${currentItem.word}" đạt ${simulatedScore}%! +20 💎`, 'good');
      if (itemIndex + 1 >= lesson.items.length) {
        setTimeout(() => {
          setIsTransitioning(false);
          handleFinishAll();
        }, 1100);
      } else {
        setTimeout(() => {
          setIsTransitioning(false);
          setItemIndex((i) => i + 1);
        }, 1100);
      }
    }, 1100);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-br from-indigo-950 via-sky-900 to-emerald-900 relative overflow-hidden">
      {/* ================= THANH TIÊU ĐỀ BÀI TẬP TINH GỌN CỦA ĐẢO ================= */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md border-2 border-white/25 rounded-3xl px-4 py-2.5 shadow-xl z-20">
        <button
          onClick={() => {
            sound.playClick();
            onExit();
          }}
          className="btn-toy-pink text-white font-display font-bold px-4 py-2 rounded-2xl flex items-center gap-2 text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Về Bản Đồ Đảo
        </button>

        {/* Thông tin Bài Tập Độc Quyền của Đảo Hiện Tại + Nút Xem Từ Vựng 3D */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 border border-white/20 px-4 py-1.5 rounded-2xl text-white flex items-center gap-2.5">
            <span className="text-2xl">{lesson.badgeEmoji}</span>
            <div>
              <div className="font-display font-extrabold text-sm text-amber-300">
                Đảo #{lesson.islandNumber} • {lesson.exerciseLabel}
              </div>
              <div className="text-[11px] text-slate-200 font-bold">
                {lesson.isBossIsland
                  ? `Đấu Trùm Vùng: Chặng ${bossStage}/3 • Câu ${Math.min(lesson.items.length, (activeMode === 'bubble' ? poppedIds.length : itemIndex) + 1)}/${lesson.items.length}`
                  : `Tiến độ bài tập: Câu ${Math.min(lesson.items.length, (activeMode === 'bubble' ? poppedIds.length : itemIndex) + 1)} / ${lesson.items.length}`}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setActiveMode(activeMode === 'discover' ? primaryExerciseMode : 'discover');
            }}
            className={`px-3.5 py-2 rounded-2xl font-display font-extrabold text-xs border-2 transition-all cursor-pointer ${
              activeMode === 'discover'
                ? 'bg-amber-400 text-slate-950 border-white shadow-lg'
                : 'bg-white/15 text-white border-white/30 hover:bg-white/25'
            }`}
          >
            {activeMode === 'discover' ? '🚀 Quay Lại Bài Tập Chính' : '📖 Xem Từ Vựng 3D'}
          </button>
        </div>

        {/* Thước Đo Sao (1-3 Sao) & Số Lỗi Sai Trực Tiếp + Nút Gợi Ý Thông Minh */}
        <div className="flex items-center gap-2.5">
          <div
            className="bg-slate-950/90 border-2 border-amber-400/80 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 shadow"
            title="0-1 lỗi: 3 Sao • 2-3 lỗi: 2 Sao • 4+ lỗi: 1 Sao"
          >
            <div className="text-base tracking-widest">
              {[1, 2, 3].map((s) => (
                <span key={s} className={s <= liveStarRating ? 'text-amber-300' : 'text-slate-600'}>
                  ★
                </span>
              ))}
            </div>
            <div className="text-[11px] font-display font-extrabold text-white border-l border-white/20 pl-2">
              Lỗi sai: <span className={mistakesCount === 0 ? 'text-emerald-400' : 'text-rose-400'}>{mistakesCount}</span>
            </div>
          </div>

          <button
            onClick={handleSmartHint}
            className="btn-toy-yellow text-slate-950 font-display font-extrabold px-3.5 py-2 rounded-2xl text-xs flex items-center gap-1 cursor-pointer"
            title="Nghe gợi ý miễn phí không bị trừ sao!"
          >
            <HelpCircle className="w-4 h-4" />
            Gợi Ý
          </button>
        </div>
      </div>

      {/* Thông báo Toast Khích Lệ */}
      {feedbackMsg && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-3xl font-display font-bold text-base shadow-2xl border-2 flex items-center gap-2 animate-bounce ${
            feedbackMsg.type === 'good'
              ? 'bg-emerald-500 text-white border-emerald-200'
              : 'bg-amber-400 text-slate-900 border-white'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          {feedbackMsg.text}
        </div>
      )}

      {/* ================= NỘI DUNG TỪNG MINI-GAME TRUNG TÂM ================= */}
      <div className="flex-1 my-3 relative flex items-center justify-center overflow-hidden">
        {/* 1. GAME KHÁM PHÁ MÔ HÌNH 3D (3D TOY & CONTEXT DISCOVERY) */}
        {activeMode === 'discover' && (
          <div className="w-full h-full grid grid-cols-12 gap-4 items-center">
            {/* Khung Xoay Mô Hình 3D Tương Tác */}
            <div className="col-span-5 h-full max-h-[430px] bg-gradient-to-b from-sky-400/30 to-indigo-900/50 rounded-3xl border-4 border-white/40 relative overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
              <div className="flex justify-between items-center z-10">
                <span className="bg-white/90 text-slate-800 font-display font-bold px-3 py-1 rounded-full text-xs">
                  👆 Chạm & Xoay Mô Hình 3D 360°
                </span>
                <span className="bg-amber-400 text-slate-900 font-display font-bold px-3 py-1 rounded-full text-xs">
                  Từ {itemIndex + 1}/{lesson.items.length}
                </span>
              </div>

              <div className="flex-1 min-h-[240px]">
                <ToyObject3DCanvas
                  shape={currentItem.shape3d}
                  color={currentItem.color}
                  emoji={currentItem.emoji}
                  word={currentItem.word}
                  glbModelUrl={currentItem.glbModelUrl}
                  onInteract={() => {
                    sound.playPop();
                    sound.speakEnglish(`${currentItem.word}. ${currentItem.exampleSentence}`);
                    if (!discoveredIds.includes(currentItem.id)) {
                      setDiscoveredIds((prev) => [...prev, currentItem.id]);
                      setSessionGems((g) => g + 5);
                      showToast(`✨ Đã khám phá mô hình 3D "${currentItem.word}"! +5 💎`, 'good');
                    }
                  }}
                />
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  sound.speakEnglish(`${currentItem.word}. ${currentItem.exampleSentence}`, 0.88);
                }}
                className="btn-toy-yellow text-slate-900 font-display font-bold py-2.5 rounded-2xl flex items-center justify-center gap-2 z-10 cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
                Nghe Phát Âm Chuẩn Bản Xứ
              </button>
            </div>

            {/* Thẻ Kiến Thức Từ Vựng, Phonics & Ngữ Cảnh */}
            <div className="col-span-7 clay-card rounded-3xl p-6 flex flex-col justify-between h-full max-h-[430px]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
                    {lesson.title} • {lesson.subtitle}
                  </span>
                  <div className="flex gap-1.5">
                    {lesson.items.map((it, idx) => (
                      <button
                        key={it.id}
                        onClick={() => {
                          sound.playClick();
                          setItemIndex(idx);
                          sound.speakEnglish(it.word);
                        }}
                        className={`w-9 h-9 rounded-xl font-bold text-lg flex items-center justify-center transition-all cursor-pointer ${
                          idx === itemIndex
                            ? 'bg-amber-400 text-slate-900 scale-110 shadow'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {it.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="text-6xl bg-amber-100 p-4 rounded-3xl border-2 border-amber-300 shadow-inner">
                    {currentItem.emoji}
                  </div>
                  <div>
                    <h2 className="text-4xl font-display font-extrabold text-slate-900 tracking-wide">
                      {currentItem.word}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-lg font-mono text-indigo-600 font-bold">{currentItem.phonetic}</span>
                      <span className="text-lg font-bold text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-xl">
                        {currentItem.vietnamese}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Câu ví dụ trong ngữ cảnh */}
                <div
                  onClick={() => sound.speakEnglish(currentItem.exampleSentence, 0.9)}
                  className="mt-4 bg-sky-50 hover:bg-sky-100 border-2 border-sky-200 rounded-2xl p-3.5 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                      💬 Mẫu câu giao tiếp (Bấm để nghe)
                    </span>
                    <Volume2 className="w-4 h-4 text-sky-600" />
                  </div>
                  <p className="text-lg font-display font-bold text-slate-800 mt-1">
                    “{currentItem.exampleSentence}”
                  </p>
                  <p className="text-sm text-slate-600">{currentItem.exampleTranslation}</p>
                </div>

                {/* Ghi chú Phonics / Ngữ pháp thông minh */}
                <div className="mt-3 bg-amber-50 border-2 border-amber-200 rounded-2xl p-3">
                  <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <span>💡 Bí Kíp Nhớ Nhanh (Phonics & Grammar):</span>
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{currentItem.grammarOrPhonicsNote}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    sound.playClick();
                    setItemIndex((prev) => (prev - 1 + lesson.items.length) % lesson.items.length);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 font-display font-bold text-slate-700 text-sm cursor-pointer"
                >
                  ⬅ Từ Trước
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    if (itemIndex + 1 < lesson.items.length) {
                      const nextIdx = itemIndex + 1;
                      setItemIndex(nextIdx);
                      sound.speakEnglish(lesson.items[nextIdx].word);
                    } else {
                      setItemIndex(0);
                      setActiveMode(primaryExerciseMode);
                    }
                  }}
                  className="btn-toy-blue text-white font-display font-bold px-6 py-2.5 rounded-2xl text-sm cursor-pointer"
                >
                  {itemIndex + 1 < lesson.items.length ? 'Từ Tiếp Theo ➡' : 'Bắt Đầu Bài Tập Của Đảo 🚀 ➡'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. GAME ĐẬP BONG BÓNG XÀ PHÒNG 3D (BUBBLE POP 3D) */}
        {activeMode === 'bubble' && (
          <div className="w-full h-full max-h-[430px] bg-gradient-to-b from-sky-500/40 via-blue-600/30 to-indigo-900/60 rounded-3xl border-4 border-white/40 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between z-10">
              <div className="bg-white/95 px-5 py-2.5 rounded-2xl shadow-lg flex items-center gap-3">
                <span className="text-2xl">🫧</span>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Nghe & Đập đúng quả bong bóng:</div>
                  <div className="text-2xl font-display font-extrabold text-sky-700">
                    “{targetBubbleItem.word}”{' '}
                    <span className="text-sm font-normal text-slate-500">({targetBubbleItem.phonetic})</span>
                  </div>
                </div>
                <button
                  onClick={() => sound.speakEnglish(targetBubbleItem.word)}
                  className="btn-toy-yellow p-2.5 rounded-xl text-slate-900 cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-white/90 px-4 py-2 rounded-2xl font-display font-bold text-slate-800 text-sm">
                Đã đập vỡ: {poppedIds.length} / {lesson.items.length} quả
              </div>
            </div>

            {/* Các Quả Bong Bóng 3D Bay Lơ Lửng */}
            <div className="flex-1 grid grid-cols-4 gap-6 items-center justify-items-center my-4">
              {lesson.items.map((item, idx) => {
                const isPopped = poppedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleBubbleClick(item)}
                    style={{ animationDelay: `${idx * 0.35}s` }}
                    className={`w-40 h-40 rounded-full animate-float transition-all duration-300 flex flex-col items-center justify-center relative cursor-pointer border-4 ${
                      isPopped
                        ? 'scale-90 opacity-45 border-emerald-300 bg-emerald-400/30'
                        : 'hover:scale-110 border-white/80 bg-gradient-to-br from-white/55 via-sky-200/35 to-pink-300/45 shadow-[0_0_35px_rgba(255,255,255,0.45)]'
                    }`}
                  >
                    {/* Điểm phản sáng bóng xà phòng */}
                    <div className="w-7 h-3.5 bg-white/80 rounded-full absolute top-4 left-6 -rotate-45" />
                    <span className="text-6xl filter drop-shadow-md">{item.emoji}</span>
                    <span className="mt-2 px-3 py-0.5 rounded-full bg-slate-900/75 text-white font-display font-bold text-sm">
                      {item.word}
                    </span>
                    {isPopped && (
                      <CheckCircle2 className="w-8 h-8 text-emerald-300 absolute -top-1 -right-1 bg-slate-900 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. GAME ĐẦU BẾP QUÁI VẬT HÁU ĂN (HUNGRY MONSTER CHEF) */}
        {activeMode === 'monster' && (
          <div className="w-full h-full max-h-[430px] clay-card rounded-3xl p-6 grid grid-cols-12 gap-6 items-center">
            {/* Chú Khủng Long / Quái Vật 3D Đợi Ăn */}
            <div className="col-span-5 h-full bg-gradient-to-b from-emerald-400 to-teal-600 rounded-3xl p-5 text-white flex flex-col items-center justify-between shadow-xl border-4 border-emerald-200">
              <div className="bg-white text-slate-800 px-4 py-2 rounded-2xl font-display font-bold text-center shadow-md w-full">
                <div className="text-xs text-emerald-600 uppercase">🦖 Quái Vật Gọi Món:</div>
                <div className="text-lg">“Feed me: {currentItem.word}!”</div>
                <div className="text-xs text-slate-500">({currentItem.vietnamese})</div>
              </div>

              <div
                onClick={() => sound.speakEnglish(`I am hungry! Give me ${currentItem.word}!`)}
                className={`text-8xl transition-transform duration-300 cursor-pointer select-none ${
                  monsterMood === 'happy'
                    ? 'scale-125 animate-bounce'
                    : monsterMood === 'yuck'
                    ? 'rotate-12 scale-90'
                    : 'hover:scale-110'
                }`}
              >
                {monsterMood === 'happy' ? '😋' : monsterMood === 'yuck' ? '🤢' : '🦖'}
              </div>

              <div className="w-full bg-emerald-900/40 rounded-2xl p-2.5 text-center text-xs font-bold">
                Đã cho ăn no: {monsterFedCount} món • Bấm vào món đúng bên phải để đút!
              </div>
            </div>

            {/* Bàn Tiệc Các Món Ăn / Từ Vựng */}
            <div className="col-span-7 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-extrabold text-slate-800 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-emerald-600" />
                  Chọn Đúng Món Quái Vật Yêu Cầu:
                </h3>
                <button
                  onClick={() => sound.speakEnglish(currentItem.word)}
                  className="btn-toy-yellow px-3.5 py-1.5 rounded-xl font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  Nghe Lại Yêu Cầu
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 my-auto">
                {lesson.items.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => handleFeedMonster(food)}
                    className="p-4 rounded-3xl bg-gradient-to-b from-white to-slate-50 border-3 border-slate-200 hover:border-emerald-400 hover:scale-105 transition-all shadow-md flex items-center gap-4 text-left cursor-pointer group"
                  >
                    <span className="text-5xl group-hover:scale-110 transition-transform">{food.emoji}</span>
                    <div>
                      <div className="text-lg font-display font-extrabold text-slate-800">{food.word}</div>
                      <div className="text-xs text-slate-500 font-mono">{food.phonetic}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. GAME ĐẤU TRÙM SLIME: LẮP BÁNH RĂNG CÂU & NGỮ PHÁP (SLIME BOSS RAID) */}
        {activeMode === 'boss' && (
          <div className="w-full h-full max-h-[430px] clay-card rounded-3xl p-6 grid grid-cols-12 gap-6 items-center">
            {/* Sân Khấu 3D: Nhân Vật Của Bé vs Boss Slime */}
            <div className="col-span-5 h-full bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-4 text-white flex flex-col justify-between relative overflow-hidden border-4 border-purple-400/50">
              <div className="flex items-center justify-between z-10">
                <span className="text-xs font-bold bg-purple-500/80 px-3 py-1 rounded-full">
                  ⚔️ Đấu Trường Ngữ Pháp & Câu
                </span>
                <span className="text-xs font-bold text-amber-300">HP Boss: {bossHp}/100</span>
              </div>

              {/* Thanh máu Boss */}
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-purple-300/40 z-10">
                <div
                  className="bg-gradient-to-r from-rose-500 to-amber-400 h-full transition-all duration-500"
                  style={{ width: `${bossHp}%` }}
                />
              </div>

              <div className="flex-1 flex items-center justify-around">
                <div className="w-36 h-44">
                  <AvatarStudioCanvas
                    avatarBase={avatarBase}
                    equippedSkin={equippedSkin}
                    petState={petState}
                  />
                </div>
                <div className="text-2xl font-display font-extrabold text-amber-400 animate-pulse">⚡ VS ⚡</div>
                <div className="flex flex-col items-center">
                  <div className="text-6xl animate-bounce">👾</div>
                  <span className="text-xs font-bold text-purple-200 mt-1">Boss Slime Ngữ Pháp</span>
                </div>
              </div>
            </div>

            {/* Khu Vực Lắp Bánh Răng Câu Tiếng Anh */}
            <div className="col-span-7 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                    <Sword className="w-3.5 h-3.5 inline mr-1" />
                    Sắp xếp các từ để tung tuyệt chiêu câu hoàn chỉnh:
                  </span>
                  <button
                    onClick={() => sound.speakEnglish(currentItem.sentenceTokens.join(' '), 0.9)}
                    className="btn-toy-yellow px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Nghe Gợi Ý Câu
                  </button>
                </div>

                <p className="text-base font-bold text-slate-700 mt-2">
                  Nghĩa tiếng Việt: <span className="text-indigo-700">“{currentItem.exampleTranslation}”</span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{currentItem.grammarOrPhonicsNote}</p>

                {/* Khung các từ đã chọn (Bấm vào từ đã chọn để bỏ ra nếu chọn nhầm) */}
                <div className="mt-4 min-h-[72px] p-3 rounded-2xl bg-indigo-50 border-2 border-dashed border-indigo-300 flex flex-wrap items-center gap-2">
                  {selectedTokens.length === 0 ? (
                    <span className="text-slate-400 text-sm italic">
                      👉 Bấm vào các mảnh từ bên dưới theo đúng thứ tự ngữ pháp...
                    </span>
                  ) : (
                    selectedTokens.map((tok, i) => (
                      <button
                        key={`${tok}-${i}`}
                        onClick={() => handleUnselectToken(tok, i)}
                        title="Bấm để bỏ từ này xuống"
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-rose-500 text-white font-display font-bold text-base shadow transition-colors cursor-pointer"
                      >
                        {tok} ✕
                      </button>
                    ))
                  )}
                </div>

                {/* Các bánh răng từ vựng để bấm chọn */}
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {shuffledTokens.map((tok, idx) => (
                    <button
                      key={`${tok}-${idx}`}
                      onClick={() => handleSelectToken(tok, idx)}
                      className="btn-toy-purple text-white font-display font-bold px-4 py-2.5 rounded-2xl text-base cursor-pointer"
                    >
                      ⚙️ {tok}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    setShuffledTokens([...currentItem.sentenceTokens].sort(() => Math.random() - 0.5));
                    setSelectedTokens([]);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  🔄 Xếp lại câu này
                </button>
                <span className="text-xs font-bold text-emerald-600">
                  💡 Mẹo: Có thể bấm vào từ đã chọn ở trên để đổi lại mà không bị tính lỗi!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 5. GAME THÁM TỬ ĐỌC HIỂU & LOGIC (MYSTERY DETECTIVE) */}
        {activeMode === 'detective' && (
          <div className="w-full h-full max-h-[430px] clay-card rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🕵️‍♂️</span>
                <div>
                  <h3 className="text-xl font-display font-extrabold text-slate-900">
                    Hồ Sơ Thám Tử Nhí • Giải Mã Manh Mối Tiếng Anh
                  </h3>
                  <p className="text-xs text-slate-500">{currentItem.grammarOrPhonicsNote}</p>
                </div>
              </div>
              <button
                onClick={() => sound.speakEnglish(currentItem.quizQuestion, 0.92)}
                className="btn-toy-yellow px-4 py-2 rounded-2xl font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                Nghe Manh Mối
              </button>
            </div>

            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-5 rounded-3xl border-2 border-indigo-400 shadow-lg my-2">
              <div className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1">
                <Search className="w-4 h-4" /> Mystery Clue #{itemIndex + 1}:
              </div>
              <p className="text-xl font-display font-bold mt-1">{currentItem.quizQuestion}</p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {currentItem.quizOptions.map((opt) => {
                const isPicked = detectiveSelected === opt;
                const isRight = opt === currentItem.quizAnswer;
                return (
                  <button
                    key={opt}
                    onClick={() => handleDetectiveOption(opt)}
                    className={`p-4 rounded-2xl font-display font-bold text-left text-base border-2 transition-all flex items-center justify-between cursor-pointer ${
                      isPicked && isRight
                        ? 'bg-emerald-500 text-white border-emerald-300 scale-102 shadow-lg'
                        : isPicked && !isRight
                        ? 'bg-rose-500 text-white border-rose-300'
                        : 'bg-slate-50 hover:bg-indigo-50 text-slate-800 border-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    <span>🔎 {opt}</span>
                    {isPicked && isRight && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. GAME XÂY CẦU GIỌNG NÓI AI (MAGIC VOICE BRIDGE) */}
        {activeMode === 'voice' && (
          <div className="w-full h-full max-h-[430px] clay-card rounded-3xl p-6 grid grid-cols-12 gap-6 items-center">
            <div className="col-span-6 flex flex-col justify-between h-full bg-gradient-to-b from-sky-900 to-indigo-950 rounded-3xl p-5 text-white border-4 border-cyan-400/50">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider bg-cyan-500/30 text-cyan-200 px-3 py-1 rounded-full">
                  🌈 Cây Cầu Âm Thanh Phép Thuật
                </span>
                <h3 className="text-2xl font-display font-extrabold mt-2">
                  Đọc To Để Xây Cầu Vượt Vực!
                </h3>
                <p className="text-xs text-sky-200 mt-1">
                  Độ dài cây cầu hiện tại: <strong className="text-amber-300">{bridgeProgress}%</strong> (Từ {itemIndex + 1}/{lesson.items.length})
                </p>
              </div>

              {/* Minh họa Cây Cầu Cầu Vồng 3D */}
              <div className="my-4 bg-slate-900/80 rounded-2xl p-4 border border-white/15">
                <div className="flex items-center justify-between text-3xl mb-2">
                  <span>🐻</span>
                  <span className="text-sm font-bold text-cyan-300">
                    {bridgeProgress >= 100 ? '🎉 Đã Tới Rương Kho Báu!' : 'Đang xây cầu...'}
                  </span>
                  <span>🎁</span>
                </div>
                <div className="w-full h-5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.max(12, bridgeProgress)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>💡 Mẹo: Có thể dùng Mic thật hoặc bấm Luyện Đọc Cùng AI</span>
                <button
                  onClick={simulateVoicePronunciation}
                  disabled={isListening || isTransitioning}
                  className="btn-toy-yellow text-slate-900 font-display font-bold px-3.5 py-2 rounded-xl cursor-pointer"
                >
                  🔊 Đọc Cùng AI Mẫu
                </button>
              </div>
            </div>

            <div className="col-span-6 flex flex-col justify-between h-full text-center p-2">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-4">
                <div className="text-5xl mb-2">{currentItem.emoji}</div>
                <div className="text-3xl font-display font-extrabold text-slate-900">{currentItem.word}</div>
                <div className="text-sm font-mono text-indigo-600 font-bold mt-0.5">{currentItem.phonetic}</div>
                <p className="text-sm text-slate-600 mt-2">“{currentItem.exampleSentence}”</p>
              </div>

              <div className="flex items-center justify-center gap-4 my-2">
                <button
                  onClick={() => sound.speakEnglish(currentItem.word, 0.85)}
                  className="btn-toy-blue text-white font-display font-bold px-5 py-3.5 rounded-2xl flex items-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                  Nghe Mẫu
                </button>

                <button
                  onClick={startVoiceRecognition}
                  disabled={isListening}
                  className={`btn-toy-pink text-white font-display font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2 cursor-pointer ${
                    isListening ? 'animate-pulse ring-4 ring-pink-300' : ''
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  {isListening ? 'Đang lắng nghe bé...' : 'Bấm Nói Vào Mic'}
                </button>
              </div>

              {pronunciationScore !== null && (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-xs font-bold text-emerald-700">Kết quả chấm điểm AI:</div>
                    <div className="text-sm font-bold text-slate-800">Nhận diện: “{spokenText}”</div>
                  </div>
                  <div className="text-2xl font-display font-extrabold text-emerald-600">
                    🌟 {pronunciationScore}/100
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-slate-500">
                <button
                  onClick={() => setItemIndex((i) => (i + 1) % lesson.items.length)}
                  className="font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Đổi từ luyện nói khác ➡
                </button>
                <span>Thưởng +20 💎 mỗi lần phát âm chuẩn</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL CHẤM SAO (1-3 SAO) & MỞ KHÓA ĐẢO TIẾP THEO ================= */}
      {showVictoryModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="clay-card max-w-md w-full rounded-3xl p-6 text-center border-4 border-amber-300 shadow-2xl">
            {/* Hiển thị 1-3 Ngôi Sao Đánh Giá Dựa Trên Số Lỗi Sai */}
            <div className="flex items-center justify-center gap-3 mb-2">
              {[1, 2, 3].map((starIdx) => (
                <span
                  key={starIdx}
                  className={`text-6xl transition-transform ${
                    starIdx <= earnedStarRating
                      ? 'text-amber-400 drop-shadow-[0_4px_12px_rgba(250,204,21,0.8)] scale-110'
                      : 'text-slate-300 scale-90'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="inline-block px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-display font-extrabold text-xs mb-1">
              {earnedStarRating === 3
                ? '🌟 3 SAO TUYỆT ĐỐI (XUẤT SẮC!)'
                : earnedStarRating === 2
                ? '✨ 2 SAO GIỎI LẮM (CỐ GẮNG THÊM CHÚT NỮA ĐỂ ĐẠT 3 SAO!)'
                : '💪 1 SAO HOÀN THÀNH (HÃY ÔN LẠI ĐỂ ĐẠT 3 SAO NHÉ!)'}
            </div>

            <h2 className="text-2xl font-display font-extrabold text-slate-900 mt-1">
              Đã Vượt Qua {lesson.title}!
            </h2>
            <p className="text-xs font-bold text-slate-500 mt-1">
              Số lỗi sai trong bài: <strong className={mistakesCount === 0 ? 'text-emerald-600' : 'text-rose-600'}>{mistakesCount} lỗi</strong> • Đã mở khóa Đảo #{Math.min(80, lesson.islandNumber + 1)}!
            </p>

            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-3">
                <div className="text-2xl">⭐</div>
                <div className="font-display font-extrabold text-lg text-amber-800">
                  +{earnedStarRating * 10 + sessionStars}
                </div>
                <div className="text-[11px] font-bold text-amber-700">Điểm Sao</div>
              </div>
              <div className="bg-pink-100 border-2 border-pink-300 rounded-2xl p-3">
                <div className="text-2xl">💎</div>
                <div className="font-display font-extrabold text-lg text-pink-800">
                  +{earnedStarRating * 18 + sessionGems}
                </div>
                <div className="text-[11px] font-bold text-pink-700">Ngọc Cầu Vồng</div>
              </div>
              <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-3">
                <div className="text-2xl">🔓</div>
                <div className="font-display font-extrabold text-xs text-emerald-800 mt-1">
                  Đảo #{Math.min(80, lesson.islandNumber + 1)}
                </div>
                <div className="text-[11px] font-bold text-emerald-700">Đã Mở Khóa!</div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowVictoryModal(false);
                  onExit();
                }}
                className="w-full btn-toy-green text-white font-display font-extrabold py-3 rounded-2xl text-base cursor-pointer"
              >
                🗺️ Trở Về Bản Đồ Đảo (Sang Đảo Tiếp Theo!)
              </button>

              {earnedStarRating < 3 && (
                <button
                  onClick={handleRetryFor3Stars}
                  className="w-full py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-display font-extrabold text-xs border-2 border-amber-300 cursor-pointer"
                >
                  🔄 Làm Lại Bài Này Để Giành Đủ 3 Sao (★★★)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
