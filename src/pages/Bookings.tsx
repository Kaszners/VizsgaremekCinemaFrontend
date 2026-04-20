import { useEffect, useState } from "react";
import { getMyBookings, cancelBooking, getShowtimes } from "../services/api";
import Toast from "../components/Toast";

const STATUS: Record<string, { label: string; cls: string }> = {
  PENDING:   { label: "Megerősítésre vár", cls: "text-[#b08030] bg-[#fef3e2] border-[#f0d090]" },
  CONFIRMED: { label: "Megerősítve",        cls: "text-[#2d7a3a] bg-[#f0faf4] border-[#86efac]" },
  CANCELLED: { label: "Lemondva",           cls: "text-[#c08080] bg-[#fef2f2] border-[#fca5a5]" },
  EXPIRED:   { label: "Lejárt",             cls: "text-[#8c8880] bg-[#f2f0ec] border-[#ccc7be]"  },
};

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success"|"error"|"info" } | null>(null);

  const load = async () => {
    try {
      const [b, s] = await Promise.all([getMyBookings(), getShowtimes()]);
      setBookings(b); setShowtimes(s);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleCancel = async (id: number) => {
    if (!confirm("Biztosan le szeretnéd mondani ezt a foglalást?")) return;
    setCancelling(id);
    try { await cancelBooking(id); setToast({ msg: "Foglalás lemondva.", type: "success" }); load(); }
    catch { setToast({ msg: "Hiba a lemondás során.", type: "error" }); }
    finally { setCancelling(null); }
  };

  const getShowtime = (showtimeId: number) => showtimes.find(s => s.id === showtimeId);

  const grouped: Record<string, any[]> = {};
  bookings.forEach(b => {
    const st = getShowtime(b.showtimeId);
    const key = st
      ? `${st.movieTitle}|||${st.id}`
      : `Vetítés #${b.showtimeId}|||${b.showtimeId}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({ ...b, _showtime: st });
  });

  return (
    <div className="min-h-screen bg-[#f2f0ec]">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-[#ede9e3] border-b border-[#ccc7be] px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] font-medium text-[#8b6f47] uppercase tracking-widest mb-2">Fiók</p>
          <h1 className="text-[32px] text-[#2a2520]" style={{ fontFamily: "'Playfair Display', serif" }}>Foglalásaim</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-10 text-center">
            <p className="text-[13px] font-medium text-[#2a2520]">Nincs foglalásod.</p>
            <p className="text-[12px] text-[#8c8880] mt-1 mb-4">Böngéssz a vetítések között</p>
            <a href="/showtimes" className="text-[13px] font-medium text-[#8b6f47] bg-[#f0e8d8] border border-[#d4c0a0] rounded-lg px-4 py-2 no-underline hover:bg-[#e8d8bc] transition-colors">
              Vetítések megtekintése
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.entries(grouped).map(([key, items], gi) => {
              const [movieTitle] = key.split("|||");
              const st = items[0]._showtime;
              return (
                <div key={gi} className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl overflow-hidden fade-up" style={{ animationDelay: `${gi * 70}ms` }}>
                  {/* Group header */}
                  <div className="bg-[#e4e0da] border-b border-[#ccc7be] px-5 py-3.5">
                    <p className="text-[14px] font-medium text-[#2a2520]">{movieTitle}</p>
                    {st && (
                      <p className="text-[12px] text-[#8c8880] mt-0.5">
                        {new Date(st.showStartTime).toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" })}
                        {" · "}
                        {new Date(st.showStartTime).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}
                        {" · "}
                        {st.theaterName}
                      </p>
                    )}
                  </div>
                  {/* Seats */}
                  {items.map((b, bi) => {
                    const st = STATUS[b.bookingStatus] ?? STATUS.EXPIRED;
                    const canCancel = b.bookingStatus === "PENDING" || b.bookingStatus === "CONFIRMED";
                    return (
                      <div key={b.id} className={`flex items-center justify-between px-5 py-3.5 ${bi > 0 ? "border-t border-[#ccc7be]" : ""}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] text-[#2a2520]">Hely #{b.seatId}</span>
                          <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-lg border ${st.cls}`}>{st.label}</span>
                        </div>
                        {canCancel && (
                          <button
                            onClick={() => handleCancel(b.id)}
                            disabled={cancelling === b.id}
                            className="text-[12px] font-medium text-[#8c8880] px-3 py-1 rounded-lg border border-[#ccc7be] hover:bg-[#ddd9d3] hover:border-[#b0aa9f] transition-colors disabled:opacity-50"
                          >
                            {cancelling === b.id ? "..." : "Lemondás"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
