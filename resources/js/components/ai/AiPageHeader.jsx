import React from 'react';
import { Scale } from 'lucide-react';
import AiTabs from './AiTabs';
import AiStatusPill from './AiStatusPill';

// Header halaman AI (setara header AI Document Checker): logo + judul di kiri, tab berbentuk pil di
// tengah, dan indikator status server di kanan. Di layar sempit disusun menumpuk.
const AiPageHeader = ({ tabs, activeTab, onTabChange, aiState, status }) => (
  <header className="rounded-2xl bg-white border-2 border-slate-200 shadow-sm px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-6">
    <div className="flex items-center gap-3.5 min-w-0">
      <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-[#2B3056] to-[#3F4780] flex items-center justify-center shadow-md shadow-[#2B3056]/25 shrink-0">
        <Scale className="w-5 h-5 text-[#FFD82B]" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <h1 className="text-lg font-extrabold tracking-tight text-[#2B3056] leading-tight">AI Document Checker</h1>
        <p className="text-[11.5px] font-medium text-slate-500">Compliance &amp; Legal Drafting Assistant</p>
      </div>
    </div>

    {tabs.length > 1 && <AiTabs tabs={tabs} active={activeTab} onChange={onTabChange} />}

    <div className="lg:flex lg:justify-end shrink-0">
      <AiStatusPill state={aiState} status={status} />
    </div>
  </header>
);

export default AiPageHeader;
