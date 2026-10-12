import React from 'react';
import { Link } from '@inertiajs/react';
import Modal from '../common/Modal';
import { User, Clock, FileText, ArrowRight } from 'lucide-react';

/**
 * Popup rincian satu aktivitas di beranda. Hanya menampilkan data yang sudah
 * diterjemahkan pemanggil (judul kalimat + baris berlabel), tidak pernah payload mentah.
 */
export const ActivityDetailModal = ({ isOpen, onClose, activity }) => {
  if (!activity) return null;

  const Icon = activity.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rincian Aktivitas" size="md">
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-start gap-3 border-b pb-3 border-slate-200">
            <div className="p-2 bg-[#2B3056] text-[#FFD82B] rounded-lg shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${activity.badgeClass}`}>
                {activity.badge}
              </span>
              <h4 className="text-sm font-bold text-[#2B3056] mt-1 break-words">{activity.title}</h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="min-w-0">
              <span className="font-semibold text-slate-700 block text-[11px] mb-0.5">Dilakukan oleh:</span>
              <div className="flex items-start gap-1.5">
                <User className="w-3.5 h-3.5 text-[#2B3056] shrink-0 mt-0.5" />
                <span className="break-words">
                  {activity.user}
                  {activity.role && <span className="text-slate-400"> · {activity.role}</span>}
                </span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 block text-[11px] mb-0.5">Waktu:</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2B3056] shrink-0" />
                <span>{activity.timestamp}</span>
              </div>
            </div>
          </div>

          {activity.berkas && (
            <div className="pt-3 border-t border-slate-200 text-xs">
              <span className="font-semibold text-slate-700 block text-[11px] mb-1">Berkas terkait:</span>
              <div className="flex items-start gap-2 text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
                <FileText className="w-4 h-4 text-[#2B3056] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-semibold break-words">{activity.berkas.judul}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{activity.berkas.nomor}</p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 text-xs">
            <span className="font-semibold text-slate-700 block text-[11px] mb-1">Rincian:</span>
            {activity.rincian.length > 0 ? (
              <dl className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
                {activity.rincian.map(({ label, value }) => (
                  <div key={label} className="p-2.5 flex flex-col sm:flex-row sm:gap-3">
                    <dt className="font-semibold text-slate-500 sm:w-32 shrink-0">{label}</dt>
                    <dd className="text-slate-800 break-words min-w-0 whitespace-pre-wrap">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 break-words">{activity.desc}</p>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[44px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
          {activity.berkas && (
            <Link
              href={`/peraturan/${activity.berkas.id}`}
              className="w-full sm:w-auto min-h-[44px] px-4 text-xs font-bold text-white bg-[#2B3056] hover:bg-[#3A4070] rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Buka Berkas</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FFD82B]" />
            </Link>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ActivityDetailModal;
