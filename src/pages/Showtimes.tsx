import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getShowtimes, getMovies } from "../services/api";

export default function Showtimes() {
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([getShowtimes(), getMovies()])
      .then(([s, m]) => { setShowtimes(s); setMovies(m); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = showtimes
    .filter(s => new Date(s.showStartTime) > new Date())
    .filter(s => selectedMovie ? s.movieId === selectedMovie : true)
    .sort((a, b) => new Date(a.showStartTime).getTime() - new Date(b.showStartTime).getTime());

  const grouped: Record<string, any[]> = {};
  filtered.forEach(s => {
    const d = new Date(s.showStartTime).toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(s);
  });

  return (
    <div className="min-h-screen bg-[#f2f0ec]">
      <div className="bg-[#ede9e3] border-b border-[#ccc7be] px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-medium text-[#8b6f47] uppercase tracking-widest mb-2">Műsor</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h1 className="text-[32px] text-[#2a2520] mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>Vetítések</h1>
            <select
              value={selectedMovie ?? ""}
              onChange={e => setSelectedMovie(e.target.value ? Number(e.target.value) : null)}
              className="px-3 py-2 bg-[#f2f0ec] border border-[#ccc7be] rounded-lg text-[13px] text-[#2a2520] outline-none cursor-pointer hover:border-[#b0aa9f] focus:border-[#8b6f47]"
            >
              <option value="">Összes film</option>
              {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-10 text-center">
            <p className="text-[13px] font-medium text-[#2a2520]">Nincs közelgő vetítés.</p>
            <p className="text-[12px] text-[#8c8880] mt-1">Próbálkozz más filmmel</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, shows]) => (
            <div key={date} className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-[15px] font-medium text-[#8b6f47] capitalize whitespace-nowrap">{date}</h2>
                <div className="flex-1 border-t border-[#ccc7be]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shows.map((s, i) => (
                  <Link key={s.id} to={`/showtimes/${s.id}`} className="no-underline fade-up" style={{ animationDelay: `${i * 55}ms` }}>
                    <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-4 transition-all hover:border-[#b0aa9f] hover:bg-[#e4e0da] hover:-translate-y-0.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[14px] font-medium text-[#2a2520]">{s.movieTitle}</p>
                          <p className="text-[12px] text-[#8c8880] mt-1">{s.theaterName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[15px] font-medium text-[#2a2520]">
                            {new Date(s.showStartTime).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                          <p className="text-[11px] text-[#8c8880] mt-1">Helyfoglalás →</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
