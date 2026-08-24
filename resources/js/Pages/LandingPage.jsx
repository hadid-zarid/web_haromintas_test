import React from 'react';
import { Link } from '@inertiajs/react';
import {
  ArrowRight,
  BookOpen,
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  Layers3,
  Mail,
  MapPin,
  PhoneCall,
  Scale,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';

import PublicNavbar from '../components/layout/PublicNavbar';
import { INITIAL_PERATURAN, KABUPATEN_LIST } from '../mock/mockPeraturan';
import logoHarmonitas from '../assets/LOGO HARMONITAS.png';

export const LandingPage = () => {
  const totalPeraturan = INITIAL_PERATURAN.length;
  const totalKabupaten = KABUPATEN_LIST.length;
  const totalSelesai = INITIAL_PERATURAN.filter(
    (peraturan) => peraturan.status === 'selesai',
  ).length;

  const benefits = [
    {
      number: '01',
      title: 'Akses Mudah & Cepat',
      description: 'Seluruh proses harmonisasi dapat dipantau dalam satu sistem yang ringkas dan mudah digunakan.',
      icon: Layers3,
      accent: '#2F6BFF',
      accentDark: '#1D4FC7',
      border: '#AFC9FF',
      surface: 'linear-gradient(145deg, #EEF5FF 0%, #D9E8FF 100%)',
    },
    {
      number: '02',
      title: 'Proses Lebih Efisien',
      description: 'Pengajuan, telaah, rapat pleno, validasi, dan pengarsipan tersusun dalam alur kerja yang jelas.',
      icon: Clock3,
      accent: '#FF930F',
      accentDark: '#D86B00',
      border: '#FFD18A',
      surface: 'linear-gradient(145deg, #FFF7E9 0%, #FFE5BC 100%)',
    },
    {
      number: '03',
      title: 'Regulasi Berkualitas',
      description: 'Pemeriksaan terstruktur membantu menjaga keselarasan dan kualitas produk hukum daerah.',
      icon: ShieldCheck,
      accent: '#20AD68',
      accentDark: '#087C48',
      border: '#A9E4C3',
      surface: 'linear-gradient(145deg, #EEFCF4 0%, #D2F2DF 100%)',
    },
  ];

  const serviceItems = [
    { label: 'Pengajuan dan pengelolaan dokumen', icon: FileCheck2, accent: '#2F6BFF', soft: '#EAF2FF' },
    { label: 'Telaah awal berbantuan HARMONITAS AI', icon: Bot, accent: '#8B48C7', soft: '#F5EAFF' },
    { label: 'Koordinasi dan pembahasan rapat pleno', icon: UsersRound, accent: '#F08415', soft: '#FFF0DF' },
    { label: 'Validasi serta arsip hasil harmonisasi', icon: CheckCircle2, accent: '#20AD68', soft: '#E8F9F0' },
  ];

  const pokjaList = [
    {
      pokja: 'POKJA 1',
      accent: '#2F6BFF',
      accentDark: '#233E91',
      soft: '#EAF2FF',
      border: '#BDD2FF',
      wilayah: [
        'Pemerintah Provinsi Riau',
        'Kabupaten Siak',
        'Kabupaten Kampar',
        'Kabupaten Indragiri Hilir',
        'Kabupaten Bengkalis',
      ],
    },
    {
      pokja: 'POKJA 2',
      accent: '#FF930F',
      accentDark: '#A95600',
      soft: '#FFF0DF',
      border: '#FFD18A',
      wilayah: [
        'Kabupaten Rokan Hulu',
        'Kabupaten Indragiri Hulu',
        'Kabupaten Kepulauan Meranti',
        'Kota Dumai',
      ],
    },
    {
      pokja: 'POKJA 3',
      accent: '#20AD68',
      accentDark: '#087C48',
      soft: '#E8F9F0',
      border: '#A9E4C3',
      wilayah: [
        'Kabupaten Kuantan Singingi',
        'Kabupaten Pelalawan',
        'Kabupaten Rokan Hilir',
        'Kota Pekanbaru',
      ],
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Input & Pra-Harmonisasi',
      description: 'Tim Pokja mengunggah draf regulasi dan kelengkapan permohonan untuk pemeriksaan awal.',
      icon: FileCheck2,
      accent: '#FF930F',
      soft: '#FFF0DF',
      border: '#FFD18A',
    },
    {
      step: '02',
      title: 'Rapat Pleno Harmonisasi',
      description: 'Pokja, pemrakarsa, dan perancang membahas substansi serta teknik penyusunan peraturan.',
      icon: SearchCheck,
      accent: '#2F6BFF',
      soft: '#EAF2FF',
      border: '#BDD2FF',
    },
    {
      step: '03',
      title: 'Validasi Biro Hukum',
      description: 'Biro atau Bagian Hukum menelaah hasil pembahasan dan memberikan keputusan akhir.',
      icon: Scale,
      accent: '#8B48C7',
      soft: '#F5EAFF',
      border: '#DEC4F4',
    },
    {
      step: '04',
      title: 'Tuntas & Diarsipkan',
      description: 'Dokumen yang disetujui tersimpan sebagai arsip digital dan dapat dipantau kembali.',
      icon: CheckCircle2,
      accent: '#20AD68',
      soft: '#E8F9F0',
      border: '#A9E4C3',
    },
  ];

  const heroFeatures = [
    { label: 'Alur kerja terintegrasi', icon: Layers3, accent: '#2F6BFF', soft: '#EAF2FF' },
    { label: 'Pemantauan status real-time', icon: Clock3, accent: '#FF930F', soft: '#FFF0DF' },
    { label: 'Telaah awal berbantuan AI', icon: Bot, accent: '#8B48C7', soft: '#F5EAFF' },
    { label: 'Arsip dokumen terpusat', icon: FileCheck2, accent: '#20AD68', soft: '#E8F9F0' },
  ];

  return (
    <div
      className="min-h-screen text-[#20283D]"
      style={{
        background: '#F7F8FC',
        overflowX: 'hidden',
        fontFamily: '"Outfit", ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <PublicNavbar />

      <main>
        <section
          id="beranda"
          className="relative scroll-mt-28 overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #F6F8FC 0%, #EEF3FB 100%)',
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2F6BFF] via-[#FFC800] to-[#20AD68]" />

          <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
            <div className="order-2 lg:order-1 lg:col-span-5">
              <div className="relative mx-auto max-w-[430px] px-6 pb-8 sm:px-10">
                <div
                  className="absolute left-0 top-16 z-20 rounded-2xl border bg-white/95 px-4 py-3 backdrop-blur-sm"
                  style={{ borderColor: '#B7CAFA', borderTop: '4px solid #2F6BFF', boxShadow: '0 8px 20px rgba(31, 44, 75, 0.10)' }}
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#75809A]">Permohonan</p>
                  <p className="mt-0.5 text-xl font-extrabold text-[#244CA7]">{totalPeraturan}+</p>
                </div>

                <div
                  className="absolute right-0 top-12 z-20 hidden rounded-2xl border bg-white/95 px-4 py-3 backdrop-blur-sm sm:block"
                  style={{ borderColor: '#A9E4C3', borderTop: '4px solid #20AD68', boxShadow: '0 8px 20px rgba(31, 44, 75, 0.10)' }}
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#75809A]">Tuntas</p>
                  <p className="mt-0.5 text-xl font-extrabold text-[#087C48]">{totalSelesai}</p>
                </div>

                <div
                  className="absolute -right-1 bottom-0 z-20 rounded-2xl border bg-white/95 px-4 py-3 backdrop-blur-sm"
                  style={{ borderColor: '#FFD18A', borderTop: '4px solid #FF930F', boxShadow: '0 8px 20px rgba(31, 44, 75, 0.10)' }}
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#75809A]">Wilayah</p>
                  <p className="mt-0.5 text-xl font-extrabold text-[#B65B00]">{totalKabupaten}</p>
                </div>

                <div
                  className="relative overflow-hidden rounded-[30px] p-6"
                  style={{
                    background: 'linear-gradient(145deg, #1E3472 0%, #3F4F8F 100%)',
                    boxShadow: '0 20px 45px rgba(31, 44, 75, 0.18)',
                  }}
                >
                  <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full border-[28px] border-white/10" />
                  <div className="pointer-events-none absolute left-12 top-7 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#FFC800] to-[#FF930F]" />

                  <div className="relative flex min-h-[350px] flex-col items-center justify-center rounded-[23px] border border-white/20 bg-white/[0.09] px-6 py-8 text-center backdrop-blur-sm">
                    <div
                      className="flex h-44 w-44 items-center justify-center rounded-full border-[7px] bg-white p-5"
                      style={{ borderColor: 'rgba(255, 200, 0, 0.55)', boxShadow: '0 10px 24px rgba(21, 35, 78, 0.18)' }}
                    >
                      <img
                        src={logoHarmonitas}
                        alt="Logo HARMONITAS"
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="mt-7 w-full rounded-2xl border border-white/20 bg-white/15 px-5 py-4 backdrop-blur-sm">
                      <p className="text-lg font-extrabold tracking-[0.12em] text-white">HARMONITAS</p>
                      <p className="mt-1 text-[10px] font-medium text-white/70">Kanwil Kementerian Hukum Riau</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-7 lg:pl-8">
              <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-extrabold tracking-wide text-[#223A78]"
                  style={{ background: '#FFFFFF', borderColor: '#C9B45B', boxShadow: '0 4px 12px rgba(31, 44, 75, 0.08)' }}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2F6BFF]" />
                  Kantor Wilayah Kementerian Hukum Riau
                </span>

                <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-[#20283D] sm:text-5xl lg:text-[56px]">
                  Harmonisasi Regulasi Daerah yang{' '}
                  <span
                    className="text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(90deg, #244CA7 0%, #5C48A9 52%, #1C8A59 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                    }}
                  >
                    Lebih Tertata
                  </span>
                </h1>

                <p className="mx-auto mt-5 max-w-xl text-sm font-medium leading-7 text-[#616A7D] sm:text-base lg:mx-0">
                  Kelola pengajuan, telaah, pembahasan, validasi, dan arsip Ranperda serta Ranperkada dalam satu layanan digital yang terintegrasi.
                </p>

                <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
                  {heroFeatures.map((feature) => {
                    const Icon = feature.icon;

                    return (
                      <div
                        key={feature.label}
                        className="flex min-h-12 items-center gap-3 rounded-xl border bg-white/80 px-3 py-2.5 text-xs font-semibold text-[#3F4960] backdrop-blur-sm"
                        style={{ borderColor: `${feature.accent}33`, boxShadow: '0 4px 12px rgba(31, 44, 75, 0.06)' }}
                      >
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                          style={{ background: feature.soft, color: feature.accent }}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        {feature.label}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <Link
                    href="/login"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-xs font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: '#2F407E', boxShadow: '0 8px 18px rgba(31, 44, 75, 0.16)' }}
                  >
                    Masuk ke Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <a
                    href="#alur"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-white/90 px-6 text-xs font-bold text-[#303661] transition-all hover:-translate-y-0.5 hover:bg-white"
                    style={{ borderColor: '#AFC0E9', boxShadow: '0 4px 12px rgba(31, 44, 75, 0.08)' }}
                  >
                    <BookOpen className="h-4 w-4" />
                    Pelajari Alur
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="tentang"
          className="relative scroll-mt-28 overflow-hidden py-20 sm:py-24"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F8FC 100%)',
          }}
        >
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span
                className="inline-flex rounded-full border px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#244CA7]"
                style={{ background: 'linear-gradient(90deg, #EAF2FF 0%, #F5EAFF 100%)', borderColor: '#B7C7EE' }}
              >
                Keunggulan Layanan
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#20283D] sm:text-4xl">
                Mengapa Menggunakan HARMONITAS?
              </h2>
              <div className="mx-auto mt-4 flex w-28 items-center gap-1.5">
                <span className="h-1 flex-1 rounded-full bg-[#2F6BFF]" />
                <span className="h-1 flex-1 rounded-full bg-[#FF930F]" />
                <span className="h-1 flex-1 rounded-full bg-[#20AD68]" />
              </div>
              <p className="mt-3 text-sm font-medium leading-6 text-[#6F778B]">
                Sistem dirancang untuk membantu kolaborasi harmonisasi regulasi daerah menjadi lebih cepat, konsisten, dan mudah dipantau.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article
                    key={benefit.title}
                    className="group relative overflow-hidden rounded-[24px] border p-6 transition-all duration-200 hover:-translate-y-1.5"
                    style={{
                      background: benefit.surface,
                      borderColor: benefit.border,
                      boxShadow: '0 10px 24px rgba(31, 44, 75, 0.09)',
                    }}
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-1.5"
                      style={{ background: `linear-gradient(90deg, ${benefit.accent}, ${benefit.accentDark})` }}
                    />
                    <div className="relative flex items-start justify-between">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-[14px] text-white"
                        style={{
                          background: `linear-gradient(135deg, ${benefit.accent}, ${benefit.accentDark})`,
                          boxShadow: '0 6px 14px rgba(31, 44, 75, 0.12)',
                        }}
                      >
                        <Icon className="h-5 w-5" style={{ color: '#FFFFFF' }} />
                      </div>
                      <span className="text-4xl font-extrabold opacity-15" style={{ color: benefit.accentDark }}>
                        {benefit.number}
                      </span>
                    </div>
                    <h3 className="relative mt-6 text-lg font-extrabold text-[#20283D]">{benefit.title}</h3>
                    <p className="relative mt-2 text-xs font-medium leading-6 text-[#536078]">{benefit.description}</p>
                    <div className="relative mt-5 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em]" style={{ color: benefit.accentDark }}>
                      <span className="h-2 w-2 rounded-full" style={{ background: benefit.accent }} />
                      Keunggulan HARMONITAS
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="relative overflow-hidden py-20 sm:py-24"
          style={{
            background: 'linear-gradient(125deg, #EFFAF4 0%, #F8FCFA 100%)',
          }}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#2F6BFF] via-[#20AD68] to-[#FFC800]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-7">
              <span
                className="inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#087C48]"
                style={{ borderColor: '#91D7AF', boxShadow: '0 4px 12px rgba(31, 44, 75, 0.07)' }}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Layanan Terintegrasi
              </span>
              <h2 className="mt-5 max-w-xl text-3xl font-extrabold tracking-tight text-[#20283D] sm:text-4xl">
                Satu Ruang Kerja untuk Seluruh Proses Harmonisasi
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-[#606B78]">
                Setiap tahapan tersusun rapi agar tim Pokja, Biro Hukum, dan Bagian Hukum daerah dapat bekerja pada data yang sama tanpa kehilangan riwayat proses.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {serviceItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="group flex min-h-14 items-center gap-3 rounded-xl border bg-white/90 px-4 py-3 transition-all hover:-translate-y-0.5"
                      style={{ borderColor: `${item.accent}35`, boxShadow: '0 4px 12px rgba(31, 44, 75, 0.06)' }}
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                        style={{ background: item.soft, color: item.accent }}
                      >
                        <Icon className="h-4 w-4" style={{ color: item.accent }} />
                      </span>
                      <span className="text-xs font-bold leading-5 text-[#3F4960]">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div
                className="mx-auto max-w-[390px] rounded-[28px] p-5"
                style={{ background: 'linear-gradient(145deg, #1EAE69 0%, #087C48 100%)', boxShadow: '0 16px 34px rgba(31, 44, 75, 0.16)' }}
              >
                <div className="relative overflow-hidden rounded-[21px] border border-white/20 bg-white/10 px-7 py-8 text-center">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border-[22px] border-white/10" />
                  <div className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-white p-5 shadow-md">
                    <img src={logoHarmonitas} alt="Logo HARMONITAS" className="h-full w-full object-contain" />
                  </div>
                  <div className="relative mt-7 rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
                    <p className="text-base font-extrabold text-white">Layanan Harmonisasi Terpadu</p>
                    <p className="mt-1 text-[10px] font-medium text-white/75">Terpantau dari pengajuan hingga tuntas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative overflow-hidden py-20 sm:py-24"
          style={{
            background: 'linear-gradient(125deg, #FFF5F6 0%, #FFF8F2 100%)',
          }}
        >
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="order-2 lg:order-1 lg:col-span-5">
              <div
                className="mx-auto max-w-[390px] rounded-[28px] p-5"
                style={{ background: 'linear-gradient(145deg, #E92F59 0%, #B8073F 100%)', boxShadow: '0 16px 34px rgba(31, 44, 75, 0.16)' }}
              >
                <div className="rounded-[21px] border border-white/20 bg-white/10 px-7 py-8 text-center">
                  <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-3xl bg-white p-5 shadow-md">
                    <img src={logoHarmonitas} alt="Logo HARMONITAS" className="h-full w-full object-contain" />
                  </div>
                  <div className="mt-7 rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#FFE76D]" />
                      <p className="text-base font-extrabold text-white">HARMONITAS AI</p>
                    </div>
                    <p className="mt-1 text-[10px] font-medium text-white/75">Asisten telaah awal dokumen regulasi</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-7 lg:pl-8">
              <span
                className="inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#B6003A]"
                style={{ borderColor: '#E9AFC0', boxShadow: '0 4px 12px rgba(31, 44, 75, 0.07)' }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Asisten Cerdas
              </span>
              <h2 className="mt-5 max-w-xl text-3xl font-extrabold tracking-tight text-[#20283D] sm:text-4xl">
                Pemeriksaan Awal Dokumen Menjadi Lebih Terarah
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-[#606B78]">
                HARMONITAS AI membantu tim mengenali potensi ketidaksesuaian format, struktur, dan teknik penyusunan sebelum dokumen masuk ke tahap pembahasan.
              </p>
              <Link
                href="/login"
                className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-xs font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: '#D91E4D', boxShadow: '0 8px 18px rgba(31, 44, 75, 0.14)' }}
              >
                Gunakan HARMONITAS AI
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section
          id="wilayah"
          className="relative scroll-mt-28 overflow-hidden py-20 sm:py-24"
          style={{
            background: 'linear-gradient(180deg, #F4F7FC 0%, #EDF2FA 100%)',
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2F6BFF]/50 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C9DBFF] bg-[#EEF4FF] px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#3269D8]">
                <Building2 className="h-3.5 w-3.5" />
                Pembagian Wilayah Kerja
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#20283D] sm:text-4xl">
                Kelompok Kerja Kanwil Riau
              </h2>
              <p className="mt-3 text-sm font-medium leading-6 text-[#6F778B]">
                Pelayanan untuk satu Pemerintah Provinsi dan dua belas Kabupaten/Kota dikelola melalui tiga kelompok kerja.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {pokjaList.map((pokja) => (
                <article
                  key={pokja.pokja}
                  className="overflow-hidden rounded-[24px] border transition-all hover:-translate-y-1.5"
                  style={{
                    background: `linear-gradient(180deg, #FFFFFF 0%, ${pokja.soft} 145%)`,
                    borderColor: pokja.border,
                    boxShadow: '0 10px 24px rgba(31, 44, 75, 0.09)',
                  }}
                >
                  <div
                    className="flex items-center justify-between px-5 py-4 text-white"
                    style={{ background: `linear-gradient(105deg, ${pokja.accentDark} 0%, ${pokja.accent} 100%)` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-white">
                        <Building2 className="h-4 w-4" style={{ color: '#FFFFFF' }} />
                      </span>
                      <h3 className="text-base font-extrabold">{pokja.pokja}</h3>
                    </div>
                    <span className="rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[9px] font-bold">
                      {pokja.wilayah.length} Wilayah
                    </span>
                  </div>

                  <ul className="space-y-1.5 p-5">
                    {pokja.wilayah.map((wilayah) => (
                      <li key={wilayah} className="flex items-center gap-2.5 rounded-xl px-2 py-2 text-xs font-semibold text-[#4E566B] hover:bg-[#F7F8FC]">
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#FFC800]" />
                        {wilayah}
                      </li>
                    ))}
                  </ul>

                  <div className="px-5 pb-5">
                    <span
                      className="inline-flex rounded-full border px-3 py-1.5 text-[9px] font-bold"
                      style={{ background: pokja.soft, borderColor: pokja.border, color: pokja.accentDark }}
                    >
                      Aktif melayani
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="alur"
          className="relative scroll-mt-28 overflow-hidden py-20 sm:py-24"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F7FB 100%)',
          }}
        >
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E1D6F0] bg-[#F7EDFF] px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#7C32B8]">
                <Scale className="h-3.5 w-3.5" />
                SOP Harmonisasi
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#20283D] sm:text-4xl">
                Alur Kerja yang Terstruktur
              </h2>
              <p className="mt-3 text-sm font-medium leading-6 text-[#6F778B]">
                Empat tahap utama menjaga proses tetap transparan dari dokumen masuk sampai hasil akhir diarsipkan.
              </p>
            </div>

            <div className="relative mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.step}
                    className="relative overflow-hidden rounded-[24px] border p-6 transition-all hover:-translate-y-1.5"
                    style={{
                      background: `linear-gradient(155deg, #FFFFFF 0%, ${step.soft} 135%)`,
                      borderColor: step.border,
                      boxShadow: '0 10px 24px rgba(31, 44, 75, 0.09)',
                    }}
                  >
                    <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: step.accent }} />
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-extrabold opacity-35" style={{ color: step.accent }}>
                        {step.step}
                      </span>
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-xl border"
                        style={{ background: step.soft, borderColor: step.border, color: step.accent }}
                      >
                        <Icon className="h-5 w-5" style={{ color: step.accent }} />
                      </span>
                    </div>
                    <h3 className="mt-6 text-base font-extrabold leading-6 text-[#20283D]">{step.title}</h3>
                    <p className="mt-2 text-xs font-medium leading-6 text-[#687184]">{step.description}</p>
                    <div
                      className="mt-6 flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#9AA1B1]"
                      style={{ borderTop: '1px solid #DCE2EA', paddingTop: '16px' }}
                    >
                      <span className="h-2 w-2 rounded-full" style={{ background: step.accent }} />
                      Tahap {index + 1} dari 4
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="relative"
          style={{ background: '#EEF2F8', padding: '72px 0 88px' }}
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div
              className="relative overflow-hidden rounded-[28px] text-white lg:flex lg:items-center lg:justify-between"
              style={{
                background: '#263A78',
                border: '1px solid #344D8C',
                boxShadow: '0 14px 32px rgba(31, 44, 75, 0.15)',
                boxSizing: 'border-box',
                gap: '40px',
                minHeight: '248px',
                padding: 'clamp(30px, 4vw, 48px)',
              }}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2F6BFF] via-[#F5C928] to-[#20AD68]" />
              <div
                className="relative text-center lg:text-left"
                style={{ flex: '1 1 620px', maxWidth: '650px', minWidth: 0 }}
              >
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.15em]"
                  style={{ background: 'rgba(255, 255, 255, 0.10)', color: '#F8E27A' }}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Akses Layanan Resmi
                </span>
                <h2
                  className="mt-4 text-2xl font-extrabold sm:text-3xl"
                  style={{ lineHeight: 1.2, letterSpacing: '-0.02em' }}
                >
                  Siap Mengelola Harmonisasi?
                </h2>
                <p
                  className="mt-3 text-sm font-medium leading-6"
                  style={{ color: '#D0D7E8', maxWidth: '610px' }}
                >
                  Gunakan akun resmi Kanwil atau Biro/Bagian Hukum untuk mengakses dashboard dan melanjutkan pekerjaan Anda.
                </p>
              </div>

              <Link
                href="/login"
                className="relative mx-auto mt-7 inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-xs font-extrabold transition-all hover:-translate-y-0.5 lg:mx-0 lg:mt-0"
                style={{
                  background: '#F5C928',
                  color: '#172A61',
                  boxShadow: '0 6px 14px rgba(18, 30, 67, 0.16)',
                  minWidth: '236px',
                  whiteSpace: 'nowrap',
                }}
              >
                Masuk ke HARMONITAS
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer
        id="kontak"
        style={{
          background: '#192A60',
          color: '#FFFFFF',
          borderTop: '4px solid #F5C928',
          paddingTop: '52px',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="grid gap-10 md:grid-cols-12"
            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: '42px' }}
          >
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
                  <img src={logoHarmonitas} alt="Logo HARMONITAS" className="h-full w-full object-contain" />
                </span>
                <div>
                  <p className="text-base font-extrabold tracking-[0.08em]">HARMONITAS</p>
                  <p className="text-[10px] font-medium text-white/65">Kanwil Kementerian Hukum Riau</p>
                </div>
              </div>
              <p className="mt-4 max-w-md text-xs font-medium leading-6" style={{ color: '#C8D0E4' }}>
                Sistem harmonisasi dan fasilitasi Ranperda serta Ranperkada yang terintegrasi untuk mendukung regulasi daerah berkualitas.
              </p>
            </div>

            <div className="md:col-span-3">
              <h3 className="text-xs font-extrabold">Tautan Cepat</h3>
              <ul className="mt-4 space-y-2.5 text-xs font-medium" style={{ color: '#C8D0E4' }}>
                <li><a href="#tentang" className="hover:text-[#FFC800]">Tentang Sistem</a></li>
                <li><a href="#alur" className="hover:text-[#FFC800]">Alur Kerja</a></li>
                <li><a href="#wilayah" className="hover:text-[#FFC800]">Wilayah Pokja</a></li>
                <li><Link href="/login" className="hover:text-[#FFC800]">Login</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h3 className="text-xs font-extrabold">Hubungi Kami</h3>
              <ul className="mt-4 space-y-3 text-xs font-medium" style={{ color: '#C8D0E4' }}>
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#FFC800]" />
                  harmonitas.kanwil@kemenkum.go.id
                </li>
                <li className="flex items-start gap-2.5">
                  <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-[#FFC800]" />
                  (0761) 853000
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FFC800]" />
                  Jl. Jend. Sudirman No. 233, Kota Pekanbaru, Riau
                </li>
              </ul>
            </div>
          </div>

          <div
            className="flex flex-col gap-2 text-[10px] font-medium sm:flex-row sm:items-center sm:justify-between"
            style={{ color: '#9EABC8', padding: '24px 0 28px' }}
          >
            <p>Hak cipta {new Date().getFullYear()} HARMONITAS Kanwil Kementerian Hukum Riau.</p>
            <p>Harmonisasi dan Fasilitasi Ranperda & Ranperkada Tuntas</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
