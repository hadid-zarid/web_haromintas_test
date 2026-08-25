import React, { useState, useRef } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
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
  Edit3
} from 'lucide-react';

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
  const [previewDoc, setPreviewDoc] = useState(null); // Document active in preview modal
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

  // Status / Decision Change Form (Biro Hukum Approval / Rejection with Letter Upload)
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
      <AppLayout>
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E2DC] shadow-sm">
          <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-black text-[#1A1A5E]">Permohonan Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Berkas permohonan tidak ditemukan atau telah dihapus dari sistem.
          </p>
          <button
            onClick={() => router.visit('/peraturan')}
            className="px-4 py-2.5 bg-[#1A1A5E] text-white rounded-xl text-xs font-bold"
          >
            Kembali ke Daftar Permohonan
          </button>
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

  const fasilitasiSlots = [6, 7];
  const uploadedFasilitasiCount = fasilitasiSlots.filter((id) => Boolean(uploadedDocsMap[id])).length;
  const isFasilitasiComplete = uploadedFasilitasiCount === 2;
  const totalUploadedCount = Object.keys(uploadedDocsMap).length;

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

  // Open Status Action Modal (Biro Hukum Decision: Terima / Tolak)
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

  // Helper keterangan hak akses & kewenangan slot
  const getSlotAuthority = (slotId) => {
    if (slotId >= 1 && slotId <= 5) {
      return {
        roleName: 'Tim Kerja Kanwil',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        dotColor: 'bg-blue-600',
        authorityDesc: 'Dikelola oleh Tim Kerja Kanwil Kemenkumham Riau & Pemda',
        lockNotice: 'Hanya Tim Kerja yang berwenang mengunggah',
      };
    }
    return {
      roleName: 'Biro Hukum Prov. Riau',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      dotColor: 'bg-purple-600',
      authorityDesc: 'Dikelola khusus oleh Biro Hukum Setda Provinsi Riau',
      lockNotice: !isHarmonisasiComplete
        ? `🔒 Terkunci: Menunggu berkas 1-5 Tim Kerja Kanwil (${uploadedHarmonisasiCount}/5)`
        : 'Hanya Biro Hukum yang berwenang mengunggah',
    };
  };

  // Helper Formatter Riwayat Aktivitas & Jejak Audit yang Ramah Pengguna (Humanized Indonesian)
  const formatAuditItem = (log) => {
    const action = log.action;
    const p = log.payload || {};
    const userName = log.user?.nama || 'Sistem HARMONITAS';

    switch (action) {
      case 'CREATE_PERMOHONAN':
        return {
          icon: PlusCircle,
          badge: 'Pendaftaran Berkas',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          iconClass: 'bg-emerald-100 text-emerald-700',
          title: `${userName} mendaftarkan permohonan baru`,
          description: `Rancangan peraturan '${p.judul_rancangan || permohonan.judul_rancangan}' didaftarkan ke sistem.`,
        };
      case 'UPLOAD_DOKUMEN':
        return {
          icon: Upload,
          badge: 'Unggah Dokumen',
          badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
          iconClass: 'bg-blue-100 text-blue-700',
          title: `${userName} mengunggah dokumen`,
          description: `Berkas '${p.nama_dokumen || 'Dokumen'}' (${p.file_name || 'lampiran'}) berhasil diunggah (Versi ${p.versi || 1}).`,
        };
      case 'APPROVE_FASILITASI':
        return {
          icon: CheckCircle2,
          badge: 'Fasilitasi Disetujui (Selesai)',
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-black',
          iconClass: 'bg-emerald-500 text-white',
          title: `${userName} menyetujui hasil fasilitasi`,
          description: `${p.catatan || 'Berkas disetujui tuntas oleh Biro Hukum Provinsi Riau.'}${p.surat_terlampir ? ` (Surat Persetujuan: ${p.surat_terlampir})` : ''}`,
        };
      case 'REJECT_FASILITASI':
        return {
          icon: XCircle,
          badge: 'Fasilitasi Dikembalikan (Perlu Perbaikan)',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-200 font-black',
          iconClass: 'bg-rose-500 text-white',
          title: `${userName} mengembalikan berkas permohonan`,
          description: `Catatan evaluasi: "${p.catatan || 'Perlu perbaikan berkas'}"${p.surat_terlampir ? ` (Surat Penolakan: ${p.surat_terlampir})` : ''}`,
        };
      case 'CHANGE_PERATURAN_STATUS':
        return {
          icon: RefreshCw,
          badge: 'Perubahan Status',
          badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
          iconClass: 'bg-purple-100 text-purple-700',
          title: `Status berkas diperbarui menjadi '${p.to_status_name || 'Status Baru'}'`,
          description: p.catatan ? `Catatan: ${p.catatan}` : 'Pembaruan tahapan berkas regulasi daerah.',
        };
      case 'UPDATE_PERMOHONAN':
        return {
          icon: Edit3,
          badge: 'Pembaruan Informasi',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          iconClass: 'bg-amber-100 text-amber-700',
          title: `${userName} memperbarui informasi permohonan`,
          description: `Pembaruan data judul atau nomor registrasi regulasi.`,
        };
      case 'PREVIEW_CONFIDENTIAL_DOKUMEN':
        return {
          icon: Eye,
          badge: 'Pratinjau Berkas',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          iconClass: 'bg-slate-200 text-slate-700',
          title: `${userName} melihat pratinjau dokumen`,
          description: `Membuka pratinjau naskah '${p.nama_file || 'dokumen'}' secara langsung di peramban web.`,
        };
      case 'DOWNLOAD_CONFIDENTIAL_DOKUMEN':
        return {
          icon: Download,
          badge: 'Unduh Berkas',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          iconClass: 'bg-slate-200 text-slate-700',
          title: `${userName} mengunduh berkas fisik`,
          description: `Mengunduh berkas '${p.nama_file || 'dokumen'}' ke perangkat komputer.`,
        };
      default:
        return {
          icon: History,
          badge: 'Aktivitas Berkas',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          iconClass: 'bg-slate-100 text-slate-700',
          title: `${userName} melakukan pembaruan`,
          description: typeof p === 'string' ? p : (p.catatan || p.nama_dokumen || p.file_name || 'Aktivitas tercatat pada sistem.'),
        };
    }
  };

  return (
    <AppLayout>
      <Head title={`Detail: ${permohonan.nomor_regulasi} - HARMONITAS`} />

      <div className="space-y-6">
        {/* Flash Notifications */}
        {flash?.success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p>{flash.success}</p>
          </div>
        )}

        {flash?.error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-bold shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p>{flash.error}</p>
          </div>
        )}

        {/* TOP BAR / BACK NAVIGATION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.visit('/peraturan')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E2E2DC] text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs w-fit"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Kembali ke Daftar Permohonan</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Nomor Registrasi:</span>
            <span className="px-3 py-1 bg-[#1A1A5E] text-white rounded-xl text-xs font-black font-mono">
              {permohonan.nomor_regulasi}
            </span>
          </div>
        </div>

        {/* BANNER DETAIL HEADER */}
        <div className="bg-[#2C3154] text-white p-6 sm:p-7 rounded-3xl border border-[#383F6A] shadow-md relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-[#FFC800]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                  jenisName === 'Ranperda' ? 'bg-purple-400/20 text-purple-200 border border-purple-300/30' : 'bg-teal-400/20 text-teal-200 border border-teal-300/30'
                }`}>
                  {jenisName}
                </span>

                <StatusBadge statusId={permohonan.status_id} />

                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-slate-200">
                  {timName}
                </span>

                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {totalUploadedCount}/7 Dokumen Lengkap
                </span>
              </div>

              <h1 className="text-lg sm:text-2xl font-black text-white leading-snug">
                {permohonan.judul_rancangan}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 font-semibold pt-1">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#FFC800]" />
                  <span>{kabName}</span>
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

            {/* ACTION BUTTONS: KEPUTUSAN BIRO HUKUM (TERIMA / TOLAK) */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              {(isBiroHukum || isAdmin) && isHarmonisasiComplete && permohonan.status_id !== 4 && (
                <>
                  {/* Tombol Terima / Sahkan Hasil Fasilitasi */}
                  <button
                    type="button"
                    onClick={() => openStatusActionModal('APPROVE')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-200" />
                    <span>Terima & Terbitkan Surat Fasilitasi</span>
                  </button>

                  {/* Tombol Tolak / Kembalikan Berkas */}
                  <button
                    type="button"
                    onClick={() => openStatusActionModal('REVISE')}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition"
                  >
                    <XCircle className="w-4 h-4 text-rose-200" />
                    <span>Tolak & Terbitkan Surat Penolakan</span>
                  </button>
                </>
              )}

              {/* Link ke Fitur AI Pra-Harmonisasi */}
              <button
                type="button"
                onClick={() => router.visit('/ai')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFC800]" />
                <span>Uji Format Dokumen via AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* CATATAN / STATUS INFO BANNER */}
        {permohonan.keterangan && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs shadow-xs">
            <MessageSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-amber-950">Catatan Berkas:</p>
              <p className="font-semibold text-amber-900 mt-0.5 leading-relaxed">{permohonan.keterangan}</p>
            </div>
          </div>
        )}

        {/* 7 SLOT DOKUMEN SISTEM HARMONITAS DENGAN PROGRESS DUA TAHAP */}
        <div className="bg-white rounded-3xl border border-[#E2E2DC] shadow-sm p-6 space-y-5">
          <div className="border-b border-[#E2E2DC] pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-[#1A1A5E] flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#FFC800]" />
                <span>7 Slot Dokumen Berkas Harmonisasi & Fasilitasi</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Alur status berubah otomatis mengikuti kelengkapan dokumen yang diunggah oleh Tim Kerja Kanwil dan Biro Hukum.
              </p>
            </div>

            {/* Indikator Progres 2 Tahap */}
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-bold">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                isHarmonisasiComplete ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {isHarmonisasiComplete ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-2 h-2 rounded-full bg-blue-600" />}
                <span>Tahap I (Kanwil): <strong>{uploadedHarmonisasiCount}/5 Lengkap</strong></span>
              </div>

              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                isFasilitasiComplete ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-purple-50 text-purple-700 border-purple-200'
              }`}>
                {isFasilitasiComplete ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-2 h-2 rounded-full bg-purple-600" />}
                <span>Tahap II (Biro Hukum): <strong>{uploadedFasilitasiCount}/2 Lengkap</strong></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {jenisDokumens.map((slot) => {
              const doc = uploadedDocsMap[slot.jenis_dokumen_id];
              const isUploaded = Boolean(doc);
              const isFasilitasiSlot = slot.jenis_dokumen_id === 6 || slot.jenis_dokumen_id === 7;
              const isLockedForUpload = isFasilitasiSlot && !isHarmonisasiComplete;
              const canUpload = canUploadSlot(slot.jenis_dokumen_id) && !isLockedForUpload;
              const authInfo = getSlotAuthority(slot.jenis_dokumen_id);

              return (
                <div
                  key={slot.jenis_dokumen_id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isUploaded
                      ? 'bg-white border-emerald-200 shadow-xs'
                      : isLockedForUpload
                      ? 'bg-slate-100/70 border-dashed border-slate-300 opacity-90'
                      : 'bg-[#F8F8F5] border-dashed border-slate-300'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Header Slot */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#1A1A5E]/10 text-[#1A1A5E] font-black text-[11px] flex items-center justify-center shrink-0">
                        {slot.urutan}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        isUploaded 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : isLockedForUpload
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isUploaded ? 'Tersedia' : isLockedForUpload ? 'Terkunci' : 'Belum Ada'}
                      </span>
                    </div>

                    {/* Judul Slot */}
                    <div>
                      <h3 className="font-black text-xs text-[#1A1A5E] leading-snug">
                        {slot.nama_dokumen}
                      </h3>
                    </div>

                    {/* Keterangan Hak Akses & Kewenangan Slot */}
                    <div className={`p-2 rounded-xl border text-[10px] font-bold ${authInfo.badgeClass}`}>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${authInfo.dotColor}`} />
                        <span>Kewenangan: {authInfo.roleName}</span>
                      </div>
                      <p className="text-[9px] text-slate-500 font-medium mt-0.5 leading-tight">
                        {authInfo.authorityDesc}
                      </p>
                    </div>

                    {/* Info File Jika Terunggah */}
                    {isUploaded && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                        <p className="font-bold text-slate-800 truncate flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{doc.nama_file}</span>
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-0.5">
                          <span>Ukuran: {doc.ukuran_file || '-'}</span>
                          <span>Versi {doc.versi || 1}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Slot */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      {isUploaded && (
                        <>
                          {/* Tombol Lihat Dokumen Langsung di Web */}
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(doc)}
                            className="flex-1 py-1.5 px-2 rounded-xl bg-[#1A1A5E] text-white hover:bg-[#2C3154] text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-xs"
                            title="Buka Lembar Pratinjau Dokumen di Web"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#FFC800]" />
                            <span>Lihat</span>
                          </button>

                          {/* Tombol Unduh Berkas */}
                          <a
                            href={`/dokumen/${doc.dokumen_id}/download`}
                            className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px] font-bold transition flex items-center justify-center shadow-xs"
                            title="Unduh Berkas ke Komputer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </>
                      )}

                      {canUpload ? (
                        <button
                          type="button"
                          onClick={() => openUploadModal(slot)}
                          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
                            isUploaded
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              : 'flex-1 bg-[#1A1A5E] hover:bg-[#2C3154] text-white'
                          }`}
                        >
                          {isUploaded ? (
                            <>
                              <RefreshCw className="w-3 h-3" />
                              <span>Ganti</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5 text-[#FFC800]" />
                              <span>+ Unggah</span>
                            </>
                          )}
                        </button>
                      ) : (
                        !isUploaded && (
                          <div className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold text-center flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{authInfo.lockNotice}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TIMELINE & RIWAYAT AKTIVITAS (HUMANIZED BAHASA INDONESIA) */}
        <div className="bg-white rounded-3xl border border-[#E2E2DC] shadow-sm p-6 space-y-4">
          <div className="border-b border-[#E2E2DC] pb-3 flex items-center justify-between">
            <h2 className="text-sm font-black text-[#1A1A5E] flex items-center gap-2">
              <History className="w-4 h-4 text-[#FFC800]" />
              <span>Riwayat Aktivitas & Perjalanan Berkas</span>
            </h2>
            <span className="text-[11px] font-bold text-slate-400">
              {auditLogs.length} Catatan
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.length > 0 ? (
              auditLogs.map((log) => {
                const item = formatAuditItem(log);
                const IconComponent = item.icon;

                return (
                  <div key={log.id} className="py-3.5 flex items-start gap-3.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${item.iconClass}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${item.badgeClass}`}>
                            {item.badge}
                          </span>
                          <span className="font-extrabold text-[#1A1A5E] text-xs">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                          {log.created_at ? new Date(log.created_at).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : '-'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400 font-semibold py-4 text-center">
                Belum ada riwayat aktivitas yang tercatat untuk berkas ini.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* MODAL PREVIEW DOKUMEN INTERAKTIF DI WEB */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A1A5E]/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2E2DC] shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header Modal Preview */}
            <div className="bg-[#2C3154] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#383F6A] shrink-0">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-[#FFC800]/20 text-[#FFC800] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white truncate">{previewDoc.nama_file}</h3>
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
                  className="px-3 py-1.5 rounded-xl bg-[#FFD54F] hover:bg-[#FFC107] text-[#1A1A5E] text-xs font-black transition flex items-center gap-1.5 shadow-sm"
                  title="Unduh Berkas"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
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
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-black text-[#1A1A5E]">{previewDoc.nama_file}</h4>
                  <p className="text-xs text-slate-500 max-w-md mt-2 leading-relaxed">
                    Dokumen ini berformat <strong>Microsoft Word (.docx/.doc)</strong>. Anda dapat mengunduh berkas fisik untuk mengedit atau membukanya di komputer Anda.
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <a
                      href={`/dokumen/${previewDoc.dokumen_id}/download`}
                      className="px-5 py-2.5 rounded-xl bg-[#1A1A5E] text-white text-xs font-black hover:bg-[#2C3154] transition flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-[#FFC800]" />
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
              <span className="flex items-center gap-1 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Dokumen Resmi Terverifikasi Sistem HARMONITAS</span>
              </span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UNGGAH / GANTI DOKUMEN SLOT */}
      {activeUploadSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A5E]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2E2DC] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="bg-[#2C3154] text-white p-5 flex items-center justify-between border-b border-[#383F6A]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFC800]/20 text-[#FFC800] flex items-center justify-center font-black text-sm">
                  {activeUploadSlot.urutan}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">{activeUploadSlot.nama_dokumen}</h3>
                  <p className="text-[10px] text-slate-300 font-bold">
                    Slot #{activeUploadSlot.urutan} • {getSlotAuthority(activeUploadSlot.jenis_dokumen_id).roleName}
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
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-2">
                  Pilih File Berkas Dokumen <span className="text-rose-500">*</span>
                </label>

                {!uploadForm.data.file ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#1A1A5E] hover:bg-slate-50/70 rounded-2xl p-6 bg-[#F8F8F5] text-center transition cursor-pointer group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => uploadForm.setData('file', e.target.files[0])}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#1A1A5E] flex items-center justify-center mx-auto mb-2.5 shadow-xs group-hover:scale-105 transition">
                      <Upload className="w-6 h-6 text-[#1A1A5E]" />
                    </div>
                    <p className="text-xs font-black text-[#1A1A5E]">
                      Klik untuk memilih berkas dari komputer
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      atau seret dan lepas file Anda ke dalam kotak ini
                    </p>

                    <div className="flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-slate-200/60">
                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 text-[10px] font-black">.PDF</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black">.DOC</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black">.DOCX</span>
                      <span className="text-[10px] text-slate-400 font-bold ml-1">Maks. 25MB</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50/90 border-2 border-emerald-300 shadow-sm animate-in fade-in zoom-in duration-150">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                          <FileCheck className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[9px] font-black tracking-wide border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>BERKAS TELAH DILAMPIRKAN</span>
                            </span>
                          </div>
                          <p className="text-xs font-black text-[#1A1A5E] truncate" title={uploadForm.data.file.name}>
                            {uploadForm.data.file.name}
                          </p>
                          <p className="text-[10px] text-slate-600 font-bold mt-0.5">
                            Ukuran: {formatFileSize(uploadForm.data.file.size)} • Format: {uploadForm.data.file.name.split('.').pop()?.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                          title="Pilih Berkas Lain"
                        >
                          <RefreshCw className="w-3 h-3 text-slate-500" />
                          <span>Ganti</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => uploadForm.setData('file', null)}
                          className="p-1.5 rounded-xl bg-rose-100/80 border border-rose-200 hover:bg-rose-200 text-rose-700 transition"
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
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                  Catatan / Keterangan Dokumen (Opsional)
                </label>
                <input
                  type="text"
                  value={uploadForm.data.keterangan}
                  onChange={(e) => uploadForm.setData('keterangan', e.target.value)}
                  placeholder="Contoh: Hasil pembahasan rapat pleno pasal 12..."
                  className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveUploadSlot(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E2DC] text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!uploadForm.data.file || uploadForm.processing}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md ${
                    uploadForm.data.file && !uploadForm.processing
                      ? 'bg-[#1A1A5E] hover:bg-[#2C3154] text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-[#FFC800]" />
                  <span>{uploadForm.processing ? 'Mengunggah Berkas...' : 'Unggah Dokumen'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KEPUTUSAN BIRO HUKUM: TERIMA (SURAT PERSETUJUAN) ATAU TOLAK (SURAT PENOLAKAN) */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A5E]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2E2DC] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#2C3154] text-white p-5 flex items-center justify-between border-b border-[#383F6A]">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                  statusAction === 'APPROVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {statusAction === 'APPROVE' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    {statusAction === 'APPROVE' ? 'Persetujuan Hasil Fasilitasi (Selesai)' : 'Pengembalian Berkas Fasilitasi (Perlu Perbaikan)'}
                  </h3>
                  <p className="text-[10px] text-slate-300 font-bold">
                    Kewenangan Resmi Biro Hukum Sekretariat Daerah Provinsi Riau
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="p-6 space-y-4">
              <div className={`p-3.5 rounded-2xl border text-xs font-semibold leading-relaxed ${
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

              {/* Upload Surat Keputusan (Surat Penerimaan / Penolakan) */}
              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-2">
                  {statusAction === 'APPROVE' ? 'Lampiran Surat Hasil Fasilitasi / Persetujuan (Opsional)' : 'Lampiran Surat Penolakan / Pengembalian Berkas (Opsional)'}
                </label>

                {!statusForm.data.surat_file ? (
                  <div
                    onClick={() => suratDecisionInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#1A1A5E] hover:bg-slate-50/70 rounded-2xl p-4 bg-[#F8F8F5] text-center transition cursor-pointer group"
                  >
                    <input
                      type="file"
                      ref={suratDecisionInputRef}
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => statusForm.setData('surat_file', e.target.files[0])}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-[#1A1A5E] mx-auto mb-1.5 group-hover:scale-105 transition" />
                    <p className="text-xs font-black text-[#1A1A5E]">
                      {statusAction === 'APPROVE' ? 'Pilih file Surat Persetujuan (.PDF, .DOC, .DOCX)' : 'Pilih file Surat Penolakan (.PDF, .DOC, .DOCX)'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Maks. 25MB</p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                        <FileCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-200/80 px-1.5 py-0.5 rounded">
                          Surat Keputusan Terlampir
                        </span>
                        <p className="text-xs font-black text-[#1A1A5E] truncate mt-0.5" title={statusForm.data.surat_file.name}>
                          {statusForm.data.surat_file.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold">
                          {formatFileSize(statusForm.data.surat_file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => statusForm.setData('surat_file', null)}
                      className="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition"
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
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                  Catatan Telaah / Alasan Evaluasi {statusAction === 'REVISE' && <span className="text-rose-500">*</span>}
                </label>
                <textarea
                  required={statusAction === 'REVISE'}
                  rows={3}
                  value={statusForm.data.catatan}
                  onChange={(e) => statusForm.setData('catatan', e.target.value)}
                  placeholder={statusAction === 'APPROVE' ? "Contoh: Naskah telah selaras dengan peraturan perundang-undangan yang lebih tinggi." : "Contoh: Perlu penyesuaian pada Pasal 8 terkait tarif retribusi..."}
                  className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                />
              </div>

              {/* Tombol Aksi */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E2DC] text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={statusForm.processing}
                  className={`px-5 py-2.5 rounded-xl text-white text-xs font-black transition flex items-center gap-1.5 disabled:opacity-50 shadow-md ${
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
