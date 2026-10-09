import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Check, Circle, KeyRound, Loader2, UserRound } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import FlashAlert from '../components/common/FlashAlert';
import RoleBadge from '../components/common/RoleBadge';
import { useAuth } from '../context/AuthContext';

// Cerminan aturan Password::defaults() di server — hanya bantuan visual,
// validasi sebenarnya tetap di UpdatePasswordRequest.
const SYARAT_PASSWORD = [
  { label: 'Minimal 8 karakter', test: (v) => v.length >= 8 },
  { label: 'Huruf besar dan huruf kecil', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { label: 'Minimal satu angka', test: (v) => /\d/.test(v) },
  { label: 'Minimal satu karakter spesial', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const inisial = (nama = '') =>
  nama.split(/\s+/).filter(Boolean).slice(0, 2).map((kata) => kata[0].toUpperCase()).join('') || '?';

const inputClass = (hasError) =>
  `w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border bg-[#F8F8F5] text-sm font-medium text-[#2B3056] placeholder-slate-400 transition
   focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2B3056]/15 focus:border-[#2B3056]
   ${hasError ? 'border-rose-400' : 'border-[#E2E2DC]'}`;

const Field = ({ id, label, hint, error, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-[#2B3056] mb-1.5">
      {label}
    </label>
    {children}
    {hint && !error && (
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">{hint}</p>
    )}
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p>
    )}
  </div>
);

const describedBy = (id, error, hint) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

// Tombol + status "berhasil" di sebelahnya: halaman memakai preserveScroll,
// jadi FlashAlert di atas bisa tidak terlihat saat user berada di bawah.
const SubmitRow = ({ processing, disabled, recentlySuccessful, successText, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
    <button
      type="submit"
      disabled={processing || disabled}
      className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 rounded-xl bg-[#2B3056] text-white text-sm font-bold whitespace-nowrap transition hover:bg-[#1A1A5E] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD82B]/70 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {processing && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
    <p role="status" className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
      {recentlySuccessful && (
        <>
          <Check className="w-4 h-4" aria-hidden="true" />
          {successText}
        </>
      )}
    </p>
  </div>
);

const DataDiriCard = ({ user }) => {
  const { data, setData, put, processing, errors, isDirty, recentlySuccessful, setDefaults, clearErrors } = useForm({
    nama: user?.nama ?? '',
    no_hp: user?.no_hp ?? '',
  });

  const ubah = (field, value) => { setData(field, value); clearErrors(field); };

  const submit = (e) => {
    e.preventDefault();
    put('/profil', { preserveScroll: true, onSuccess: () => setDefaults() });
  };

  return (
    <section aria-labelledby="judul-data-diri" className="rounded-2xl border border-[#E2E2DC] bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-1">
        <UserRound className="w-5 h-5 text-[#2B3056]" aria-hidden="true" />
        <h2 id="judul-data-diri" className="text-base font-bold text-[#2B3056]">Data diri</h2>
      </div>
      <p className="text-sm text-slate-500 mb-5">Nama dan nomor ini dilihat rekan kerja di riwayat berkas.</p>

      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field id="nama" label="Nama lengkap" error={errors.nama}>
          <input
            id="nama"
            type="text"
            autoComplete="name"
            maxLength={150}
            required
            value={data.nama}
            onChange={(e) => ubah('nama', e.target.value)}
            aria-invalid={Boolean(errors.nama)}
            aria-describedby={describedBy('nama', errors.nama)}
            className={inputClass(errors.nama)}
          />
        </Field>

        <Field id="no_hp" label="Nomor WhatsApp / HP" hint="Hanya angka, maksimal 13 digit." error={errors.no_hp}>
          <input
            id="no_hp"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={data.no_hp}
            onChange={(e) => ubah('no_hp', e.target.value.replace(/\D/g, '').slice(0, 13))}
            placeholder="08xxxxxxxxxx"
            aria-invalid={Boolean(errors.no_hp)}
            aria-describedby={describedBy('no_hp', errors.no_hp, true)}
            className={inputClass(errors.no_hp)}
          />
        </Field>

        <SubmitRow processing={processing} disabled={!isDirty} recentlySuccessful={recentlySuccessful} successText="Perubahan tersimpan.">
          Simpan perubahan
        </SubmitRow>
      </form>
    </section>
  );
};

const KataSandiCard = () => {
  const [tampilkan, setTampilkan] = useState(false);
  const { data, setData, put, processing, errors, reset, recentlySuccessful, clearErrors } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const ubah = (field, value) => { setData(field, value); clearErrors(field); };

  const submit = (e) => {
    e.preventDefault();
    put('/profil/password', {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: () => reset('current_password'),
    });
  };

  const tipe = tampilkan ? 'text' : 'password';
  const cocok = data.password_confirmation.length > 0 && data.password === data.password_confirmation;

  return (
    <section aria-labelledby="judul-kata-sandi" className="rounded-2xl border border-[#E2E2DC] bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-1">
        <KeyRound className="w-5 h-5 text-[#2B3056]" aria-hidden="true" />
        <h2 id="judul-kata-sandi" className="text-base font-bold text-[#2B3056]">Ganti kata sandi</h2>
      </div>
      <p className="text-sm text-slate-500 mb-5">
        Setelah diganti, akun Anda otomatis keluar di perangkat lain dan email pemberitahuan dikirim.
      </p>

      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field id="current_password" label="Kata sandi saat ini" error={errors.current_password}>
          <input
            id="current_password"
            type={tipe}
            autoComplete="current-password"
            required
            value={data.current_password}
            onChange={(e) => ubah('current_password', e.target.value)}
            aria-invalid={Boolean(errors.current_password)}
            aria-describedby={describedBy('current_password', errors.current_password)}
            className={inputClass(errors.current_password)}
          />
        </Field>

        <Field id="password" label="Kata sandi baru" error={errors.password}>
          <input
            id="password"
            type={tipe}
            autoComplete="new-password"
            required
            value={data.password}
            onChange={(e) => ubah('password', e.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={`syarat-password${errors.password ? ' password-error' : ''}`}
            className={inputClass(errors.password)}
          />
        </Field>

        <ul id="syarat-password" className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs" aria-label="Syarat kata sandi baru">
          {SYARAT_PASSWORD.map(({ label, test }) => {
            const ok = test(data.password);
            return (
              <li key={label} className={`flex items-center gap-1.5 transition-colors ${ok ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                {ok
                  ? <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  : <Circle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                <span>{label}</span>
                <span className="sr-only">{ok ? '(terpenuhi)' : '(belum terpenuhi)'}</span>
              </li>
            );
          })}
        </ul>

        <Field id="password_confirmation" label="Ulangi kata sandi baru" error={errors.password_confirmation}>
          <input
            id="password_confirmation"
            type={tipe}
            autoComplete="new-password"
            required
            value={data.password_confirmation}
            onChange={(e) => ubah('password_confirmation', e.target.value)}
            aria-invalid={Boolean(errors.password_confirmation)}
            aria-describedby="konfirmasi-status"
            className={inputClass(errors.password_confirmation)}
          />
        </Field>
        <p id="konfirmasi-status" className={`-mt-2 text-xs ${cocok ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`} aria-live="polite">
          {data.password_confirmation.length === 0 ? '' : cocok ? 'Kata sandi cocok.' : 'Belum sama dengan kata sandi baru.'}
        </p>

        <label className="flex items-center gap-2.5 min-h-[44px] text-sm text-[#2B3056] cursor-pointer select-none w-fit">
          <input
            type="checkbox"
            checked={tampilkan}
            onChange={(e) => setTampilkan(e.target.checked)}
            className="w-4 h-4 rounded accent-[#2B3056] focus-visible:ring-4 focus-visible:ring-[#FFD82B]/70"
          />
          Tampilkan kata sandi
        </label>

        <SubmitRow processing={processing} recentlySuccessful={recentlySuccessful} successText="Kata sandi diganti.">
          Ganti kata sandi
        </SubmitRow>
        <p className="text-xs text-slate-500">
          Lupa kata sandi saat ini? Keluar dari akun, lalu pilih <strong className="font-semibold text-[#2B3056]">Lupa kata sandi</strong> di halaman masuk.
        </p>
      </form>
    </section>
  );
};

export default function ProfilPage() {
  const { props } = usePage();
  const { user, role } = useAuth();

  return (
    <AppLayout title="Profil Saya" subtitle="Kelola data diri dan kata sandi akun Anda.">
      <Head title="Profil Saya - HARMONITAS" />

      <div className="mx-auto max-w-5xl space-y-5">
        <FlashAlert flash={props.flash} />

        {/* Identitas akun: hanya bisa diubah Admin */}
        <section
          aria-label="Identitas akun"
          className="rounded-2xl bg-[#2B3056] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt=""
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#FFD82B] shrink-0"
            />
          ) : (
            <div aria-hidden="true" className="w-16 h-16 rounded-2xl bg-[#FFD82B] text-[#2B3056] flex items-center justify-center text-2xl font-extrabold shrink-0">
              {inisial(user?.nama)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-xl sm:text-2xl font-extrabold leading-tight break-words">{user?.nama}</p>
            <p className="text-sm text-white/75 break-all mt-0.5">{user?.email}</p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <RoleBadge role={role} />
              <span className="text-xs text-white/75">{user?.unit}</span>
            </div>
          </div>

          <p className="text-xs text-white/60 sm:max-w-[13rem] sm:text-right">
            Email, peran, dan unit kerja hanya dapat diubah oleh Admin.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <DataDiriCard user={user} />
          <KataSandiCard />
        </div>
      </div>
    </AppLayout>
  );
}
