import React from 'react';
import { Link } from '@inertiajs/react';
import {
  ArrowRight,
  BookOpen,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  Layers3,
  Mail,
  MapPin,
  PhoneCall,
  Scale,
  SearchCheck,
  ShieldCheck,
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
      title: 'Akses Mudah dan Cepat',
      description:
        'Seluruh proses harmonisasi dapat dipantau dalam satu sistem yang ringkas, terarah, dan mudah digunakan.',
      icon: Layers3,
    },
    {
      number: '02',
      title: 'Proses Lebih Efisien',
      description:
        'Pengajuan, telaah, rapat pleno, validasi, dan pengarsipan tersusun dalam alur kerja yang jelas.',
      icon: Clock3,
    },
    {
      number: '03',
      title: 'Regulasi Lebih Berkualitas',
      description:
        'Pemeriksaan terstruktur membantu menjaga keselarasan serta kualitas produk hukum daerah.',
      icon: ShieldCheck,
    },
  ];

  const heroFeatures = [
    { label: 'Alur kerja terintegrasi', icon: Layers3 },
    { label: 'Pemantauan status berkala', icon: Clock3 },
    { label: 'Telaah awal berbantuan AI', icon: Bot },
    { label: 'Arsip dokumen terpusat', icon: FileCheck2 },
  ];

  const serviceItems = [
    { label: 'Pengajuan dan pengelolaan dokumen', icon: FileCheck2 },
    { label: 'Telaah awal berbantuan HARMONITAS AI', icon: Bot },
    { label: 'Koordinasi dan pembahasan rapat pleno', icon: UsersRound },
    { label: 'Validasi serta arsip hasil harmonisasi', icon: CheckCircle2 },
  ];

  const teamWorkAreas = [
    {
      name: 'Tim Kerja 1',
      wilayah: [
        'Pemerintah Provinsi Riau',
        'Kabupaten Siak',
        'Kabupaten Kampar',
        'Kabupaten Indragiri Hilir',
        'Kabupaten Bengkalis',
      ],
    },
    {
      name: 'Tim Kerja 2',
      wilayah: [
        'Kabupaten Rokan Hulu',
        'Kabupaten Indragiri Hulu',
        'Kabupaten Kepulauan Meranti',
        'Kota Dumai',
      ],
    },
    {
      name: 'Tim Kerja 3',
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
      title: 'Input dan Pra-Harmonisasi',
      description:
        'Tim Kerja mengunggah draf regulasi dan kelengkapan permohonan untuk pemeriksaan awal.',
      icon: FileCheck2,
    },
    {
      step: '02',
      title: 'Rapat Pleno Harmonisasi',
      description:
        'Tim Kerja, pemrakarsa, dan perancang membahas substansi serta teknik penyusunan peraturan.',
      icon: SearchCheck,
    },
    {
      step: '03',
      title: 'Validasi Biro Hukum',
      description:
        'Biro atau Bagian Hukum menelaah hasil pembahasan dan memberikan keputusan akhir.',
      icon: Scale,
    },
    {
      step: '04',
      title: 'Tuntas dan Diarsipkan',
      description:
        'Dokumen yang disetujui tersimpan sebagai arsip digital dan dapat dipantau kembali.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#F5F7FA] text-[#1E293B]"
      style={{ fontFamily: '"Outfit", ui-sans-serif, system-ui, sans-serif' }}
    >
      <PublicNavbar />

      <main>
        <section
          id="beranda"
          className="relative scroll-mt-28 overflow-hidden border-b border-[#DCE2EC] bg-[#F2F5F9]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-48 -top-64 h-[620px] w-[620px] rounded-full border-[80px] border-[#E7EBF2]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-56 -left-52 h-[460px] w-[460px] rounded-full border-[64px] border-white/80"
          />

          <div className="relative mx-auto grid min-h-[670px] max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
            <div className="lg:col-span-7 lg:pr-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C9D2E2] bg-white px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#21366F] shadow-[0_4px_14px_rgba(20,42,94,0.06)]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#B08A22]" />
                Kantor Wilayah Kementerian Hukum Riau
              </span>

              <h1 className="mt-7 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] text-[#142A5E] sm:text-5xl lg:text-[58px]">
                Harmonisasi Regulasi Daerah yang Lebih Tertata
              </h1>

              <p className="mt-6 max-w-2xl text-sm font-medium leading-7 text-[#5B6475] sm:text-base">
                Kelola pengajuan, telaah, pembahasan, validasi, dan arsip Ranperda serta Ranperkada dalam satu layanan digital resmi yang terintegrasi.
              </p>

              <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-2">
                {heroFeatures.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.label}
                      className="flex min-h-12 items-center gap-3 rounded-xl border border-[#D6DDE8] bg-white px-3.5 py-3 text-xs font-semibold text-[#3E4A5E] shadow-[0_5px_16px_rgba(20,42,94,0.05)]"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E9EDF5] text-[#203B78]">
                        <Icon className="h-4 w-4" />
                      </span>
                      {feature.label}
                    </div>
                  );
                })}
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#17336F] px-6 text-xs font-bold text-white shadow-[0_10px_24px_rgba(20,42,94,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#10285E]"
                >
                  Masuk ke Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="#alur"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#AEBBD0] bg-white px-6 text-xs font-bold text-[#17336F] transition duration-200 hover:-translate-y-0.5 hover:border-[#7F8FAB]"
                >
                  <BookOpen className="h-4 w-4" />
                  Pelajari Alur
                </a>
              </div>

              <div className="mt-8 flex items-center gap-3 text-[11px] font-medium text-[#6B7280]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D5C183] bg-[#FBF7EA] text-[#927018]">
                  <Check className="h-3.5 w-3.5" />
                </span>
                Layanan resmi untuk mendukung harmonisasi produk hukum daerah
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-[470px]">
                <div
                  aria-hidden="true"
                  className="absolute -bottom-5 -right-5 h-full w-full rounded-[28px] border border-[#CBD3E0] bg-[#E4E8EF]"
                />

                <div className="relative overflow-hidden rounded-[28px] border border-[#243E77] bg-[#142A5E] shadow-[0_24px_60px_rgba(20,42,94,0.20)]">
                  <div className="border-b border-white/10 px-6 py-6 sm:px-7">
                    <div className="flex items-center gap-4">
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-sm">
                        <img
                          src={logoHarmonitas}
                          alt="Logo HARMONITAS"
                          className="h-full w-full object-contain"
                        />
                      </span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D5B95F]">
                          Layanan Digital Resmi
                        </p>
                        <h2 className="mt-1 text-xl font-extrabold tracking-[0.04em] text-white">
                          HARMONITAS
                        </h2>
                        <p className="mt-1 text-[10px] font-medium text-white/60">
                          Kanwil Kementerian Hukum Riau
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-7 sm:px-7">
                    <p className="text-sm font-bold text-white">Pusat kendali harmonisasi terpadu</p>
                    <p className="mt-2 text-xs font-medium leading-6 text-white/65">
                      Informasi proses tersusun dalam satu ruang kerja yang aman, terdokumentasi, dan mudah dipantau.
                    </p>

                    <div className="mt-6 space-y-3">
                      {[
                        'Dokumen tersimpan secara terpusat',
                        'Status proses dapat dipantau',
                        'Riwayat telaah terdokumentasi',
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-3 text-xs font-semibold text-white/85"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#D5B95F]" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 border-t border-[#DCE2EC] bg-white">
                    {[
                      { label: 'Permohonan', value: `${totalPeraturan}+` },
                      { label: 'Tuntas', value: totalSelesai },
                      { label: 'Wilayah', value: totalKabupaten },
                    ].map((item, index) => (
                      <div
                        key={item.label}
                        className={`px-3 py-4 text-center ${index !== 0 ? 'border-l border-[#E1E5EC]' : ''}`}
                      >
                        <p className="text-xl font-extrabold text-[#142A5E]">{item.value}</p>
                        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#7A8392]">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tentang" className="scroll-mt-28 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8A6B18]">
                <span className="h-px w-8 bg-[#C5A64B]" />
                Keunggulan Layanan
                <span className="h-px w-8 bg-[#C5A64B]" />
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.025em] text-[#142A5E] sm:text-4xl">
                Mendukung Proses yang Lebih Terarah
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-[#687184]">
                HARMONITAS membantu kolaborasi harmonisasi regulasi daerah menjadi lebih cepat, konsisten, transparan, dan mudah dipantau.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article
                    key={benefit.title}
                    className="group relative rounded-2xl border border-[#DCE2EC] bg-white p-7 shadow-[0_10px_30px_rgba(20,42,94,0.07)] transition duration-200 hover:-translate-y-1 hover:border-[#BAC4D3]"
                  >
                    <span className="absolute inset-x-7 top-0 h-[3px] bg-[#C5A64B]" />
                    <div className="flex items-start justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E9EDF5] text-[#17336F]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-4xl font-extrabold text-[#E7EAF0]">{benefit.number}</span>
                    </div>
                    <h3 className="mt-6 text-lg font-extrabold text-[#1E293B]">{benefit.title}</h3>
                    <p className="mt-3 text-xs font-medium leading-6 text-[#626D7F]">
                      {benefit.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-[#E0E5ED] bg-[#F3F5F8] py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#CCD5E3] bg-white px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#17336F]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#9A781C]" />
                Layanan Terintegrasi
              </span>
              <h2 className="mt-5 max-w-xl text-3xl font-extrabold tracking-[-0.025em] text-[#142A5E] sm:text-4xl">
                Satu Ruang Kerja untuk Seluruh Proses Harmonisasi
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-[#626D7F]">
                Setiap tahapan tersusun rapi agar Tim Kerja, Biro Hukum, dan Bagian Hukum daerah dapat bekerja pada data yang sama tanpa kehilangan riwayat proses.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {serviceItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex min-h-16 items-center gap-3 rounded-xl border border-[#D8DEE8] bg-white px-4 py-3 shadow-[0_5px_16px_rgba(20,42,94,0.04)]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E9EDF5] text-[#17336F]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-bold leading-5 text-[#3F4A5D]">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="mx-auto max-w-[410px] rounded-[26px] border border-[#263F78] bg-[#142A5E] p-5 shadow-[0_18px_45px_rgba(20,42,94,0.17)]">
                <div className="rounded-[20px] border border-white/10 bg-white/[0.05] px-6 py-7">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#D5B95F]">
                        Sistem Terpadu
                      </p>
                      <p className="mt-1 text-lg font-extrabold text-white">Ruang Kerja Digital</p>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-1.5">
                      <img src={logoHarmonitas} alt="Logo HARMONITAS" className="h-full w-full object-contain" />
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      { label: 'Pengajuan Dokumen', value: 'Terkelola' },
                      { label: 'Proses Telaah', value: 'Terpantau' },
                      { label: 'Arsip Regulasi', value: 'Terpusat' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3"
                      >
                        <span className="text-xs font-semibold text-white/75">{item.label}</span>
                        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold text-[#E7D48A]">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="order-2 lg:order-1 lg:col-span-5">
              <div className="mx-auto max-w-[410px] rounded-[26px] border border-[#D5DCE7] bg-[#F4F6F9] p-6 shadow-[0_16px_38px_rgba(20,42,94,0.10)]">
                <div className="rounded-[20px] border border-[#D9DFE8] bg-white p-6">
                  <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E9EDF5] text-[#17336F]">
                      <Bot className="h-6 w-6" />
                    </span>
                    <span className="rounded-full border border-[#D8C889] bg-[#FAF7EC] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#826515]">
                      Asisten Telaah
                    </span>
                  </div>

                  <div className="mt-6 rounded-xl border border-[#DEE3EA] bg-[#F8F9FB] p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[#17336F]" />
                      <div className="h-2.5 w-36 rounded-full bg-[#C9D0DC]" />
                    </div>
                    <div className="mt-4 space-y-2.5">
                      <div className="h-2 rounded-full bg-[#D9DEE6]" />
                      <div className="h-2 w-11/12 rounded-full bg-[#D9DEE6]" />
                      <div className="h-2 w-4/5 rounded-full bg-[#D9DEE6]" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#D8C889] bg-[#FBF8EE] px-4 py-3 text-xs font-semibold text-[#66531B]">
                    <SearchCheck className="h-4 w-4 shrink-0" />
                    Pemeriksaan awal siap ditinjau
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-7 lg:pl-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#CCD5E3] bg-[#F5F7FA] px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#17336F]">
                <Bot className="h-3.5 w-3.5 text-[#9A781C]" />
                Dukungan Teknologi
              </span>
              <h2 className="mt-5 max-w-xl text-3xl font-extrabold tracking-[-0.025em] text-[#142A5E] sm:text-4xl">
                Pemeriksaan Awal Dokumen Menjadi Lebih Terarah
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-[#626D7F]">
                HARMONITAS AI membantu tim mengenali potensi ketidaksesuaian format, struktur, dan teknik penyusunan sebelum dokumen masuk ke tahap pembahasan.
              </p>
              <Link
                href="/login"
                className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#17336F] px-5 text-xs font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#10285E]"
              >
                Gunakan HARMONITAS AI
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section
          id="wilayah"
          className="scroll-mt-28 border-y border-[#E0E5ED] bg-[#F3F5F8] py-20 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#CCD5E3] bg-white px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#17336F]">
                <Building2 className="h-3.5 w-3.5 text-[#9A781C]" />
                Pembagian Wilayah Kerja
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.025em] text-[#142A5E] sm:text-4xl">
                Cakupan Tim Kerja Kanwil Riau
              </h2>
              <p className="mt-3 text-sm font-medium leading-7 text-[#687184]">
                Pelayanan untuk Pemerintah Provinsi serta Kabupaten/Kota di Riau dikelola melalui tiga Tim Kerja.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {teamWorkAreas.map((team) => (
                <article
                  key={team.name}
                  className="overflow-hidden rounded-2xl border border-[#D5DCE7] bg-white shadow-[0_10px_30px_rgba(20,42,94,0.07)] transition duration-200 hover:-translate-y-1 hover:border-[#B9C3D2]"
                >
                  <div className="flex items-center justify-between border-b border-white/10 bg-[#17336F] px-5 py-4 text-white">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10">
                        <Building2 className="h-4 w-4 text-[#E1CA77]" />
                      </span>
                      <h3 className="text-base font-extrabold">{team.name}</h3>
                    </div>
                    <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-bold text-white/80">
                      {team.wilayah.length} Wilayah
                    </span>
                  </div>

                  <ul className="space-y-1.5 p-5">
                    {team.wilayah.map((wilayah) => (
                      <li
                        key={wilayah}
                        className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-xs font-semibold text-[#4B5565] transition hover:bg-[#F4F6F9]"
                      >
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#A98522]" />
                        {wilayah}
                      </li>
                    ))}
                  </ul>

                  <div className="px-5 pb-5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#D8C889] bg-[#FBF8EE] px-3 py-1.5 text-[9px] font-bold text-[#745C17]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#A98522]" />
                      Aktif melayani
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="alur" className="scroll-mt-28 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#CCD5E3] bg-[#F5F7FA] px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#17336F]">
                <Scale className="h-3.5 w-3.5 text-[#9A781C]" />
                SOP Harmonisasi
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.025em] text-[#142A5E] sm:text-4xl">
                Alur Kerja yang Terstruktur
              </h2>
              <p className="mt-3 text-sm font-medium leading-7 text-[#687184]">
                Empat tahap utama menjaga proses tetap transparan sejak dokumen masuk hingga hasil akhir diarsipkan.
              </p>
            </div>

            <div className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div
                aria-hidden="true"
                className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-[#CBD3E0] lg:block"
              />

              {workflowSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.step}
                    className="relative rounded-2xl border border-[#DCE2EC] bg-white p-6 shadow-[0_10px_28px_rgba(20,42,94,0.06)] transition duration-200 hover:-translate-y-1 hover:border-[#B9C3D2]"
                  >
                    <div className="relative flex items-center justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#17336F] text-sm font-extrabold text-white shadow-[0_4px_14px_rgba(20,42,94,0.16)]">
                        {step.step}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9EDF5] text-[#17336F]">
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="mt-6 text-base font-extrabold leading-6 text-[#1E293B]">{step.title}</h3>
                    <p className="mt-2 text-xs font-medium leading-6 text-[#687184]">{step.description}</p>
                    <div className="mt-6 flex items-center gap-2 border-t border-[#E2E6EC] pt-4 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#8A6B18]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#B3912D]" />
                      Tahap {index + 1} dari 4
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-[#E0E5ED] bg-[#F3F5F8] py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[28px] border border-[#29447D] bg-[#142A5E] px-7 py-10 text-white shadow-[0_18px_45px_rgba(20,42,94,0.16)] sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-12 lg:py-12">
              <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-[#C5A64B]" />

              <div className="relative max-w-2xl text-center lg:text-left">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#E4CE7B]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Akses Layanan Resmi
                </span>
                <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
                  Siap Mengelola Proses Harmonisasi?
                </h2>
                <p className="mt-3 text-sm font-medium leading-6 text-white/70">
                  Gunakan akun resmi Kanwil atau Biro/Bagian Hukum untuk mengakses dashboard dan melanjutkan pekerjaan Anda.
                </p>
              </div>

              <Link
                href="/login"
                className="relative mx-auto mt-7 inline-flex h-12 min-w-[228px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D2B24F] px-6 text-xs font-extrabold text-[#12275A] transition duration-200 hover:-translate-y-0.5 hover:bg-[#E0C56C] lg:mx-0 lg:mt-0"
              >
                Masuk ke HARMONITAS
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer id="kontak" className="border-t-4 border-[#C5A64B] bg-[#102454] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 border-b border-white/10 py-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
                  <img src={logoHarmonitas} alt="Logo HARMONITAS" className="h-full w-full object-contain" />
                </span>
                <div>
                  <p className="text-base font-extrabold tracking-[0.08em]">HARMONITAS</p>
                  <p className="text-[10px] font-medium text-white/60">Kanwil Kementerian Hukum Riau</p>
                </div>
              </div>
              <p className="mt-4 max-w-md text-xs font-medium leading-6 text-white/65">
                Sistem harmonisasi dan fasilitasi Ranperda serta Ranperkada yang terintegrasi untuk mendukung regulasi daerah berkualitas.
              </p>
            </div>

            <div className="md:col-span-3">
              <h3 className="text-xs font-extrabold">Tautan Cepat</h3>
              <ul className="mt-4 space-y-2.5 text-xs font-medium text-white/65">
                <li><a href="#tentang" className="transition hover:text-[#E4CE7B]">Tentang Sistem</a></li>
                <li><a href="#alur" className="transition hover:text-[#E4CE7B]">Alur Kerja</a></li>
                <li><a href="#wilayah" className="transition hover:text-[#E4CE7B]">Wilayah Tim Kerja</a></li>
                <li><Link href="/login" className="transition hover:text-[#E4CE7B]">Login</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h3 className="text-xs font-extrabold">Hubungi Kami</h3>
              <ul className="mt-4 space-y-3 text-xs font-medium text-white/65">
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#D5B95F]" />
                  harmonitas.kanwil@kemenkum.go.id
                </li>
                <li className="flex items-start gap-2.5">
                  <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-[#D5B95F]" />
                  (0761) 853000
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D5B95F]" />
                  Jl. Jend. Sudirman No. 233, Kota Pekanbaru, Riau
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2 py-6 text-[10px] font-medium text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>Hak cipta {new Date().getFullYear()} HARMONITAS Kanwil Kementerian Hukum Riau.</p>
            <p>Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
