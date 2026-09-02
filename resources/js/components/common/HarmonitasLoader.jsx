import React, { useState, useEffect } from "react";
import { FileText, Scale, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";

/**
 * HarmonitasLoader - Anti-Mainstream Bespoke Legal Tech Loading Animations
 * 
 * Variants:
 * - "scanner" (Default): Holographic legal document scanner with sweeping gold laser & cycling status
 * - "scales": Counter-rotating orbital rings with glowing golden Scales of Justice
 * - "button" / "inline": Ultra-sleek dual-ring quantum micro-loader for buttons and chips
 * - "fullscreen": Ambient backdrop blur overlay with holographic scanner and progress text
 */
export const HarmonitasLoader = ({
  variant = "scanner",
  title = "Memproses Naskah Regulasi...",
  subtitle = "Sistem Harmonisasi & Fasilitasi Peraturan Perundang-undangan Kanwil Kemenkum Provinsi Riau",
  steps = [
    "Menghubungkan ke layanan HARMONITAS...",
    "Memvalidasi sesi autentikasi pengguna...",
    "Memuat struktur 7 dokumen permohonan...",
    "Sinkronisasi database JDIH & Kanwil Kemenkum Provinsi Riau...",
    "Menyiapkan ruang kerja digital...",
  ],
  size = "md",
  className = "",
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!steps || steps.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [steps]);

  /* =========================================================
     1. INLINE / BUTTON QUANTUM LOADER
     ========================================================= */
  if (variant === "button" || variant === "inline") {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
          {/* Outer Orbital Ring */}
          <span className="absolute inset-0 rounded-full border-[1.5px] border-[#FFD82B]/30 border-t-[#FFD82B] animate-orbit-fast" />
          {/* Inner Counter Ring */}
          <span className="absolute inset-[2.5px] rounded-full border-[1.5px] border-white/20 border-b-white animate-orbit-counter" />
          {/* Core Pulsing Gold Dot */}
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD82B] shadow-[0_0_8px_#FFD82B]" />
        </span>
        {title && <span className="text-xs font-bold tracking-wide">{title}</span>}
      </span>
    );
  }

  /* =========================================================
     2. NEURAL SCALES OF JUSTICE LOADER
     ========================================================= */
  if (variant === "scales") {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
        {/* Orbital System Container */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          {/* Ambient Glow Pulse */}
          <div className="absolute inset-0 rounded-full bg-[#FFD82B]/15 blur-xl animate-pulse-glow-ring" />
          
          {/* Outer Golden Ring with Node */}
          <div className="absolute inset-0 rounded-full border border-[#FFD82B]/40 animate-orbit-clockwise">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#FFD82B] shadow-[0_0_10px_#FFD82B]" />
          </div>

          {/* Middle Navy Dashed Ring */}
          <div className="absolute inset-2.5 rounded-full border border-dashed border-[#2B3056]/30 dark:border-white/20 animate-orbit-counter" />

          {/* Inner Ring */}
          <div className="absolute inset-5 rounded-full border border-indigo-400/30 animate-orbit-clockwise" />

          {/* Center Scales Orb */}
          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-[#2B3056] to-[#1E2342] text-[#FFD82B] shadow-lg border border-[#FFD82B]/30 transition-transform duration-300">
            <Scale className="h-7 w-7 animate-mascot-wave" />
          </div>

          {/* Orbiting Sparkles */}
          <Sparkles className="absolute -top-1 right-2 h-4 w-4 text-[#FFD82B] animate-float-badge1" />
        </div>

        {/* Labels & Dynamic Status */}
        <div className="mt-5 max-w-sm space-y-1.5">
          <h4 className="text-sm font-black text-[#2B3056] tracking-tight">{title}</h4>
          {steps && steps.length > 0 ? (
            <p className="text-xs font-semibold text-slate-500 transition-all duration-300 min-h-[1.5rem] flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD82B] animate-ping shrink-0" />
              <span>{steps[currentStepIndex]}</span>
            </p>
          ) : (
            <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
          )}
        </div>
      </div>
    );
  }

  /* =========================================================
     3. HOLOGRAPHIC DOCUMENT SCANNER LOADER (Default)
     ========================================================= */
  const scannerContent = (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* 3D Holographic Scanner Card */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Ambient Halo behind document */}
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#2B3056]/20 via-[#FFD82B]/20 to-blue-500/20 blur-2xl animate-pulse-glow-ring" />

        {/* Floating Futuristic Document Container */}
        <div className="relative h-40 w-32 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-3.5 overflow-hidden transition-transform duration-300 hover:scale-105">
          {/* Top Paper Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <span className="h-2 w-2 rounded-full bg-[#FFD82B]" />
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <ShieldCheck className="h-3.5 w-3.5 text-[#2B3056]" />
          </div>

          {/* Shimmering Legal Skeleton Lines */}
          <div className="mt-3 space-y-2">
            <div className="h-2 w-3/4 rounded-full bg-slate-200/80 animate-shimmer-glow" />
            <div className="h-2 w-full rounded-full bg-slate-100 animate-shimmer-glow" />
            <div className="h-2 w-5/6 rounded-full bg-slate-200/80 animate-shimmer-glow" />
            <div className="h-2 w-4/5 rounded-full bg-slate-100 animate-shimmer-glow" />
            <div className="h-2 w-2/3 rounded-full bg-slate-200/80 animate-shimmer-glow" />
          </div>

          {/* Watermark Logo Center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <Scale className="h-20 w-20 text-[#2B3056]" />
          </div>

          {/* Sweeping Laser Scan Line */}
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD82B] to-transparent shadow-[0_0_12px_#FFD82B] animate-laser-scan z-20 pointer-events-none" />

          {/* Laser Glow Area */}
          <div className="absolute left-0 right-0 h-6 bg-gradient-to-b from-[#FFD82B]/20 to-transparent animate-laser-scan z-10 pointer-events-none" />
        </div>

        {/* Floating Hologram Mini Badges */}
        <div className="absolute -bottom-2 -right-3 flex items-center gap-1 rounded-xl bg-[#2B3056] px-2.5 py-1 text-[10px] font-black text-white shadow-md border border-[#FFD82B]/40 animate-float-badge1 z-30">
          <Sparkles className="h-3 w-3 text-[#FFD82B]" />
          <span>AI SCANNER</span>
        </div>

        <div className="absolute -top-2 -left-3 flex items-center gap-1 rounded-xl bg-white px-2 py-1 text-[9px] font-extrabold text-[#2B3056] shadow-sm border border-slate-200 animate-float-badge2 z-30">
          <FileText className="h-3 w-3 text-blue-600" />
          <span>RANPERDA</span>
        </div>
      </div>

      {/* Title, Subtitle, & Animated Typing Phase */}
      <div className="mt-6 max-w-md space-y-2">
        <h3 className="text-base font-black text-[#2B3056] tracking-tight">{title}</h3>

        {/* Kinetic 3-Dot Pulse */}
        <div className="flex items-center justify-center gap-1.5 py-0.5">
          <span className="h-2 w-2 rounded-full bg-[#2B3056] animate-kinetic-dot-1" />
          <span className="h-2 w-2 rounded-full bg-[#FFD82B] animate-kinetic-dot-2" />
          <span className="h-2 w-2 rounded-full bg-[#3A4070] animate-kinetic-dot-3" />
        </div>

        {/* Active Phase Pill */}
        {steps && steps.length > 0 ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs font-bold text-[#2B3056] shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-slate-600 font-semibold">{steps[currentStepIndex]}</span>
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );

  /* =========================================================
     4. FULLSCREEN OVERLAY VARIANT
     ========================================================= */
  if (variant === "fullscreen" || variant === "overlay") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2342]/70 backdrop-blur-md transition-all animate-fadeIn">
        <div className="relative max-w-sm w-full bg-white/95 rounded-3xl p-8 shadow-2xl border border-white/40 flex flex-col items-center">
          {scannerContent}
        </div>
      </div>
    );
  }

  return scannerContent;
};

export default HarmonitasLoader;
