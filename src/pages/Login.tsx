import { useState } from "react";
import { login } from "../services/authServiec";

function Login() {
  const [usernameOrEmail, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await login(usernameOrEmail, password);
      setError("");
      window.location.href = "/";
    } catch (err: any) {
      setError("Hibás felhasználónév vagy jelszó");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f2f0ec]">

      {error && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(242,240,236,0.75)" }}
        >
          <div
            className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-6 w-72 flex flex-col gap-4"
            style={{ boxShadow: "0 2px 24px 0 rgba(42,37,32,0.08)" }}
          >
            <p className="text-[13px] text-[#2a2520] leading-relaxed">{error}</p>
            <button
              onClick={() => setError("")}
              className="self-end text-[12px] font-medium text-[#8b6f47] bg-[#f0e8d8] border border-[#d4c0a0] rounded-lg px-4 py-1.5 transition-colors hover:bg-[#e8d8bc] hover:border-[#c4a888]"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5 w-80">

        <div className="flex flex-col gap-1 mb-2">
          <h1 className="text-[22px] font-medium text-[#2a2520] tracking-tight">
            Bejelentkezés
          </h1>
          <p className="text-[13px] text-[#8c8880]">
            Üdvözlünk vissza
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Felhasználónév vagy e-mail"
            className="w-full px-3 py-2.5 bg-[#ede9e3] border border-[#ccc7be] rounded-lg text-[13px] text-[#2a2520] placeholder:text-[#8c8880] outline-none transition-colors hover:border-[#b0aa9f] focus:border-[#8b6f47] focus:bg-[#f5f2ee]"
            value={usernameOrEmail}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <input
            type="password"
            placeholder="Jelszó"
            className="w-full px-3 py-2.5 bg-[#ede9e3] border border-[#ccc7be] rounded-lg text-[13px] text-[#2a2520] placeholder:text-[#8c8880] outline-none transition-colors hover:border-[#b0aa9f] focus:border-[#8b6f47] focus:bg-[#f5f2ee]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-2.5 bg-[#2a2520] text-[#f2f0ec] text-[13px] font-medium rounded-lg border border-[#2a2520] transition-colors hover:bg-[#3d3730] hover:border-[#3d3730] active:scale-[0.98]"
        >
          Bejelentkezés
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-[#ccc7be]" />
          <span className="text-[11px] text-[#8c8880]">vagy</span>
          <div className="flex-1 border-t border-[#ccc7be]" />
        </div>

        <button className="w-full py-2.5 bg-transparent text-[#5c5850] text-[13px] font-medium rounded-lg border border-[#ccc7be] transition-colors hover:bg-[#e8e4de] hover:border-[#b0aa9f]">
          Vendégként folytatom
        </button>

      </div>
    </div>
  );
}

export default Login;