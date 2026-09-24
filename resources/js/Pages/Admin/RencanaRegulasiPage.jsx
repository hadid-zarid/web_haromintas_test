import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '../../components/layout/AppLayout';
import FlashAlert from '../../components/common/FlashAlert';
import {
  FileOutput,
  Save,
  Globe,
  Lock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Building2,
  Landmark,
  MapPin,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const RencanaRegulasiPage = ({
  selectedYear,
  availableYears,
  items: initialItems = [],
  isPublished,
  publishedAt,
  sumberResmi: initialSumber = '',
}) => {
  const { flash } = usePage().props || {};
  const [year, setYear] = useState(selectedYear);
  const [sumberResmi, setSumberResmi] = useState(initialSumber || '');
  const [items, setItems] = useState(
    initialItems.map((it) => ({
      kabupaten_id: it.kabupaten_id,
      nama_kabupaten: it.nama_kabupaten,
      nama_singkat: it.nama_singkat,
      kelompok: it.kelompok,
      propem: it.propem,
      progsun: it.progsun,
      harm_ranperda: it.harm_ranperda,
      harm_ranperkada: it.harm_ranperkada,
    }))
  );

  const [saving, setSaving] = useState(false);
  const [togglingPublish, setTogglingPublish] = useState(false);

  const handleYearChange = (newYear) => {
    setYear(newYear);
    router.get(
      '/admin/rencana',
      { tahun: newYear },
      { preserveState: false, preserveScroll: true }
    );
  };

  const handleValueChange = (kabId, field, val) => {
    const num = val === '' ? 0 : Math.max(0, parseInt(val, 10) || 0);
    setItems((prev) =>
      prev.map((row) => (row.kabupaten_id === kabId ? { ...row, [field]: num } : row))
    );
  };

  const handleSaveAll = (e) => {
    e.preventDefault();
    setSaving(true);

    router.post(
      '/admin/rencana',
      {
        tahun: year,
        sumber_resmi: sumberResmi,
        items: items.map((it) => ({
          kabupaten_id: it.kabupaten_id,
          propem: it.propem,
          progsun: it.progsun,
        })),
      },
      {
        preserveScroll: true,
        onFinish: () => setSaving(false),
      }
    );
  };

  const handleTogglePublish = () => {
    const nextState = !isPublished;
    const confirmMsg = nextState
      ? `Apakah Anda yakin ingin mempublikasikan dataset target ProPem & Progsun tahun ${year} ke Landing Page publik?`
      : `Apakah Anda yakin ingin menonaktifkan publikasi tahun ${year}? Tampilan publik akan otomatis kembali ke Data Historis 2025.`;

    if (!window.confirm(confirmMsg)) return;

    setTogglingPublish(true);
    router.post(
      '/admin/rencana/publish',
      {
        tahun: year,
        is_published: nextState,
      },
      {
        preserveScroll: true,
        onFinish: () => setTogglingPublish(false),
      }
    );
  };

  const totalPropem = items.reduce((acc, it) => acc + (it.propem || 0), 0);
  const totalHarmPerda = items.reduce((acc, it) => acc + (it.harm_ranperda || 0), 0);
  const totalProgsun = items.reduce((acc, it) => acc + (it.progsun || 0), 0);
  const totalHarmPerkada = items.reduce((acc, it) => acc + (it.harm_ranperkada || 0), 0);

  return (
    <AppLayout>
      <Head title={`Kelola Target ProPem & Progsun (${year}) - HARMONITAS Admin`} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Flash Alert */}
        <FlashAlert flash={flash} />

        {/* Page Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#2B3056]/15 bg-[#2B3056]/5 px-2.5 py-1 text-xs font-bold text-[#2B3056]">
                <FileOutput className="h-3.5 w-3.5 text-[#FFC800]" />
                Manajemen Data Perencanaan Regulasi
              </span>
              <h1 className="mt-2 text-2xl font-black text-[#2B3056] sm:text-3xl">
                Target ProPem &amp; Progsun Tahunan
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Input target resmi ProPem (Ranperda) dan Progsun (Ranperkada) per wilayah, serta atur publikasi dataset ke landing page publik.
              </p>
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-600">Pilih Tahun:</span>
              <select
                value={year}
                onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
                className="h-10 rounded-xl border border-slate-300 bg-white px-3.5 text-xs font-bold text-[#2B3056] focus:border-[#2B3056] focus:ring-1 focus:ring-[#2B3056]"
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    Tahun {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Publication Control Banner */}
        <div
          className={`rounded-2xl border p-5 sm:p-6 transition-all ${
            isPublished
              ? 'border-emerald-300 bg-emerald-50/60'
              : 'border-amber-300 bg-amber-50/50'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold shadow-xs ${
                  isPublished
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {isPublished ? (
                  <Globe className="h-5 w-5" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#2B3056]">
                    Status Publikasi Dataset {year}:
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-extrabold ${
                      isPublished
                        ? 'bg-emerald-200 text-emerald-900 border border-emerald-300'
                        : 'bg-amber-200 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {isPublished ? 'AKTIF DITAYANGKAN' : 'DRAF / BELUM TAYANG'}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
                  {isPublished
                    ? `Dataset tahun berjalan ${year} telah dipublikasikan secara resmi ke landing page publik HARMONITAS. Pengunjung dapat melihat target dan perkembangan harmonisasi real-time.`
                    : `Dataset tahun ${year} saat ini berstatus draf internal. Landing page publik tetap aman menampilkan Data Historis 2025 secara default hingga Anda mengaktifkannya.`}
                </p>

                {publishedAt && (
                  <p className="mt-1 text-[11px] font-mono text-slate-500">
                    Terakhir dipublikasikan pada: {publishedAt}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleTogglePublish}
              disabled={togglingPublish}
              className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-xs font-extrabold shadow-sm transition-all duration-200 cursor-pointer ${
                isPublished
                  ? 'bg-white border border-rose-300 text-rose-700 hover:bg-rose-50'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:brightness-105'
              } disabled:opacity-50`}
            >
              {isPublished ? (
                <>
                  <RotateCcw className="h-4 w-4" />
                  <span>Tarik Publikasi (Kembali ke 2025)</span>
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  <span>Aktifkan Publikasi ke Publik</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Input Form & Table */}
        <form onSubmit={handleSaveAll} className="space-y-6">
          {/* Metadata Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#2B3056] mb-1.5">
                  Sumber Rujukan Resmi Dataset {year}:
                </label>
                <input
                  type="text"
                  value={sumberResmi}
                  onChange={(e) => setSumberResmi(e.target.value)}
                  placeholder="Contoh: SK DPRD Riau No. 14 Tahun 2026 & Keputusan Kepala Daerah"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#2B3056] focus:bg-white focus:ring-1 focus:ring-[#2B3056]"
                />
              </div>

              <div className="flex items-center justify-end sm:pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] px-6 text-xs font-bold text-[#2B3056] shadow-sm hover:brightness-105 transition duration-200 cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Menyimpan...' : 'Simpan Seluruh Target'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#2B3056]">
                  Rincian 13 Wilayah di Provinsi Riau
                </h3>
                <p className="text-xs text-slate-500">
                  Angka 0 diperbolehkan jika memang terkonfirmasi tidak ada rencana regulasi pada tahun tersebut.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  ProPem Ranperda: {totalPropem} (Selesai: {totalHarmPerda})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  Progsun Ranperkada: {totalProgsun} (Selesai: {totalHarmPerkada})
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/60 font-extrabold text-slate-700 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4 min-w-[200px]">Nama Wilayah</th>
                    <th className="py-3 px-4 w-28 text-center">Kelompok</th>
                    <th className="py-3 px-4 min-w-[150px] bg-blue-50/60 border-l border-r border-blue-100 text-blue-950 text-center">
                      ProPem Ranperda (Target)
                    </th>
                    <th className="py-3 px-4 w-32 bg-blue-50/30 text-blue-900 text-center">
                      Realisasi Harm.
                    </th>
                    <th className="py-3 px-4 min-w-[150px] bg-amber-50/60 border-l border-r border-amber-100 text-amber-950 text-center">
                      Progsun Ranperkada (Target)
                    </th>
                    <th className="py-3 px-4 w-32 bg-amber-50/30 text-amber-900 text-center">
                      Realisasi Harm.
                    </th>
                    <th className="py-3 px-4 w-32 text-center bg-slate-50 font-black">
                      Total Rencana
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((row, index) => {
                    const rowTotalRencana = (row.propem || 0) + (row.progsun || 0);
                    const rowTotalHarm = (row.harm_ranperda || 0) + (row.harm_ranperkada || 0);

                    return (
                      <tr key={row.kabupaten_id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-center font-bold text-slate-400">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#2B3056] text-[#FFD82B]">
                              {row.kelompok === 'Provinsi' ? (
                                <Landmark className="h-3.5 w-3.5" />
                              ) : row.kelompok === 'Kota' ? (
                                <Building2 className="h-3.5 w-3.5" />
                              ) : (
                                <MapPin className="h-3.5 w-3.5" />
                              )}
                            </span>
                            <span className="font-bold text-[#2B3056]">{row.nama_kabupaten}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.kelompok === 'Provinsi'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : row.kelompok === 'Kota'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-slate-200/80 text-slate-700'
                            }`}
                          >
                            {row.kelompok}
                          </span>
                        </td>

                        {/* ProPem Input */}
                        <td className="py-2.5 px-4 bg-blue-50/30 border-l border-blue-100 text-center">
                          <input
                            type="number"
                            min="0"
                            value={row.propem}
                            onChange={(e) =>
                              handleValueChange(row.kabupaten_id, 'propem', e.target.value)
                            }
                            className="w-24 h-9 rounded-lg border border-blue-200 bg-white px-2.5 text-center font-bold text-blue-950 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-4 text-center bg-blue-50/10 font-bold text-slate-700">
                          {row.harm_ranperda}
                        </td>

                        {/* Progsun Input */}
                        <td className="py-2.5 px-4 bg-amber-50/30 border-l border-amber-100 text-center">
                          <input
                            type="number"
                            min="0"
                            value={row.progsun}
                            onChange={(e) =>
                              handleValueChange(row.kabupaten_id, 'progsun', e.target.value)
                            }
                            className="w-24 h-9 rounded-lg border border-amber-200 bg-white px-2.5 text-center font-bold text-amber-950 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                          />
                        </td>
                        <td className="py-3 px-4 text-center bg-amber-50/10 font-bold text-slate-700 border-r border-amber-100">
                          {row.harm_ranperkada}
                        </td>

                        {/* Total */}
                        <td className="py-3 px-4 text-center bg-slate-50 font-black text-[#2B3056]">
                          {rowTotalRencana}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                    <td colSpan={3} className="py-3.5 px-4 text-right uppercase tracking-wider text-xs">
                      Total Seluruh Wilayah (13 Daerah):
                    </td>
                    <td className="py-3.5 px-4 text-center text-blue-950 bg-blue-100/50 text-sm">
                      {totalPropem}
                    </td>
                    <td className="py-3.5 px-4 text-center text-blue-900 bg-blue-50/50 text-sm">
                      {totalHarmPerda}
                    </td>
                    <td className="py-3.5 px-4 text-center text-amber-950 bg-amber-100/50 text-sm">
                      {totalProgsun}
                    </td>
                    <td className="py-3.5 px-4 text-center text-amber-900 bg-amber-50/50 text-sm">
                      {totalHarmPerkada}
                    </td>
                    <td className="py-3.5 px-4 text-center bg-slate-200 text-sm">
                      {totalPropem + totalProgsun}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] px-7 text-xs font-bold text-[#2B3056] shadow-sm hover:brightness-105 transition duration-200 cursor-pointer disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Menyimpan...' : 'Simpan Seluruh Target'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default RencanaRegulasiPage;
