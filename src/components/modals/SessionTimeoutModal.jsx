import React from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldAlert } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const SessionTimeoutModal = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('Sesi Anda telah berakhir. Berhasil keluar.', 'info');
    onClose();
    navigate('/login');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Keluar Sesi"
      size="sm"
    >
      <div className="space-y-4 text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Apakah Anda Yakin Ingin Keluar?</h4>
          <p className="text-xs text-slate-500 mt-1">
            Sesi pengguna <span className="font-semibold text-slate-700">{user?.name}</span> akan diakhiri dan dialihkan ke halaman login.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Ya, Keluar</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SessionTimeoutModal;
