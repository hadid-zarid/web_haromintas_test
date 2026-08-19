import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useAuth } from '../context/AuthContext';
import { usePeraturan } from '../context/PeraturanContext';
import AppLayout from '../components/layout/AppLayout';
import StatusBadge from '../components/common/StatusBadge';
import RoleBadge from '../components/common/RoleBadge';

// Modals
import UploadConfirmModal from '../components/modals/UploadConfirmModal';
import ReplaceDocumentConfirmModal from '../components/modals/ReplaceDocumentConfirmModal';
import DocumentPreviewModal from '../components/modals/DocumentPreviewModal';
import StatusChangeConfirmModal from '../components/modals/StatusChangeConfirmModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';

import { 
  DOCUMENT_TYPES, 
  STATUS_PERATURAN 
} from '../mock/mockPeraturan';

import { 
  ArrowLeft, 
  Upload, 
  Eye, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  Trash2, 
  ShieldAlert
} from 'lucide-react';

export const PeraturanDetailPage = (props) => {
  const { props: pageProps, url } = usePage();
  const id = props.id || pageProps.id || url.split('?')[0].split('/').pop();
  const { role: currentRole, user } = useAuth();
  const { 
    peraturanList, 
    markAsRead, 
    uploadDocument, 
    updatePeraturanStatus, 
    deletePeraturan,
    activityLogs
  } = usePeraturan();

  const regulation = peraturanList.find(p => p.id === id);

  useEffect(() => {
    if (id) markAsRead(id);
  }, [id]);

  const [activeUploadDocType, setActiveUploadDocType] = useState(null);
  const [activeReplaceDoc, setActiveReplaceDoc] = useState(null);
  const [activePreviewDoc, setActivePreviewDoc] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [targetStatusOption, setTargetStatusOption] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!regulation) {
    return (
      <AppLayout>
        <div className="p-12 text-center glass-panel rounded-2xl">
          <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Peraturan Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Berkas dengan ID "{id}" tidak ditemukan atau telah dihapus dari sistem.
          </p>
          <button
            onClick={() => router.visit('/peraturan')}
            className="px-4 py-2.5 bg-[#1a2238] text-white rounded-xl text-xs font-bold glass-panel-hover"
          >
            Kembali ke Daftar Peraturan
          </button>
        </div>
      </AppLayout>
    );
  }

  const canUploadDoc1to5 = ['Proja 1', 'Proja 2', 'Proja 3'].includes(currentRole);
  const canUploadDoc6 = currentRole === 'Biro Hukum';

  const regulationTimeline = activityLogs.filter(a => a.regulationId === regulation.id);

  const handleUploadSuccess = (fileObj) => {
    if (activeUploadDocType) {
      uploadDocument(regulation.id, activeUploadDocType.typeIndex, fileObj, user?.name, currentRole);
      setActiveUploadDocType(null);
    }
  };

  const handleReplaceSuccess = (fileObj) => {
    if (activeReplaceDoc) {
      uploadDocument(regulation.id, activeReplaceDoc.typeIndex, fileObj, user?.name, currentRole);
      setActiveReplaceDoc(null);
    }
  };

  const handleConfirmStatusChange = (newStatus, note) => {
    updatePeraturanStatus(regulation.id, newStatus, note, user?.name, currentRole);
  };

  const handleDeleteConfirm = () => {
    deletePeraturan(regulation.id, user?.name, currentRole);
    router.visit('/peraturan');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.visit('/peraturan')}
            className="inline-flex items-center gap-2 px-3.5 py-2 flat-btn-secondary rounded-lg text-xs font-bold text-slate-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Peraturan</span>
          </button>

          <div className="flex items-center gap-2">
            {(canUploadDoc1to5 || currentRole === 'Kakanwil') && (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-3.5 py-2 flat-btn-danger text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Berkas</span>
              </button>
            )}
          </div>
        </div>

        {/* Regulation Header Meta Card Flat 2.0 */}
        <div className="flat-card p-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4 border-slate-200">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono font-bold text-xs">
                  {regulation.nomor}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs">
                  {regulation.jenis}
                </span>
                <StatusBadge status={regulation.status} />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug pt-1">
                {regulation.judul}
              </h2>
            </div>

            {/* Quick Change Status Dropdown Flat */}
            <div className="flex items-center gap-2 flat-input p-2 rounded-lg">
              <span className="text-xs font-bold text-slate-700">Ubah Status:</span>
              <select
                value={regulation.status}
                onChange={(e) => {
                  setTargetStatusOption(e.target.value);
                  setIsStatusModalOpen(true);
                }}
                className="text-xs font-bold p-1 bg-white text-slate-900 rounded outline-none cursor-pointer border border-slate-200"
              >
                {Object.values(STATUS_PERATURAN).map(s => (
                  <option key={s} value={s}>{s.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Kabupaten / Kota</span>
              <span className="font-extrabold text-slate-900">{regulation.kabupaten}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Tim Penanggung Jawab</span>
              <span className="font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded inline-block mt-0.5">
                {regulation.proja}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Diunggah Oleh</span>
              <span className="font-bold text-slate-900">{regulation.uploadedBy}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Terakhir Diperbarui</span>
              <span className="font-mono text-slate-600 font-bold">{regulation.updatedAt}</span>
            </div>
          </div>

          {regulation.keterangan && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium">
              <span className="font-bold text-slate-900">Catatan / Keterangan:</span> {regulation.keterangan}
            </div>
          )}
        </div>

        {/* Grid of 6 Mandatory Document Cards Flat 2.0 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
              Kelengkapan 6 Berkas Dokumen Peraturan (HARMONITAS Riau)
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              {regulation.documents.filter(Boolean).length} dari 6 Dokumen Terunggah
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DOCUMENT_TYPES.map((docType) => {
              const existingDoc = regulation.documents[docType.typeIndex - 1];
              const isDoc6 = docType.typeIndex === 6;
              const canUploadThisDoc = isDoc6 ? canUploadDoc6 : canUploadDoc1to5;

              return (
                <div
                  key={docType.typeIndex}
                  className={`p-5 flat-card-hover flex flex-col justify-between space-y-3`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        DOKUMEN 0{docType.typeIndex}
                      </span>
                      {existingDoc ? (
                        <span className="flat-badge-emerald text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> Ada File
                        </span>
                      ) : (
                        <span className="flat-badge-slate text-[10px]">
                          Belum Ada
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-black text-slate-900 leading-snug">{docType.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      Wewenang: <span className="font-bold text-slate-900">{isDoc6 ? 'Biro Hukum' : 'Tim Proja'}</span>
                    </p>

                    {existingDoc ? (
                      <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                        <p className="font-bold text-slate-900 truncate">{existingDoc.fileName}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                          <span>{existingDoc.fileSize}</span>
                          <span>{existingDoc.uploadedAt}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-xs italic text-slate-400 font-medium">File belum diunggah.</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    {existingDoc && (
                      <button
                        onClick={() => setActivePreviewDoc({ ...existingDoc, title: docType.title })}
                        className="px-3 py-1.5 flat-btn-secondary text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-700" />
                        <span>Lihat</span>
                      </button>
                    )}

                    {canUploadThisDoc && (
                      existingDoc ? (
                        <button
                          onClick={() => setActiveReplaceDoc({ ...existingDoc, typeIndex: docType.typeIndex, title: docType.title })}
                          className="px-3 py-1.5 flat-btn-amber text-white rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Ganti</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveUploadDocType(docType)}
                          className="px-3 py-1.5 flat-btn-amber text-white rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah File</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Histori Aktivitas Flat 2.0 */}
        <div className="flat-card p-6 space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b pb-3 border-slate-100">
            <Clock className="w-4 h-4 text-amber-600" />
            Histori Aktivitas & Perubahan Berkas
          </h3>

          {regulationTimeline.length > 0 ? (
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-5 py-1">
              {regulationTimeline.map((item) => (
                <div key={item.id} className="relative pl-6">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-amber-500" />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{item.action}</span>
                      <RoleBadge role={item.role} />
                      <span className="text-[10px] text-slate-400 font-mono font-medium ml-auto">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Pelaksana: <span className="font-bold text-slate-900">{item.user}</span></p>
                    <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-2.5 rounded-lg font-mono text-[11px]">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic font-medium">Belum ada histori aktivitas tercatat.</p>
          )}
        </div>
      </div>

      {/* Modals */}
      <UploadConfirmModal
        isOpen={!!activeUploadDocType}
        onClose={() => setActiveUploadDocType(null)}
        docType={activeUploadDocType}
        regTitle={regulation.judul}
        onUploadSuccess={handleUploadSuccess}
      />

      <ReplaceDocumentConfirmModal
        isOpen={!!activeReplaceDoc}
        onClose={() => setActiveReplaceDoc(null)}
        existingDoc={activeReplaceDoc}
        regTitle={regulation.judul}
        onReplaceSuccess={handleReplaceSuccess}
      />

      <DocumentPreviewModal
        isOpen={!!activePreviewDoc}
        onClose={() => setActivePreviewDoc(null)}
        document={activePreviewDoc}
        regTitle={regulation.judul}
      />

      <StatusChangeConfirmModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={regulation.status}
        targetStatus={targetStatusOption}
        onConfirmStatusChange={handleConfirmStatusChange}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        regTitle={regulation.judul}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </AppLayout>
  );
};

export default PeraturanDetailPage;
