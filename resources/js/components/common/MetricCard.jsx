import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

export const MetricCard = ({ title, value, icon: Icon, variant = 'total', subtext, onClick }) => {
  const variantStyles = {
    total: {
      card: 'bg-[#323864] text-white shadow-sm border border-[#3E4576]',
      textTitle: 'text-white/90',
      textVal: 'text-white',
      sub: 'text-white/80',
      iconBox: 'bg-white/10 text-white border border-white/20'
    },
    // Proses Harmonisasi: Oranye / Kuning Emas (Original)
    harmonisasi: {
      card: 'bg-gradient-to-br from-[#FFC837] to-[#FF8008] text-white shadow-sm border border-[#FF9800]/50',
      textTitle: 'text-white/90',
      textVal: 'text-white',
      sub: 'text-white/90',
      iconBox: 'bg-white/20 text-white border border-white/30'
    },
    proses: {
      card: 'bg-gradient-to-br from-[#FFC837] to-[#FF8008] text-white shadow-sm border border-[#FF9800]/50',
      textTitle: 'text-white/90',
      textVal: 'text-white',
      sub: 'text-white/90',
      iconBox: 'bg-white/20 text-white border border-white/30'
    },
    // Proses Fasilitasi: Biru Muda / Sky Blue (Permintaan User)
    fasilitasi: {
      card: 'bg-gradient-to-br from-[#38BDF8] to-[#0284C7] text-white shadow-sm border border-sky-400/50',
      textTitle: 'text-white/90',
      textVal: 'text-white',
      sub: 'text-white/90',
      iconBox: 'bg-white/20 text-white border border-white/30'
    },
    analisis: {
      card: 'bg-gradient-to-br from-[#38BDF8] to-[#0284C7] text-white shadow-sm border border-sky-400/50',
      textTitle: 'text-white/90',
      textVal: 'text-white',
      sub: 'text-white/90',
      iconBox: 'bg-white/20 text-white border border-white/30'
    },
    // Selesai: Hijau / Emerald Green (Permintaan User)
    selesai: {
      card: 'bg-gradient-to-br from-[#27A169] to-[#127A4A] text-white shadow-sm border border-[#1A8754]/50',
      textTitle: 'text-white/90',
      textVal: 'text-white',
      sub: 'text-white/90',
      iconBox: 'bg-white/20 text-white border border-white/30'
    },
    revisi: {
      card: 'bg-gradient-to-br from-[#F43F5E] to-[#E11D48] text-white shadow-sm border border-rose-500/50',
      textTitle: 'text-white/90',
      textVal: 'text-white',
      sub: 'text-white/90',
      iconBox: 'bg-white/20 text-white border border-white/30'
    }
  };

  const style = variantStyles[variant] || variantStyles.total;

  return (
    <div 
      onClick={onClick}
      className={`group p-5 sm:p-6 ${style.card} hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] hover:brightness-105 transition-all duration-300 rounded-[22px] flex flex-col justify-between min-h-[140px] cursor-pointer relative overflow-hidden`}
    >
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div>
          <span className={`text-[14px] font-bold tracking-wide ${style.textTitle} block leading-snug`}>
            {title}
          </span>
        </div>
        {Icon && (
          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl ${style.iconBox} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[6deg] shadow-xs`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 relative z-10">
        <div className="flex items-baseline justify-between">
          <span className={`text-3xl sm:text-4xl font-bold tracking-tight leading-none ${style.textVal}`}>
            {value}
          </span>
          <ArrowUpRight className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
        {subtext && (
          <p className={`mt-2 text-[10px] ${style.sub} font-medium`}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
