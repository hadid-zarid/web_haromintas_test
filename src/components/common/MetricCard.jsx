import React from 'react';
import { TrendingUp } from 'lucide-react';

export const MetricCard = ({ title, value, icon: Icon, variant = 'total', subtext }) => {
  const variantStyles = {
    total: {
      card: 'bg-[#323864] text-white shadow-sm border border-[#3E4576]',
      textTitle: 'text-white/90',
      textVal: 'text-white',
      sub: 'text-white/80',
      iconBox: 'bg-white/10 text-white border border-white/20'
    },
    proses: {
      card: 'bg-gradient-to-br from-[#FFC837] to-[#FF8008] text-white shadow-sm border border-[#FF9800]/50',
      textTitle: 'text-white/90',
      textVal: 'text-white',
      sub: 'text-white/90',
      iconBox: 'bg-white/20 text-white border border-white/30'
    },
    analisis: {
      card: 'bg-gradient-to-br from-[#27A169] to-[#127A4A] text-white shadow-sm border border-[#1A8754]/50',
      textTitle: 'text-white/90',
      textVal: 'text-white',
      sub: 'text-white/90',
      iconBox: 'bg-white/20 text-white border border-white/30'
    },
    selesai: {
      card: 'bg-[#323864] text-white shadow-sm border border-[#3E4576]',
      textTitle: 'text-white/90',
      textVal: 'text-white',
      sub: 'text-white/80',
      iconBox: 'bg-white/10 text-white border border-white/20'
    }
  };

  const style = variantStyles[variant] || variantStyles.total;

  // Use dummy trend percentage for UI preview if subtext is available
  const trendValues = {
    total: '+15%',
    proses: '+12%',
    analisis: '+8%',
    selesai: '+9%'
  };

  return (
    <div className={`group p-6 ${style.card} hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] hover:brightness-105 transition-all duration-500 ease-out rounded-[20px] flex flex-col min-h-[140px] cursor-pointer`}>
      <div className="flex items-start justify-between">
        <div>
          <span className={`text-[15px] font-bold tracking-wide ${style.textTitle} block leading-snug max-w-[140px]`}>
            {title}
          </span>
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-2xl ${style.iconBox} flex items-center justify-center shrink-0 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[10deg]`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <span className={`text-4xl font-bold tracking-tight leading-none ${style.textVal}`}>
          {value}
        </span>
        {subtext && (
          <div className={`flex items-center gap-1.5 mt-2 text-[10px] ${style.sub} font-medium`}>
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{trendValues[variant]} dari bulan lalu</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
