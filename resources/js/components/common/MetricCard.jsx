import React from 'react';
import { TrendingUp } from 'lucide-react';

export const MetricCard = ({ title, value, icon: Icon, variant = 'total', subtext }) => {
  const variantStyles = {
    total: {
      card: 'bg-gradient-to-br from-[#303661] to-[#4B5286] border-white/10',
      iconBox: 'border-white/15 bg-white/10 text-white',
      subtext: 'text-white/70',
    },
    proses: {
      card: 'bg-gradient-to-br from-[#FFBC4A] to-[#FF8F2D] border-[#FF9E30]/40',
      iconBox: 'border-white/25 bg-white/15 text-white',
      subtext: 'text-white/85',
    },
    analisis: {
      card: 'bg-gradient-to-br from-[#40518F] to-[#303661] border-white/10',
      iconBox: 'border-white/15 bg-white/10 text-white',
      subtext: 'text-white/70',
    },
    selesai: {
      card: 'bg-gradient-to-br from-[#269666] to-[#177A52] border-[#18835A]/40',
      iconBox: 'border-white/20 bg-white/15 text-white',
      subtext: 'text-white/80',
    },
  };

  const trendValues = {
    total: '+15%',
    proses: '+12%',
    analisis: '+8%',
    selesai: '+9%',
  };

  const style = variantStyles[variant] || variantStyles.total;

  return (
    <article
      className={`group flex min-h-[132px] cursor-default flex-col justify-between rounded-[18px] border p-5 text-white shadow-[0_12px_24px_rgba(30,39,89,0.13)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_17px_34px_rgba(30,39,89,0.2)] ${style.card}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="max-w-[150px] text-sm font-bold leading-5 text-white/90">{title}</p>
        {Icon && (
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${style.iconBox}`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <span className="text-4xl font-extrabold leading-none tracking-tight">{value}</span>
        {subtext && (
          <span className={`mb-0.5 inline-flex items-center gap-1 text-[9px] font-semibold ${style.subtext}`}>
            <TrendingUp className="h-3 w-3" />
            {trendValues[variant]}
          </span>
        )}
      </div>
    </article>
  );
};

export default MetricCard;
