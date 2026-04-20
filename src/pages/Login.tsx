import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { refresh } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.usernameOrEmail || !form.password) { setError("Kérjük töltsd ki az összes mezőt."); return; }
    setLoading(true); setError("");
    try {
      await login(form.usernameOrEmail, form.password);
      await refresh();
      navigate("/");
    } catch { setError("Hibás felhasználónév vagy jelszó."); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f2f0ec] p-6">
      {/* Error modal */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center fade-in" style={{ background: "rgba(242,240,236,0.8)", backdropFilter: "blur(4px)" }}>
          <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-6 w-72 flex flex-col gap-4 shadow-lg fade-up">
            <p className="text-[13px] text-[#2a2520] leading-relaxed">{error}</p>
            <button onClick={() => setError("")} className="self-end text-[12px] font-medium text-[#8b6f47] bg-[#f0e8d8] border border-[#d4c0a0] rounded-lg px-4 py-1.5 transition-colors hover:bg-[#e8d8bc]">
              OK
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-sm fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-5 h-5 rounded-full border border-[#8b6f47] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8b6f47]" />
            </div>
            <span className="text-[14px] font-medium text-[#2a2520] tracking-widest uppercase">Cinema</span>
          </div>
          <h1 className="text-[28px] text-[#2a2520] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Bejelentkezés</h1>
          <p className="text-[13px] text-[#8c8880]">Üdvözlünk vissza</p>
        </div>

        {/* Card */}
        <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[12px] font-medium text-[#8c8880] block mb-1.5">Felhasználónév vagy e-mail</label>
              <input
                type="text"
                placeholder="pl. john_doe"
                className="w-full px-3 py-2.5 bg-[#f2f0ec] border border-[#ccc7be] rounded-lg text-[13px] text-[#2a2520] placeholder:text-[#b0aa9f] outline-none transition-colors hover:border-[#b0aa9f] focus:border-[#8b6f47]"
                value={form.usernameOrEmail}
                onChange={e => setForm(f => ({ ...f, usernameOrEmail: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#8c8880] block mb-1.5">Jelszó</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-[#f2f0ec] border border-[#ccc7be] rounded-lg text-[13px] text-[#2a2520] placeholder:text-[#b0aa9f] outline-none transition-colors hover:border-[#b0aa9f] focus:border-[#8b6f47]"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2.5 bg-[#2a2520] text-[#f2f0ec] text-[13px] font-medium rounded-lg border border-[#2a2520] transition-colors hover:bg-[#3d3730] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Bejelentkezés..." : "Bejelentkezés"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-[#ccc7be]" />
            <span className="text-[11px] text-[#8c8880]">vagy</span>
            <div className="flex-1 border-t border-[#ccc7be]" />
          </div>

          <Link to="/showtimes">
            <button className="w-full py-2.5 bg-transparent text-[#8c8880] text-[13px] font-medium rounded-lg border border-[#ccc7be] transition-colors hover:bg-[#e4e0da] hover:border-[#b0aa9f] hover:text-[#2a2520]">
              Vendégként böngészek
            </button>
          </Link>
        </div>

        <p className="text-center text-[12px] text-[#8c8880] mt-5">
          Még nincs fiókod?{" "}
          <Link to="/register" className="text-[#8b6f47] font-medium hover:text-[#6b5230] transition-colors no-underline">
            Regisztrálj
          </Link>
        </p>
      </div>
    </div>
  );
}
