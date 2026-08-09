import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react';

export const Toast = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start p-4 rounded-xl text-sm font-bold transition-all duration-200 ${
              isSuccess ? 'bg-emerald-900 text-white border border-emerald-800 shadow-md' :
              isError ? 'bg-red-900 text-white border border-red-800 shadow-md' :
              isWarning ? 'bg-amber-900 text-white border border-amber-800 shadow-md' :
              'bg-slate-900 text-white border border-slate-800 shadow-md'
            }`}
          >
            <div className="mr-3 mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            </div>
            <div className="flex-1 pr-2 leading-snug">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
