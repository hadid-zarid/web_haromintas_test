import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/layout/PublicNavbar';
import {
  FileCheck2,
  SearchCheck,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  Building2,
  ShieldCheck,
  BookOpen,
  PhoneCall,
  Mail,
  MapPin,
  Scale
} from 'lucide-react';
import { INITIAL_PERATURAN, KABUPATEN_LIST } from '../mock/mockPeraturan';
import logoHarmonitas from '../assets/LOGO HARMONITAS.png';

export const LandingPage = () => {
  const totalPeraturan = INITIAL_PERATURAN.length;
  const totalKabupaten = KABUPATEN_LIST.length;
  const totalSelesai = INITIAL_PERATURAN.filter(p => p.status === 'selesai').length;

  const workflowSteps = [
    {
      step: '01',
      title: 'Input Dokumen',
      desc: 'Tim Proja Kanwil mengunggah Draft Rancangan Peraturan & Analisa Konsepsi.',
      icon: FileSpreadsheet,
      cardClass: 'bento-card-dark'
    },
    {
      step: '02',
      title: 'Pemeriksaan & Harmonisasi',
      desc: 'Analisis pasal sandingan, rapat harmonisasi, dan penyusunan Surat Hasil Harmonisasi.',
      icon: SearchCheck,
      cardClass: 'bento-card-amber'
    },
    {
      step: '03',
      title: 'Fasilitasi Biro Hukum',
      desc: 'Penelaahan komprehensif oleh Biro Hukum Provinsi dan penyesuaian akhir.',
      icon: FileCheck2,
      cardClass: 'bento-card-slate'
    },
    {
      step: '04',
      title: 'Selesai & Pengarsipan',
      desc: 'Penerbitan Surat Hasil Fasilitasi resmi & pengarsipan digital terintegrasi.',
      icon: CheckCircle2,
      cardClass: 'bento-card-emerald'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col text-slate-800">
      <PublicNavbar />

      {/* Hero Section */}
      <section id="beranda" className="relative bg-[#0f172a] text-white py-16 lg:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>HARMONITAS - Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                Penyederhanaan Proses Harmonisasi Ranperda & Ranperkada
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-medium">
                Aplikasi HARMONITAS (Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas) dirancang khusus sebagai upaya menyederhanakan proses harmonisasi Rancangan Peraturan Daerah (Ranperda) dan Rancangan Peraturan Kepala Daerah (Ranperkada) secara terintegrasi dan tuntas.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bento-btn-amber text-white font-black text-sm shadow-xs transition-all"
                >
                  <span>Masuk ke System Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#alur"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bento-btn-secondary text-slate-800 font-bold text-sm transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Lihat Alur Kerja</span>
                </a>
              </div>
            </div>

            {/* Quick Stats Bento Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
              <div className="bento-card-dark p-6 rounded-2xl flex items-center gap-4 text-white">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                  <img src={logoHarmonitas} alt="Logo Harmonitas" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-3xl font-black text-white">{totalPeraturan}+</span>
                  <p className="text-xs text-slate-400 font-bold">Total Berkas Permohonan Terdaftar</p>
                </div>
              </div>

              <div className="bento-card-dark p-6 rounded-2xl flex items-center gap-4 text-white">
                <div className="p-3 bg-slate-800 text-slate-200 rounded-xl font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-3xl font-black text-white">{totalKabupaten} Wilayah</span>
                  <p className="text-xs text-slate-400 font-bold">Kabupaten & Kota Terlayani</p>
                </div>
              </div>

              <div className="bento-card-dark p-6 rounded-2xl flex items-center gap-4 text-white">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-3xl font-black text-white">{totalSelesai} Berkas</span>
                  <p className="text-xs text-slate-400 font-bold">Fasilitasi Selesai & Terbit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Kerja Section Bento Grid */}
      <section id="alur" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Alur Kerja Pengarsipan & Harmonisasi (PASIH & E-Harmonisasi)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Proses pemeriksaan 4 tahap yang terstruktur dan terstandarisasi untuk menjamin kepastian hukum produk peraturan daerah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className={`${step.cardClass} bento-card-hover p-6 rounded-2xl space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black opacity-80 uppercase tracking-widest">TAHAP {step.step}</span>
                    <div className="p-2.5 rounded-xl bg-current opacity-20 text-current">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-black">{step.title}</h3>
                  <p className="text-xs leading-relaxed font-medium">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="kontak" className="mt-auto bg-[#0f172a] text-white pt-12 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800 text-xs">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                  <img src={logoHarmonitas} alt="Logo Harmonitas" className="w-full h-full object-contain" />
                </div>
                <span className="font-black text-sm text-white">HARMONITAS KEMENKUM</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-medium">
                Harmonisasi Ranperda dan Ranperkada Tuntas - Kantor Wilayah Kementerian Hukum dan HAM & Biro Hukum Setda Provinsi Riau.
              </p>
            </div>

            <div>
              <h4 className="font-black text-white text-sm mb-3">Kontak Layanan</h4>
              <ul className="space-y-2.5 text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>(022) 7208000 - Layanan Harmonisasi</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>harmonitas.kanwil@kemenkum.go.id</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Jl. Jend. Sudirman No.233, Kota Pekanbaru, Riau</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white text-sm mb-3">Akses Cepat</h4>
              <ul className="space-y-2 text-slate-300 font-medium">
                <li><Link to="/login" className="hover:text-amber-400 transition-colors">Login Petugas Kanwil</Link></li>
                <li><Link to="/login" className="hover:text-amber-400 transition-colors">Login Biro Hukum</Link></li>
                <li><a href="#alur" className="hover:text-amber-400 transition-colors">Dokumentasi Alur Kerja</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 text-center text-[11px] text-slate-400 font-bold">
            © {new Date().getFullYear()} HARMONITAS Kanwil Kemenkum & Biro Hukum Riau. Seluruh Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
