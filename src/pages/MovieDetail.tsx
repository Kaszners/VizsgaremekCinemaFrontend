import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovies, getShowtimes } from "../services/api";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMovies(), getShowtimes()]).then(([movies, sts]) => {
      setMovie(movies.find((m: any) => m.id === Number(id)) ?? null);
      setShowtimes(sts.filter((s: any) => s.movieId === Number(id)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="skeleton h-64 rounded-xl mb-6" />
      <div className="skeleton h-8 w-64 mb-3" />
      <div className="skeleton h-4 w-32" />
    </div>
  );

  if (!movie) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <p className="text-[14px] text-[#8c8880]">A film nem található.</p>
      <Link to="/movies" className="text-[13px] text-[#8b6f47] no-underline hover:text-[#6b5230]">← Vissza a filmekhez</Link>
    </div>
  );

  const upcoming = showtimes.filter(s => new Date(s.showStartTime) > new Date());

  return (
    <div className="min-h-screen bg-[#f2f0ec]">
      {/* Header */}
      <div className="bg-[#ede9e3] border-b border-[#ccc7be] px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <Link to="/movies" className="text-[12px] text-[#8c8880] no-underline hover:text-[#2a2520] transition-colors">← Filmek</Link>
          <div className="flex gap-6 mt-5 items-start">
            {/* Poster */}
            <div className="w-28 flex-shrink-0">
              <div className="aspect-[2/3] bg-[#e4e0da] border border-[#ccc7be] rounded-xl overflow-hidden">
                {movie.posterUrl
                  ? <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  : <div className="w-full h-full flex items-center justify-center text-2xl text-[#ccc7be]">🎬</div>}
              </div>
            </div>
            <div>
              <h1 className="text-[30px] text-[#2a2520] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{movie.title}</h1>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[12px] text-[#8c8880] bg-[#f2f0ec] border border-[#ccc7be] rounded-lg px-3 py-1">⏱ {movie.duration} perc</span>
                {movie.trailerUrl && (
                  <a href={movie.trailerUrl} target="_blank" rel="noreferrer" className="no-underline">
                    <span className="text-[12px] text-[#8b6f47] bg-[#f0e8d8] border border-[#d4c0a0] rounded-lg px-3 py-1 hover:bg-[#e8d8bc] transition-colors cursor-pointer">▶ Előzetes</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-[22px] text-[#2a2520] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>Vetítések</h2>
        {upcoming.length === 0 ? (
          <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-8 text-center">
            <p className="text-[13px] font-medium text-[#2a2520]">Jelenleg nincs közelgő vetítés.</p>
            <p className="text-[12px] text-[#8c8880] mt-1">Néz vissza hamarosan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {upcoming.map((s, i) => (
              <Link key={s.id} to={`/showtimes/${s.id}`} className="no-underline fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-4 transition-all hover:border-[#b0aa9f] hover:bg-[#e4e0da] hover:-translate-y-0.5">
                  <p className="text-[13px] font-medium text-[#2a2520]">
                    {new Date(s.showStartTime).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="text-[12px] text-[#8c8880] mt-1">
                    {new Date(s.showStartTime).toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                  <p className="text-[12px] text-[#8c8880] mt-0.5">{s.theaterName} · Foglalás →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
