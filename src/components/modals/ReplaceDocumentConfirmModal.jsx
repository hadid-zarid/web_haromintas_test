import React, { useState } from 'react';
import Modal from '../common/Modal';
import FileUpload from '../common/FileUpload';
import { useToast } from '../../context/ToastContext';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ReplaceDocumentConfirmModal = ({ isOpen, onClose, existingDoc, regTitle, onReplaceSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleReplace = () => {
    if (!selectedFile) return;
    setIsSubmitting(true);

    setTimeout(() => {
      onReplaceSuccess(selectedFile);
      showToast(`Dokumen "${existingDoc?.title}" berhasil diperbarui!`, 'success');
      setIsSubmitting(false);
      setSelectedFile(null);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Pengantian Dokumen"
      size="md"
    >
      <div className="space-y-4">
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Peringatan Penggantian Dokumen!</p>
            <p className="mt-1 leading-relaxed">
              Dokumen lama <span className="font-semibold">{existingDoc?.fileName}</span> akan digantikan dengan file baru. Versi sebelumnya akan tercatat di histori aktivitas.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-600">
          <p className="font-semibold text-slate-800">Pilih File Pengganti Baru:</p>
        </div>

        <FileUpload
          onFileSelected={(file) => setSelectedFile(file)}
          allowedExtensions={['.pdf', '.doc', '.docx']}
        />

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
            disabled={!selectedFile || isSubmitting}
            onClick={handleReplace}
            className={`px-4 py-2 text-xs font-bold text-white rounded-lg flex items-center gap-1.5 transition-all ${
              !selectedFile || isSubmitting
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 shadow-sm'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
            <span>{isSubmitting ? 'Memproses...' : 'Ya, Ganti Dokumen'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReplaceDocumentConfirmModal;
