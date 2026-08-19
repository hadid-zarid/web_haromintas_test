import React from "react";
import { Link } from "@inertiajs/react";
import PublicNavbar from "../components/layout/PublicNavbar";
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
  Scale,
  Layers3,
  UsersRound,
  FolderArchive,
  Eye,
} from "lucide-react";
import { INITIAL_PERATURAN, KABUPATEN_LIST } from "../mock/mockPeraturan";
import logoHarmonitas from "../assets/LOGO HARMONITAS.png";

export const LandingPage = () => {
  const totalPeraturan = INITIAL_PERATURAN.length;
  const totalKabupaten = KABUPATEN_LIST.length;
  const totalSelesai = INITIAL_PERATURAN.filter(
    (p) => p.status === "selesai",
  ).length;

  const workflowSteps = [
    {
      step: "01",
      title: "Input Dokumen",
      desc: "Tim Proja Kanwil mengunggah Draft Rancangan Peraturan & Analisa Konsepsi.",
      icon: FileSpreadsheet,
      cardClass: "border-indigo-800 bg-[#211d6f] text-white",
      badgeClass: "border-white/10 bg-white/10 text-amber-300",
      iconClass: "border-white/15 bg-white/10 text-amber-300",
      descClass: "text-indigo-100/80",
      dividerClass: "border-white/10 text-indigo-200",
      accentClass: "bg-amber-400",
      dotClass: "bg-amber-400",
    },
    {
      step: "02",
      title: "Pemeriksaan & Harmonisasi",
      desc: "Analisis pasal sandingan, rapat harmonisasi, dan penyusunan Surat Hasil Harmonisasi.",
      icon: SearchCheck,
      cardClass: "border-amber-200 bg-amber-50 text-slate-900",
      badgeClass: "border-amber-200 bg-amber-100 text-amber-800",
      iconClass: "border-amber-200 bg-white text-amber-600",
      descClass: "text-slate-600",
      dividerClass: "border-amber-200/80 text-amber-800",
      accentClass: "bg-amber-400",
      dotClass: "bg-amber-500",
    },
    {
      step: "03",
      title: "Fasilitasi Biro Hukum",
      desc: "Penelaahan komprehensif oleh Biro Hukum Provinsi dan penyesuaian akhir.",
      icon: FileCheck2,
      cardClass: "border-slate-200 bg-white text-slate-900",
      badgeClass: "border-slate-200 bg-slate-100 text-slate-600",
      iconClass: "border-slate-200 bg-slate-100 text-indigo-700",
      descClass: "text-slate-600",
      dividerClass: "border-slate-200 text-slate-600",
      accentClass: "bg-indigo-600",
      dotClass: "bg-indigo-600",
    },
    {
      step: "04",
      title: "Selesai & Pengarsipan",
      desc: "Penerbitan Surat Hasil Fasilitasi resmi & pengarsipan digital terintegrasi.",
      icon: CheckCircle2,
      cardClass: "border-emerald-200 bg-emerald-50 text-emerald-950",
      badgeClass: "border-emerald-200 bg-emerald-100 text-emerald-800",
      iconClass: "border-emerald-200 bg-white text-emerald-600",
      descClass: "text-emerald-800/80",
      dividerClass: "border-emerald-200 text-emerald-800",
      accentClass: "bg-emerald-500",
      dotClass: "bg-emerald-500",
    },
  ];

  const systemHighlights = [
    {
      title: "Proses Terintegrasi",
      desc: "Pengajuan, pemeriksaan, fasilitasi, dan pengarsipan berada dalam satu alur kerja.",
      icon: Layers3,
      iconClass: "bg-amber-400/15 text-amber-300 border-amber-400/20",
    },
    {
      title: "Kolaborasi Antarinstansi",
      desc: "Memudahkan koordinasi Tim Proja Kanwil dan Biro Hukum Provinsi pada setiap tahap.",
      icon: UsersRound,
      iconClass: "bg-indigo-400/15 text-indigo-200 border-indigo-400/20",
    },
    {
      title: "Dokumen Terpusat",
      desc: "Draft, hasil pemeriksaan, dan surat resmi tersimpan secara tertata dan mudah ditelusuri.",
      icon: FolderArchive,
      iconClass: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
    },
    {
      title: "Status Lebih Transparan",
      desc: "Perkembangan setiap berkas dapat dipantau berdasarkan tahapan prosesnya.",
      icon: Eye,
      iconClass: "bg-sky-400/15 text-sky-300 border-sky-400/20",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col text-slate-800">
      <PublicNavbar />

      {/* Hero Section */}
      <section
        id="beranda"
        className="relative bg-[#0f172a] text-white py-16 lg:py-24 border-b border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>
                  HARMONITAS - Harmonisasi dan Fasilitasi Ranperda dan
                  Ranperkada Tuntas
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                Penyederhanaan Proses Harmonisasi Ranperda & Ranperkada
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-medium">
                Aplikasi HARMONITAS (Harmonisasi dan Fasilitasi Ranperda dan
                Ranperkada Tuntas) dirancang khusus sebagai upaya
                menyederhanakan proses harmonisasi Rancangan Peraturan Daerah
                (Ranperda) dan Rancangan Peraturan Kepala Daerah (Ranperkada)
                secara terintegrasi dan tuntas.
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
                  <img
                    src={logoHarmonitas}
                    alt="Logo Harmonitas"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-3xl font-black text-white">
                    {totalPeraturan}+
                  </span>
                  <p className="text-xs text-slate-400 font-bold">
                    Total Berkas Permohonan Terdaftar
                  </p>
                </div>
              </div>

              <div className="bento-card-dark p-6 rounded-2xl flex items-center gap-4 text-white">
                <div className="p-3 bg-slate-800 text-slate-200 rounded-xl font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-3xl font-black text-white">
                    {totalKabupaten} Wilayah
                  </span>
                  <p className="text-xs text-slate-400 font-bold">
                    Kabupaten & Kota Terlayani
                  </p>
                </div>
              </div>

              <div className="bento-card-dark p-6 rounded-2xl flex items-center gap-4 text-white">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-3xl font-black text-white">
                    {totalSelesai} Berkas
                  </span>
                  <p className="text-xs text-slate-400 font-bold">
                    Fasilitasi Selesai & Terbit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Sistem Section */}
      <section
        id="tentang"
        className="relative scroll-mt-24 overflow-hidden border-b border-slate-200 bg-white py-20 sm:py-24"
      >
        <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-amber-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-indigo-700">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Tentang Sistem</span>
              </div>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
                Satu sistem untuk proses harmonisasi yang lebih tertata
              </h2>

              <div className="mt-5 space-y-4 text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
                <p>
                  <strong className="font-black text-slate-900">
                    HARMONITAS
                  </strong>{" "}
                  adalah sistem informasi yang mendukung proses harmonisasi dan
                  fasilitasi Rancangan Peraturan Daerah serta Rancangan
                  Peraturan Kepala Daerah secara terintegrasi.
                </p>
                <p>
                  Sistem ini membantu setiap pihak menjalankan proses dari
                  pengajuan dokumen, pemeriksaan, fasilitasi, hingga pengarsipan
                  hasil secara lebih terstruktur, transparan, dan mudah
                  ditelusuri.
                </p>
              </div>

              <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white text-amber-600 shadow-sm">
                    <Scale className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-800">
                      Tujuan Utama
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-700">
                      Mewujudkan proses harmonisasi produk hukum daerah yang
                      konsisten, terdokumentasi, dan memberikan kepastian pada
                      setiap tahapan.
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="#alur"
                className="mt-7 inline-flex items-center gap-2 text-sm font-black text-indigo-700 transition-colors hover:text-indigo-900"
              >
                <span>Pelajari alur kerja sistem</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-[30px] border border-slate-800 bg-[#0f172a] p-5 text-white shadow-[0_28px_80px_-35px_rgba(15,23,42,0.65)] sm:p-7">
                <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-indigo-600/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />

                <div className="relative mb-6 flex items-center gap-4 border-b border-white/10 pb-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-sm">
                    <img
                      src={logoHarmonitas}
                      alt="Logo Harmonitas"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-black tracking-tight text-white">
                      HARMONITAS
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-slate-400">
                      Harmonisasi Ranperda & Ranperkada Tuntas
                    </p>
                  </div>
                </div>

                <div className="relative grid gap-4 sm:grid-cols-2">
                  {systemHighlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 transition-colors duration-300 hover:bg-white/[0.085]"
                      >
                        <div
                          className={`${item.iconClass} flex h-10 w-10 items-center justify-center rounded-xl border`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <h3 className="mt-4 text-sm font-black text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs font-medium leading-relaxed text-slate-400">
                          {item.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Kerja Section Bento Grid */}
      <section
        id="alur"
        className="relative overflow-hidden bg-[#f8fafc] py-20 sm:py-24"
      >
        <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-amber-100/70 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-indigo-700 shadow-sm">
              <Scale className="h-3.5 w-3.5 text-amber-500" />
              <span>PASIH & E-Harmonisasi</span>
            </div>
            <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Alur Kerja Pengarsipan & Harmonisasi
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
              Empat tahap pemeriksaan yang terstruktur dan terstandarisasi untuk
              menjamin kepastian hukum produk peraturan daerah.
            </p>
          </div>

          <div className="rounded-[30px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.4)] backdrop-blur-sm sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="relative">
                    <article
                      className={`${step.cardClass} group relative flex h-full min-h-[270px] flex-col overflow-hidden rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                    >
                      <div
                        className={`absolute inset-x-0 top-0 h-1 ${step.accentClass}`}
                      />
                      <span className="pointer-events-none absolute -bottom-8 -right-1 text-[92px] font-black leading-none opacity-[0.045]">
                        {step.step}
                      </span>

                      <div className="relative flex items-center justify-between gap-4">
                        <span
                          className={`${step.badgeClass} inline-flex rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em]`}
                        >
                          Tahap {step.step}
                        </span>
                        <div
                          className={`${step.iconClass} flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-transform duration-300 group-hover:scale-105`}
                        >
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                      </div>

                      <div className="relative mt-7 flex-1">
                        <h3 className="text-lg font-black leading-snug tracking-tight">
                          {step.title}
                        </h3>
                        <p
                          className={`${step.descClass} mt-3 text-sm font-medium leading-relaxed`}
                        >
                          {step.desc}
                        </p>
                      </div>

                      <div
                        className={`${step.dividerClass} relative mt-6 flex items-center gap-2 border-t pt-4 text-[10px] font-black uppercase tracking-[0.15em]`}
                      >
                        <span
                          className={`${step.dotClass} h-2 w-2 rounded-full`}
                        />
                        <span>Proses {index + 1} dari 4</span>
                      </div>
                    </article>

                    {index < workflowSteps.length - 1 && (
                      <div className="absolute -right-[19px] top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-indigo-700 shadow-md lg:flex">
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer
        id="kontak"
        className="mt-auto bg-[#0f172a] text-white pt-12 pb-8 border-t border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800 text-xs">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                  <img
                    src={logoHarmonitas}
                    alt="Logo Harmonitas"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-black text-sm text-white">
                  HARMONITAS KEMENKUM
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-medium">
                Harmonisasi Ranperda dan Ranperkada Tuntas - Kantor Wilayah
                Kementerian Hukum dan HAM & Biro Hukum Setda Provinsi Riau.
              </p>
            </div>

            <div>
              <h4 className="font-black text-white text-sm mb-3">
                Kontak Layanan
              </h4>
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
              <h4 className="font-black text-white text-sm mb-3">
                Akses Cepat
              </h4>
              <ul className="space-y-2 text-slate-300 font-medium">
                <li>
                  <Link
                    to="/login"
                    className="hover:text-amber-400 transition-colors"
                  >
                    Login Petugas Kanwil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-amber-400 transition-colors"
                  >
                    Login Biro Hukum
                  </Link>
                </li>
                <li>
                  <a
                    href="#alur"
                    className="hover:text-amber-400 transition-colors"
                  >
                    Dokumentasi Alur Kerja
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 text-center text-[11px] text-slate-400 font-bold">
            © {new Date().getFullYear()} HARMONITAS Kanwil Kemenkum & Biro
            Hukum Riau. Seluruh Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;