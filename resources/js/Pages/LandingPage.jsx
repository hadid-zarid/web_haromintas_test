import React from "react";
import { Link } from "@inertiajs/react";
import PublicNavbar from "../components/layout/PublicNavbar";
import {
  FileCheck2,
  SearchCheck,
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
  Eye,
  Sparkles,
  Bot,
  ChevronRight,
} from "lucide-react";
import { INITIAL_PERATURAN, KABUPATEN_LIST } from "../mock/mockPeraturan";
import logoHarmonitas from "../assets/LOGO HARMONITAS.png";

export const LandingPage = () => {
  const totalPeraturan = INITIAL_PERATURAN.length;
  const totalKabupaten = KABUPATEN_LIST.length;
  const totalSelesai = INITIAL_PERATURAN.filter(
    (p) => p.status === "selesai",
  ).length;

  const valuePillars = [
    { label: "Sinergi Terintegrasi" },
    { label: "Proses Efisien" },
    { label: "Regulasi Berkualitas" },
    { label: "#RiauBedelau", isHashtag: true },
  ];

  const pokjaList = [
    {
      pokja: "POKJA 1",
      badge: "bg-blue-100 text-blue-800 border-blue-200",
      accent: "border-l-blue-600",
      wilayah: [
        "Pemerintah Provinsi Riau",
        "Kabupaten Siak",
        "Kabupaten Kampar",
        "Kabupaten Indragiri Hilir",
        "Kabupaten Bengkalis",
      ],
    },
    {
      pokja: "POKJA 2",
      badge: "bg-amber-100 text-amber-800 border-amber-200",
      accent: "border-l-amber-500",
      wilayah: [
        "Kabupaten Rokan Hulu",
        "Kabupaten Indragiri Hulu",
        "Kabupaten Kepulauan Meranti",
        "Kota Dumai",
      ],
    },
    {
      pokja: "POKJA 3",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      accent: "border-l-emerald-600",
      wilayah: [
        "Kabupaten Kuantan Singingi",
        "Kabupaten Pelalawan",
        "Kabupaten Rokan Hilir",
        "Kota Pekanbaru",
      ],
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Input & AI Pra-Harmonisasi",
      desc: "Tim Pokja Kanwil mengunggah Draf Regulasi. Asisten AI memindai kesesuaian format dan teknik perundang-undangan (UU 12/2011 & UU 13/2022).",
      icon: Bot,
      badgeClass: "border-amber-200 bg-amber-50 text-amber-800",
      iconClass: "border-amber-200 bg-amber-100/80 text-amber-700",
      accentClass: "bg-amber-500",
    },
    {
      step: "02",
      title: "Rapat Pleno Harmonisasi",
      desc: "Pelaksanaan rapat pembahasan bersama pemrakarsa daerah dan perancang peraturan, kemudian Pokja mengunggah dokumen luaran resmi.",
      icon: SearchCheck,
      badgeClass: "border-blue-200 bg-blue-50 text-blue-800",
      iconClass: "border-blue-200 bg-blue-100/80 text-blue-700",
      accentClass: "bg-blue-600",
    },
    {
      step: "03",
      title: "Validasi Biro / Bagian Hukum",
      desc: "Biro Hukum Pemprov atau Bagian Hukum Pemkab/Pemkot menerima notifikasi, menelaah naskah hasil rapat, dan memberikan keputusan akhir.",
      icon: FileCheck2,
      badgeClass: "border-purple-200 bg-purple-50 text-purple-800",
      iconClass: "border-purple-200 bg-purple-100/80 text-purple-700",
      accentClass: "bg-purple-600",
    },
    {
      step: "04",
      title: "Disetujui (Tuntas) & Arsip",
      desc: "Berkas disetujui, status berubah menjadi Tuntas, dan seluruh naskah final tersimpan dalam repositori arsip digital terintegrasi.",
      icon: CheckCircle2,
      badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
      iconClass: "border-emerald-200 bg-emerald-100/80 text-emerald-700",
      accentClass: "bg-emerald-600",
    },
  ];

  const systemHighlights = [
    {
      title: "Sinergi Terintegrasi",
      desc: "Menghubungkan secara langsung Kanwil Kemenkumham Riau dengan Biro Hukum Pemprov dan Bagian Hukum Kab/Kota.",
      icon: Layers3,
      iconClass: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Proses Efisien & Terpadu",
      desc: "Pengajuan berkas, telaah AI, rapat pleno, validasi respon, hingga penerbitan surat selesai dalam satu alur terstruktur.",
      icon: UsersRound,
      iconClass: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "AI Legal Drafting Checker",
      desc: "Asisten cerdas pendeteksi format naskah hukum, hierarki konsiderans, dan konsistensi pasal berdasarkan UU 12/2011.",
      icon: Sparkles,
      iconClass: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Regulasi Berkualitas & Akuntabel",
      desc: "Menjamin produk hukum daerah selaras dengan peraturan yang lebih tinggi dan dapat dipantau perkembangannya secara transparan.",
      icon: Eye,
      iconClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col selection:bg-amber-400 selection:text-slate-950 font-sans antialiased">
      {/* Sticky Navbar */}
      <PublicNavbar />

      {/* Hero Section — FULL SCREEN DONKER / DARK NAVY */}
      <section
        id="beranda"
        className="relative min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex flex-col justify-between bg-[#0f172a] text-white pt-10 sm:pt-14 pb-6 sm:pb-8 overflow-hidden border-b border-slate-800"
      >
        {/* Ambient Glows & Wave Elements */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
        <div className="pointer-events-none absolute -top-24 left-1/3 w-[600px] h-[350px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-12 right-10 w-[400px] h-[280px] bg-amber-500/10 rounded-full blur-[100px]" />

        {/* Main Hero Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge Identitas */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-800/90 border border-slate-700/80 text-amber-400 text-xs font-bold shadow-sm backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="tracking-wide">
                  HARMONITAS • KANWIL KEMENTERIAN HUKUM RIAU
                </span>
              </div>

              {/* Judul Utama Banner */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white">
                  HARMONITAS
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-400 tracking-tight leading-snug">
                  Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas
                </h2>
              </div>

              {/* Kalimat Deskripsi Sesuai Banner */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                Mewujudkan sinergi terintegrasi untuk regulasi daerah yang berkualitas, efektif, dan berdaya guna.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Masuk ke System Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#tentang"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm transition-all hover:text-white"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Pelajari Alur Kerja</span>
                </a>
              </div>
            </div>

            {/* Right Bento Stats Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
              {/* Card 1: Total Permohonan */}
              <div className="bg-slate-800/80 border border-slate-700/80 backdrop-blur-md p-5 rounded-2xl flex items-center gap-4 text-white hover:border-amber-400/40 transition-all shadow-md">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm p-1 overflow-hidden shrink-0">
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
                  <p className="text-xs text-slate-300 font-bold">
                    Total Berkas Permohonan Terdaftar
                  </p>
                  <span className="text-[10px] text-amber-400 font-semibold">Ranperda & Ranperkada</span>
                </div>
              </div>

              {/* Card 2: 13 Wilayah */}
              <div className="bg-slate-800/80 border border-slate-700/80 backdrop-blur-md p-5 rounded-2xl flex items-center gap-4 text-white hover:border-blue-400/40 transition-all shadow-md">
                <div className="p-3 bg-slate-700/80 text-blue-300 rounded-xl font-bold border border-slate-600 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-3xl font-black text-white">
                    {totalKabupaten} Wilayah
                  </span>
                  <p className="text-xs text-slate-300 font-bold">
                    1 Pemprov & 12 Pemkab/Pemkot Terlayani
                  </p>
                  <span className="text-[10px] text-blue-400 font-semibold">Dibina oleh 3 Pokja Kanwil Riau</span>
                </div>
              </div>

              {/* Card 3: Berkas Tuntas */}
              <div className="bg-slate-800/80 border border-slate-700/80 backdrop-blur-md p-5 rounded-2xl flex items-center gap-4 text-white hover:border-emerald-400/40 transition-all shadow-md">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl font-bold border border-emerald-500/30 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-3xl font-black text-white">
                    {totalSelesai} Berkas
                  </span>
                  <p className="text-xs text-slate-300 font-bold">
                    Fasilitasi Selesai & Tuntas
                  </p>
                  <span className="text-[10px] text-emerald-400 font-semibold">Validasi Resmi Biro Hukum</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Pillars Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 relative z-10">
          <div className="border-t border-slate-800/80 pt-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center">
              {valuePillars.map((item, idx) => (
                <div
                  key={item.label}
                  className="flex items-center justify-center gap-3 text-xs sm:text-sm font-bold tracking-wide"
                >
                  <span
                    className={
                      item.isHashtag
                        ? "text-amber-400 font-black tracking-wider"
                        : "text-slate-300 hover:text-white transition-colors"
                    }
                  >
                    {item.label}
                  </span>
                  {idx < valuePillars.length - 1 && (
                    <span className="hidden md:inline-block text-slate-700">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Sistem Section (LIGHT THEME) */}
      <section
        id="tentang"
        className="relative scroll-mt-24 overflow-hidden border-b border-slate-200 bg-white py-20 sm:py-24"
      >
        <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-amber-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-indigo-700">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Tentang Sistem</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-slate-900">
                Satu Sistem untuk Harmonisasi yang Lebih Tertata & Terintegrasi
              </h2>

              <div className="space-y-4 text-sm sm:text-base font-medium leading-relaxed text-slate-600">
                <p>
                  <strong className="font-black text-slate-900">HARMONITAS</strong> adalah sistem informasi terpadu yang memfasilitasi koordinasi harmonisasi Rancangan Peraturan Daerah (Ranperda) dan Rancangan Peraturan Kepala Daerah (Ranperkada) di lingkungan <strong className="text-indigo-900">Provinsi Riau</strong>.
                </p>
                <p>
                  Sistem ini mendukung terwujudnya regulasi daerah yang berkualitas, efektif, dan berdaya guna melalui integrasi pengajuan dokumen, telaah cerdas berbasis AI, rapat pleno, hingga persetujuan dan pengarsipan digital.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white text-amber-600 shadow-sm">
                    <Scale className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-800">
                      Tujuan Pokok
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-700">
                      Mewujudkan sinergi terintegrasi untuk regulasi daerah yang berkualitas, konsisten, dan memberikan kepastian hukum di setiap tahapan.
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="#alur"
                className="inline-flex items-center gap-2 text-sm font-black text-indigo-700 transition-colors hover:text-indigo-900"
              >
                <span>Pelajari alur kerja 4 tahap</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            {/* System Highlights Cards */}
            <div className="lg:col-span-7">
              <div className="grid gap-4 sm:grid-cols-2">
                {systemHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 group"
                    >
                      <div
                        className={`${item.iconClass} flex h-11 w-11 items-center justify-center rounded-xl border mb-4 transition-transform group-hover:scale-105`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-sm font-black text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pembagian Wilayah Pokja Section (LIGHT THEME) */}
      <section
        id="wilayah"
        className="relative overflow-hidden bg-[#f8fafc] border-b border-slate-200 py-20 sm:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700 mb-4">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Cakupan Wilayah Kerja</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Pembagian Kelompok Kerja (Pokja) Kanwil Riau
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
              Pelayanan harmonisasi 1 Pemerintah Provinsi dan 12 Kabupaten/Kota yang terbagi ke dalam 3 Pokja pembinaan:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pokjaList.map((p) => (
              <div
                key={p.pokja}
                className={`bg-white border border-slate-200 border-l-4 ${p.accent} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-black text-slate-900">{p.pokja}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${p.badge}`}>
                    {p.wilayah.length} Wilayah
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {p.wilayah.map((w) => (
                    <li key={w} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                      <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alur Kerja Section (LIGHT THEME) */}
      <section
        id="alur"
        className="relative overflow-hidden bg-white border-b border-slate-200 py-20 sm:py-24"
      >
        <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-amber-100/70 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-indigo-700 shadow-sm">
              <Scale className="h-3.5 w-3.5 text-amber-500" />
              <span>SOP & Alur Harmonisasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight text-slate-900">
              Alur Kerja Harmonisasi Terstruktur
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base font-medium leading-relaxed text-slate-600">
              Empat tahap terstandarisasi untuk menjamin kepastian hukum dan efisiensi penyusunan produk peraturan daerah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative group bg-slate-50/80 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-white hover:border-slate-300 transition-all duration-300"
                >
                  <div className={`absolute inset-x-0 top-0 h-1.5 rounded-t-3xl ${step.accentClass}`} />
                  <div>
                    {/* Top Step Header */}
                    <div className="flex items-center justify-between mb-5 pt-1">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${step.badgeClass}`}>
                        Tahap {step.step}
                      </span>
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs ${step.iconClass} transition-transform group-hover:scale-105`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <span className={`w-2 h-2 rounded-full ${step.accentClass}`} />
                    <span>Langkah {index + 1} dari 4</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section (NAVY ACCENT) */}
      <section className="relative overflow-hidden bg-[#0f172a] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Siap Mengakses Layanan HARMONITAS?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
            Masuk dengan akun resmi Pokja Kanwil Riau atau Biro/Bagian Hukum Pemda untuk mengelola dan memantau berkas permohonan.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <span>Login ke Dashboard Sistem</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer
        id="kontak"
        className="bg-[#0b1329] text-white pt-12 pb-8 border-t border-slate-800 mt-auto"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800 text-xs">
            {/* Column 1: Info */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1 shadow-sm overflow-hidden shrink-0">
                  <img
                    src={logoHarmonitas}
                    alt="Logo Harmonitas"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="font-black text-sm text-white block">
                    HARMONITAS KEMENKUM
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">KANWIL PROVINSI RIAU</span>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed font-medium">
                Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas — Kantor Wilayah
                Kementerian Hukum Riau & Biro Hukum Setda Provinsi Riau.
              </p>
            </div>

            {/* Column 2: Kontak */}
            <div>
              <h4 className="font-black text-white text-sm mb-3">
                Kontak Layanan
              </h4>
              <ul className="space-y-2.5 text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>(0761) 853000 - Layanan Harmonisasi</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>harmonitas.kanwil@kemenkum.go.id</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Jl. Jend. Sudirman No. 233, Kota Pekanbaru, Riau</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div>
              <h4 className="font-black text-white text-sm mb-3">
                Akses Cepat
              </h4>
              <ul className="space-y-2 text-slate-300 font-medium">
                <li>
                  <Link
                    href="/login"
                    className="hover:text-amber-400 transition-colors"
                  >
                    Login Petugas Pokja Kanwil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-amber-400 transition-colors"
                  >
                    Login Biro / Bagian Hukum Daerah
                  </Link>
                </li>
                <li>
                  <a
                    href="#alur"
                    className="hover:text-amber-400 transition-colors"
                  >
                    Dokumentasi SOP Alur Kerja
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 text-center text-[11px] text-slate-400 font-bold">
            © {new Date().getFullYear()} HARMONITAS Kanwil Kementerian Hukum Riau & Biro
            Hukum Riau. Seluruh Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;