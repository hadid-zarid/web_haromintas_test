import React from 'react';

// Tab utama berbentuk pil (kontainer abu-abu, tab aktif putih bergaris tipis), sama dengan AI
// Document Checker. Bisa digeser mendatar di layar sempit; tiap tab minimal 44px di layar sentuh.
const AiTabs = ({ tabs, active, onChange }) => (
  <div
    role="tablist"
    aria-label="Menu Asisten AI"
    className="flex gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 overflow-x-auto max-w-full"
  >
    {tabs.map(({ key, label, icon: Icon }) => {
      const selected = active === key;
      return (
        <button
          key={key}
          type="button"
          role="tab"
          id={`ai-tab-${key}`}
          aria-selected={selected}
          aria-controls={`ai-panel-${key}`}
          onClick={() => onChange(key)}
          className={`inline-flex items-center gap-2 shrink-0 min-h-[44px] sm:min-h-[40px] px-4 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B3056]/40 ${
            selected
              ? 'bg-white text-[#2B3056] shadow-sm border border-[#2B3056]/15'
              : 'text-slate-500 border border-transparent hover:text-[#2B3056] hover:bg-white/60'
          }`}
        >
          {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
          {label}
        </button>
      );
    })}
  </div>
);

export default AiTabs;
