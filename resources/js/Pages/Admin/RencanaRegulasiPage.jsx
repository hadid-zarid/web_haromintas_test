import React, { useEffect, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../components/layout/AppLayout';
import FlashAlert from '../../components/common/FlashAlert';
import Modal from '../../components/common/Modal';
import { AlertCircle, Check, EyeOff, Globe, Info, Loader2, Pencil, Plus, Save, Star, Trash2 } from 'lucide-react';

// Urutan kolom mengikuti lembar rekap Excel.
const KOLOM = [
  { key: 'propem', label: 'Jumlah Propem', mobile: 'Propem (Raperda)' },
  { key: 'harm_ranperda', label: 'Jumlah Harmonisasi', mobile: 'Harmonisasi Raperda' },
  { key: 'progsun', label: 'Jumlah Progsun', mobile: 'Progsun (Raperkada)' },
  { key: 'harm_ranperkada', label: 'Jumlah Harmonisasi', mobile: 'Harmonisasi Raperkada' },
];
const KELOMPOK = ['Kabupaten', 'Kota', 'Provinsi'];
const GRID = 'md:grid md:grid-cols-[2.5rem_minmax(9rem,1fr)_repeat(4,minmax(5.5rem,8rem))] md:gap-3 md:items-center';

const tombol = 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD82B]/70 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
const tombolSekunder = `${tombol} border border-slate-300 bg-white text-[#2B3056] hover:bg-slate-50`;

const angka = (v) => Number(v) || 0;

const isianAwal = (rekap) => ({
  sumber: rekap?.sumber ?? '',
  items: (rekap?.wilayah ?? []).map(({ kabupaten_id, propem, harm_ranperda, progsun, harm_ranperkada }) => ({
    kabupaten_id, propem, harm_ranperda, progsun, harm_ranperkada,
  })),
});

