import { useEffect, useState } from "react";
import { getMovies } from "../services/api";
import MovieCard from "../components/MovieCard";

export default function Movies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { getMovies().then(m => { setMovies(m); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const filtered = movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f2f0ec]">
      <div className="border-b border-[#ccc7be] bg-[#ede9e3] px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-medium text-[#8b6f47] uppercase tracking-widest mb-2">Katalógus</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h1 className="text-[32px] text-[#2a2520] mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>Filmek</h1>
            <input
              type="text"
              placeholder="Keresés..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-3 py-2 bg-[#f2f0ec] border border-[#ccc7be] rounded-lg text-[13px] text-[#2a2520] placeholder:text-[#b0aa9f] outline-none transition-colors hover:border-[#b0aa9f] focus:border-[#8b6f47] w-52"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i}><div className="skeleton aspect-[2/3] mb-2" /><div className="skeleton h-3 w-3/4 mb-1.5" /><div className="skeleton h-3 w-1/2" /></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-10 text-center">
            <p className="text-[13px] font-medium text-[#2a2520]">{search ? "Nincs találat." : "Jelenleg nincs elérhető film."}</p>
            <p className="text-[12px] text-[#8c8880] mt-1">Hamarosan frissülünk</p>
          </div>
        ) : (
          <>
            <p className="text-[12px] text-[#8c8880] mb-5">{filtered.length} film</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {filtered.map((m, i) => <MovieCard key={m.id} movie={m} delay={i * 45} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
