import React from 'react';

export const MetricCard = ({ title, value, icon: Icon, variant = 'total', subtext }) => {
  const variantStyles = {
    total: {
      card: 'bg-[#1A1A5E] text-white hover:brightness-110 transition-all duration-300 rounded-2xl shadow-sm border border-[#1A1A5E]',
      textTitle: 'text-white/90',
      textVal: 'text-white',
      sub: 'text-white/70',
      iconBox: 'bg-[#2E3A87] text-[#FFC800] border border-[#FFC800]/40'
    },
    proses: {
      card: 'bg-white hover:border-[#1A1A5E] transition-all duration-300 rounded-2xl shadow-sm border border-gray-200',
      textTitle: 'text-[#1A1A5E]',
      textVal: 'text-[#1A1A5E]',
      sub: 'text-gray-500',
      iconBox: 'bg-white text-[#1A1A5E] border border-[#FFC800]'
    },
    analisis: {
      card: 'bg-white hover:border-[#1A1A5E] transition-all duration-300 rounded-2xl shadow-sm border border-gray-200',
      textTitle: 'text-[#1A1A5E]',
      textVal: 'text-gray-700',
      sub: 'text-gray-500',
      iconBox: 'bg-white text-gray-500 border border-gray-300'
    },
    selesai: {
      card: 'bg-white hover:border-[#1A1A5E] transition-all duration-300 rounded-2xl shadow-sm border border-gray-200',
      textTitle: 'text-[#1A1A5E]',
      textVal: 'text-[#198754]',
      sub: 'text-gray-500',
      iconBox: 'bg-emerald-50 text-emerald-600 border border-emerald-200'
    }
  };

  const style = variantStyles[variant] || variantStyles.total;

  return (
    <div className={`p-6 ${style.card} flex flex-col justify-between min-h-[140px]`}>
      <div className="flex items-start justify-between">
        <div>
          <span className={`text-xs font-black tracking-wider uppercase ${style.textTitle} block`}>
            {title}
          </span>
          {subtext && <span className={`text-[11px] ${style.sub} block mt-1 font-medium`}>{subtext}</span>}
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