export const RencanaRegulasiPage = ({ daftarTahun = [], rekap = null }) => {
  const { flash, errors } = usePage().props;
  const [konfirmasi, setKonfirmasi] = useState(null); // { judul, pesan, label, bahaya, jalankan }
  const [processing, setProcessing] = useState(false);

  const form = useForm(isianAwal(rekap));
  const formTahun = useForm({ tahun: '' });

  // Inertia bisa mempertahankan state halaman saat tahun yang dibuka berganti (misalnya setelah
  // membuat tahun baru). Isian wajib diganti dengan angka tahun itu agar angka tahun lain tidak ikut tersimpan.
  useEffect(() => {
    const awal = isianAwal(rekap);
    form.setDefaults(awal);
    form.setData(awal);
    form.clearErrors();
  }, [rekap?.tahun]); // eslint-disable-line react-hooks/exhaustive-deps

  const catatanBelumDisimpan = (tahun) =>
    form.isDirty && rekap?.tahun === tahun
      ? ' Perubahan angka yang belum disimpan tidak ikut; yang dipakai adalah angka terakhir yang disimpan.'
      : '';

  const jalankan = (kirim, opsi = {}) => {
    setProcessing(true);
    kirim({
      preserveScroll: true,
      ...opsi,
      onFinish: () => { setProcessing(false); setKonfirmasi(null); },
    });
  };

  const bukaTahun = (tahun) => {
    const pindah = () => router.get('/admin/rencana', { tahun }, { preserveScroll: true });
    if (!form.isDirty) return pindah();
    setKonfirmasi({
      judul: 'Perubahan belum disimpan',
      pesan: `Angka rekap tahun ${rekap.tahun} yang belum disimpan akan hilang jika Anda membuka tahun ${tahun}.`,
      label: `Buka tahun ${tahun}`,
      bahaya: true,
      jalankan: pindah,
    });
  };

  const aksiTahun = {
    tayangkan: (t) => setKonfirmasi({
      judul: `Tayangkan rekap ${t}?`,
      pesan: `Rekap tahun ${t} akan bisa dilihat semua pengunjung landing page.${catatanBelumDisimpan(t)}`,
      label: 'Tayangkan',
      jalankan: () => jalankan((o) => router.put(`/admin/rencana/${t}/publikasi`, { is_published: true }, o), { preserveState: true }),
    }),
    tarik: (t) => setKonfirmasi({
      judul: `Tarik rekap ${t}?`,
      pesan: `Rekap tahun ${t} tidak lagi tampil di landing page dan kembali menjadi draf. Angkanya tetap tersimpan.`,
      label: 'Tarik dari landing page',
      bahaya: true,
      jalankan: () => jalankan((o) => router.put(`/admin/rencana/${t}/publikasi`, { is_published: false }, o), { preserveState: true }),
    }),
    utama: (t) => setKonfirmasi({
      judul: `Tampilkan ${t} pertama?`,
      pesan: `Saat landing page dibuka, pengunjung langsung melihat rekap tahun ${t}. Tahun lain yang tayang tetap bisa dipilih.`,
      label: 'Jadikan tampil pertama',
      jalankan: () => jalankan((o) => router.put(`/admin/rencana/${t}/utama`, {}, o), { preserveState: true }),
    }),
    hapus: (t) => setKonfirmasi({
      judul: `Hapus draf ${t}?`,
      pesan: `Draf rekap tahun ${t} beserta seluruh angkanya akan dihapus permanen.`,
      label: 'Hapus draf',
      bahaya: true,
      jalankan: () => jalankan((o) => router.delete(`/admin/rencana/${t}`, o)),
    }),
  };

  const buatTahun = (e) => {
    e.preventDefault();
    formTahun.post('/admin/rencana/tahun', { preserveScroll: true, onSuccess: () => formTahun.reset() });
  };

  return (
    <AppLayout
      title="Target ProPem & Progsun"
      subtitle="Rekap tahunan ProPem/Progsun dan harmonisasi yang tampil di landing page."
    >
      <Head title="Target ProPem & Progsun - HARMONITAS" />

      <div className="space-y-5">
        <FlashAlert flash={flash} />

        {/* Penjelasan singkat cara kerja halaman */}
        <section className="rounded-2xl border border-[#2B3056]/15 bg-[#2B3056]/[0.03] p-4 sm:p-5">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-[#2B3056] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1.5 text-sm text-slate-700 leading-relaxed">
              <p>
                Angka di halaman ini adalah angka yang tampil di <strong>landing page, bagian Statistik</strong>.
                Semua angka <strong>diisi manual</strong> dari rekap resmi (Excel); sistem tidak menghitung apa pun secara otomatis.
              </p>
              <p className="text-slate-600">
                Langkahnya: <strong>buat rekap tahun</strong> → <strong>isi angka</strong> → <strong>Simpan</strong> → <strong>Tayangkan</strong>.
                Tahun berlabel <strong>Tampil pertama</strong> adalah tahun yang langsung dilihat pengunjung saat landing page dibuka.
              </p>
            </div>
          </div>
        </section>

        {errors?.rekap && (
          <p role="alert" className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            {errors.rekap}
          </p>
        )}

        {/* Daftar tahun */}
        <section aria-labelledby="judul-daftar-tahun" className="rounded-2xl border border-[#E2E2DC] bg-white p-4 sm:p-6">
          <h2 id="judul-daftar-tahun" className="text-base font-bold text-[#2B3056]">Daftar tahun</h2>
          <p className="text-sm text-slate-500 mb-4">Hanya tahun berstatus <strong>Tayang</strong> yang bisa dilihat pengunjung.</p>

          {daftarTahun.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">Belum ada rekap. Buat rekap tahun pertama di bawah.</p>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
              {daftarTahun.map((t) => {
                const sedangDiedit = rekap?.tahun === t.tahun;
                return (
                  <li key={t.tahun} className={`flex flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between ${sedangDiedit ? 'bg-[#FFD82B]/10' : ''}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-extrabold text-[#2B3056]">Tahun {t.tahun}</span>
                      {t.is_published ? (
                        <span className="rounded-md border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800">Tayang</span>
                      ) : (
                        <span className="rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">Draf</span>
                      )}
                      {t.is_default && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800">
                          <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" /> Tampil pertama
                        </span>
                      )}
                      {sedangDiedit && <span className="text-xs font-semibold text-slate-500">(sedang dibuka)</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                      {!sedangDiedit && (
                        <button type="button" onClick={() => bukaTahun(t.tahun)} className={tombolSekunder}>
                          <Pencil className="w-4 h-4" aria-hidden="true" /> Buka
                        </button>
                      )}
                      {t.is_published ? (
                        <button
                          type="button"
                          onClick={() => aksiTahun.tarik(t.tahun)}
                          disabled={t.is_default}
                          title={t.is_default ? 'Pilih tahun lain sebagai tampil pertama dulu' : undefined}
                          className={tombolSekunder}
                        >
                          <EyeOff className="w-4 h-4" aria-hidden="true" /> Tarik
                        </button>
                      ) : (
                        <button type="button" onClick={() => aksiTahun.tayangkan(t.tahun)} className={`${tombol} bg-emerald-600 text-white hover:bg-emerald-700`}>
                          <Globe className="w-4 h-4" aria-hidden="true" /> Tayangkan
                        </button>
                      )}
                      {t.is_published && !t.is_default && (
                        <button type="button" onClick={() => aksiTahun.utama(t.tahun)} className={tombolSekunder}>
                          <Star className="w-4 h-4" aria-hidden="true" /> Jadikan tampil pertama
                        </button>
                      )}
                      {!t.is_published && (
                        <button type="button" onClick={() => aksiTahun.hapus(t.tahun)} className={`${tombol} border border-rose-200 bg-white text-rose-700 hover:bg-rose-50`}>
                          <Trash2 className="w-4 h-4" aria-hidden="true" /> Hapus
                        </button>
                      )}
                    </div>
                    {t.is_published && t.is_default && (
                      <p className="text-xs text-slate-500 lg:hidden">Tahun tampil pertama tidak bisa ditarik. Jadikan tahun lain tampil pertama dulu.</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <form onSubmit={buatTahun} className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end" noValidate>
            <div className="sm:w-48">
              <label htmlFor="tahun-baru" className="block text-sm font-semibold text-[#2B3056] mb-1.5">Buat rekap tahun baru</label>
              <input
                id="tahun-baru"
                type="number"
                inputMode="numeric"
                min="2020"
                placeholder={String(new Date().getFullYear())}
                value={formTahun.data.tahun}
                onChange={(e) => { formTahun.setData('tahun', e.target.value); formTahun.clearErrors(); }}
                aria-invalid={Boolean(formTahun.errors.tahun)}
                aria-describedby={formTahun.errors.tahun ? 'tahun-baru-error' : undefined}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3.5 text-sm focus:border-[#2B3056] focus:outline-none focus:ring-2 focus:ring-[#2B3056]/30"
              />
            </div>
            <button type="submit" disabled={formTahun.processing || !formTahun.data.tahun} className={`${tombol} w-full sm:w-auto bg-[#2B3056] text-white hover:bg-[#1A1A5E]`}>
              <Plus className="w-4 h-4" aria-hidden="true" /> Buat sebagai draf
            </button>
          </form>
          {formTahun.errors.tahun && <p id="tahun-baru-error" className="mt-1.5 text-xs font-semibold text-rose-600">{formTahun.errors.tahun}</p>}
        </section>

        {rekap && <EditorRekap rekap={rekap} form={form} />}
      </div>

      <Modal isOpen={Boolean(konfirmasi)} onClose={() => !processing && setKonfirmasi(null)} title={konfirmasi?.judul} size="sm">
        <p className="text-sm text-slate-600 leading-relaxed">{konfirmasi?.pesan}</p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => setKonfirmasi(null)} disabled={processing} className={tombolSekunder}>Batal</button>
          <button
            type="button"
            onClick={() => konfirmasi?.jalankan()}
            disabled={processing}
            className={`${tombol} text-white ${konfirmasi?.bahaya ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#2B3056] hover:bg-[#1A1A5E]'}`}
          >
            {processing && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            {konfirmasi?.label}
          </button>
        </div>
      </Modal>
    </AppLayout>
  );
};

// Tabel isian rekap satu tahun. Di layar kecil tiap wilayah tampil sebagai kartu dengan 4 isian.
const EditorRekap = ({ rekap, form }) => {
  const { data, setData, errors, clearErrors, processing, isDirty, recentlySuccessful } = form;

  const ubahAngka = (index, key, value) => {
    setData('items', data.items.map((it, i) => (i === index ? { ...it, [key]: value } : it)));
    clearErrors(`items.${index}.${key}`);
  };

  const total = Object.fromEntries(KOLOM.map(({ key }) => [key, data.items.reduce((acc, it) => acc + angka(it[key]), 0)]));
  const errorPertama = Object.entries(errors).find(([k]) => k.startsWith('items'))?.[1];

  const simpan = (e) => {
    e.preventDefault();
    form.put(`/admin/rencana/${rekap.tahun}`, {
      preserveScroll: true,
      onSuccess: () => form.setDefaults(),
    });
  };

  return (
    <section aria-labelledby="judul-rekap" className="rounded-2xl border border-[#E2E2DC] bg-white p-4 sm:p-6">
      <h2 id="judul-rekap" className="text-base font-bold text-[#2B3056]">Rekap tahun {rekap.tahun}</h2>
      <p className="text-sm text-slate-500 mb-5">Salin angka dari Excel. Isi 0 jika memang tidak ada. Harmonisasi boleh lebih besar dari target.</p>

      <form onSubmit={simpan} className="space-y-5" noValidate>
        <div className="max-w-xl">
          <label htmlFor="sumber" className="block text-sm font-semibold text-[#2B3056] mb-1.5">Sumber data</label>
          <input
            id="sumber"
            type="text"
            maxLength={255}
            value={data.sumber}
            onChange={(e) => { setData('sumber', e.target.value); clearErrors('sumber'); }}
            placeholder="Contoh: Rekap Kanwil Kemenkum Riau tahun 2026"
            aria-invalid={Boolean(errors.sumber)}
            className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3.5 text-sm focus:border-[#2B3056] focus:outline-none focus:ring-2 focus:ring-[#2B3056]/30"
          />
          <p className="mt-1.5 text-xs text-slate-500">Tampil di landing page sebagai keterangan sumber.</p>
          {errors.sumber && <p className="mt-1 text-xs font-semibold text-rose-600">{errors.sumber}</p>}
        </div>

        <div className="md:overflow-hidden md:rounded-xl md:border md:border-slate-200">
          {/* Kepala tabel (hanya layar md ke atas) */}
          <div className="hidden md:block border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600" aria-hidden="true">
            <div className={GRID}>
              <span /><span />
              <span className="col-span-2 rounded bg-blue-100/70 py-1 text-center text-blue-900">Raperda</span>
              <span className="col-span-2 rounded bg-amber-100/70 py-1 text-center text-amber-900">Raperkada</span>
            </div>
            <div className={`${GRID} mt-1.5`}>
              <span>No</span>
              <span>Nama Daerah</span>
              {KOLOM.map((k, i) => <span key={i} className="text-center">{k.label}</span>)}
            </div>
          </div>
  
          <div className="space-y-4 md:space-y-0">
            {KELOMPOK.map((kelompok) => {
              const baris = data.items
                .map((it, index) => ({ it, index, info: rekap.wilayah[index] }))
                .filter(({ info }) => info.kelompok === kelompok);
              if (baris.length === 0) return null;
  
              return (
                <div key={kelompok}>
                  <h3 className="mb-2 md:mb-0 rounded-lg md:rounded-none bg-[#FFF3DC] px-3 py-1.5 text-center text-sm font-bold text-[#2B3056]">{kelompok}</h3>
                  <div className="space-y-3 md:space-y-0 md:divide-y md:divide-slate-100">
                    {baris.map(({ it, index, info }, no) => (
                      <div key={it.kabupaten_id} className={`rounded-xl border border-slate-200 p-3 md:rounded-none md:border-0 md:px-3 md:py-2 ${GRID}`}>
                        <span className="hidden md:block text-sm font-semibold text-slate-400">{no + 1}</span>
                        <span className="block text-sm font-bold text-[#2B3056] break-words">{info.nama_kabupaten}</span>
                        <div className="mt-3 grid grid-cols-2 gap-3 md:contents">
                          {KOLOM.map((k) => {
                            const error = errors[`items.${index}.${k.key}`];
                            return (
                              <label key={k.key} className="block">
                                <span className="mb-1 block text-xs font-semibold text-slate-600 md:sr-only">
                                  {k.mobile}<span className="sr-only"> {info.nama_kabupaten}</span>
                                </span>
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  min="0"
                                  max="9999"
                                  step="1"
                                  value={it[k.key]}
                                  onChange={(e) => ubahAngka(index, k.key, e.target.value)}
                                  aria-invalid={Boolean(error)}
                                  title={error}
                                  className={`w-full min-h-[44px] rounded-lg border px-2.5 text-right text-sm font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-[#2B3056]/30 ${error ? 'border-rose-400 bg-rose-50' : 'border-slate-300'}`}
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
  
            {/* Total = penjumlahan isian, untuk dicocokkan dengan Excel */}
            <div className={`rounded-xl bg-[#E6F0D8] p-3 md:rounded-none md:px-3 md:py-2.5 ${GRID}`}>
              <span className="hidden md:block" />
              <span className="block text-sm font-extrabold text-[#2B3056]">Total</span>
              <dl className="mt-2 grid grid-cols-2 gap-2 md:contents">
                {KOLOM.map((k) => (
                  <div key={k.key} className="md:text-right md:pr-2.5">
                    <dt className="text-xs text-slate-600 md:sr-only">{k.mobile}</dt>
                    <dd className="text-sm font-extrabold tabular-nums text-[#2B3056]">{total[k.key]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {errorPertama && (
          <p role="alert" className="text-sm font-semibold text-rose-600">Ada isian yang belum valid (ditandai merah): {errorPertama}</p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="submit" disabled={processing || !isDirty} className={`${tombol} w-full sm:w-auto bg-[#2B3056] text-white hover:bg-[#1A1A5E]`}>
            {processing ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Save className="w-4 h-4" aria-hidden="true" />}
            Simpan rekap {rekap.tahun}
          </button>
          <p role="status" className="text-sm font-semibold">
            {recentlySuccessful ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700"><Check className="w-4 h-4" aria-hidden="true" /> Tersimpan</span>
            ) : isDirty ? (
              <span className="text-amber-700">Ada perubahan yang belum disimpan.</span>
            ) : null}
          </p>
        </div>
      </form>
    </section>
  );
};

export default RencanaRegulasiPage;
