import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovies, useTheaters, useShowtimes, useSeatAvailability, useBookings } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';

import { MapPin, Clock, X, Check, Armchair } from 'lucide-react';
import { toast } from 'sonner';

export default function ShowtimesPage() {
  const { showtimes, loading } = useShowtimes();
  const { movies } = useMovies();
  const { theaters } = useTheaters();

  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<number | null>(null);
  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const [activeShowtime, setActiveShowtime] = useState<number | null>(null);
  const activeShowtimeData = showtimes.find(s => s.id === activeShowtime);

  const filtered = useMemo(() => {
    return showtimes.filter(s => {
      if (selectedMovie && s.movieId !== selectedMovie) return false;
      if (selectedTheater && s.theaterId !== selectedTheater) return false;
      return true;
    });
  }, [showtimes, selectedMovie, selectedTheater]);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return 'Today';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <main className="min-h-screen bg-[#050505] pt-24 pb-28">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
        <h1 className="text-white font-extrabold tracking-[-0.02em] mb-10" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Showtimes
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:w-[280px] flex-shrink-0">
            <div className="bg-[#111111] rounded-lg p-6 sticky top-24">
              <h3 className="text-white font-semibold mb-4">Filter by Movie</h3>
              <div className="space-y-2 mb-6">
                {movies.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMovie(selectedMovie === m.id ? null : m.id)}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-sm transition-colors ${
                      selectedMovie === m.id ? 'text-white bg-white/[0.06]' : 'text-[#A3A3A3] hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <img src={`/assets/poster-${m.title.toLowerCase().replace(/[^a-z]/g, '')}.jpg`} alt="" className="w-8 h-12 object-cover rounded-sm" onError={(e) => { (e.target as HTMLImageElement).src = '/assets/poster-dune.jpg'; }} />
                    <span className="text-sm truncate">{m.title}</span>
                    {selectedMovie === m.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E50914]" />}
                  </button>
                ))}
              </div>

              <h3 className="text-white font-semibold mb-4">Filter by Theater</h3>
              <div className="space-y-2">
                {theaters.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheater(selectedTheater === t.id ? null : t.id)}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-sm transition-colors ${
                      selectedTheater === t.id ? 'text-white bg-white/[0.06]' : 'text-[#A3A3A3] hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-sm">{t.name}</span>
                    {selectedTheater === t.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E50914]" />}
                  </button>
                ))}
              </div>

              {(selectedMovie || selectedTheater) && (
                <button
                  onClick={() => { setSelectedMovie(null); setSelectedTheater(null); }}
                  className="mt-4 text-sm text-[#E50914] hover:text-white transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Showtimes List */}
          <div className="flex-1">
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-[90px] bg-white/5 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#A3A3A3]">No showtimes match your filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((st, i) => (
                  <div
                    key={st.id}
                    className="bg-[#111111] border border-white/[0.06] rounded-lg px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/[0.12] transition-colors"
                    style={{
                      animation: `slideInRight 0.5s cubic-bezier(0.33, 1, 0.68, 1) ${i * 0.05}s both`,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg truncate">{st.movieTitle}</h3>
                      <div className="flex items-center gap-1.5 text-[#A3A3A3] text-sm mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {st.theaterName}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-white text-xl font-bold">{formatTime(st.showStartTime)}</div>
                        <div className="text-[#A3A3A3] text-xs">{formatDate(st.showStartTime)}</div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveShowtime(st.id);
                          setSeatModalOpen(true);
                        }}
                        className="bg-[#E50914] hover:bg-[#b20710] text-white px-6 py-2.5 rounded-sm font-semibold text-sm transition-colors flex-shrink-0"
                      >
                        Select Seats
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seat Selection Modal */}
      {seatModalOpen && activeShowtimeData && (
        <SeatSelectionModal
          showtimeId={activeShowtime}
          movieTitle={activeShowtimeData.movieTitle}
          theaterName={activeShowtimeData.theaterName}
          showTime={formatTime(activeShowtimeData.showStartTime)}
          onClose={() => { setSeatModalOpen(false); setActiveShowtime(null); }}
        />
      )}

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </main>
  );
}

