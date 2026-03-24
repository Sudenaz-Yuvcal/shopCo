import React from "react";

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-zinc-100 border-t-black rounded-full animate-spin"></div>
        <div className="absolute font-black italic text-[10px] tracking-tighter">
          CO.
        </div>
      </div>
      <p className="mt-6 text-[11px] font-black uppercase tracking-[0.4em] italic text-black animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingOverlay;
