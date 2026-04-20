import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSeatAvailability, getShowtimes, createBooking } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

interface Seat { id: number; rowNumber: number; seatNumber: number; status: string; }

export default function ShowtimeDetail() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState<any>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success"|"error"|"info" } | null>(null);

  useEffect(() => {
    Promise.all([getShowtimes(), getSeatAvailability(Number(id))])
      .then(([sts, seatData]) => {
        setShowtime(sts.find((s: any) => s.id === Number(id)) ?? null);
        setSeats(seatData);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [id]);

  const toggleSeat = (seatId: number, status: string) => {
    if (status !== "AVAILABLE") return;
    setSelected(prev => prev.includes(seatId) ? prev.filter(x => x !== seatId) : [...prev, seatId]);
  };

  const handleBook = async () => {
    if (!profile) { navigate("/login"); return; }
    if (selected.length === 0) { setToast({ msg: "Válassz ki legalább egy helyet!", type: "info" }); return; }
    setBooking(true);
    try {
      await createBooking(Number(id), selected);
      setToast({ msg: "Foglalás elküldve! Ellenőrizd az e-mailjedet a megerősítéshez.", type: "success" });
      setSelected([]);
      setSeats(await getSeatAvailability(Number(id)));
    } catch (err: any) {
      setToast({ msg: err.response?.status === 409 ? "Egy vagy több hely már foglalt." : "Hiba a foglalás során.", type: "error" });
    } finally { setBooking(false); }
  };

  const rows = seats.reduce((acc, s) => {
    if (!acc[s.rowNumber]) acc[s.rowNumber] = [];
    acc[s.rowNumber].push(s);
    return acc;
  }, {} as Record<number, Seat[]>);

  const seatClass = (seat: Seat) => {
    if (selected.includes(seat.id)) return "bg-[#2a2520] border-[#2a2520] text-[#f2f0ec] cursor-pointer";
    if (seat.status === "BOOKED")   return "bg-[#f2d9d9] border-[#e8b4b4] text-[#c08080] cursor-not-allowed";
    if (seat.status === "LOCKED")   return "bg-[#fef3e2] border-[#f0d090] text-[#b08030] cursor-not-allowed";
    return "bg-[#f2f0ec] border-[#ccc7be] text-[#8c8880] cursor-pointer hover:border-[#8b6f47] hover:text-[#2a2520] hover:bg-[#e8e4de]";
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="skeleton h-32 rounded-xl mb-6" />
      <div className="skeleton h-64 rounded-xl" />
    </div>
  );

  if (!showtime) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <p className="text-[14px] text-[#8c8880]">A vetítés nem található.</p>
      <Link to="/showtimes" className="text-[13px] text-[#8b6f47] no-underline hover:text-[#6b5230]">← Vetítések</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f2f0ec]">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-[#ede9e3] border-b border-[#ccc7be] px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <Link to="/showtimes" className="text-[12px] text-[#8c8880] no-underline hover:text-[#2a2520] transition-colors">← Vetítések</Link>
          <h1 className="text-[30px] text-[#2a2520] mt-3 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{showtime.movieTitle}</h1>
          <div className="flex gap-3 flex-wrap">
            <span className="text-[12px] text-[#8c8880] bg-[#f2f0ec] border border-[#ccc7be] rounded-lg px-3 py-1">
              📅 {new Date(showtime.showStartTime).toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
            </span>
            <span className="text-[12px] text-[#8c8880] bg-[#f2f0ec] border border-[#ccc7be] rounded-lg px-3 py-1">
              🕐 {new Date(showtime.showStartTime).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <span className="text-[12px] text-[#8c8880] bg-[#f2f0ec] border border-[#ccc7be] rounded-lg px-3 py-1">
              🎭 {showtime.theaterName}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Legend */}
        <div className="flex gap-5 mb-8 flex-wrap">
          {[
            { cls: "bg-[#f2f0ec] border-[#ccc7be]", label: "Szabad" },
            { cls: "bg-[#2a2520] border-[#2a2520]", label: "Kiválasztott" },
            { cls: "bg-[#fef3e2] border-[#f0d090]", label: "Folyamatban" },
            { cls: "bg-[#f2d9d9] border-[#e8b4b4]", label: "Foglalt" },
          ].map(({ cls, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded border ${cls}`} />
              <span className="text-[12px] text-[#8c8880]">{label}</span>
            </div>
          ))}
        </div>

        {/* Screen */}
        <div className="text-center mb-8">
          <div className="inline-block bg-[#ede9e3] border border-[#ccc7be] rounded px-16 py-1.5">
            <span className="text-[11px] font-medium text-[#8c8880] uppercase tracking-widest">Vászon</span>
          </div>
        </div>

        {/* Seat map */}
        <div className="flex flex-col gap-2 items-center mb-10">
          {Object.entries(rows).sort(([a], [b]) => Number(a) - Number(b)).map(([row, rowSeats]) => (
            <div key={row} className="flex gap-1.5 items-center">
              <span className="w-5 text-[11px] text-[#b0aa9f] text-right mr-1">{row}</span>
              {rowSeats.sort((a, b) => a.seatNumber - b.seatNumber).map(seat => (
                <button
                  key={seat.id}
                  onClick={() => toggleSeat(seat.id, seat.status)}
                  title={`Sor ${seat.rowNumber}, Hely ${seat.seatNumber}`}
                  className={`w-8 h-7 text-[11px] rounded border transition-all ${seatClass(seat)}`}
                >
                  {seat.seatNumber}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Booking summary */}
        <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-6 max-w-sm mx-auto">
          <h3 className="text-[16px] font-medium text-[#2a2520] mb-4">Foglalás összegzése</h3>
          {selected.length === 0 ? (
            <p className="text-[13px] text-[#8c8880] mb-4">Kattints egy szabad helyre a kiválasztáshoz.</p>
          ) : (
            <div className="mb-4">
              <p className="text-[12px] text-[#8c8880] mb-2">Kiválasztott helyek:</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.map(sId => {
                  const s = seats.find(x => x.id === sId);
                  return s ? (
                    <span key={sId} className="text-[12px] font-medium text-[#8b6f47] bg-[#f0e8d8] border border-[#d4c0a0] rounded-lg px-2.5 py-0.5">
                      {s.rowNumber}/{s.seatNumber}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {!profile && (
            <p className="text-[12px] text-[#8c8880] mb-3">
              A foglaláshoz{" "}
              <Link to="/login" className="text-[#8b6f47] font-medium no-underline hover:text-[#6b5230]">be kell jelentkezni</Link>.
            </p>
          )}

          <button
            onClick={handleBook}
            disabled={booking || selected.length === 0}
            className="w-full py-2.5 bg-[#2a2520] text-[#f2f0ec] text-[13px] font-medium rounded-lg border border-[#2a2520] transition-colors hover:bg-[#3d3730] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {booking ? "Foglalás folyamatban..." : selected.length === 0 ? "Válassz helyet" : `${selected.length} hely foglalása`}
          </button>
        </div>
      </div>
    </div>
  );
}
