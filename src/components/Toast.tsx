import { useEffect } from "react";
type ToastProps = { message: string; type?: "success"|"error"|"info"; onClose: () => void; };

export default function Toast({ message, type = "info", onClose }: ToastProps) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const styles = {
    success: "bg-[#f0faf4] border-[#86efac] text-[#166534]",
    error:   "bg-[#fef2f2] border-[#fca5a5] text-[#991b1b]",
    info:    "bg-[#ede9e3] border-[#ccc7be] text-[#2a2520]",
  }[type];
  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm fade-up ${styles}`}>
      <span className="text-[13px] leading-relaxed flex-1">{message}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity text-sm leading-none">✕</button>
    </div>
  );
}
