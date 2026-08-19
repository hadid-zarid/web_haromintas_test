import React, { useState } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { ArrowRight, CheckCircle, MessageSquare } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StatusChangeConfirmModal = ({ isOpen, onClose, currentStatus, targetStatus, onConfirmStatusChange }) => {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmStatusChange(targetStatus, note);
      showToast(`Status berhasil diperbarui menjadi "${targetStatus.toUpperCase()}"`, 'success');
      setIsSubmitting(false);
      setNote('');
      onClose();
    }, 500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Perubahan Status Peraturan"
      size="md"
    >
      <div className="space-y-4">
        {/* Status Transition Visual Banner */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-around">
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status Saat Ini</span>
            <StatusBadge status={currentStatus} />
          </div>

          <div className="p-2 bg-blue-100 text-blue-900 rounded-full">
            <ArrowRight className="w-5 h-5" />
          </div>

          <div className="text-center">
            <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block mb-1">Status Baru</span>
            <StatusBadge status={targetStatus} />
          </div>
        </div>

        {/* Note Textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-blue-900" />
            <span>Catatan / Keterangan Perubahan Status (Opsional):</span>
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tambahkan catatan hasil rapat, rekomendasi, atau alasan perubahan status..."
            className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-950 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Konfirmasi Perubahan'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StatusChangeConfirmModal;
