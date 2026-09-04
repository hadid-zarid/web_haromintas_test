import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '5xl': 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-[#101B4F]/65 backdrop-blur-[2px] transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div 
          className={`relative z-50 w-full ${sizeClasses[size] || 'max-w-lg'} transform overflow-hidden rounded-2xl sm:rounded-[22px] border border-[#E2E6EF] bg-white text-left align-middle shadow-[0_28px_70px_rgba(10,19,63,0.28)] transition-all max-h-[92vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          {title && (
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#303661] to-[#4B5286] px-4 sm:px-6 py-3.5 sm:py-4 shrink-0">
              <h3 className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-white truncate">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white focus:outline-none shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Tutup</span>
              </button>
            </div>
          )}

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(92vh-64px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
