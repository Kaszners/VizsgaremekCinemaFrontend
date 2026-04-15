import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const linkClass = (path: string) =>
    `text-[13px] font-medium transition-colors hover:text-[#2a2520] ${
      location.pathname === path
        ? "text-[#2a2520]"
        : "text-[#8c8880]"
    }`;

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-[#ede9e3] border-b border-[#ccc7be]">

      <Link
        to="/"
        className="text-[15px] font-medium text-[#2a2520] tracking-widest uppercase hover:text-[#8b6f47] transition-colors"
      >
        Cinema
      </Link>

      <div className="flex items-center gap-1">
        {!token && (
          <>
            <Link to="/" className={linkClass("/")}>
              <span className="px-3 py-1.5 rounded-lg hover:bg-[#e4e0da] transition-colors block">
                Főoldal
              </span>
            </Link>
            <Link to="/login" className={linkClass("/login")}>
              <span className="px-3 py-1.5 rounded-lg hover:bg-[#e4e0da] transition-colors block">
                Bejelentkezés
              </span>
            </Link>
            <Link
              to="/register"
              className="ml-2 px-4 py-1.5 bg-[#2a2520] text-[#f2f0ec] text-[13px] font-medium rounded-lg border border-[#2a2520] transition-colors hover:bg-[#3d3730] hover:border-[#3d3730]"
            >
              Regisztráció
            </Link>
          </>
        )}

        {token && (
          <>
            <Link to="/" className={linkClass("/")}>
              <span className="px-3 py-1.5 rounded-lg hover:bg-[#e4e0da] transition-colors block">
                Főoldal
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-1.5 bg-transparent text-[#8c8880] text-[13px] font-medium rounded-lg border border-[#ccc7be] transition-colors hover:bg-[#e8e4de] hover:border-[#b0aa9f] hover:text-[#2a2520]"
            >
              Kijelentkezés
            </button>
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;