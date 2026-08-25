import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
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
  Building,
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
  MapPin
} from 'lucide-react';

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
  userScope = {},
}) => {
  const { user, isTimKerja, isBiroHukum, isAdmin, isPimpinan } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Helper Formatter Riwayat Aktivitas yang Ramah Pengguna
  const formatAuditItem = (act) => {
    const action = act.action;
    const p = act.payload || {};
    const userName = act.user?.nama || 'Sistem';

    switch (action) {
      case 'CREATE_PERMOHONAN':
        return {
          icon: PlusCircle,
          badge: 'Daftar',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          title: `${userName} mendaftarkan permohonan`,
          desc: p.judul_rancangan || 'Rancangan regulasi baru.',
        };
      case 'UPLOAD_DOKUMEN':
        return {
          icon: Upload,
          badge: 'Unggah',
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
          title: `${userName} mengunggah berkas`,
          desc: `${p.nama_dokumen || 'Dokumen'} (Versi ${p.versi || 1})`,
        };
      case 'APPROVE_FASILITASI':
        return {
          icon: CheckCircle2,
          badge: 'Disetujui',
          badgeClass: 'bg-emerald-200 text-emerald-900 border-emerald-300 font-black',
          title: `Biro Hukum menyetujui fasilitasi`,
          desc: p.surat_terlampir ? `Surat: ${p.surat_terlampir}` : (p.catatan || 'Fasilitasi selesai tuntas.'),
        };
      case 'REJECT_FASILITASI':
        return {
          icon: XCircle,
          badge: 'Revisi',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200 font-black',
          title: `Biro Hukum mengembalikan berkas`,
          desc: p.catatan || 'Perlu perbaikan draf pasal.',
        };
      case 'CHANGE_PERATURAN_STATUS':
        return {
          icon: RefreshCw,
          badge: 'Status',
          badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
          title: `Status: ${p.to_status_name || 'Diperbarui'}`,
          desc: p.catatan ? `Catatan: ${p.catatan}` : 'Pembaruan tahapan berkas.',
        };
      case 'UPDATE_PERMOHONAN':
        return {
          icon: Edit3,
          badge: 'Ubah Data',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          title: `${userName} mengubah data regulasi`,
          desc: `Pembaruan data permohonan.`,
        };
      case 'PREVIEW_CONFIDENTIAL_DOKUMEN':
        return {
          icon: Eye,
          badge: 'Lihat',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          title: `${userName} melihat dokumen`,
          desc: p.nama_file || 'Pratinjau naskah di web.',
        };
      case 'DOWNLOAD_CONFIDENTIAL_DOKUMEN':
        return {
          icon: Download,
          badge: 'Unduh',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          title: `${userName} mengunduh berkas`,
          desc: p.nama_file || 'Unduh file fisik ke komputer.',
        };
      default:
        return {
          icon: History,
          badge: 'Aktivitas',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          title: `${userName} melakukan pembaruan`,
          desc: typeof p === 'string' ? p : (p.catatan || p.nama_dokumen || 'Aktivitas tercatat.'),
        };
    }
  };

  return (
    <AppLayout>
      <Head title="Dashboard - HARMONITAS" />

      <div className="space-y-5">
        {/* =========================================================================
            TOP METRIC CARDS GRID (RESTORED BELOVED STYLE WITH SKY BLUE & GREEN)
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Total Permohonan (Navy) */}
          <MetricCard
            title="Total Permohonan"
            value={metrics.total || 0}
            icon={FileText}
            variant="total"
            subtext="Permohonan terdaftar"
            onClick={() => router.visit('/peraturan')}
          />

          {/* Card 2: Proses Harmonisasi (Oranye / Kuning Emas) */}
          <MetricCard
            title="Proses Harmonisasi"
            value={metrics.harmonisasi || 0}
            icon={Clock}
            variant="harmonisasi"
            subtext="Tahap harmonisasi Kanwil"
            onClick={() => router.visit('/peraturan?status_id=2')}
          />

          {/* Card 3: Proses Fasilitasi (Biru Muda / Sky Blue) */}
          <MetricCard
            title="Proses Fasilitasi"
            value={metrics.fasilitasi || 0}
            icon={Search}
            variant="fasilitasi"
            subtext="Tahap fasilitasi Biro Hukum"
            onClick={() => router.visit('/peraturan?status_id=3')}
          />

          {/* Card 4: Selesai / Tuntas (Hijau / Emerald Green) */}
          <MetricCard
            title="Selesai / Tuntas"
            value={metrics.selesai || 0}
            icon={CheckCircle2}
            variant="selesai"
            subtext="Fasilitasi tuntas & terbit"
            onClick={() => router.visit('/peraturan?status_id=4')}
          />
        </div>

        {/* =========================================================================
            MAIN SECTION: PROGRES ALUR (COMPACT) + TUGAS & AKTIVITAS (COMPACT)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT COLUMN (7 COLS): PROGRES ALUR STATUS (COMPACT & SLEEK) */}
          <div className="lg:col-span-7 bg-[#FCFCF9] rounded-2xl border border-[#E2E2DC] p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b pb-3 border-[#E2E2DC]">
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#1A1A5E] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#FFC800]" />
                  <span>Progres Alur Regulasi Daerah</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {userScope.isTimKerja 
                    ? `Cakupan wilayah binaan: ${userScope.timKerjaNama || 'Tim Kerja'}`
                    : 'Distribusi permohonan aktif pada setiap tahapan alur kerja'}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold">
                ● Live Data
              </span>
            </div>

            <div className="space-y-2.5">
              {statusProgressItems.map((item) => {
                const percentage = totalBerkas > 0 ? Math.round((item.count / totalBerkas) * 100) : 0;

                return (
                  <div
                    key={item.label}
                    onClick={() => router.visit(`/peraturan?status_id=${item.status_id}`)}
                    className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/80 hover:border-[#1A1A5E]/40 hover:shadow-xs transition-all cursor-pointer space-y-1.5 group"
                    title={`Klik untuk menyaring berkas ${item.label}`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border ${item.badge}`}>
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium hidden sm:inline truncate">
                          • {item.desc}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className="text-[10px] text-slate-400 font-bold">{percentage}%</span>
                        <span className="font-mono font-black text-[#1A1A5E] px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-[11px]">
                          {item.count} Berkas
                        </span>
                      </div>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${item.color}`}
                        style={{ width: `${Math.max(percentage, item.count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SEBARAN WILAYAH BINAAN (SCOPED TO TIM KERJA) */}
            <div className="pt-3 border-t border-[#E2E2DC] space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#1A1A5E] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FFC800]" />
                  <span>{userScope.isTimKerja ? `Wilayah Binaan (${userScope.timKerjaNama})` : 'Sebaran Wilayah Kabupaten / Kota'}</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-400">
                  {wilayahStats.length} Wilayah
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {wilayahStats.map((w) => (
                  <div
                    key={w.kabupaten_id}
                    onClick={() => router.visit(`/peraturan?kabupaten_id=${w.kabupaten_id}`)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-[#1A1A5E]/40 transition cursor-pointer flex items-center justify-between gap-2 shadow-xs group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-black text-[#1A1A5E] truncate group-hover:text-blue-900">
                        {w.nama_kabupaten}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        <span className="text-emerald-700 font-bold">{w.selesai} Selesai</span> • {w.berjalan} Berjalan
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[#1A1A5E] font-mono font-black text-[11px] shrink-0">
                      {w.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (5 COLS): TUGAS & AKTIVITAS TERBARU (COMPACT & NEAT) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* TUGAS PERLU TINDAKAN (COMPACT) */}
            <div className="bg-[#FCFCF9] rounded-2xl border border-[#E2E2DC] p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b pb-2.5 border-[#E2E2DC]">
                <h3 className="text-xs font-black text-[#1A1A5E] flex items-center gap-1.5">
                  <BellRing className="w-3.5 h-3.5 text-[#FFC800]" />
                  <span>Tugas Perlu Tindakan</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400">Sesuai Peran</span>
              </div>

              <div className="space-y-2">
                {taskNotifications.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => router.visit(task.link)}
                    className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#1A1A5E]/40 transition cursor-pointer flex items-center justify-between gap-3 shadow-xs group"
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-[#1A1A5E] group-hover:text-blue-900 flex items-center gap-1">
                        <span className="truncate">{task.title}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                        {task.desc}
                      </p>
                    </div>
                    <span className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${task.color}`}>
                      {task.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AKTIVITAS BERKAS TERBARU (COMPACT TIMELINE FEED) */}
            <div className="bg-[#FCFCF9] rounded-2xl border border-[#E2E2DC] p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b pb-2.5 border-[#E2E2DC]">
                <h3 className="text-xs font-black text-[#1A1A5E] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#FFC800]" />
                  <span>Aktivitas Berkas Terbaru</span>
                </h3>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Live Feed
                </span>
              </div>

              <div className="space-y-2">
                {recentActivities.length > 0 ? (
                  recentActivities.map((act) => {
                    const formatted = formatAuditItem(act);

                    return (
                      <div
                        key={act.id}
                        onClick={() => act.target_id && router.visit(`/peraturan/${act.target_id}`)}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#1A1A5E]/40 transition cursor-pointer text-xs space-y-1 group shadow-xs"
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${formatted.badgeClass}`}>
                            {formatted.badge}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono font-medium">
                            {act.created_at ? new Date(act.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                          </span>
                        </div>
                        <p className="font-extrabold text-[#1A1A5E] text-[11px] truncate">
                          {formatted.title}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium truncate">
                          {formatted.desc}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[11px] text-slate-400 font-semibold py-3 text-center">
                    Belum ada riwayat aktivitas terbaru.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            BOTTOM SECTION: GRAFIK TREN BULANAN RIIL
            ========================================================================= */}
        <div className="bg-[#FCFCF9] rounded-2xl border border-[#E2E2DC] p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b pb-3 border-[#E2E2DC]">
            <div>
              <h3 className="text-sm font-black text-[#1A1A5E] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#FFC800]" />
                <span>Grafik Tren Pengajuan & Penyelesaian ({new Date().getFullYear()})</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Statistik jumlah berkas masuk, diproses, dan selesai per bulan
              </p>
            </div>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E2DC" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B', fontWeight: 700 }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A5E', borderRadius: '10px', border: '1px solid #383F6A', color: '#fff', fontSize: '11px', fontWeight: 600 }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontWeight: 700 }} />
                <Bar dataKey="Total Masuk" fill="#1A1A5E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Diproses" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Selesai" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default HomePage;
