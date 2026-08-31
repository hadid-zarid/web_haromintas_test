import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const MetricCard = ({ title, value, icon: Icon, variant = 'total', subtext, onClick }) => {
  const variantStyles = {
    total: {
      topBorder: 'bg-[#2B3056]',
      iconBg: 'bg-[#2B3056]/10 text-[#2B3056]',
      badgeBg: 'bg-slate-100 text-slate-700',
    },
    draft: {
      topBorder: 'bg-slate-500',
      iconBg: 'bg-slate-500/10 text-slate-700 border border-slate-200/60',
      badgeBg: 'bg-slate-50 text-slate-800',
    },
    harmonisasi: {
      topBorder: 'bg-amber-400',
      iconBg: 'bg-amber-500/10 text-amber-700 border border-amber-200/60',
      badgeBg: 'bg-amber-50 text-amber-800',
    },
    proses: {
      topBorder: 'bg-amber-400',
      iconBg: 'bg-amber-500/10 text-amber-700 border border-amber-200/60',
      badgeBg: 'bg-amber-50 text-amber-800',
    },
    fasilitasi: {
      topBorder: 'bg-blue-500',
      iconBg: 'bg-blue-500/10 text-blue-700 border border-blue-200/60',
      badgeBg: 'bg-blue-50 text-blue-800',
    },
    analisis: {
      topBorder: 'bg-blue-500',
      iconBg: 'bg-blue-500/10 text-blue-700 border border-blue-200/60',
      badgeBg: 'bg-blue-50 text-blue-800',
    },
    selesai: {
      topBorder: 'bg-emerald-500',
      iconBg: 'bg-emerald-500/10 text-emerald-700 border border-emerald-200/60',
      badgeBg: 'bg-emerald-50 text-emerald-800',
    },
    revisi: {
      topBorder: 'bg-rose-500',
      iconBg: 'bg-rose-500/10 text-rose-700 border border-rose-200/60',
      badgeBg: 'bg-rose-50 text-rose-800',
    },
  };

  const style = variantStyles[variant] || variantStyles.total;

  return (
    <div
      onClick={onClick}
      className="group relative flex min-h-[135px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-[#2B3056]/30 hover:shadow-md cursor-pointer"
    >
      {/* Top Accent Stripe */}
      <span className={`absolute inset-x-0 top-0 h-1 ${style.topBorder}`} />

      {/* Card Header: Title & Tinted Icon */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500 block leading-tight">
            {title}
          </span>
        </div>
        {Icon && (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${style.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Card Value & Subtitle */}
      <div className="mt-3">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold tracking-tight text-[#2B3056] leading-none">
            {value}
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-[#2B3056] group-hover:text-[#FFD82B] transition-colors">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
        {subtext && (
          <p className="mt-2 text-[11px] font-medium text-slate-500 truncate">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
