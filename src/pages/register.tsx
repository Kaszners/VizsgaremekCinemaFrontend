import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";

type FieldErrors = { username?: string; email?: string; fullName?: string; password?: string; };

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", fullName: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (f: string) => (e: any) => {
    setForm(prev => ({ ...prev, [f]: e.target.value }));
    setErrors(prev => ({ ...prev, [f]: undefined }));
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register(form.username, form.password, form.email, form.fullName);
      navigate("/login");
    } catch (err: any) {
      const data = err.response?.data;
      const fieldErrors: FieldErrors = {};
      const messages: string[] = typeof data === "object" && data !== null
        ? (Object.values(data).flat() as string[])
        : typeof data === "string" ? [data] : ["Hiba történt"];
      messages.forEach(msg => {
        if (msg.includes("username")) fieldErrors.username = "Ez a felhasználónév már foglalt";
        else if (msg.includes("email") && msg.includes("well-formed")) fieldErrors.email = "Hibás e-mail cím";
        else if (msg.includes("email")) fieldErrors.email = "Ez az e-mail már regisztrált";
        else if (msg.includes("fullName")) fieldErrors.fullName = "Teljes név kötelező";
        else if (msg.includes("password") && msg.includes("size")) fieldErrors.password = "Legalább 8 karakter";
        else if (msg.includes("password")) fieldErrors.password = "Jelszó kötelező";
      });
      if (Object.keys(fieldErrors).length === 0) fieldErrors.username = "Hiba történt, próbáld újra";
      setErrors(fieldErrors);
    } finally { setLoading(false); }
  };

  const fields = [
    { key: "username",  label: "Felhasználónév",       type: "text",     placeholder: "pl. john_doe" },
    { key: "email",     label: "E-mail cím",            type: "email",    placeholder: "pl. john@example.com" },
    { key: "fullName",  label: "Teljes név",            type: "text",     placeholder: "pl. Kovács János" },
    { key: "password",  label: "Jelszó",               type: "password", placeholder: "Minimum 8 karakter" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f2f0ec] p-6">
      <div className="w-full max-w-sm fade-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-5 h-5 rounded-full border border-[#8b6f47] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8b6f47]" />
            </div>
            <span className="text-[14px] font-medium text-[#2a2520] tracking-widest uppercase">Cinema</span>
          </div>
          <h1 className="text-[28px] text-[#2a2520] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Regisztráció</h1>
          <p className="text-[13px] text-[#8c8880]">Hozz létre egy fiókot</p>
        </div>

        <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-[12px] font-medium text-[#8c8880] block mb-1.5">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className={`w-full px-3 py-2.5 bg-[#f2f0ec] rounded-lg text-[13px] text-[#2a2520] placeholder:text-[#b0aa9f] outline-none transition-colors hover:border-[#b0aa9f] ${
                    errors[key as keyof FieldErrors]
                      ? "border border-red-300 bg-red-50 focus:border-red-400"
                      : "border border-[#ccc7be] focus:border-[#8b6f47]"
                  }`}
                  value={(form as any)[key]}
                  onChange={set(key)}
                  onKeyDown={e => e.key === "Enter" && handleRegister()}
                />
                {errors[key as keyof FieldErrors] && (
                  <p className="text-[11px] text-red-500 mt-1">{errors[key as keyof FieldErrors]}</p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-2.5 bg-[#2a2520] text-[#f2f0ec] text-[13px] font-medium rounded-lg border border-[#2a2520] transition-colors hover:bg-[#3d3730] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Regisztráció..." : "Fiók létrehozása"}
          </button>
        </div>

        <p className="text-center text-[12px] text-[#8c8880] mt-5">
          Már van fiókod?{" "}
          <Link to="/login" className="text-[#8b6f47] font-medium hover:text-[#6b5230] transition-colors no-underline">
            Bejelentkezés
          </Link>
        </p>
      </div>
    </div>
  );
}
