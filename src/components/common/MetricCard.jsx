import React from 'react';

export const MetricCard = ({ title, value, icon: Icon, variant = 'total', subtext }) => {
  const variantStyles = {
    total: {
      card: 'flat-card-dark',
      textTitle: 'text-slate-300',
      textVal: 'text-white',
      sub: 'text-slate-300/80',
      iconBox: 'bg-[#2E3A87] text-[#FFC800] border border-[#FFC800]/40'
    },
    proses: {
      card: 'flat-card-amber',
      textTitle: 'text-[#1A1A5E]',
      textVal: 'text-[#1A1A5E]',
      sub: 'text-[#3D3D3A]/80',
      iconBox: 'bg-[#FFFDF0] text-[#1A1A5E] border border-[#FFC800]'
    },
    analisis: {
      card: 'flat-card-slate',
      textTitle: 'text-[#1A1A5E]',
      textVal: 'text-[#3D3D3A]',
      sub: 'text-[#3D3D3A]/70',
      iconBox: 'bg-white text-[#2E3A87] border border-[#D5D5CE]'
    },
    selesai: {
      card: 'flat-card-emerald',
      textTitle: 'text-emerald-900',
      textVal: 'text-emerald-950',
      sub: 'text-emerald-800/80',
      iconBox: 'bg-emerald-100 text-emerald-800 border border-emerald-300'
    }
  };

  const style = variantStyles[variant] || variantStyles.total;

  return (
    <div className={`p-6 ${style.card} flat-card-hover flex flex-col justify-between min-h-[140px]`}>
      <div className="flex items-start justify-between">
        <div>
          <span className={`text-xs font-black tracking-wider uppercase ${style.textTitle} block`}>
            {title}
          </span>
          {subtext && <span className={`text-[11px] ${style.sub} block mt-0.5 font-semibold`}>{subtext}</span>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg ${style.iconBox} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <span className={`text-4xl sm:text-5xl font-black tracking-tight leading-none ${style.textVal}`}>
          {value}
        </span>
      </div>
    </div>
  );
};

export default MetricCard;
