import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, X } from 'lucide-react';

export const FileUpload = ({ onFileSelected, allowedExtensions = ['.pdf', '.doc', '.docx'], maxMb = 10 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);

  const validateFile = (file) => {
    setErrorMsg('');
    if (!file) return false;

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setErrorMsg(`Format file tidak didukung (${ext}). Hanya format ${allowedExtensions.join(', ')} yang diperbolehkan.`);
      return false;
    }

    if (file.size > maxMb * 1024 * 1024) {
      setErrorMsg(`Ukuran file melebihi batas maksimal ${maxMb} MB.`);
      return false;
    }

    setSelectedFile(file);
    if (onFileSelected) onFileSelected(file);
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setErrorMsg('');
    if (inputRef.current) inputRef.current.value = '';
    if (onFileSelected) onFileSelected(null);
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-amber-500 bg-amber-50'
              : 'border-slate-300 hover:border-amber-500 bento-card hover:bg-slate-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={allowedExtensions.join(',')}
            onChange={handleChange}
            className="hidden"
          />
          <div className="mx-auto w-10 h-10 mb-3 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-slate-800">
            Klik untuk pilih file atau tarik & lepas di sini
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Format yang didukung: <span className="font-bold text-slate-700">{allowedExtensions.join(', ')}</span> (Maks. {maxMb}MB)
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bento-card rounded-xl">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-lg shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{selectedFile.name}</p>
              <p className="text-xs text-slate-500 font-medium">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Siap diunggah</p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="w-8 h-8 rounded-lg bento-btn-danger flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="mt-2.5 flex items-center gap-2 text-xs font-bold text-red-700 bento-badge-rose p-3 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