/* ─── Seat Selection Modal ─── */
function SeatSelectionModal({
  showtimeId,
  movieTitle,
  theaterName,
  showTime,
  onClose,
}: {
  showtimeId: number | null;
  movieTitle: string;
  theaterName: string;
  showTime: string;
  onClose: () => void;
}) {
  const { seats, refetch } = useSeatAvailability(showtimeId);
  const { createBooking } = useBookings();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);

  // Group seats by row
  const rows = useMemo(() => {
    const map = new Map<number, typeof seats>();
    seats.forEach(s => {
      const existing = map.get(s.row) || [];
      existing.push(s);
      map.set(s.row, existing);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [seats]);

  const toggleSeat = (seatId: number, status: string) => {
    if (status !== 'AVAILABLE') return;
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book seats');
      onClose();
      navigate('/profile');
      return;
    }
    if (selectedSeats.length === 0 || !showtimeId) return;
    try {
      setBooking(true);
      await createBooking(showtimeId, selectedSeats);
      setSuccess(true);
      toast.success('Booking confirmed!');
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const getSeatStyle = (status: string, isSelected: boolean) => {
    if (isSelected) return 'bg-[#E50914] border-[#E50914] text-white';
    if (status === 'AVAILABLE') return 'bg-white/10 border-white/[0.08] text-[#A3A3A3] hover:bg-white/20 hover:text-white cursor-pointer';
    return 'bg-white/[0.03] border-white/[0.04] text-[#333333] cursor-not-allowed';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div
        className="bg-[#111111] rounded-lg w-full max-w-[800px] max-h-[90vh] overflow-y-auto"
        style={{ animation: 'modalIn 0.3s ease-out both' }}
      >
        {!success ? (
          <>
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-white/[0.06]">
              <div>
                <h3 className="text-white text-xl font-bold">{movieTitle}</h3>
                <div className="flex items-center gap-3 mt-1 text-[#A3A3A3] text-sm">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {theaterName}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {showTime}</span>
                </div>
              </div>
              <button onClick={onClose} className="text-[#A3A3A3] hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Seat Map */}
            <div className="p-6">
              {/* Screen */}
              <div className="w-[80%] mx-auto mb-2">
                <div className="h-2 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
              </div>
              <p className="text-center text-[0.625rem] text-[#555555] tracking-[0.1em] mb-8">SCREEN</p>

              {/* Seats */}
              <div className="space-y-3">
                {rows.map(([rowNum, rowSeats]) => (
                  <div key={rowNum} className="flex items-center justify-center gap-1.5">
                    <span className="text-xs text-[#555555] w-6 text-center">{String.fromCharCode(64 + rowNum)}</span>
                    <div className="flex gap-1.5">
                      {rowSeats.sort((a, b) => a.number - b.number).map(seat => {
                        const isSelected = selectedSeats.includes(seat.seatId);
                        return (
                          <button
                            key={seat.seatId}
                            onClick={() => toggleSeat(seat.seatId, seat.status)}
                            className={`w-8 h-8 rounded border text-[0.625rem] flex items-center justify-center transition-all duration-150 ${getSeatStyle(seat.status, isSelected)}`}
                            title={`Row ${String.fromCharCode(64 + rowNum)} Seat ${seat.number}`}
                          >
                            <Armchair className="w-3.5 h-3.5" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white/10 border border-white/[0.08]" />
                  <span className="text-xs text-[#A3A3A3]">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#E50914] border border-[#E50914]" />
                  <span className="text-xs text-[#A3A3A3]">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white/[0.03] border border-white/[0.04]" />
                  <span className="text-xs text-[#A3A3A3]">Occupied</span>
                </div>
              </div>

              {/* Selected summary */}
              {selectedSeats.length > 0 && (
                <div className="mt-6 p-4 bg-white/[0.03] rounded-lg">
                  <p className="text-white text-sm">
                    Selected {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}:
                    {' '}
                    {selectedSeats.map(id => {
                      const seat = seats.find(s => s.seatId === id);
                      return seat ? `Row ${String.fromCharCode(64 + seat.row)}-${seat.number}` : '';
                    }).join(', ')}
                  </p>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBook}
                disabled={selectedSeats.length === 0 || booking}
                className="w-full mt-4 bg-[#E50914] hover:bg-[#b20710] disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-sm font-bold text-base transition-colors flex items-center justify-center gap-2"
              >
                {booking ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Book Selected Seats</>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="p-12 text-center" style={{ animation: 'fadeInUp 0.4s ease-out both' }}>
            <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-white text-2xl font-bold mb-2">Booking Confirmed!</h3>
            <p className="text-[#A3A3A3] mb-8">Your seats have been reserved. Check your email for confirmation.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { onClose(); navigate('/profile'); }}
                className="bg-[#E50914] hover:bg-[#b20710] text-white px-6 py-2.5 rounded-sm font-semibold transition-colors"
              >
                View My Bookings
              </button>
              <button
                onClick={onClose}
                className="border border-white/20 hover:border-white text-white px-6 py-2.5 rounded-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
