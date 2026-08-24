import React from 'react';
import Modal from '../common/Modal';
import { router, usePage } from '@inertiajs/react';
import { LogOut, ShieldAlert } from 'lucide-react';

export const SessionTimeoutModal = ({ isOpen, onClose }) => {
  const { auth } = usePage().props;
  const userName = auth?.user?.name || 'Petugas';

  const handleLogout = () => {
    onClose();
    router.post('/logout');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Keluar Sesi"
      size="sm"
    >
      <div className="space-y-4 text-center">
        <div className="mx-auto w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-black text-[#1A1A5E]">Apakah Anda Yakin Ingin Keluar?</h4>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Sesi pengguna <span className="font-bold text-[#1A1A5E]">{userName}</span> akan diakhiri dan dialihkan kembali ke portal login.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2.5 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Ya, Keluar</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SessionTimeoutModal;
