import { Link } from "react-router-dom";
interface Movie { id: number; title: string; duration: number; posterUrl?: string; }

export default function MovieCard({ movie, delay = 0 }: { movie: Movie; delay?: number }) {
  return (
    <Link to={`/movies/${movie.id}`} className="no-underline group fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl overflow-hidden transition-all hover:border-[#b0aa9f] hover:shadow-md hover:-translate-y-0.5">
        {/* Poster */}
        <div className="aspect-[2/3] bg-[#e4e0da] relative overflow-hidden">
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#ccc7be] text-4xl">🎬</div>
          )}
        </div>
        {/* Info */}
        <div className="p-3.5">
          <p className="text-[13px] font-medium text-[#2a2520] leading-tight line-clamp-2">{movie.title}</p>
          <p className="text-[12px] text-[#8c8880] mt-1">{movie.duration} perc</p>
        </div>
      </div>
    </Link>
  );
}
