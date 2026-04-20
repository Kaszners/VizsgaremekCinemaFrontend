import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = profile?.role === "ADMIN" || profile?.role === "STAFF";

  const NavLink = ({ to, label }: { to: string; label: string }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setMobileOpen(false)}
        className={`text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
          active
            ? "text-[#2a2520] bg-[#e4e0da]"
            : "text-[#8c8880] hover:text-[#2a2520] hover:bg-[#e4e0da]"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#ede9e3]/95 backdrop-blur-sm border-b border-[#ccc7be]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <div className="w-6 h-6 rounded-full border border-[#8b6f47] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#8b6f47]" />
          </div>
          <span className="text-[15px] font-medium text-[#2a2520] tracking-widest uppercase group-hover:text-[#8b6f47] transition-colors">
            Cinema
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" label="Főoldal" />
          <NavLink to="/movies" label="Filmek" />
          <NavLink to="/showtimes" label="Vetítések" />
          {profile && <NavLink to="/bookings" label="Foglalásaim" />}
          {profile && <NavLink to="/profile" label="Profil" />}
          {isAdmin && <NavLink to="/admin" label="Admin" />}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          {!profile ? (
            <>
              <Link to="/login">
                <button className="text-[13px] font-medium text-[#8c8880] px-3 py-1.5 rounded-lg border border-[#ccc7be] hover:bg-[#e4e0da] hover:border-[#b0aa9f] hover:text-[#2a2520] transition-colors">
                  Bejelentkezés
                </button>
              </Link>
              <Link to="/register">
                <button className="text-[13px] font-medium text-[#f2f0ec] px-4 py-1.5 rounded-lg bg-[#2a2520] border border-[#2a2520] hover:bg-[#3d3730] transition-colors">
                  Regisztráció
                </button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-[#8c8880]">{profile.fullName}</span>
              <button
                onClick={logout}
                className="text-[13px] font-medium text-[#8c8880] px-3 py-1.5 rounded-lg border border-[#ccc7be] hover:bg-[#e4e0da] hover:border-[#b0aa9f] hover:text-[#2a2520] transition-colors"
              >
                Kilépés
              </button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-[#8c8880] hover:text-[#2a2520] transition-colors" onClick={() => setMobileOpen(v => !v)}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#ccc7be] bg-[#ede9e3] px-6 py-3 flex flex-col gap-1 fade-in">
          {[
            { to: "/", label: "Főoldal" },
            { to: "/movies", label: "Filmek" },
            { to: "/showtimes", label: "Vetítések" },
            ...(profile ? [{ to: "/bookings", label: "Foglalásaim" }, { to: "/profile", label: "Profil" }] : []),
            ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} label={label} />
          ))}
          <div className="pt-2 border-t border-[#ccc7be] mt-1 flex flex-col gap-2">
            {!profile ? (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <button className="w-full text-[13px] font-medium text-[#8c8880] px-3 py-2 rounded-lg border border-[#ccc7be] hover:bg-[#e4e0da] transition-colors">Bejelentkezés</button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <button className="w-full text-[13px] font-medium text-[#f2f0ec] px-3 py-2 rounded-lg bg-[#2a2520] hover:bg-[#3d3730] transition-colors">Regisztráció</button>
                </Link>
              </>
            ) : (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-[13px] font-medium text-[#8c8880] px-3 py-2 rounded-lg border border-[#ccc7be] hover:bg-[#e4e0da] transition-colors">Kilépés</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
