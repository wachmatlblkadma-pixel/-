import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-50 bg-[#004331] text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#85f8c4]/30 animate-in slide-in-from-bottom-5 duration-300"
      dir="rtl"
    >
      <span className="material-symbols-outlined text-[#85f8c4] text-[22px]">
        check_circle
      </span>
      <span className="font-sans text-xs sm:text-sm font-bold">{message}</span>
      <button
        onClick={onClose}
        className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 mr-1"
      >
        ✕
      </button>
    </div>
  );
};
