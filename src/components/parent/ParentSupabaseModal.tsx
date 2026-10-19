import React, { useState } from 'react';
import { X, ShieldCheck, Database, Clock, BarChart3, CheckCircle2, UserCheck } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { getSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig } from '../../lib/supabase';
import { KINGDOMS, GradeTier } from '../../data/curriculumData';
import { sound } from '../../lib/sound';

interface ParentSupabaseModalProps {
  onClose: () => void;
}

export const ParentSupabaseModal: React.FC<ParentSupabaseModalProps> = ({ onClose }) => {
  const {
    nickname,
    gradeTier,
    srsRecords,
    screenTimeLimitMins,
    cloudSyncStatus,
    setProfileInfo,
    setScreenTimeLimit,
    syncToSupabaseCloud,
  } = useGameStore();

  // Cổng phụ huynh (Parent Gate)
  const [isUnlockedGate, setIsUnlockedGate] = useState(false);
  const [gateInput, setGateInput] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'srs' | 'supabase'>('profile');

  // Form Hồ sơ Học sinh
  const [editNickname, setEditNickname] = useState(nickname);
  const [editTier, setEditTier] = useState<GradeTier>(gradeTier);

  // Form Supabase Config
  const existingConfig = getSupabaseConfig();
  const [sbUrl, setSbUrl] = useState(existingConfig.url);
  const [sbKey, setSbKey] = useState(existingConfig.anonKey);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const handleGateCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (gateInput.trim() === '21') {
      sound.playSuccess();
      setIsUnlockedGate(true);
    } else {
      sound.playGentleTryAgain();
    }
  };

  const handleSaveSupabase = async () => {
    saveSupabaseConfig(sbUrl, sbKey);
    const ok = await syncToSupabaseCloud();
    setSyncMsg(
      ok
        ? '✅ Đã kết nối & đồng bộ hồ sơ học sinh lên Supabase thành công!'
        : '⚠️ Đã lưu thông tin! Hãy đảm bảo bạn đã chạy file supabase/schema.sql trong Supabase SQL Editor.'
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="clay-card max-w-3xl w-full rounded-3xl p-6 border-4 border-indigo-300 relative max-h-[90vh] flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-indigo-600" />
            <div>
              <h2 className="text-xl font-display font-extrabold text-slate-900">
                Góc Phụ Huynh, Báo Cáo SRS & Kết Nối Supabase
              </h2>
              <p className="text-xs text-slate-500">
                Theo dõi từ vựng con đã thuộc, chỉnh cấp độ lớp (Mầm non – Lớp 7) & đồng bộ Cloud
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isUnlockedGate ? (
          <form onSubmit={handleGateCheck} className="my-8 text-center max-w-md mx-auto space-y-4">
            <div className="text-5xl">🔒</div>
            <h3 className="text-xl font-display font-extrabold text-slate-800">
              Xác Thực Phụ Huynh / Giáo Viên
            </h3>
            <p className="text-sm text-slate-600">
              Để tránh các bé nhỏ bấm nhầm vào cài đặt hệ thống, vui lòng nhập kết quả phép tính:{' '}
              <strong className="text-indigo-700 text-base">7 × 3 = ?</strong>
            </p>
            <div className="flex items-center justify-center gap-3">
              <input
                type="number"
                value={gateInput}
                onChange={(e) => setGateInput(e.target.value)}
                placeholder="Nhập 21..."
                className="w-32 px-4 py-2.5 rounded-2xl border-2 border-indigo-300 text-center font-display font-extrabold text-xl focus:outline-none focus:border-indigo-600"
                autoFocus
              />
              <button
                type="submit"
                className="btn-toy-blue text-white font-display font-bold px-6 py-2.5 rounded-2xl cursor-pointer"
              >
                Mở Cổng (Đáp án: 21)
              </button>
            </div>
          </form>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden mt-3">
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-2xl font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <UserCheck className="w-4 h-4" /> Hồ Sơ Học Sinh & Giờ Chơi
              </button>
              <button
                onClick={() => setActiveTab('srs')}
                className={`px-4 py-2 rounded-2xl font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'srs' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <BarChart3 className="w-4 h-4" /> Tiến Độ Thuộc Từ (SRS)
              </button>
              <button
                onClick={() => setActiveTab('supabase')}
                className={`px-4 py-2 rounded-2xl font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'supabase' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Database className="w-4 h-4" /> Cấu Hình Database Supabase
              </button>
            </div>

            {/* TAB 1: HỒ SƠ & GIỚI HẠN GIỜ HỌC */}
            {activeTab === 'profile' && (
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Tên Biệt Danh Của Học Sinh Trên Bảng Xếp Hạng:
                  </label>
                  <input
                    type="text"
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-display font-bold text-slate-900"
                  />

                  <label className="block text-xs font-bold text-slate-700 uppercase pt-2">
                    Cấp Độ / Khối Lớp Mặc Định (Từ Mầm Non Đến Lớp 6–7):
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {KINGDOMS.map((k) => (
                      <button
                        key={k.tier}
                        type="button"
                        onClick={() => setEditTier(k.tier)}
                        className={`p-3 rounded-2xl border-2 text-left cursor-pointer ${
                          editTier === k.tier
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-950'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="font-display font-bold text-sm">
                          {k.emoji} {k.vietnameseName}
                        </div>
                        <div className="text-xs text-slate-500">{k.standard}</div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      sound.playSuccess();
                      setProfileInfo(editNickname, editTier);
                    }}
                    className="btn-toy-green text-white font-display font-bold px-5 py-2.5 rounded-2xl text-sm cursor-pointer"
                  >
                    Lưu Hồ Sơ Học Sinh
                  </button>
                </div>

                {/* Giới hạn thời gian bảo vệ mắt */}
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-amber-600" />
                    <div>
                      <div className="font-display font-bold text-sm text-slate-900">
                        Bảo Vệ Mắt (Screen-Time Guardian)
                      </div>
                      <div className="text-xs text-slate-600">
                        Khi hết giờ, nhân vật 3D sẽ ngáp ngủ và nhắc bé nghỉ ngơi
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[15, 20, 30, 45].map((m) => (
                      <button
                        key={m}
                        onClick={() => setScreenTimeLimit(m)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                          screenTimeLimitMins === m
                            ? 'bg-amber-500 text-white'
                            : 'bg-white text-slate-700 border border-amber-300'
                        }`}
                      >
                        {m} phút
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: THỐNG KÊ TIẾN ĐỘ TỪ VỰNG SRS */}
            {activeTab === 'srs' && (
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {Object.values(srsRecords).map((rec) => (
                  <div
                    key={rec.itemId}
                    className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-display font-bold text-base text-slate-900">{rec.word}</div>
                      <div className="text-xs text-slate-500">
                        Đã luyện tập: {rec.practicedCount} lần • Cấp độ Vương quốc #{rec.tier}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-48">
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${rec.mastery}%` }}
                        />
                      </div>
                      <span className="font-display font-bold text-xs text-emerald-700 w-10 text-right">
                        {rec.mastery}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: KẾT NỐI SUPABASE CLOUD */}
            {activeTab === 'supabase' && (
              <div className="space-y-3 overflow-y-auto pr-1">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900">
                  <strong>💡 Hướng dẫn 30 giây:</strong> Toàn bộ mã lệnh tạo bảng PostgreSQL đã được chuẩn bị sẵn trong file{' '}
                  <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">
                    supabase/schema.sql
                  </code>
                  . Bạn có thể dán Project URL & Anon Key vào dưới đây để đồng bộ Cloud trực tiếp, hoặc để trống để chạy chế độ Hybrid Local!
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supabase Project URL:
                  </label>
                  <input
                    type="text"
                    value={sbUrl}
                    onChange={(e) => setSbUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supabase Anon Public Key:
                  </label>
                  <input
                    type="password"
                    value={sbKey}
                    onChange={(e) => setSbKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono"
                  />
                </div>

                {syncMsg && (
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-900 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{syncMsg}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveSupabase}
                    className="btn-toy-green text-white font-display font-bold px-5 py-2.5 rounded-2xl text-xs cursor-pointer"
                  >
                    Kết Nối & Đồng Bộ Lên Supabase ({cloudSyncStatus})
                  </button>
                  <button
                    onClick={() => {
                      clearSupabaseConfig();
                      setSbUrl('');
                      setSbKey('');
                      setSyncMsg('Đã chuyển về chế độ lưu trữ Local trên trình duyệt.');
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Dùng Chế Độ Local
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
