import React from 'react';
import Modal from '../common/Modal';
import RoleBadge from '../common/RoleBadge';
import { History, User, Clock, FileText, Activity } from 'lucide-react';

export const ActivityDetailModal = ({ isOpen, onClose, activity }) => {
  if (!activity) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Histori Aktivitas"
      size="md"
    >
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b pb-3 border-slate-200">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-900 text-amber-400 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{activity.action}</h4>
                <p className="text-[10px] text-slate-500">ID Aktivitas: {activity.id}</p>
              </div>
            </div>
            <RoleBadge role={activity.role} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div>
              <span className="font-semibold text-slate-700 block text-[11px] mb-0.5">Pengguna Pelaksana:</span>
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-900" />
                <span>{activity.user}</span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 block text-[11px] mb-0.5">Waktu Eksekusi:</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-900" />
                <span>{activity.timestamp}</span>
              </div>
            </div>
          </div>

          {activity.regulationTitle && (
            <div className="pt-2 border-t border-slate-200 text-xs">
              <span className="font-semibold text-slate-700 block text-[11px] mb-0.5">Peraturan Terkait:</span>
              <div className="flex items-start gap-1.5 text-slate-800 font-medium bg-white p-2.5 rounded-lg border border-slate-200">
                <FileText className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                <span>{activity.regulationTitle}</span>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 text-xs">
            <span className="font-semibold text-slate-700 block text-[11px] mb-0.5">Rincian Perubahan / Keterangan:</span>
            <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed font-mono text-[11px]">
              {activity.detail}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ActivityDetailModal;
