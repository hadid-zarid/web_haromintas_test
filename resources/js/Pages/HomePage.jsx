import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import MetricCard from '../components/common/MetricCard';
import ActivityDetailModal from '../components/modals/ActivityDetailModal';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  FileText,
  Clock,
  Search,
  CheckCircle2,
  TrendingUp,
  Activity,
  BellRing,
  Building2,
  Landmark,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  Layers,
  Upload,
  PlusCircle,
  RefreshCw,
  Edit3,
  Eye,
  Download,
  XCircle,
  History,
  MapPin,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Calendar,
  BookOpen,
  HelpCircle,
  Check,
  Bot
} from 'lucide-react';

/* Custom Compact & Clean Tooltip for Horizontal Recharts */
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-lg text-xs font-sans min-w-[170px] z-50">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
          <span className="font-bold text-[#2B3056] text-[11px]">
            Bulan {label}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            Rekap Bulanan
          </span>
        </div>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-600 font-medium">{entry.name}</span>
              </div>
              <span className="font-bold text-[#2B3056]">
                {entry.value} <span className="font-normal text-slate-400 text-[10px]">berkas</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const HomePage = ({
  metrics = {
    total: 0,
    draft: 0,
    harmonisasi: 0,
    fasilitasi: 0,
    selesai: 0,
    revisi: 0,
  },
  statusProgressItems = [],
  wilayahStats = [],
  taskNotifications = [],
  trendData = [],
  recentActivities = [],
  totalBerkas = 0,
  selectedYear = new Date().getFullYear(),
  availableYears = [],
  userScope = {},
}) => {
  const { user, isTimKerja, isBiroHukum, isAdmin, isPimpinan } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [wilayahSearch, setWilayahSearch] = useState('');

  // Semester Switcher for Trend Chart (1: Jan-Jun, 2: Jul-Des)
  const currentMonthIndex = new Date().getMonth(); // 0-based
  const [semester, setSemester] = useState(currentMonthIndex >= 6 ? 2 : 1);

  // Filter 6 bulan untuk bar chart horizontal
  const displayedTrendData = semester === 1
    ? trendData.slice(0, 6)
    : trendData.slice(6, 12);

  // Role display name helper
  const getRoleDisplayName = () => {
    if (userScope.isTimKerja) return userScope.timKerjaNama || 'Tim Kerja Kanwil';
    if (isBiroHukum) return 'Biro Hukum Provinsi Riau';
    if (isAdmin) return 'Administrator Sistem';
    if (isPimpinan) return 'Pimpinan Kanwil Kemenkum';
    return user?.role?.name || user?.unit || 'Operator Resmi';
  };

  // Helper Formatter Riwayat Aktivitas
  const formatAuditItem = (act) => {
    const action = act.action;
    const p = act.payload || {};
    const userName = act.user?.nama || act.user?.name || 'Sistem';

    switch (action) {
      case 'CREATE_PERMOHONAN':
        return {
          icon: PlusCircle,
          badge: 'Daftar',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/70',
          title: `${userName} mendaftarkan permohonan`,
          desc: p.judul_rancangan || 'Rancangan regulasi baru.',
        };
      case 'UPLOAD_DOKUMEN':
        return {
          icon: Upload,
          badge: 'Unggah',
          badgeClass: 'bg-blue-50 text-blue-800 border-blue-200/70',
          title: `${userName} mengunggah naskah`,
          desc: `${p.nama_dokumen || 'Dokumen'} (Versi ${p.versi || 1})`,
        };
      case 'APPROVE_FASILITASI':
        return {
          icon: CheckCircle2,
          badge: 'Disetujui',
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold',
          title: `Biro Hukum menyetujui fasilitasi`,
          desc: p.surat_terlampir ? `Surat: ${p.surat_terlampir}` : (p.catatan || 'Fasilitasi selesai tuntas.'),
        };
      case 'REJECT_FASILITASI':
        return {
          icon: XCircle,
          badge: 'Revisi',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-200/70 font-bold',
          title: `Biro Hukum mengembalikan berkas`,
          desc: p.catatan || 'Perlu perbaikan draf pasal.',
        };
      case 'CHANGE_PERATURAN_STATUS':
        return {
          icon: RefreshCw,
          badge: 'Status',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200/70',
          title: `Status: ${p.to_status_name || 'Diperbarui'}`,
          desc: p.catatan ? `Catatan: ${p.catatan}` : 'Pembaruan tahapan berkas.',
        };
      case 'UPDATE_PERMOHONAN':
        return {
          icon: Edit3,
          badge: 'Ubah Data',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/70',
          title: `${userName} memperbarui data`,
          desc: p.judul_rancangan || 'Pembaruan data permohonan.',
        };
      case 'PREVIEW_CONFIDENTIAL_DOKUMEN':
        return {
          icon: Eye,
          badge: 'Lihat',
          badgeClass: 'bg-slate-50 text-slate-600 border-slate-200/60',
          title: `${userName} melihat dokumen`,
          desc: p.nama_file || 'Pratinjau naskah hukum.',
        };
      case 'DOWNLOAD_CONFIDENTIAL_DOKUMEN':
        return {
          icon: Download,
          badge: 'Unduh',
          badgeClass: 'bg-slate-50 text-slate-600 border-slate-200/60',
          title: `${userName} mengunduh berkas`,
          desc: p.nama_file || 'Unduh file fisik berkas.',
        };
      case 'AUTH_LOGIN':
      case 'AUTH_LOGIN_GOOGLE':
        return {
          icon: ShieldCheck,
          badge: 'Masuk',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/70 font-bold',
          title: `${userName} masuk ke sistem`,
          desc: `Autentikasi akun ${p.role || 'petugas'} berhasil via ${action === 'AUTH_LOGIN_GOOGLE' ? 'Google OAuth' : 'Email/Password'}.`,
        };
      case 'AUTH_LOGOUT':
        return {
          icon: History,
          badge: 'Keluar',
          badgeClass: 'bg-slate-100 text-slate-600 border-slate-200/70 font-bold',
          title: `${userName} keluar dari sistem`,
          desc: 'Sesi akun resmi telah diakhiri.',
        };
      default:
        return {
          icon: History,
          badge: 'Berkas',
          badgeClass: 'bg-slate-50 text-slate-600 border-slate-200/60 font-bold',
          title: `${userName} memperbarui berkas`,
          desc: typeof p === 'string' ? p : (p.catatan || p.nama_dokumen || p.judul_rancangan || 'Pembaruan data permohonan harmonisasi.'),
        };
    }
  };

  const handleOpenActivityModal = (act) => {
    setSelectedActivity({
      id: act.id,
      action: act.action,
      user: act.user?.nama || act.user?.name || 'Sistem',
      role: act.user?.role?.name || 'Operator',
      timestamp: act.created_at ? new Date(act.created_at).toLocaleString('id-ID') : '-',
      regulationTitle: act.payload?.judul_rancangan || act.payload?.nama_dokumen || null,
      description: typeof act.payload === 'string' ? act.payload : JSON.stringify(act.payload, null, 2),
    });
  };

  // Filtered district list
  const filteredWilayah = wilayahStats.filter((w) =>
    w.nama_kabupaten.toLowerCase().includes(wilayahSearch.toLowerCase())
  );

  return (
    <AppLayout>
      <Head title="Dashboard - HARMONITAS" />

      <div className="space-y-6">

        {/* =========================================================================
            1. EXECUTIVE CONTEXT HEADER
            ========================================================================= */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs">
          {/* Subtle Top Pure Gold Accent Line */}
          <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FFD82B] via-[#FFC800] to-[#FFB943]" />

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#2B3056]/10 px-2.5 py-1 text-[11px] font-bold text-[#2B3056]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#B3912D]" />
                  {getRoleDisplayName()}
                </span>
                {/* "•" dan teks unit digabung jadi satu unit flex-wrap agar tidak pernah
                    ke-wrap terpisah (bullet nyasar sendirian di barisnya sendiri). */}
                <span className="inline-flex items-center gap-2 text-[11px] font-medium text-slate-500">
                  <span className="text-slate-400 hidden sm:inline">•</span>
                  Kanwil Kementerian Hukum Riau
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#2B3056]">
                Selamat Datang, {user?.nama || user?.name || 'Operator'}
              </h1>

              <p className="text-xs text-slate-500 font-normal max-w-2xl leading-relaxed">
                {userScope.isTimKerja
                  ? `Ruang kendali harmonisasi regulasi untuk cakupan ${userScope.timKerjaNama || 'Tim Kerja'}.`
                  : 'Pusat pemantauan dan kendali terpadu seluruh tahapan harmonisasi regulasi daerah di Provinsi Riau.'}
              </p>
            </div>

            {/* Quick Actions & Year Filter */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 xl:pt-0">
              {availableYears.length > 1 ? (
                <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 mr-1 border border-slate-200 shadow-2xs">
                  {availableYears.map(y => (
                    <button
                      key={y}
                      onClick={() => router.visit(`/home?tahun=${y}`)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${y === selectedYear
                          ? 'bg-white text-[#2B3056] shadow-sm ring-1 ring-slate-200/50'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs mr-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Tahun {selectedYear}</span>
                </div>
              )}

              <Link
                href="/panduan"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                <span>Panduan SOP</span>
              </Link>

              <Link
                href="/ai"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 text-xs font-bold text-[#2B3056] transition-colors shadow-2xs cursor-pointer"
              >
                <Bot className="h-3.5 w-3.5 text-[#B3912D]" />
                <span>Asisten AI</span>
              </Link>

              <Link
                href="/peraturan"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2B3056] hover:bg-[#3A4070] px-4 py-2 text-xs font-bold text-white transition-colors shadow-2xs cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5 text-[#FFD82B]" />
                <span>Lihat Semua Berkas</span>
                <ChevronRight className="h-3.5 w-3.5 text-white/70" />
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. REFINED 5 METRIC CARDS
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Total Permohonan"
            value={metrics.total || 0}
            icon={FileText}
            variant="total"
            subtext="Seluruh permohonan terdaftar"
            onClick={() => router.visit('/peraturan')}
          />

          <MetricCard
            title="Draf Awal"
            value={metrics.draft || 0}
            icon={FileText}
            variant="draft"
            subtext="Pra-Harmonisasi"
            onClick={() => router.visit('/peraturan?status_id=1')}
          />

          <MetricCard
            title="Dalam Harmonisasi"
            value={metrics.harmonisasi || 0}
            icon={Clock}
            variant="harmonisasi"
            subtext="Tahap telaah & rapat pleno Kanwil"
            onClick={() => router.visit('/peraturan?status_id=2')}
          />

          <MetricCard
            title="Dalam Fasilitasi"
            value={metrics.fasilitasi || 0}
            icon={Search}
            variant="fasilitasi"
            subtext="Tahap telaah Biro Hukum"
            onClick={() => router.visit('/peraturan?status_id=3')}
          />

          <MetricCard
            title="Selesai"
            value={metrics.selesai || 0}
            icon={CheckCircle2}
            variant="selesai"
            subtext="Harmonisasi & fasilitasi tuntas"
            onClick={() => router.visit('/peraturan?status_id=4')}
          />
        </div>

        {/* =========================================================================
            3. MIDDLE WORKSPACE: 2-COLUMN BALANCED GRID
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* =======================================================================
              LEFT COLUMN (7 COLS): PROGRES ALUR & SEBARAN WILAYAH
              ======================================================================= */}
          <div className="lg:col-span-7 space-y-6">

            {/* Card 1: Distribusi Tahapan Alur Harmonisasi */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-[#2B3056] flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#B3912D]" />
                    <span>Distribusi Tahapan Alur Harmonisasi</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {userScope.isTimKerja
                      ? `Cakupan wilayah: ${userScope.timKerjaNama || 'Tim Kerja'}`
                      : 'Distribusi permohonan aktif pada setiap tahapan SOP harmonisasi'}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[10px] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Data
                </span>
              </div>

              {/* Progress Stage Items */}
              <div className="space-y-2.5">
                {statusProgressItems.map((item) => {
                  const percentage = totalBerkas > 0 ? Math.round((item.count / totalBerkas) * 100) : 0;

                  return (
                    <div
                      key={item.label}
                      onClick={() => router.visit(`/peraturan?status_id=${item.status_id}`)}
                      className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-[#2B3056]/35 hover:shadow-2xs transition-all cursor-pointer space-y-2 group"
                      title={`Klik untuk melihat berkas ${item.label}`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${item.badge}`}>
                            {item.label}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline truncate">
                            • {item.desc}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="font-mono font-extrabold text-[#2B3056] px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs shadow-2xs group-hover:border-[#2B3056]/30 group-hover:bg-slate-50 transition-colors">
                            {item.count} Berkas
                          </span>
                        </div>
                      </div>

                      {/* Smooth Progress Bar */}
                      <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${item.color}`}
                          style={{ width: `${Math.max(percentage, item.count > 0 ? 6 : 0)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Sebaran Wilayah Binaan (13 Kab/Kota & Pemprov) */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3.5">
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-[#2B3056] flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#B3912D]" />
                    <span>Sebaran Wilayah Administrasi ({wilayahStats.length})</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {userScope.isTimKerja
                      ? `Wilayah binaan ${userScope.timKerjaNama}`
                      : 'Distribusi permohonan regulasi di seluruh Kabupaten / Kota se-Riau'}
                  </p>
                </div>

                {/* Quick Search */}
                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari daerah..."
                    value={wilayahSearch}
                    onChange={(e) => setWilayahSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs font-semibold text-[#2B3056] bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD82B] transition-all"
                  />
                </div>
              </div>

              {/* District Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredWilayah.length > 0 ? (
                  filteredWilayah.map((w) => (
                    <div
                      key={w.kabupaten_id}
                      onClick={() => router.visit(`/peraturan?kabupaten_id=${w.kabupaten_id}`)}
                      className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:bg-white hover:border-[#2B3056]/35 hover:shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-2.5 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 group-hover:bg-[#2B3056] group-hover:text-[#FFD82B] transition-colors">
                          {w.nama_kabupaten.toLowerCase().includes('provinsi') ? (
                            <Landmark className="h-3.5 w-3.5" />
                          ) : w.nama_kabupaten.toLowerCase().includes('kota') ? (
                            <Building2 className="h-3.5 w-3.5" />
                          ) : (
                            <MapPin className="h-3.5 w-3.5" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#2B3056] truncate group-hover:text-[#3A4070]">
                            {w.nama_kabupaten}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            <span className="text-emerald-700 font-bold">{w.selesai} Selesai</span> • <span className="text-slate-600">{w.berjalan} Berjalan</span>
                          </p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[#2B3056] font-mono font-extrabold text-xs shrink-0 shadow-2xs">
                        {w.total}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-8 text-center text-xs text-slate-400 font-medium">
                    Tidak ada wilayah yang cocok dengan pencarian "{wilayahSearch}".
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* =======================================================================
              RIGHT COLUMN (5 COLS): PRIORITY ACTIONS, AUDIT FEED & SOP CARD
              ======================================================================= */}
          <div className="lg:col-span-5 space-y-6">

            {/* Card 1: Tugas Perlu Tindakan (Action Hub) */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B3056] flex items-center gap-2">
                  <BellRing className="h-4 w-4 text-[#B3912D]" />
                  <span>Tugas Perlu Tindakan</span>
                </h3>
                <span className="rounded-md bg-amber-50 border border-amber-200/70 px-2 py-0.5 text-[9.5px] font-bold text-amber-800">
                  Prioritas Peran
                </span>
              </div>

              <div className="space-y-2.5">
                {taskNotifications.length > 0 ? (
                  taskNotifications.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => router.visit(task.link)}
                      className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:border-[#2B3056]/35 hover:shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#2B3056] group-hover:text-[#3A4070] flex items-center gap-1.5">
                          <span className="truncate">{task.title}</span>
                          <ArrowRight className="h-3 w-3 text-[#B3912D] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </h4>
                        <p className="text-[10.5px] text-slate-500 font-medium line-clamp-2 mt-0.5 leading-relaxed">
                          {task.desc}
                        </p>
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2B3056] text-[#FFD82B] font-extrabold text-xs shrink-0 shadow-xs">
                        {task.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400 font-medium">
                    Semua permohonan terkini telah tertangani.
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: Aktivitas Berkas Terbaru (Live Audit Timeline Feed) */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B3056] flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#B3912D]" />
                  <span>Aktivitas Berkas Terbaru</span>
                </h3>
                <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[9.5px] font-bold text-slate-600">
                  Live Feed
                </span>
              </div>

              <div className="space-y-2.5">
                {recentActivities.length > 0 ? (
                  recentActivities.map((act) => {
                    const formatted = formatAuditItem(act);

                    return (
                      <div
                        key={act.id}
                        onClick={() => handleOpenActivityModal(act)}
                        className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:bg-white hover:border-[#2B3056]/35 hover:shadow-2xs transition-all cursor-pointer text-xs space-y-1.5 group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-bold uppercase border ${formatted.badgeClass}`}>
                            {formatted.badge}
                          </span>
                          <span className="text-[9.5px] text-slate-400 font-mono font-medium">
                            {act.created_at ? new Date(act.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                          </span>
                        </div>

                        <p className="font-bold text-[#2B3056] text-[11.5px] truncate group-hover:text-[#3A4070]">
                          {formatted.title}
                        </p>

                        <p className="text-[10.5px] text-slate-500 font-medium truncate">
                          {formatted.desc}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 font-medium py-6 text-center">
                    Belum ada riwayat aktivitas terbaru.
                  </p>
                )}
              </div>
            </div>

            {/* Card 3: Quick SOP & Technical Assistance Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-white p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2B3056] text-[#FFD82B] shadow-2xs">
                  <BookOpen className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#2B3056]">Panduan & SOP Harmonisasi</h4>
                  <p className="text-[10.5px] text-slate-500">Standar operasional resmi Kanwil Kemenkum Riau</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 font-normal leading-relaxed">
                Pelajari alur pendaftaran naskah rancangan, telaah dokumen 1-5, rapat pleno harmonisasi, hingga fasilitasi Biro Hukum.
              </p>

              <div className="pt-1 flex items-center justify-between border-t border-slate-200/60 text-xs">
                <Link
                  href="/panduan"
                  className="font-bold text-[#2B3056] hover:text-[#3A4070] inline-flex items-center gap-1 hover:underline text-[11.5px]"
                >
                  <span>Buka Buku Panduan</span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#B3912D]" />
                </Link>

                <span className="text-[10px] text-slate-400 font-medium">
                  Versi 2.4 Digital
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================================
            4. BOTTOM SECTION: FULL-WIDTH HORIZONTAL CARD FOR BAR CHART TREND
            ========================================================================= */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4">

          {/* Header with 6-Month Period Toggle and Total */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3.5">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-[#2B3056] flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#B3912D]" />
                <span>Tren Selesai Harmonisasi dan Fasilitasi ({new Date().getFullYear()})</span>
              </h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Diagram batang vertikal rekapitulasi permohonan masuk, draf awal, proses harmonisasi, proses fasilitasi, dan selesai tuntas
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 border border-slate-200/60">
                Total: {metrics.total || 0} Berkas
              </span>

              {/* 6-Month Semester Slider Controls */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setSemester(1)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${semester === 1
                    ? 'bg-white text-[#2B3056] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                  title="Tampilkan Semester 1 (Januari - Juni)"
                >
                  <ChevronLeft className="h-3 w-3" />
                  <span>Jan - Jun</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSemester(2)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${semester === 2
                    ? 'bg-white text-[#2B3056] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                  title="Tampilkan Semester 2 (Juli - Desember)"
                >
                  <span>Jul - Des</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Full-Width Vertical Bar Chart */}
          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={displayedTrendData}
                margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                barGap={3}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="bulan"
                  tick={{ fontSize: 11.5, fill: '#2B3056', fontWeight: 700 }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(43, 48, 86, 0.04)', radius: 6 }} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontWeight: 600 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar dataKey="Total Permohonan" fill="#2B3056" radius={[4, 4, 0, 0]} maxBarSize={18} />
                <Bar dataKey="Draf Awal" fill="#64748B" radius={[4, 4, 0, 0]} maxBarSize={18} />
                <Bar dataKey="Proses Harmonisasi" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={18} />
                <Bar dataKey="Proses Fasilitasi" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={18} />
                <Bar dataKey="Selesai" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Footer Period Note */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>
              Menampilkan periode <strong>Semester {semester} ({semester === 1 ? 'Januari – Juni' : 'Juli – Desember'} {new Date().getFullYear()})</strong>. Klik tombol di atas untuk beralih semester.
            </span>
            <span className="font-semibold text-slate-600">
              Sinkronisasi Real-Time
            </span>
          </div>

        </div>

      </div>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        isOpen={Boolean(selectedActivity)}
        onClose={() => setSelectedActivity(null)}
        activity={selectedActivity}
      />
    </AppLayout>
  );
};

export default HomePage;
