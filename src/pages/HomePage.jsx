import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePeraturan } from '../context/PeraturanContext';
import AppLayout from '../components/layout/AppLayout';
import MetricCard from '../components/common/MetricCard';
import RoleBadge from '../components/common/RoleBadge';
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
  Sparkles,
  BellRing
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const { role: currentRole } = useAuth();
  const { peraturanList, activityLogs } = usePeraturan();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const navigate = useNavigate();

  // Role Data Filter Logic
  const filteredData = useMemo(() => {
    if (['Proja 1', 'Proja 2', 'Proja 3'].includes(currentRole)) {
      return peraturanList.filter(d => d.proja === currentRole);
    }
    return peraturanList;
  }, [peraturanList, currentRole]);

  // Dynamic Metric calculation
  const metrics = useMemo(() => {
    const total = filteredData.length;
    const proses = filteredData.filter(d => d.status === 'proses' || d.status === 'draft').length;
    const analsis = filteredData.filter(d => d.status === 'harmonisasi' || d.status === 'fasilitasi').length;
    const selesai = filteredData.filter(d => d.status === 'selesai').length;

    return { total, proses, analsis, selesai };
  }, [filteredData]);

  // Bottleneck process items calculation
  const bottleneckItems = useMemo(() => {
    const permohonanMasuk = filteredData.length;
    const sudahDivalidasi = filteredData.filter(d => d.status !== 'draft').length;
    const sudahDisposisi = filteredData.filter(d => d.status === 'harmonisasi' || d.status === 'fasilitasi' || d.status === 'selesai').length;
    const belumPenanggungJawab = filteredData.filter(d => d.status === 'draft').length;
    const sedangDianalisis = filteredData.filter(d => d.status === 'harmonisasi').length;
    const menungguPersetujuanKadiv = filteredData.filter(d => d.status === 'fasilitasi').length;
    const fasilitasiSelesai = filteredData.filter(d => d.status === 'selesai').length;

    return [
      { label: 'Permohonan Masuk', count: permohonanMasuk, max: Math.max(permohonanMasuk, 1) },
      { label: 'Sudah Divalidasi', count: sudahDivalidasi, max: Math.max(permohonanMasuk, 1) },
      { label: 'Sudah Disposisi', count: sudahDisposisi, max: Math.max(permohonanMasuk, 1) },
      { label: 'Belum Ada Penanggung Jawab', count: belumPenanggungJawab, max: Math.max(permohonanMasuk, 1) },
      { label: 'Sedang Dianalisis', count: sedangDianalisis, max: Math.max(permohonanMasuk, 1) },
      { label: 'Menunggu Persetujuan Kepala Divisi P3H', count: menungguPersetujuanKadiv, max: Math.max(permohonanMasuk, 1) },
      { label: 'Fasilitasi Selesai', count: fasilitasiSelesai, max: Math.max(permohonanMasuk, 1) }
    ];
  }, [filteredData]);

  // Task notifications counts
  const pendingValidationCount = filteredData.filter(d => d.status === 'draft').length;
  const pendingDisposisiCount = filteredData.filter(d => d.status === 'proses').length;

  // Monthly trend chart data
  const trendData = [
    { bulan: 'Jan', Selesai: 4, Harmonisasi: 2, Diproses: 3 },
    { bulan: 'Feb', Selesai: 6, Harmonisasi: 4, Diproses: 2 },
    { bulan: 'Mar', Selesai: 5, Harmonisasi: 3, Diproses: 4 },
    { bulan: 'Apr', Selesai: 8, Harmonisasi: 5, Diproses: 3 },
    { bulan: 'Mei', Selesai: 7, Harmonisasi: 6, Diproses: 2 },
    { bulan: 'Jun', Selesai: 9, Harmonisasi: 4, Diproses: 5 },
    { bulan: 'Jul', Selesai: 11, Harmonisasi: 7, Diproses: 3 },
    { bulan: 'Agu', Selesai: metrics.selesai, Harmonisasi: metrics.analsis, Diproses: metrics.proses }
  ];

  const recentActivities = activityLogs.slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top 4 Glassmorphic Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Permohonan"
            value={metrics.total}
            icon={FileText}
            variant="total"
            subtext="Permohonan terdaftar"
          />
          <MetricCard
            title="Sedang Diproses"
            value={metrics.proses}
            icon={Clock}
            variant="proses"
            subtext="Tahap verifikasi awal"
          />
          <MetricCard
            title="Sedang Dianalisis"
            value={metrics.analsis}
            icon={Search}
            variant="analisis"
            subtext="Harmonisasi & fasilitasi"
          />
          <MetricCard
            title="Selesai"
            value={metrics.selesai}
            icon={CheckCircle2}
            variant="selesai"
            subtext="Fasilitasi terbit"
          />
        </div>

        {/* Flat Design 2.0 Bottleneck & Task Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Bottleneck Widget Flat 2.0 */}
          <div className="lg:col-span-7 flat-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b pb-4 border-[#E2E2DC]">
              <div>
                <h3 className="text-base font-black text-[#1A1A5E]">Grafik Bottleneck Proses</h3>
                <p className="text-xs text-[#3D3D3A]/70 mt-0.5 font-semibold">
                  Grafik ini menunjukkan distribusi permohonan untuk mendeteksi hambatan proses
                </p>
              </div>
              <span className="p-2 bg-[#EAEAE2] text-[#1A1A5E] rounded-lg">
                <Sparkles className="w-4 h-4 text-[#1A1A5E]" />
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {bottleneckItems.map((item) => {
                const percentage = Math.round((item.count / item.max) * 100) || 0;
                return (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#3D3D3A]">
                      <span>{item.label}</span>
                      <span className="font-mono font-black text-[#1A1A5E] bg-[#EAEAE2] border border-[#D5D5CE] px-2 py-0.5 rounded-md">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full bg-[#EAEAE2] rounded-full h-3 overflow-hidden border border-[#D5D5CE]">
                      <div
                        className="bg-[#1A1A5E] h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(percentage, item.count > 0 ? 6 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Task Notifications Widget Flat 2.0 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flat-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-[#E2E2DC]">
                <div>
                  <h3 className="text-base font-black text-[#1A1A5E] flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-[#1A1A5E]" />
                    Notifikasi Tugas
                  </h3>
                  <p className="text-xs text-[#3D3D3A]/70 mt-0.5 font-semibold">
                    Berikut tugas yang menjadi tanggung jawab Anda
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Task Item 1 */}
                <div className="p-4 rounded-xl flat-card-hover border border-[#E2E2DC] flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#1A1A5E]">Validasi permohonan masuk</h4>
                    <p className="text-[11px] text-[#3D3D3A]/80 leading-relaxed font-semibold">
                      Permohonan berstatus diajukan/revisi menunggu validasi dan disposisi
                    </p>
                  </div>
                  <span className="w-7 h-7 rounded-full bg-[#FFC800] text-[#1A1A5E] font-black text-xs flex items-center justify-center shrink-0">
                    {pendingValidationCount}
                  </span>
                </div>

                {/* Task Item 2 */}
                <div className="p-4 rounded-xl flat-card-hover border border-[#E2E2DC] flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#1A1A5E]">Lanjutkan disposisi permohonan diterima</h4>
                    <p className="text-[11px] text-[#3D3D3A]/80 leading-relaxed font-semibold">
                      Permohonan diterima namun belum didisposisikan ke Kadiv
                    </p>
                  </div>
                  <span className="w-7 h-7 rounded-full bg-[#FFC800] text-[#1A1A5E] font-black text-xs flex items-center justify-center shrink-0">
                    {pendingDisposisiCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Feed Widget Flat 2.0 */}
            <div className="flat-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-[#E2E2DC]">
                <h3 className="text-xs font-black text-[#1A1A5E] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#1A1A5E]" />
                  Aktivitas Terbaru
                </h3>
                <span className="text-[10px] font-bold flat-badge-navy">
                  Live Feed
                </span>
              </div>

              <div className="space-y-2">
                {recentActivities.map((act) => (
                  <div
                    key={act.id}
                    onClick={() => setSelectedActivity(act)}
                    className="p-3 flat-card-hover rounded-lg border border-[#E2E2DC] cursor-pointer text-xs group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-[#1A1A5E] group-hover:text-[#2E3A87] transition-colors">
                        {act.user}
                      </span>
                      <span className="text-[10px] text-[#3D3D3A]/60 font-mono font-medium">{act.timestamp}</span>
                    </div>
                    <p className="text-[#3D3D3A] font-semibold">{act.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Recharts Section Flat 2.0 */}
        <div className="flat-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-4 border-[#E2E2DC]">
            <div>
              <h3 className="text-base font-black text-[#1A1A5E] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#1A1A5E]" />
                Grafik Tren Pengarsipan Bulanan (2024)
              </h3>
              <p className="text-xs text-[#3D3D3A]/70 font-semibold">Statistik jumlah permohonan diselesaikan vs diproses</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E2DC" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#3D3D3A', fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 11, fill: '#3D3D3A', fontWeight: 600 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A5E', borderRadius: '8px', border: '1px solid #2E3A87', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontWeight: 600 }} />
                <Bar dataKey="Selesai" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Harmonisasi" fill="#2E3A87" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Diproses" fill="#1A1A5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        activity={selectedActivity}
      />
    </AppLayout>
  );
};

export default HomePage;
