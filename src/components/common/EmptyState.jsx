import React from 'react';
import { FileQuestion } from 'lucide-react';

export const EmptyState = ({ title = 'Data Tidak Ditemukan', description = 'Tidak ada peraturan yang sesuai dengan kriteria pencarian atau filter Anda.', actionBtn }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-4">{description}</p>
      {actionBtn}
    </div>
  );
};

export default EmptyState;
