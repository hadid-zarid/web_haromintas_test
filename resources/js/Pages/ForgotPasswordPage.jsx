import React, { useEffect, useRef } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
  Mail,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  KeyRound,
  Send
} from 'lucide-react';
import FlashAlert from '../components/common/FlashAlert';
import logoHarmonitas from '../assets/LOGO HARMONITAS.png';
import logoPengayoman from '../assets/logo_pengayoman.png';

const RECAPTCHA_SCRIPT_ID = 'google-recaptcha-script';

export const ForgotPasswordPage = ({ recaptchaSiteKey = null }) => {
  const { flash } = usePage().props;
  const recaptchaContainerRef = useRef(null);
  const recaptchaWidgetIdRef = useRef(null);

  const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
    email: '',
    recaptcha_token: '',
  });

  // Muat & render widget Google reCAPTCHA v2 (checkbox) untuk pemulihan kata sandi
  useEffect(() => {
    if (!recaptchaSiteKey) return;

    const renderWidget = () => {
      if (!recaptchaContainerRef.current || recaptchaWidgetIdRef.current !== null) return;
      recaptchaWidgetIdRef.current = window.grecaptcha.render(recaptchaContainerRef.current, {
        sitekey: recaptchaSiteKey,
        callback: (token) => {
          setData('recaptcha_token', token);
          clearErrors('recaptcha_token');
        },
        'expired-callback': () => setData('recaptcha_token', ''),
        'error-callback': () => setData('recaptcha_token', ''),
      });
    };

    if (window.grecaptcha?.render) {
      window.grecaptcha.ready(renderWidget);
    } else {
      window.onHarmonitasRecaptchaLoad = renderWidget;
      if (!document.getElementById(RECAPTCHA_SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = RECAPTCHA_SCRIPT_ID;
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onHarmonitasRecaptchaLoad&render=explicit&hl=id';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      recaptchaWidgetIdRef.current = null;
    };
  }, [recaptchaSiteKey]);

  // Token reCAPTCHA hanya berlaku sekali: reset widget setelah setiap percobaan kirim
  const resetRecaptcha = () => {
    if (recaptchaWidgetIdRef.current !== null && window.grecaptcha?.reset) {
      window.grecaptcha.reset(recaptchaWidgetIdRef.current);
    }
    setData('recaptcha_token', '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (recaptchaSiteKey && !data.recaptcha_token) {
      setError('recaptcha_token', 'Silakan centang kotak "Saya bukan robot" terlebih dahulu.');
      return;
    }

    post('/forgot-password', {
      onFinish: () => {
        resetRecaptcha();
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-white relative flex flex-col justify-center items-center p-4 sm:p-6 overflow-hidden antialiased font-sans">
      <Head title="Lupa Kata Sandi - HARMONITAS" />

      {/* Background Layer 1: Structured Micro Grid with Slow Subtle Drift Animation */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] animate-hero-grid"
        style={{
          backgroundImage: `
            linear-gradient(to right, #2B3056 1px, transparent 1px),
            linear-gradient(to bottom, #2B3056 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Background Layer 2: Subtle Ambient Warmth */}
      <div
        className="absolute -top-16 right-1/4 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl animate-hero-glow-1"
        style={{
          background: "radial-gradient(circle, rgba(255, 216, 43, 0.14) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />
      <div
        className="absolute -bottom-16 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-30 blur-3xl animate-hero-glow-2"
        style={{
          background: "radial-gradient(circle, rgba(43, 48, 86, 0.10) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />

      {/* Top Header Navigation Controls */}
      <div className="w-full max-w-lg mb-3 flex items-center justify-between z-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 hover:bg-white border border-slate-200 hover:border-[#2B3056]/30 rounded-xl text-xs font-bold text-[#2B3056] shadow-2xs transition-all duration-150 backdrop-blur-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#2B3056]" />
          <span>Kembali ke Login</span>
        </Link>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF9DF] text-[#2B3056] border border-[#FFD82B]/60 rounded-md text-[10px] font-bold shadow-2xs">
          <KeyRound className="w-3 h-3 text-[#B3912D]" />
          Pemulihan Akun
        </span>
      </div>

      {/* Main Bento Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden backdrop-blur-sm z-10">
        
        {/* Header Branding Navy Blue (#2B3056) - Sleek & Compact */}
        <div className="relative bg-[#2B3056] text-white py-5 px-6 sm:py-6 sm:px-7 text-center border-b border-[#3A4070] overflow-hidden">
          <div 
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-xl pointer-events-none opacity-25"
            style={{ background: 'radial-gradient(circle, #FFC800 0%, transparent 70%)' }}
          />

          {/* Logo HARMONITAS (Clear & High Contrast in Frosted White Rounded-xl Badge) */}
          <div className="relative mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/95 border border-white/30 shadow-sm flex items-center justify-center mb-2.5 p-1.5 shrink-0">
            <img src={logoHarmonitas} alt="Logo HARMONITAS" className="w-full h-full object-contain" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-white text-[10px] font-bold mb-1 border border-white/15 shadow-2xs">
            <img src={logoPengayoman} alt="Pengayoman" className="h-3.5 w-3.5 object-contain" />
            <span>Kantor Wilayah Kementerian Hukum Riau</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide text-white">
            Lupa Kata Sandi Akun?
          </h2>
          <p className="text-[11px] text-[#FFD82B] font-medium mt-0.5 tracking-wide">
            Masukkan email kedinasan Anda untuk menerima tautan pemulihan kata sandi
          </p>
        </div>

        {/* Flash Notifications */}
        <FlashAlert flash={flash} className="mx-6 mt-6" />

        {/* Form Content */}
        <div className="p-6 sm:p-8 space-y-5">
          <p className="text-xs text-slate-600 font-normal leading-relaxed">
            Sistem akan mengirimkan pesan berisi tautan khusus ke email kedinasan Anda. Klik tombol di dalam email tersebut untuk melanjutkan ke tahap pembuatan kata sandi baru.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2B3056] mb-1.5">
                Alamat Email Kedinasan Terdaftar <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="nama.pegawai@gmail.com"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50/70 border rounded-2xl text-xs font-semibold text-[#2B3056] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2B3056]/10 focus:border-[#2B3056] transition-all ${
                    errors.email ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Google reCAPTCHA v2 (checkbox) */}
            {recaptchaSiteKey && (
              <div>
                {/* Widget Google berukuran tetap 304px: diperkecil sedikit pada layar sempit agar tidak terpotong */}
                <div className="flex justify-center">
                  <div
                    ref={recaptchaContainerRef}
                    className="min-h-[78px] origin-center max-[400px]:scale-[0.9]"
                  />
                </div>
                {errors.recaptcha_token && (
                  <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center justify-center gap-1 text-center">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.recaptcha_token}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 text-[#2B3056] font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{processing ? 'Memproses...' : 'Lanjutkan Reset Password'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link
              href="/login"
              className="text-xs font-bold text-[#2B3056] hover:text-[#FFC800] transition-colors"
            >
              Sudah ingat kata sandi Anda? Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
