import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const FlashAlert = ({ flash, className = '' }) => {
  const [showSuccess, setShowSuccess] = useState(Boolean(flash?.success));
  const [showError, setShowError] = useState(Boolean(flash?.error));
  const [showInfo, setShowInfo] = useState(Boolean(flash?.info));
  const [showWarning, setShowWarning] = useState(Boolean(flash?.warning));

  useEffect(() => {
    setShowSuccess(Boolean(flash?.success));
  }, [flash?.success]);

  useEffect(() => {
    setShowError(Boolean(flash?.error));
  }, [flash?.error]);

  useEffect(() => {
    setShowInfo(Boolean(flash?.info));
  }, [flash?.info]);

  useEffect(() => {
    setShowWarning(Boolean(flash?.warning));
  }, [flash?.warning]);

  if (!showSuccess && !showError && !showInfo && !showWarning) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Success Notification */}
      {showSuccess && flash?.success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start justify-between gap-3 text-emerald-800 text-xs font-bold shadow-xs transition-all duration-200">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed flex-1 pt-0.5">{flash.success}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccess(false)}
            className="p-1 -mr-1 -mt-1 rounded-lg text-emerald-600 hover:text-emerald-950 hover:bg-emerald-100/70 transition cursor-pointer shrink-0"
            title="Tutup pemberitahuan"
            aria-label="Tutup pemberitahuan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Notification */}
      {showError && flash?.error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-3 text-rose-800 text-xs font-bold shadow-xs transition-all duration-200">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed flex-1 pt-0.5">{flash.error}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowError(false)}
            className="p-1 -mr-1 -mt-1 rounded-lg text-rose-600 hover:text-rose-950 hover:bg-rose-100/70 transition cursor-pointer shrink-0"
            title="Tutup pemberitahuan"
            aria-label="Tutup pemberitahuan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Warning Notification */}
      {showWarning && flash?.warning && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-3 text-amber-800 text-xs font-bold shadow-xs transition-all duration-200">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed flex-1 pt-0.5">{flash.warning}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowWarning(false)}
            className="p-1 -mr-1 -mt-1 rounded-lg text-amber-600 hover:text-amber-950 hover:bg-amber-100/70 transition cursor-pointer shrink-0"
            title="Tutup pemberitahuan"
            aria-label="Tutup pemberitahuan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Info Notification */}
      {showInfo && flash?.info && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start justify-between gap-3 text-blue-800 text-xs font-bold shadow-xs transition-all duration-200">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed flex-1 pt-0.5">{flash.info}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowInfo(false)}
            className="p-1 -mr-1 -mt-1 rounded-lg text-blue-600 hover:text-blue-950 hover:bg-blue-100/70 transition cursor-pointer shrink-0"
            title="Tutup pemberitahuan"
            aria-label="Tutup pemberitahuan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashAlert;
