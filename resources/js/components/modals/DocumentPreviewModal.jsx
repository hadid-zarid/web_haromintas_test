import React from 'react';
import Modal from '../common/Modal';
import { Download, ExternalLink, FileText, Calendar, User, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const DocumentPreviewModal = ({ isOpen, onClose, document, regTitle }) => {
  const { showToast } = useToast();

  if (!document) return null;

  const handleDownload = () => {
    showToast(`Mengunduh file: ${document.fileName}`, 'success');
  };

  const handleOpenNewTab = () => {
    showToast(`Membuka ${document.fileName} di tab baru`, 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Preview Dokumen: ${document.title}`}
      size="5xl"
    >
      <div className="space-y-4">
        {/* Document Meta Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900 text-amber-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{document.fileName}</p>
              <p className="text-slate-500">{regTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-900" />
              {document.uploadedBy || 'Proja'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-900" />
              {document.uploadedAt}
            </span>
            <span className="font-semibold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">
              {document.fileSize}
            </span>
          </div>
        </div>

        {/* PDF Viewer Mock / iFrame container */}
        <div className="w-full h-[480px] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden relative flex flex-col items-center justify-center text-white">
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-900/60 border border-blue-700 flex items-center justify-center text-amber-400 mb-4 shadow-lg">
              <FileText className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-100">{document.fileName}</h4>
            <p className="text-xs text-slate-400 max-w-md mt-1 mb-6">
              Pratinjau resmi PDF Kemenkum Kanwil & Biro Hukum Provinsi.
            </p>

            {/* Visual Simulated PDF Paper preview */}
            <div className="w-full max-w-2xl bg-white text-slate-800 rounded-lg p-6 text-left shadow-2xl border border-slate-300 font-serif text-xs leading-relaxed overflow-hidden hidden sm:block">
              <div className="text-center border-b pb-3 mb-3 border-slate-300">
                <p className="font-bold uppercase tracking-wider text-sm text-blue-950">KEMENTERIAN HUKUM DAN HAK ASASI MANUSIA RI</p>
                <p className="text-[11px] font-semibold text-slate-600">KANTOR WILAYAH PROVINSI - BIRO HUKUM</p>
                <p className="text-[10px] text-slate-500">Berkas Peraturan Nomor: {document.fileName.slice(0, 15)}</p>
              </div>
              <p className="font-bold mb-2 text-slate-900">PERIHAL: {document.title.toUpperCase()}</p>
              <p className="text-slate-700 mb-3">
                Bahwa berdasarkan hasil pemeriksaan dan harmonisasi rancangan peraturan daerah/bupati, dokumen ini dinyatakan sesuai dengan ketentuan peraturan perundang-undangan yang lebih tinggi.
              </p>
              <div className="flex justify-between items-end text-[10px] text-slate-500 pt-4 border-t border-slate-200">
                <span>Tanggal Unggah: {document.uploadedAt}</span>
                <span className="font-sans text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Terverifikasi Digital
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenNewTab}
              className="px-4 py-2 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka di Tab Baru</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-950 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Unduh PDF</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentPreviewModal;
