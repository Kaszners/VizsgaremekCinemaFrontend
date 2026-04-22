interface PageHeaderProps { eyebrow?: string; title: string; subtitle?: string; }

export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <div className="border-b border-[#ccc7be] bg-[#ede9e3] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {eyebrow && <p className="text-[11px] font-medium text-[#8b6f47] uppercase tracking-widest mb-2">{eyebrow}</p>}
        <h1 className="text-[32px] font-medium text-[#2a2520] mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h1>
        {subtitle && <p className="text-[14px] text-[#8c8880] mt-1.5">{subtitle}</p>}
      </div>
    </div>
  );
}
