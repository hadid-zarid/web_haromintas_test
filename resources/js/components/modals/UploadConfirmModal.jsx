import React, { useState } from 'react';
import Modal from '../common/Modal';
import FileUpload from '../common/FileUpload';
import { useToast } from '../../context/ToastContext';
import { FileUp, Info, AlertCircle } from 'lucide-react';

export const UploadConfirmModal = ({ isOpen, onClose, docType, regTitle, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleUpload = () => {
    if (!selectedFile) return;
    setIsSubmitting(true);

    setTimeout(() => {
      onUploadSuccess(selectedFile);
      showToast(`Dokumen "${docType?.title}" berhasil diunggah!`, 'success');
      setIsSubmitting(false);
      setSelectedFile(null);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Unggah Dokumen: ${docType?.title || ''}`}
      size="md"
    >
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
          <p className="font-bold flex items-center gap-1 mb-1">
            <Info className="w-4 h-4 text-blue-900" />
            Petunjuk Pengunggahan:
          </p>
          <p>Dokumen ini akan dilampirkan ke peraturan: <span className="font-semibold">{regTitle}</span>.</p>
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
            onClick={handleUpload}
            className={`px-4 py-2 text-xs font-bold text-white rounded-lg flex items-center gap-1.5 transition-all ${
              !selectedFile || isSubmitting
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-blue-900 hover:bg-blue-950 shadow-sm'
            }`}
          >
            <FileUp className="w-4 h-4" />
            <span>{isSubmitting ? 'Mengunggah...' : 'Unggah Dokumen'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadConfirmModal;
