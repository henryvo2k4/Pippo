import React, { useState } from 'react';
import {
  PRECONFIGURED_STUDENTS,
  PreconfiguredStudent,
  authenticatePreconfiguredStudent,
} from '../../data/studentAccounts';
import { useGameStore } from '../../store/useGameStore';
import { sound } from '../../lib/sound';
import { KeyRound, Lock, Sparkles, User, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface StudentLoginModalProps {
  isOpen: boolean;
  onSuccess?: () => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({ isOpen, onSuccess }) => {
  const [selectedStudent, setSelectedStudent] = useState<PreconfiguredStudent | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'visual' | 'manual'>('visual');

  const customPasswords = useGameStore((state) => state.customPasswords);
  const loginStudentAccount = useGameStore((state) => state.loginStudentAccount);

  if (!isOpen) return null;

  const handleSelectStudentCard = (student: PreconfiguredStudent) => {
    sound.playClick();
    setSelectedStudent(student);
    setUsernameInput(student.username);
    setPasswordInput('');
    setErrorMsg(null);
  };

  const handlePerformLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const targetUsername = selectedStudent ? selectedStudent.username : usernameInput.trim();
    if (!targetUsername) {
      setErrorMsg('Vui lòng chọn hoặc nhập Tên Tài Khoản của bé!');
      sound.playGentleTryAgain();
      return;
    }
    if (!passwordInput.trim()) {
      setErrorMsg('Vui lòng nhập Mật Khẩu để tiếp tục!');
      sound.playGentleTryAgain();
      return;
    }

    setIsLoading(true);

    try {
      const authResult = authenticatePreconfiguredStudent(
        targetUsername,
        passwordInput.trim(),
        customPasswords
      );

      if (!authResult.success || !authResult.student) {
        setErrorMsg(authResult.message || 'Tên đăng nhập hoặc mật khẩu chưa đúng!');
        sound.playGentleTryAgain();
        setIsLoading(false);
        return;
      }

      // Đăng nhập thành công
      sound.playWinFanfare();
      await loginStudentAccount(authResult.student);
      setIsLoading(false);
      if (onSuccess) onSuccess();
    } catch {
      setErrorMsg('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!');
      sound.playGentleTryAgain();
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="clay-card w-full max-w-4xl max-h-[94vh] rounded-3xl p-5 sm:p-7 border-4 border-amber-300 shadow-2xl flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-white to-sky-50">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/logo.png"
                alt="Pippo Logo"
                className="w-14 h-14 object-contain rounded-2xl drop-shadow-md border border-amber-300/60 bg-white p-1"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                    Đăng Nhập Học Sinh Pippo English
                  </h2>
                  <span className="text-[10px] font-extrabold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Chính Thức
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  Chọn tên của bạn nhỏ hoặc nhập tài khoản được cấp để bắt đầu hành trình học tiếng Anh!
                </p>
              </div>
            </div>

            {/* Chuyển chế độ đăng nhập */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-200/80 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setLoginMode('visual');
                }}
                className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs transition-all ${
                  loginMode === 'visual'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                👶 Chọn Nhanh Bé
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setLoginMode('manual');
                  setSelectedStudent(null);
                }}
                className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs transition-all ${
                  loginMode === 'manual'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⌨️ Gõ Tài Khoản
              </button>
            </div>
          </div>

          {/* Lựa chọn danh sách 9 học sinh (Visual Cards) */}
          {loginMode === 'visual' && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Danh Sách 9 Học Sinh (Bấm Chọn Bạn Nhỏ Của Mình):
                </span>
                <button
                  type="button"
                  onClick={() => setLoginMode('manual')}
                  className="sm:hidden text-xs font-bold text-indigo-600 hover:underline"
                >
                  Gõ tài khoản riêng ➜
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-3">
                {PRECONFIGURED_STUDENTS.map((std) => {
                  const isChosen = selectedStudent?.username === std.username;
                  return (
                    <button
                      key={std.id}
                      type="button"
                      onClick={() => handleSelectStudentCard(std)}
                      className={`text-left p-3 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                        isChosen
                          ? 'border-indigo-600 bg-indigo-50/90 shadow-md scale-[1.02] ring-2 ring-indigo-400'
                          : 'border-slate-200 bg-white hover:border-amber-400 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-300 via-orange-400 to-pink-500 flex items-center justify-center text-2xl shadow-inner border border-white">
                          {std.badgeEmoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-display font-extrabold text-sm text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                            {std.nickname}
                          </div>
                          <div className="text-[11px] font-bold text-slate-500 truncate">
                            {std.fullName}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-extrabold bg-slate-100 text-indigo-700 px-1.5 py-0.2 rounded-md">
                              {std.gradeLabel}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold">
                              @{std.username}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isChosen && (
                        <div className="absolute top-1.5 right-1.5 bg-indigo-600 text-white rounded-full p-0.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Nhập Mật Khẩu / Tài Khoản */}
          <form onSubmit={handlePerformLogin} className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-200">
            {loginMode === 'manual' && (
              <div className="mb-3">
                <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  Tên Tài Khoản (Tên lót + tên, vd: minhduc, quynhhuong, thienphuc...):
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Nhập tên tài khoản của bé..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 font-bold text-sm bg-white"
                  autoComplete="username"
                />
              </div>
            )}

            {selectedStudent && loginMode === 'visual' && (
              <div className="mb-3 bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedStudent.badgeEmoji}</span>
                  <div>
                    <div className="font-display font-extrabold text-xs text-indigo-900">
                      Đang đăng nhập cho: <span className="text-indigo-600">{selectedStudent.fullName} ({selectedStudent.nickname})</span>
                    </div>
                    <div className="text-[11px] font-bold text-indigo-700/80">
                      Tài khoản: @{selectedStudent.username} • {selectedStudent.gradeLabel}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 underline cursor-pointer"
                >
                  Đổi bé khác
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                Mật Khẩu (Tên + 123@, ví dụ duc123@, huong123@...):
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Nhập mật khẩu của bé..."
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 font-bold text-sm bg-white"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between pt-1">
              <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Quên mật khẩu? Liên hệ giáo viên/phụ huynh để cấp lại.</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-extrabold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Đang Đăng Nhập...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-200" />
                    <span>Vào Học Tiếng Anh 3D!</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Thông báo bảo mật: Chỉ cho phép admin tạo tài khoản */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center text-center">
          <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Hệ thống bảo vệ:</strong> Chỉ có Giáo viên/Admin mới được quyền tạo tài khoản. Người ngoài không thể tự tạo tài khoản mới.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
