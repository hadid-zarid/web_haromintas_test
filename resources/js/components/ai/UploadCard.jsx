import React, { useState } from 'react';
import { CloudUpload, FileText } from 'lucide-react';
import { SUPPORTED_EXTENSIONS, isSupportedFile } from '../../lib/aiApi';
import { useToast } from '../../context/ToastContext';

const FORMATS = [
  { label: 'DOCX / DOC', color: 'text-blue-600' },
  { label: 'PDF', color: 'text-red-600' },
  { label: 'TXT / MD', color: 'text-slate-600' },
  { label: 'RTF / ODT', color: 'text-amber-600' },
];

// Dropzone besar (setara AI Document Checker): memilih atau menjatuhkan file langsung memulai
// pemeriksaan, tanpa tombol terpisah. Dokumen referensi dipilih lebih dulu di panel di atasnya.
const UploadCard = ({ onFile, disabled }) => {
  const { showToast } = useToast();
  const [dragging, setDragging] = useState(false);

  const accept = (file) => {
    if (!file || disabled) return;
    if (!isSupportedFile(file.name)) {
      showToast(`Format "${file.name}" tidak didukung. Gunakan DOCX, DOC, PDF, TXT, RTF, MD, atau ODT.`, 'warning');
      return;
    }
    onFile(file);
  };

  return (
    <label
      htmlFor="ai-document-upload"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        accept(e.dataTransfer.files?.[0]);
      }}
      className={`block cursor-pointer rounded-2xl border-2 border-dashed bg-white px-5 sm:px-8 py-10 sm:py-11 text-center shadow-sm transition-all focus-within:ring-4 focus-within:ring-[#2B3056]/15 ${
        dragging
          ? 'border-[#2B3056] bg-[#F3F4FA] ring-4 ring-[#2B3056]/10'
          : 'border-[#B9BFDD] hover:border-[#2B3056] hover:bg-[#F3F4FA] hover:ring-4 hover:ring-[#2B3056]/10'
      }`}
    >
      <span className="mx-auto mb-4 w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#2B3056] to-[#3F4780] flex items-center justify-center shadow-lg shadow-[#2B3056]/20">
        <CloudUpload className="w-7 h-7 text-[#FFD82B]" aria-hidden="true" />
      </span>
      <span className="block text-[1.15rem] font-bold text-[#2B3056] mb-1">Unggah Dokumen (DOCX, DOC, PDF, TXT, RTF, MD)</span>
      <span className="block text-sm text-slate-500">Tarik &amp; lepaskan file dokumen di sini, atau klik untuk memilih file dari komputer</span>
      <span className="flex flex-wrap justify-center gap-2 mt-3">
        {FORMATS.map(({ label, color }) => (
          <span key={label} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
            <FileText className={`w-3.5 h-3.5 ${color}`} aria-hidden="true" /> {label}
          </span>
        ))}
      </span>
      <input
        id="ai-document-upload"
        type="file"
        accept={SUPPORTED_EXTENSIONS.join(',')}
        disabled={disabled}
        onChange={(e) => {
          accept(e.target.files?.[0]);
          e.target.value = '';
        }}
        className="sr-only"
      />
    </label>
  );
};

export default UploadCard;
