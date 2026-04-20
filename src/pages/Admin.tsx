import { useEffect, useState } from "react";
import { getMovies, getShowtimes, getTheaters, adminCreateMovie, adminDeleteMovie, adminCreateTheater, adminDeleteTheater, adminCreateShowtime, adminDeleteShowtime } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import Modal from "../components/Modal";

const inputCls = "w-full px-3 py-2.5 bg-[#f2f0ec] border border-[#ccc7be] rounded-lg text-[13px] text-[#2a2520] placeholder:text-[#b0aa9f] outline-none transition-colors hover:border-[#b0aa9f] focus:border-[#8b6f47]";
const btnPrimary = "text-[13px] font-medium text-[#f2f0ec] px-4 py-2 rounded-lg bg-[#2a2520] border border-[#2a2520] transition-colors hover:bg-[#3d3730] active:scale-[0.98] disabled:opacity-50";
const btnDanger = "text-[12px] font-medium text-[#c08080] px-3 py-1.5 rounded-lg border border-[#f5c5c5] bg-[#fdf5f5] hover:bg-[#fce8e8] transition-colors";

type Tab = "movies" | "theaters" | "showtimes";

export default function Admin() {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("movies");
  const [movies, setMovies] = useState<any[]>([]);
  const [theaters, setTheaters] = useState<any[]>([]);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: "success"|"error"|"info" } | null>(null);

  // Movie modal
  const [movieModal, setMovieModal] = useState(false);
  const [movieForm, setMovieForm] = useState({ title: "", duration: "", posterUrl: "", trailerUrl: "" });
  const [movieLoading, setMovieLoading] = useState(false);

  // Theater modal
  const [theaterModal, setTheaterModal] = useState(false);
  const [theaterForm, setTheaterForm] = useState({ name: "", size: "SMALL" });
  const [theaterLoading, setTheaterLoading] = useState(false);

  // Showtime modal
  const [showtimeModal, setShowtimeModal] = useState(false);
  const [showtimeForm, setShowtimeForm] = useState({ movieId: "", theaterId: "", showStartTime: "" });
  const [showtimeLoading, setShowtimeLoading] = useState(false);

  const load = async () => {
    try {
      const [m, t, s] = await Promise.all([getMovies(), getTheaters(), getShowtimes()]);
      setMovies(m); setTheaters(t); setShowtimes(s);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!authLoading && profile && profile.role !== "ADMIN" && profile.role !== "STAFF") navigate("/");
    if (!authLoading && !profile) navigate("/login");
  }, [profile, authLoading]);

  const handleCreateMovie = async () => {
    if (!movieForm.title || !movieForm.duration) { setToast({ msg: "Cím és időtartam kötelező.", type: "info" }); return; }
    setMovieLoading(true);
    try {
      await adminCreateMovie({ title: movieForm.title, duration: Number(movieForm.duration), posterUrl: movieForm.posterUrl || null, trailerUrl: movieForm.trailerUrl || null });
      setToast({ msg: "Film sikeresen hozzáadva!", type: "success" });
      setMovieModal(false); setMovieForm({ title: "", duration: "", posterUrl: "", trailerUrl: "" }); load();
    } catch { setToast({ msg: "Hiba a film hozzáadása során.", type: "error" }); }
    finally { setMovieLoading(false); }
  };

  const handleDeleteMovie = async (id: number) => {
    if (!confirm("Biztosan törlöd ezt a filmet? A hozzá tartozó vetítések és foglalások is törlődnek.")) return;
    try { await adminDeleteMovie(id); setToast({ msg: "Film törölve.", type: "success" }); load(); }
    catch { setToast({ msg: "Hiba a törlés során.", type: "error" }); }
  };

  const handleCreateTheater = async () => {
    if (!theaterForm.name) { setToast({ msg: "Terem neve kötelező.", type: "info" }); return; }
    setTheaterLoading(true);
    try {
      await adminCreateTheater({ name: theaterForm.name, size: theaterForm.size });
      setToast({ msg: "Terem sikeresen hozzáadva!", type: "success" });
      setTheaterModal(false); setTheaterForm({ name: "", size: "SMALL" }); load();
    } catch (err: any) {
      setToast({ msg: err.response?.status === 409 ? "Ez a terem név már foglalt." : "Hiba a terem hozzáadása során.", type: "error" });
    } finally { setTheaterLoading(false); }
  };

  const handleDeleteTheater = async (id: number) => {
    if (!confirm("Biztosan törlöd ezt a termet? A hozzá tartozó vetítések és foglalások is törlődnek.")) return;
    try { await adminDeleteTheater(id); setToast({ msg: "Terem törölve.", type: "success" }); load(); }
    catch { setToast({ msg: "Hiba a törlés során.", type: "error" }); }
  };

  const handleCreateShowtime = async () => {
    if (!showtimeForm.movieId || !showtimeForm.theaterId || !showtimeForm.showStartTime) { setToast({ msg: "Töltsd ki az összes mezőt.", type: "info" }); return; }
    setShowtimeLoading(true);
    try {
      await adminCreateShowtime({ movieId: Number(showtimeForm.movieId), theaterId: Number(showtimeForm.theaterId), showStartTime: new Date(showtimeForm.showStartTime).toISOString() });
      setToast({ msg: "Vetítés sikeresen hozzáadva!", type: "success" });
      setShowtimeModal(false); setShowtimeForm({ movieId: "", theaterId: "", showStartTime: "" }); load();
    } catch { setToast({ msg: "Hiba a vetítés hozzáadása során.", type: "error" }); }
    finally { setShowtimeLoading(false); }
  };

  const handleDeleteShowtime = async (id: number) => {
    if (!confirm("Biztosan törlöd ezt a vetítést?")) return;
    try { await adminDeleteShowtime(id); setToast({ msg: "Vetítés törölve.", type: "success" }); load(); }
    catch { setToast({ msg: "Hiba a törlés során.", type: "error" }); }
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "movies", label: "Filmek", count: movies.length },
    { key: "theaters", label: "Termek", count: theaters.length },
    { key: "showtimes", label: "Vetítések", count: showtimes.length },
  ];

  return (
    <div className="min-h-screen bg-[#f2f0ec]">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-[#ede9e3] border-b border-[#ccc7be] px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-medium text-[#8b6f47] uppercase tracking-widest mb-2">Kezelőfelület</p>
          <h1 className="text-[32px] text-[#2a2520]" style={{ fontFamily: "'Playfair Display', serif" }}>Admin</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-1 w-fit mb-8">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-[13px] font-medium px-4 py-2 rounded-lg transition-colors ${
                tab === t.key ? "bg-[#2a2520] text-[#f2f0ec]" : "text-[#8c8880] hover:text-[#2a2520] hover:bg-[#e4e0da]"
              }`}
            >
              {t.label}
              <span className={`ml-2 text-[11px] ${tab === t.key ? "text-[#b0aa9f]" : "text-[#b0aa9f]"}`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Movies */}
        {tab === "movies" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] font-medium text-[#2a2520]">Filmek kezelése</h2>
              <button className={btnPrimary} onClick={() => setMovieModal(true)}>+ Film hozzáadása</button>
            </div>
            {loading ? <div className="skeleton h-48 rounded-xl" /> : (
              <div className="flex flex-col gap-2">
                {movies.map(m => (
                  <div key={m.id} className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl px-5 py-3.5 flex items-center justify-between transition-colors hover:border-[#b0aa9f]">
                    <div className="flex items-center gap-4">
                      {m.posterUrl && <img src={m.posterUrl} alt="" className="w-9 h-12 object-cover rounded border border-[#ccc7be]" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                      <div>
                        <p className="text-[13px] font-medium text-[#2a2520]">{m.title}</p>
                        <p className="text-[12px] text-[#8c8880] mt-0.5">{m.duration} perc</p>
                      </div>
                    </div>
                    <button className={btnDanger} onClick={() => handleDeleteMovie(m.id)}>Törlés</button>
                  </div>
                ))}
                {movies.length === 0 && <p className="text-[13px] text-[#8c8880] py-6 text-center">Nincs film.</p>}
              </div>
            )}
          </div>
        )}

        {/* Theaters */}
        {tab === "theaters" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] font-medium text-[#2a2520]">Termek kezelése</h2>
              <button className={btnPrimary} onClick={() => setTheaterModal(true)}>+ Terem hozzáadása</button>
            </div>
            {loading ? <div className="skeleton h-48 rounded-xl" /> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {theaters.map(t => (
                  <div key={t.id} className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-4 transition-colors hover:border-[#b0aa9f]">
                    <p className="text-[13px] font-medium text-[#2a2520]">{t.name}</p>
                    <p className="text-[12px] text-[#8c8880] mt-1">{t.size === "SMALL" ? "Kis terem (5×8)" : "Nagy terem (10×12)"}</p>
                    <div className="mt-3 flex justify-end">
                      <button className={btnDanger} onClick={() => handleDeleteTheater(t.id)}>Törlés</button>
                    </div>
                  </div>
                ))}
                {theaters.length === 0 && <p className="text-[13px] text-[#8c8880] py-6 col-span-3 text-center">Nincs terem.</p>}
              </div>
            )}
          </div>
        )}

        {/* Showtimes */}
        {tab === "showtimes" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] font-medium text-[#2a2520]">Vetítések kezelése</h2>
              <button className={btnPrimary} onClick={() => setShowtimeModal(true)}>+ Vetítés hozzáadása</button>
            </div>
            {loading ? <div className="skeleton h-48 rounded-xl" /> : (
              <div className="flex flex-col gap-2">
                {showtimes
                  .sort((a, b) => new Date(a.showStartTime).getTime() - new Date(b.showStartTime).getTime())
                  .map(s => (
                    <div key={s.id} className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl px-5 py-3.5 flex items-center justify-between transition-colors hover:border-[#b0aa9f]">
                      <div>
                        <p className="text-[13px] font-medium text-[#2a2520]">{s.movieTitle}</p>
                        <p className="text-[12px] text-[#8c8880] mt-0.5">
                          {new Date(s.showStartTime).toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" })}
                          {" · "}
                          {new Date(s.showStartTime).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}
                          {" · "}
                          {s.theaterName}
                        </p>
                      </div>
                      <button className={btnDanger} onClick={() => handleDeleteShowtime(s.id)}>Törlés</button>
                    </div>
                  ))}
                {showtimes.length === 0 && <p className="text-[13px] text-[#8c8880] py-6 text-center">Nincs vetítés.</p>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Movie modal */}
      <Modal open={movieModal} onClose={() => setMovieModal(false)} title="Film hozzáadása">
        <div className="flex flex-col gap-3 mb-5">
          {[
            { key: "title", label: "Cím *", placeholder: "pl. Inception", type: "text" },
            { key: "duration", label: "Időtartam (perc) *", placeholder: "pl. 148", type: "number" },
            { key: "posterUrl", label: "Poszter URL", placeholder: "https://...", type: "text" },
            { key: "trailerUrl", label: "Előzetes URL", placeholder: "https://...", type: "text" },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="text-[12px] font-medium text-[#8c8880] block mb-1.5">{label}</label>
              <input className={inputCls} type={type} placeholder={placeholder} value={(movieForm as any)[key]} onChange={e => setMovieForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setMovieModal(false)} className="text-[13px] font-medium text-[#8c8880] px-4 py-2 rounded-lg border border-[#ccc7be] hover:bg-[#e4e0da] transition-colors">Mégsem</button>
          <button onClick={handleCreateMovie} disabled={movieLoading} className={btnPrimary}>{movieLoading ? "Mentés..." : "Hozzáadás"}</button>
        </div>
      </Modal>

      {/* Theater modal */}
      <Modal open={theaterModal} onClose={() => setTheaterModal(false)} title="Terem hozzáadása">
        <div className="flex flex-col gap-3 mb-5">
          <div>
            <label className="text-[12px] font-medium text-[#8c8880] block mb-1.5">Terem neve *</label>
            <input className={inputCls} type="text" placeholder="pl. 1-es terem" value={theaterForm.name} onChange={e => setTheaterForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#8c8880] block mb-1.5">Méret</label>
            <select className={inputCls} value={theaterForm.size} onChange={e => setTheaterForm(f => ({ ...f, size: e.target.value }))}>
              <option value="SMALL">Kis terem (5 sor × 8 szék = 40 hely)</option>
              <option value="LARGE">Nagy terem (10 sor × 12 szék = 120 hely)</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setTheaterModal(false)} className="text-[13px] font-medium text-[#8c8880] px-4 py-2 rounded-lg border border-[#ccc7be] hover:bg-[#e4e0da] transition-colors">Mégsem</button>
          <button onClick={handleCreateTheater} disabled={theaterLoading} className={btnPrimary}>{theaterLoading ? "Mentés..." : "Hozzáadás"}</button>
        </div>
      </Modal>

      {/* Showtime modal */}
      <Modal open={showtimeModal} onClose={() => setShowtimeModal(false)} title="Vetítés hozzáadása">
        <div className="flex flex-col gap-3 mb-5">
          <div>
            <label className="text-[12px] font-medium text-[#8c8880] block mb-1.5">Film *</label>
            <select className={inputCls} value={showtimeForm.movieId} onChange={e => setShowtimeForm(f => ({ ...f, movieId: e.target.value }))}>
              <option value="">Válassz filmet...</option>
              {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#8c8880] block mb-1.5">Terem *</label>
            <select className={inputCls} value={showtimeForm.theaterId} onChange={e => setShowtimeForm(f => ({ ...f, theaterId: e.target.value }))}>
              <option value="">Válassz termet...</option>
              {theaters.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#8c8880] block mb-1.5">Kezdési idő *</label>
            <input className={inputCls} type="datetime-local" value={showtimeForm.showStartTime} onChange={e => setShowtimeForm(f => ({ ...f, showStartTime: e.target.value }))} />
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setShowtimeModal(false)} className="text-[13px] font-medium text-[#8c8880] px-4 py-2 rounded-lg border border-[#ccc7be] hover:bg-[#e4e0da] transition-colors">Mégsem</button>
          <button onClick={handleCreateShowtime} disabled={showtimeLoading} className={btnPrimary}>{showtimeLoading ? "Mentés..." : "Hozzáadás"}</button>
        </div>
      </Modal>
    </div>
  );
}
