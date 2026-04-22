import { type ReactNode } from "react";
type ModalProps = { open: boolean; onClose: () => void; title?: string; children: ReactNode; };

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 fade-in"
      style={{ background: "rgba(242,240,236,0.8)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-6 w-full max-w-md shadow-xl fade-up">
        {title && <h2 className="text-[18px] font-medium text-[#2a2520] mb-5">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
