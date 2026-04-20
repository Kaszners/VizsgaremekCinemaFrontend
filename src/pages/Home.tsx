import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMovies, getShowtimes } from "../services/api";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMovies(), getShowtimes()])
      .then(([m, s]) => { setMovies(m.slice(0, 6)); setShowtimes(s); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const upcoming = showtimes
    .filter(s => new Date(s.showStartTime) > new Date())
    .sort((a, b) => new Date(a.showStartTime).getTime() - new Date(b.showStartTime).getTime())
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f2f0ec]">
      {/* Hero */}
      <div className="bg-[#ede9e3] border-b border-[#ccc7be] px-6 py-16 text-center fade-up">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] font-medium text-[#8b6f47] uppercase tracking-widest mb-4">Mozijegyek online</p>
          <h1 className="text-[42px] leading-tight text-[#2a2520] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Válaszd ki a kedvenc<br />
            <em className="italic text-[#8b6f47]">filmédet</em>
          </h1>
          <p className="text-[15px] text-[#8c8880] mb-8 leading-relaxed">
            Foglald le helyed a legjobb filmekre. Egyszerűen, gyorsan, biztonságosan.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/showtimes">
              <button className="text-[13px] font-medium text-[#f2f0ec] px-6 py-2.5 rounded-lg bg-[#2a2520] border border-[#2a2520] hover:bg-[#3d3730] transition-colors">
                Vetítések böngészése
              </button>
            </Link>
            <Link to="/movies">
              <button className="text-[13px] font-medium text-[#8c8880] px-6 py-2.5 rounded-lg border border-[#ccc7be] hover:bg-[#e4e0da] hover:border-[#b0aa9f] hover:text-[#2a2520] transition-colors">
                Filmek megtekintése
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Movies */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[11px] font-medium text-[#8b6f47] uppercase tracking-widest mb-1">Műsoron</p>
            <h2 className="text-[22px] text-[#2a2520]" style={{ fontFamily: "'Playfair Display', serif" }}>Aktuális filmek</h2>
          </div>
          <Link to="/movies" className="text-[13px] text-[#8b6f47] hover:text-[#6b5230] transition-colors no-underline">
            Összes →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[2/3] mb-2" />
                <div className="skeleton h-3.5 w-3/4 mb-1.5" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-10 text-center">
            <p className="text-[13px] text-[#8c8880]">Jelenleg nincs elérhető film.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {movies.map((m, i) => <MovieCard key={m.id} movie={m} delay={i * 55} />)}
          </div>
        )}
      </div>

      {/* Upcoming showtimes */}
      {upcoming.length > 0 && (
        <div className="border-t border-[#ccc7be] bg-[#ede9e3]">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[11px] font-medium text-[#8b6f47] uppercase tracking-widest mb-1">Következő</p>
                <h2 className="text-[22px] text-[#2a2520]" style={{ fontFamily: "'Playfair Display', serif" }}>Közelgő vetítések</h2>
              </div>
              <Link to="/showtimes" className="text-[13px] text-[#8b6f47] hover:text-[#6b5230] transition-colors no-underline">
                Összes →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {upcoming.map((s, i) => (
                <Link key={s.id} to={`/showtimes/${s.id}`} className="no-underline group fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                  <div className="bg-[#f2f0ec] border border-[#ccc7be] rounded-xl p-4 transition-all hover:border-[#b0aa9f] hover:bg-[#e8e4de] hover:-translate-y-0.5">
                    <p className="text-[11px] font-medium text-[#8b6f47] uppercase tracking-wide mb-1.5">
                      {new Date(s.showStartTime).toLocaleDateString("hu-HU", { month: "short", day: "numeric", weekday: "short" })}
                    </p>
                    <p className="text-[14px] font-medium text-[#2a2520] mb-1 leading-tight">{s.movieTitle}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[12px] text-[#8c8880]">{s.theaterName}</span>
                      <span className="text-[13px] font-medium text-[#2a2520]">
                        {new Date(s.showStartTime).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
