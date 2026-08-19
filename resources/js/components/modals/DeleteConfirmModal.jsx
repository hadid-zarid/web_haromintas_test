import React, { useState } from 'react';
import Modal from '../common/Modal';
import { AlertOctagon, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const DeleteConfirmModal = ({ isOpen, onClose, regTitle, onDeleteConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleDelete = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onDeleteConfirm();
      showToast('Peraturan berhasil dihapus dari sistem.', 'error');
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus Peraturan"
      size="md"
    >
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-900">
          <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-950">Peringatan: Penghapusan Permanen</h4>
            <p className="text-xs mt-1 leading-relaxed text-red-800">
              Apakah Anda yakin ingin menghapus peraturan <span className="font-bold underline">{regTitle}</span>?
            </p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-red-600 mt-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Aksi ini tidak dapat dibatalkan dan seluruh berkas terkait akan dihapus!</span>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleDelete}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Menghapus...' : 'Ya, Hapus Peraturan'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
