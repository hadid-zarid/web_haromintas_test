import React, { useState, useRef } from 'react';
import { Head, router, useForm, usePage, Link } from '@inertiajs/react';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import StatusBadge from '../components/common/StatusBadge';
import { 
  ArrowLeft, 
  Upload, 
  Eye, 
  Download, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Building, 
  UserCheck, 
  ShieldCheck, 
  ShieldAlert, 
  AlertCircle, 
  Sparkles, 
  FileCheck2, 
  RefreshCw, 
  X, 
  Layers,
  MessageSquare,
  History,
  Lock,
  ExternalLink,
  Trash2,
  FileCheck,
  Check,
  CheckCircle,
  XCircle,
  PlusCircle,
  Edit3,
  Landmark,
  Scale,
  Folder,
  FolderOpen,
  ChevronRight
} from 'lucide-react';

/**
 * MapDokumenCard Component
 * Represents an authentic physical document folder (Map Berkas)
 * with interactive layered paper sheets that peek upwards on hover.
 */
const MapDokumenCard = ({
  slot,
  doc,
  isUploaded,
  isOptional,
  isLockedForUpload,
  canUpload,
  authInfo,
  onView,
  onUpload,
  formatFileSize,
}) => {
  const isDocWord = doc?.nama_file?.toLowerCase().endsWith('.docx') || doc?.nama_file?.toLowerCase().endsWith('.doc');

  return (
    <div
      onClick={() => {
        if (isUploaded) {
          onView(doc);
        } else if (canUpload) {
          onUpload(slot);
        }
      }}
      className={`group relative rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer select-none overflow-visible mt-2.5 ${
        isUploaded
          ? 'bg-gradient-to-b from-white via-white to-slate-50/80 border-slate-200/90 hover:border-[#2B3056]/40 hover:shadow-xl hover:-translate-y-1.5'
          : isLockedForUpload
          ? 'bg-slate-50/80 border-dashed border-slate-300 opacity-80 cursor-not-allowed'
          : 'bg-white border-dashed border-slate-300 hover:border-[#2B3056]/40 hover:shadow-md hover:-translate-y-1'
      }`}
    >
      {/* =========================================================================
          FOLDER TOP TAB & INTERNAL PEEKING PAPER SHEETS
          ========================================================================= */}
      <div className="relative pt-3.5 px-4 overflow-visible">
        {/* Layered Paper Sheets Peeking Out Behind Folder Front */}
        <div className="absolute left-7 right-7 -top-3.5 h-6 pointer-events-none overflow-visible z-0">
          {/* Back Paper Sheet 3 */}
          <div
            className={`folder-paper-layer-3 absolute inset-x-2 top-0 h-6 rounded-t-lg border border-slate-300 shadow-2xs ${
              isUploaded ? 'bg-amber-50' : 'bg-slate-100'
            }`}
          >
            <div className="flex gap-1.5 p-1.5 opacity-40">
              <span className="h-1 w-6 bg-slate-400 rounded-full" />
              <span className="h-1 w-10 bg-slate-300 rounded-full" />
            </div>
          </div>

          {/* Middle Paper Sheet 2 */}
          <div
            className={`folder-paper-layer-2 absolute inset-x-1 top-1 h-6 rounded-t-lg border border-slate-300 shadow-2xs ${
              isUploaded ? 'bg-blue-50' : 'bg-slate-100'
            }`}
          >
            <div className="flex gap-1.5 p-1.5 opacity-50">
              <span className="h-1 w-12 bg-slate-400 rounded-full" />
              <span className="h-1 w-8 bg-slate-300 rounded-full" />
            </div>
          </div>

          {/* Front Paper Sheet 1 */}
          <div
            className="folder-paper-layer-1 absolute inset-x-0 top-2 h-6 rounded-t-lg bg-white border border-slate-300 shadow-xs"
          >
            <div className="flex items-center justify-between p-1.5 opacity-60">
              <span className="h-1 w-16 bg-[#2B3056]/50 rounded-full" />
              <span className="h-1 w-4 bg-[#FFD82B] rounded-full" />
            </div>
          </div>
        </div>

        {/* Physical Folder Ear / Tab Top Bar */}
        <div className="relative z-10 flex items-center justify-between gap-2 pt-1 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10.5px] font-black tracking-wide shadow-2xs transition-colors shrink-0 ${
              isUploaded
                ? 'bg-[#2B3056] text-[#FFD82B]'
                : isLockedForUpload
                ? 'bg-slate-200 text-slate-500'
                : 'bg-slate-100 text-slate-700 group-hover:bg-[#2B3056] group-hover:text-[#FFD82B]'
            }`}>
              <Folder className="h-3.5 w-3.5 shrink-0" />
              <span>Slot #{slot.urutan}</span>
            </span>
          </div>

          {/* Status Pill */}
          <span className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider border shadow-2xs shrink-0 ${
            isUploaded 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : isOptional
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : isLockedForUpload
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            {isUploaded ? '✓ Tersedia' : isOptional ? 'Opsional' : isLockedForUpload ? '🔒 Terkunci' : '○ Belum Ada'}
          </span>
        </div>
      </div>

      {/* =========================================================================
          FOLDER BODY CONTENT
          ========================================================================= */}
      <div className="p-4 space-y-3 relative z-10 flex-1 flex flex-col justify-between">
        {/* Document Slot Name */}
        <div>
          <h3 className="font-extrabold text-xs text-[#2B3056] group-hover:text-[#3A4070] transition-colors leading-snug min-h-[32px] line-clamp-2">
            {slot.nama_dokumen}
          </h3>
        </div>

        {/* Authority / Role Badge */}
        <div className={`p-2.5 rounded-2xl border text-[10px] font-bold min-h-[48px] flex flex-col justify-center ${authInfo.badgeClass}`}>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${authInfo.dotColor}`} />
            <span className="truncate">{authInfo.roleName}</span>
          </div>
          <p className="text-[9.5px] text-slate-500 font-normal mt-0.5 leading-tight line-clamp-1">
            {authInfo.authorityDesc}
          </p>
        </div>

        {/* Uploaded File Pill / Metadata */}
        {isUploaded ? (
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-1 group-hover:bg-white group-hover:border-slate-300 transition-colors">
            <p className="font-bold text-[#2B3056] truncate flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{doc.nama_file}</span>
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-0.5">
              <span>{doc.ukuran_file || 'PDF / Word'}</span>
              <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded text-slate-600 font-bold">
                v{doc.versi || 1}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-slate-50/80 border border-dashed border-slate-200 text-center text-slate-400 text-[10.5px] font-medium min-h-[58px] flex items-center justify-center">
            {isLockedForUpload
              ? 'Menunggu kelengkapan Tahap 1-5'
              : isOptional
              ? 'Tidak wajib — unggah jika tersedia'
              : 'Klik untuk mengunggah dokumen'}
          </div>
        )}
      </div>

      {/* =========================================================================
          FOLDER ACTION BAR
          ========================================================================= */}
      <div className="p-4 pt-0 mt-auto relative z-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          {isUploaded && (
            <>
              {/* Button: Lihat Dokumen */}
              <button
                type="button"
                onClick={() => onView(doc)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#2B3056] hover:bg-[#3A4070] text-white text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer group-hover:shadow-sm"
                title="Buka Dokumen di Web"
              >
                <Eye className="w-3.5 h-3.5 text-[#FFD82B]" />
                <span>Lihat</span>
              </button>

              {/* Button: Unduh Dokumen */}
              <a
                href={`/dokumen/${doc.dokumen_id}/download`}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition flex items-center justify-center shadow-2xs cursor-pointer shrink-0"
                title="Unduh Berkas ke Komputer"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </>
          )}

          {canUpload ? (
            <button
              type="button"
              onClick={() => onUpload(slot)}
              className={`py-2 px-3 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                isUploaded
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0'
                  : 'w-full bg-[#2B3056] hover:bg-[#3A4070] text-white shadow-2xs'
              }`}
            >
              {isUploaded ? (
                <>
                  <RefreshCw className="w-3 h-3 text-slate-500" />
                  <span>Ganti</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-[#FFD82B]" />
                  <span>+ Unggah</span>
                </>
              )}
            </button>
          ) : (
            !isUploaded && (
              <div className="w-full py-2 px-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-[10.5px] font-bold text-center flex items-center justify-center gap-1.5 overflow-hidden">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{authInfo.lockNotice}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export const PeraturanDetailPage = ({
  permohonan,
  jenisDokumens = [],
  statuses = [],
  auditLogs = [],
}) => {
  const { user, isTimKerja, isAdmin, isBiroHukum, isPimpinan } = useAuth();
  const { flash } = usePage().props;

  // Active modals
  const [activeUploadSlot, setActiveUploadSlot] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState(null); // 'APPROVE' or 'REVISE'

  const fileInputRef = useRef(null);
  const suratDecisionInputRef = useRef(null);

  // Upload Form
  const uploadForm = useForm({
    jenis_dokumen_id: 1,
    file: null,
    keterangan: '',
  });

  // Status Decision Form
  const statusForm = useForm({
    status_id: 4,
    catatan: '',
    surat_file: null,
  });

  // Format File Size Helper
  const formatFileSize = (bytes) => {
    if (!bytes || bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!permohonan) {
    return (
      <AppLayout hideHeader={true}>
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
          <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-[#2B3056]">Permohonan Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Berkas permohonan tidak ditemukan atau telah dihapus dari sistem.
          </p>
          <Link
            href="/peraturan"
            className="px-4 py-2.5 bg-[#2B3056] text-white rounded-xl text-xs font-bold"
          >
            Kembali ke Daftar Permohonan
          </Link>
        </div>
      </AppLayout>
    );
  }

  const kabName = permohonan.kabupaten?.nama_kabupaten || 'Wilayah Riau';
  const timName = permohonan.tim_kerja?.nama_tim_kerja || permohonan.kabupaten?.tim_kerja?.nama_tim_kerja || 'Tim Kerja';
  const jenisName = permohonan.jenis_regulasi?.nama_jenis || (permohonan.jenis_regulasi_id === 1 ? 'Ranperda' : 'Ranperkada');

  // Map uploaded documents by jenis_dokumen_id (slots 1 to 7)
  const uploadedDocsMap = {};
  if (permohonan.dokumens) {
    permohonan.dokumens.forEach((doc) => {
      uploadedDocsMap[doc.jenis_dokumen_id] = doc;
    });
  }

  // Hitung kelengkapan dokumen Tahap I & Tahap II
  const harmonisasiSlots = [1, 2, 3, 4, 5];
  const uploadedHarmonisasiCount = harmonisasiSlots.filter((id) => Boolean(uploadedDocsMap[id])).length;
  const isHarmonisasiComplete = uploadedHarmonisasiCount === 5;

  const requiredFasilitasiSlots = [7];
  const uploadedFasilitasiCount = requiredFasilitasiSlots.filter((id) => Boolean(uploadedDocsMap[id])).length;
  const isFasilitasiComplete = uploadedFasilitasiCount === requiredFasilitasiSlots.length;
  const requiredDocumentSlots = [...harmonisasiSlots, ...requiredFasilitasiSlots];
  const requiredUploadedCount = requiredDocumentSlots.filter((id) => Boolean(uploadedDocsMap[id])).length;

  // Open Upload Modal
  const openUploadModal = (slot) => {
    setActiveUploadSlot(slot);
    uploadForm.setData({
      jenis_dokumen_id: slot.jenis_dokumen_id,
      file: null,
      keterangan: '',
    });
  };

  // Submit Upload
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!activeUploadSlot) return;

    uploadForm.post(`/peraturan/${permohonan.rancangan_id}/dokumen`, {
      forceFormData: true,
      onSuccess: () => {
        setActiveUploadSlot(null);
        uploadForm.reset();
      },
    });
  };

  // Open Status Action Modal (Biro Hukum Decision)
  const openStatusActionModal = (actionType) => {
    setStatusAction(actionType);
    if (actionType === 'APPROVE') {
      statusForm.setData({
        status_id: 4, // Selesai
        catatan: 'Disetujui tuntas oleh Biro Hukum Sekretariat Daerah Provinsi Riau.',
        surat_file: null,
      });
    } else if (actionType === 'REVISE') {
      statusForm.setData({
        status_id: 5, // Perlu Perbaikan
        catatan: '',
        surat_file: null,
      });
    }
    setIsStatusModalOpen(true);
  };

  // Submit Status Decision
  const handleStatusSubmit = (e) => {
    e.preventDefault();
    statusForm.post(`/peraturan/${permohonan.rancangan_id}/status`, {
      forceFormData: true,
      onSuccess: () => {
        setIsStatusModalOpen(false);
        statusForm.reset();
      },
    });
  };

  // Check upload permissions per slot
  const canUploadSlot = (slotId) => {
    if (isAdmin) return true;
    if (slotId >= 1 && slotId <= 5) return isTimKerja;
    if (slotId === 6 || slotId === 7) return isBiroHukum;
    return false;
  };

  // Get Authority badge & styling per slot
  const getSlotAuthority = (slotId) => {
    if (slotId >= 1 && slotId <= 5) {
      return {
        roleName: 'Kewenangan: Tim Kerja Kanwil',
        authorityDesc: 'Dikelola oleh Tim Kerja Kanwil Kemenkumham Riau & Pemda',
        badgeClass: 'bg-blue-50/80 border-blue-200/80 text-blue-900',
        dotColor: 'bg-blue-600',
        lockNotice: 'Wewenang Tim Kerja Kanwil',
      };
    }
    return {
      roleName: 'Kewenangan: Biro Hukum Prov. Riau',
      authorityDesc: 'Dikelola khusus oleh Biro Hukum Setda Provinsi Riau',
      badgeClass: 'bg-purple-50/80 border-purple-200/80 text-purple-900',
      dotColor: 'bg-purple-600',
      lockNotice: isHarmonisasiComplete ? 'Wewenang Biro Hukum' : 'Terkunci (Tahap 1-5 Belum Lengkap)',
    };
  };

  return (
    <AppLayout hideHeader={true}>
      <Head title={`Detail ${permohonan.nomor_regulasi} - HARMONITAS`} />

      <div className="space-y-6">
        {/* Flash Notifications */}
        {flash?.success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-xs font-bold shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p>{flash.success}</p>
          </div>
        )}

        {flash?.error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-bold shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p>{flash.error}</p>
          </div>
        )}

        {/* TOP BREADCRUMB & NAVIGATION BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <Link
            href="/peraturan"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#2B3056] hover:bg-slate-50 transition shadow-2xs w-fit"
          >
            <ArrowLeft className="w-4 h-4 text-[#FFC800]" />
            <span>Kembali ke Daftar Permohonan</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">Nomor Registrasi:</span>
            <span className="px-3 py-1 bg-[#2B3056] text-[#FFD82B] rounded-xl text-xs font-mono font-extrabold shadow-2xs">
              {permohonan.nomor_regulasi}
            </span>
          </div>
        </div>

        {/* HERO BANNER CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2B3056] via-[#323963] to-[#2B3056] p-6 sm:p-7 text-white shadow-xl border border-[#3A4070]">
          {/* Gold Accent Left Stripe */}
          <span className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-[#FFD82B] via-[#FFC800] to-[#FFD82B]" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                  jenisName === 'Ranperda' ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30' : 'bg-teal-500/20 text-teal-200 border border-teal-400/30'
                }`}>
                  {jenisName}
                </span>

                <StatusBadge statusId={permohonan.status_id} />

                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-slate-200 border border-white/10">
                  {timName}
                </span>

                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {requiredUploadedCount}/6 Dokumen Wajib
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                {permohonan.judul_rancangan}
              </h1>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#FFD82B]" />
                  <span className="text-white font-bold">{kabName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Masuk: {permohonan.tanggal_dibuat ? new Date(permohonan.tanggal_dibuat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Petugas: {permohonan.uploader?.nama || 'Petugas Kanwil'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              {(isBiroHukum || isAdmin) && isHarmonisasiComplete && permohonan.status_id !== 4 && (
                <>
                  <button
                    type="button"
                    onClick={() => openStatusActionModal('APPROVE')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-200" />
                    <span>Terima & Terbitkan Surat Fasilitasi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openStatusActionModal('REVISE')}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 text-rose-200" />
                    <span>Tolak & Terbitkan Surat Penolakan</span>
                  </button>
                </>
              )}

              <Link
                href="/ai"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFD82B]" />
                <span>Uji Format Dokumen via AI</span>
              </Link>
            </div>
          </div>
        </div>

        {/* CATATAN BERKAS BANNER */}
        {permohonan.keterangan && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs shadow-2xs">
            <MessageSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Catatan Berkas:</p>
              <p className="font-normal text-amber-900 mt-0.5 leading-relaxed">{permohonan.keterangan}</p>
            </div>
          </div>
        )}

        {/* 7 SLOT DOKUMEN SISTEM HARMONITAS DALAM BENTUK MAP DOKUMEN */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
          {/* Header Section with 2-Stage Progress */}
          <div className="border-b border-slate-200/90 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-[#2B3056] flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#FFC800]" />
                <span>7 Slot Dokumen Berkas Harmonisasi & Fasilitasi</span>
              </h2>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Arahkan kursor ke tiap map berkas untuk melihat isi dokumen. Klik card untuk membuka pratinjau dokumen langsung di web.
              </p>
            </div>

            {/* Indikator Progres 2 Tahap */}
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-bold">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                isHarmonisasiComplete ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {isHarmonisasiComplete ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />}
                <span>Tahap I (Kanwil): <strong>{uploadedHarmonisasiCount}/5 Lengkap</strong></span>
              </div>

              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                isFasilitasiComplete ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-purple-50 text-purple-700 border-purple-200'
              }`}>
                {isFasilitasiComplete ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-2 h-2 rounded-full bg-purple-600" />}
                <span>Tahap II (Biro Hukum): <strong>{uploadedFasilitasiCount}/1 Wajib</strong> • Slot #6 Opsional</span>
              </div>
            </div>
          </div>

          {/* 4-Column Grid of Map Dokumen Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8 pt-5">
            {jenisDokumens.map((slot) => {
              const doc = uploadedDocsMap[slot.jenis_dokumen_id];
              const isUploaded = Boolean(doc);
              const isOptional = slot.jenis_dokumen_id === 6;
              const isFasilitasiSlot = slot.jenis_dokumen_id === 6 || slot.jenis_dokumen_id === 7;
              const isLockedForUpload = isFasilitasiSlot && !isHarmonisasiComplete;
              const canUpload = canUploadSlot(slot.jenis_dokumen_id) && !isLockedForUpload;
              const authInfo = getSlotAuthority(slot.jenis_dokumen_id);

              return (
                <MapDokumenCard
                  key={slot.jenis_dokumen_id}
                  slot={slot}
                  doc={doc}
                  isUploaded={isUploaded}
                  isOptional={isOptional}
                  isLockedForUpload={isLockedForUpload}
                  canUpload={canUpload}
                  authInfo={authInfo}
                  onView={(d) => setPreviewDoc(d)}
                  onUpload={(s) => openUploadModal(s)}
                  formatFileSize={formatFileSize}
                />
              );
            })}
          </div>
        </div>

        {/* TIMELINE & RIWAYAT AKTIVITAS */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#2B3056] flex items-center gap-2">
              <History className="w-4 h-4 text-[#FFC800]" />
              <span>Riwayat Aktivitas & Perjalanan Berkas</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400">
              {auditLogs.length} Catatan
            </span>
          </div>

          <div className="space-y-3">
            {auditLogs && auditLogs.length > 0 ? (
              auditLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-[#2B3056] flex items-center justify-center shrink-0 shadow-2xs mt-0.5 font-bold">
                    {log.action?.includes('UPLOAD') ? <Upload className="w-4 h-4 text-blue-600" /> : <CheckCircle className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-[#2B3056]">
                        {log.user?.nama || 'Petugas Sistem'}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {log.created_at ? new Date(log.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      {log.action === 'UPLOAD_DOKUMEN' ? (
                        <span>Mengunggah berkas <strong>{log.payload?.nama_dokumen || 'Dokumen'}</strong> ({log.payload?.file_name}) versi {log.payload?.versi || 1}.</span>
                      ) : log.action === 'APPROVE_FASILITASI' ? (
                        <span>Mengesahkan hasil fasilitasi regulasi sebagai <strong>Selesai (Tuntas)</strong>.</span>
                      ) : log.action === 'REJECT_FASILITASI' ? (
                        <span>Mengembalikan berkas fasilitasi dengan catatan perbaikan: "{log.payload?.catatan}".</span>
                      ) : (
                        <span>Memperbarui status berkas ke <strong>{log.payload?.to_status_name || 'Status Baru'}</strong>.</span>
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs font-medium py-4 text-center">
                Belum ada riwayat aktivitas yang tercatat untuk berkas ini.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: PRATINJAU DOKUMEN INTERAKTIF (DENGAN SAFE FALLBACK ERROR STATE)
          ========================================================================= */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#2B3056]/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header Modal Preview */}
            <div className="bg-[#2B3056] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#3A4070] shrink-0">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-white/10 text-[#FFD82B] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-white truncate">{previewDoc.nama_file}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-300/30 shrink-0">
                      🔒 Rahasia
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {permohonan.nomor_regulasi} • Versi {previewDoc.versi || 1} • Ukuran: {previewDoc.ukuran_file || '-'}
                  </p>
                </div>
              </div>

              {/* Actions Header */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`/dokumen/${previewDoc.dokumen_id}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
                  title="Buka di Tab Baru"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tab Baru</span>
                </a>

                <a
                  href={`/dokumen/${previewDoc.dokumen_id}/download`}
                  className="px-3 py-1.5 rounded-xl bg-[#FFD82B] hover:bg-[#FFC800] text-[#2B3056] text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs"
                  title="Unduh Berkas"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  title="Tutup Pratinjau"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Preview Container */}
            <div className="flex-1 bg-slate-100 p-2 sm:p-4 overflow-hidden relative flex flex-col">
              {previewDoc.nama_file?.toLowerCase().endsWith('.docx') || previewDoc.nama_file?.toLowerCase().endsWith('.doc') ? (
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-extrabold text-[#2B3056]">{previewDoc.nama_file}</h4>
                  <p className="text-xs text-slate-500 max-w-md mt-2 leading-relaxed">
                    Dokumen ini berformat <strong>Microsoft Word (.docx/.doc)</strong>. Anda dapat mengunduh berkas fisik untuk mengedit atau membukanya di aplikasi pengolah kata.
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <a
                      href={`/dokumen/${previewDoc.dokumen_id}/download`}
                      className="px-5 py-2.5 rounded-xl bg-[#2B3056] text-white text-xs font-bold hover:bg-[#3A4070] transition flex items-center gap-2 shadow-sm"
                    >
                      <Download className="w-4 h-4 text-[#FFD82B]" />
                      <span>Unduh Berkas Word</span>
                    </a>
                  </div>
                </div>
              ) : (
                <iframe
                  src={`/dokumen/${previewDoc.dokumen_id}/view`}
                  className="w-full flex-1 rounded-2xl border border-slate-200 bg-white shadow-inner"
                  title={previewDoc.nama_file}
                />
              )}
            </div>

            {/* Footer Modal Preview */}
            <div className="bg-white px-5 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-bold shrink-0">
              <span className="flex items-center gap-1.5 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Dokumen Resmi Terverifikasi Sistem HARMONITAS</span>
              </span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition font-semibold cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: UNGGAH DOKUMEN SLOT
          ========================================================================= */}
      {activeUploadSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B3056]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#2B3056] text-white p-5 flex items-center justify-between border-b border-[#3A4070]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 text-[#FFD82B] flex items-center justify-center font-bold text-sm">
                  {activeUploadSlot.urutan}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">{activeUploadSlot.nama_dokumen}</h3>
                  <p className="text-[10px] text-slate-300 font-medium">
                    Slot #{activeUploadSlot.urutan} • {getSlotAuthority(activeUploadSlot.jenis_dokumen_id).roleName}
                    {activeUploadSlot.jenis_dokumen_id === 6 ? ' • Opsional' : ''}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveUploadSlot(null)}
                className="text-slate-300 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2B3056] mb-2">
                  Pilih File Berkas Dokumen <span className="text-rose-500">*</span>
                </label>

                {!uploadForm.data.file ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#2B3056] hover:bg-slate-50/70 rounded-2xl p-6 bg-slate-50 text-center transition cursor-pointer group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => uploadForm.setData('file', e.target.files[0])}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#2B3056] flex items-center justify-center mx-auto mb-2.5 shadow-2xs group-hover:scale-105 transition">
                      <Upload className="w-6 h-6 text-[#2B3056]" />
                    </div>
                    <p className="text-xs font-extrabold text-[#2B3056]">
                      Klik untuk memilih berkas dari komputer
                    </p>
                    <p className="text-[11px] text-slate-500 font-normal mt-1">
                      atau seret dan lepas file Anda ke dalam kotak ini
                    </p>

                    <div className="flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-slate-200/60">
                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">.PDF</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">.DOC</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">.DOCX</span>
                      <span className="text-[10px] text-slate-400 font-semibold ml-1">Maks. 25MB</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50/90 border-2 border-emerald-300 shadow-xs animate-in fade-in zoom-in duration-150">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                          <FileCheck className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[9px] font-extrabold tracking-wide border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>BERKAS TELAH DILAMPIRKAN</span>
                            </span>
                          </div>
                          <p className="text-xs font-bold text-[#2B3056] truncate" title={uploadForm.data.file.name}>
                            {uploadForm.data.file.name}
                          </p>
                          <p className="text-[10px] text-slate-600 font-semibold mt-0.5">
                            Ukuran: {formatFileSize(uploadForm.data.file.size)} • Format: {uploadForm.data.file.name.split('.').pop()?.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Pilih Berkas Lain"
                        >
                          <RefreshCw className="w-3 h-3 text-slate-500" />
                          <span>Ganti</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => uploadForm.setData('file', null)}
                          className="p-1.5 rounded-xl bg-rose-100/80 border border-rose-200 hover:bg-rose-200 text-rose-700 transition cursor-pointer"
                          title="Hapus Lampiran Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => uploadForm.setData('file', e.target.files[0])}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {uploadForm.errors.file && (
                  <p className="mt-1.5 text-[10px] text-rose-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{uploadForm.errors.file}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B3056] mb-1">
                  Catatan / Keterangan Dokumen (Opsional)
                </label>
                <input
                  type="text"
                  value={uploadForm.data.keterangan}
                  onChange={(e) => uploadForm.setData('keterangan', e.target.value)}
                  placeholder="Contoh: Hasil pembahasan rapat pleno pasal 12..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#2B3056] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD82B]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveUploadSlot(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!uploadForm.data.file || uploadForm.processing}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                    uploadForm.data.file && !uploadForm.processing
                      ? 'bg-[#2B3056] hover:bg-[#3A4070] text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-[#FFD82B]" />
                  <span>{uploadForm.processing ? 'Mengunggah Berkas...' : 'Unggah Dokumen'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: KEPUTUSAN BIRO HUKUM
          ========================================================================= */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B3056]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#2B3056] text-white p-5 flex items-center justify-between border-b border-[#3A4070]">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                  statusAction === 'APPROVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {statusAction === 'APPROVE' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    {statusAction === 'APPROVE' ? 'Persetujuan Hasil Fasilitasi (Selesai)' : 'Pengembalian Berkas Fasilitasi (Perlu Perbaikan)'}
                  </h3>
                  <p className="text-[10px] text-slate-300 font-medium">
                    Kewenangan Resmi Biro Hukum Sekretariat Daerah Provinsi Riau
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="p-6 space-y-4">
              <div className={`p-3.5 rounded-2xl border text-xs font-medium leading-relaxed ${
                statusAction === 'APPROVE' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                {statusAction === 'APPROVE' ? (
                  <p>
                    Rancangan peraturan ini akan disahkan sebagai <strong>SELESAI (TUNTAS)</strong>. Anda dapat melampirkan file <strong>Surat Hasil Fasilitasi / Surat Persetujuan</strong> resmi di bawah ini.
                  </p>
                ) : (
                  <p>
                    Berkas akan dikembalikan ke Tim Kerja Kanwil dengan status <strong>PERLU PERBAIKAN</strong>. Silakan lampirkan <strong>Surat Penolakan / Pengembalian Berkas</strong> serta uraian pasal yang memerlukan revisi.
                  </p>
                )}
              </div>

              {/* Upload Surat Keputusan */}
              <div>
                <label className="block text-xs font-bold text-[#2B3056] mb-2">
                  {statusAction === 'APPROVE' ? 'Lampiran Surat Hasil Fasilitasi / Persetujuan (Opsional)' : 'Lampiran Surat Penolakan / Pengembalian Berkas (Opsional)'}
                </label>

                {!statusForm.data.surat_file ? (
                  <div
                    onClick={() => suratDecisionInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#2B3056] hover:bg-slate-50/70 rounded-2xl p-4 bg-slate-50 text-center transition cursor-pointer group"
                  >
                    <input
                      type="file"
                      ref={suratDecisionInputRef}
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => statusForm.setData('surat_file', e.target.files[0])}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-[#2B3056] mx-auto mb-1.5 group-hover:scale-105 transition" />
                    <p className="text-xs font-bold text-[#2B3056]">
                      {statusAction === 'APPROVE' ? 'Pilih file Surat Persetujuan (.PDF, .DOC, .DOCX)' : 'Pilih file Surat Penolakan (.PDF, .DOC, .DOCX)'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Maks. 25MB</p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                        <FileCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-200/80 px-1.5 py-0.5 rounded">
                          Surat Keputusan Terlampir
                        </span>
                        <p className="text-xs font-bold text-[#2B3056] truncate mt-0.5" title={statusForm.data.surat_file.name}>
                          {statusForm.data.surat_file.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {formatFileSize(statusForm.data.surat_file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => statusForm.setData('surat_file', null)}
                      className="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition cursor-pointer"
                      title="Hapus Lampiran"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {statusForm.errors.surat_file && (
                  <p className="mt-1 text-[10px] text-rose-600 font-bold">{statusForm.errors.surat_file}</p>
                )}
              </div>

              {/* Catatan / Alasan Evaluasi */}
              <div>
                <label className="block text-xs font-bold text-[#2B3056] mb-1">
                  Catatan Telaah / Alasan Evaluasi {statusAction === 'REVISE' && <span className="text-rose-500">*</span>}
                </label>
                <textarea
                  required={statusAction === 'REVISE'}
                  rows={3}
                  value={statusForm.data.catatan}
                  onChange={(e) => statusForm.setData('catatan', e.target.value)}
                  placeholder={statusAction === 'APPROVE' ? "Contoh: Naskah telah selaras dengan peraturan perundang-undangan yang lebih tinggi." : "Contoh: Perlu penyesuaian pada Pasal 8 terkait tarif retribusi..."}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#2B3056] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD82B]"
                />
              </div>

              {/* Tombol Aksi */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={statusForm.processing}
                  className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 shadow-sm cursor-pointer ${
                    statusAction === 'APPROVE'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {statusAction === 'APPROVE' ? <CheckCircle className="w-4 h-4 text-emerald-200" /> : <XCircle className="w-4 h-4 text-rose-200" />}
                  <span>{statusForm.processing ? 'Memproses...' : statusAction === 'APPROVE' ? 'Sahkan Hasil Fasilitasi' : 'Kirim Pengembalian Berkas'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default PeraturanDetailPage;
