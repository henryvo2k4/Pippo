import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { sound } from '../../lib/sound';
import { KeyRound, Lock, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { findStudentByUsername } from '../../data/studentAccounts';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const currentUsername = useGameStore((state) => state.currentUsername);
  const customPasswords = useGameStore((state) => state.customPasswords);
  const changeStudentPassword = useGameStore((state) => state.changeStudentPassword);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen || !currentUsername) return null;

  const student = findStudentByUsername(currentUsername);
  const expectedOldPassword = customPasswords[currentUsername] || student?.defaultPassword || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (oldPassword.trim() !== expectedOldPassword) {
      setErrorMsg('Mật khẩu hiện tại chưa đúng!');
      sound.playGentleTryAgain();
      return;
    }

    if (newPassword.trim().length < 4) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 4 ký tự!');
      sound.playGentleTryAgain();
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setErrorMsg('Xác nhận mật khẩu mới không trùng khớp!');
      sound.playGentleTryAgain();
      return;
    }

    const ok = changeStudentPassword(newPassword.trim());
    if (ok) {
      sound.playWinFanfare();
      setSuccessMsg('Đã đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới nhé.');
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 1500);
    } else {
      setErrorMsg('Có lỗi xảy ra khi đổi mật khẩu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="clay-card w-full max-w-md rounded-3xl p-6 border-4 border-indigo-300 shadow-2xl bg-white relative">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                Đổi Mật Khẩu Cá Nhân
              </h3>
              <p className="text-[11px] font-bold text-slate-500">
                Tài khoản: @{currentUsername}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              Mật khẩu hiện tại:
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="Nhập mật khẩu hiện tại..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 font-bold text-sm bg-slate-50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              Mật khẩu mới:
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="Nhập mật khẩu mới..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 font-bold text-sm bg-slate-50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              Xác nhận mật khẩu mới:
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="Gõ lại mật khẩu mới..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 font-bold text-sm bg-slate-50"
              required
            />
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-display font-bold text-xs text-slate-700 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-extrabold text-xs shadow flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Cập Nhật Mật Khẩu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
