import { useState } from "react";
import { register } from "../services/authServiec";
import { Link } from "react-router-dom";

type FieldErrors = {
  username?: string;
  email?: string;
  fullName?: string;
  password?: string;
};

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullname] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleRegister = async () => {
    try {
      await register(username, password, email, fullName);
      window.location.href = "/";
    } catch (err: any) {
      const data = err.response?.data;
      let messages: string[] = [];

      if (typeof data === "string") {
        messages = data.split(/,|\n/);
      } else if (Array.isArray(data)) {
        messages = data;
      } else if (typeof data === "object" && data !== null) {
        messages = Object.values(data).flat() as string[];
      } else {
        messages = ["Hiba történt"];
      }

      const cleaned = messages
        .map((m) => m.trim())
        .filter((m) => m !== "" && !m.match(/\d{4}-\d{2}-\d{2}/))
        .filter((m, i, arr) => arr.indexOf(m) === i);

      const fieldErrors: FieldErrors = {};

      cleaned.forEach((msg) => {
        if (msg.includes("username"))
          fieldErrors.username = "Felhasználónév kötelező";
        else if (msg.includes("email") && msg.includes("well-formed"))
          fieldErrors.email = "Hibás e-mail cím";
        else if (msg.includes("email"))
          fieldErrors.email = "E-mail cím kötelező";
        else if (msg.includes("fullName"))
          fieldErrors.fullName = "Teljes név kötelező";
        else if (msg.includes("password") && msg.includes("size"))
          fieldErrors.password = "A jelszó minimum 8 karakter";
        else if (msg.includes("password"))
          fieldErrors.password = "A jelszó kötelező";
      });

      setErrors(fieldErrors);
    }
  };

  const inputClass = (field: keyof FieldErrors) =>
    `w-full px-3 py-2.5 bg-[#ede9e3] border rounded-lg text-[13px] text-[#2a2520] placeholder:text-[#8c8880] outline-none transition-colors hover:border-[#b0aa9f] focus:bg-[#f5f2ee] ${
      errors[field]
        ? "border-[#a0522d] focus:border-[#a0522d] bg-[#f2e4d8]"
        : "border-[#ccc7be] focus:border-[#8b6f47]"
    }`;

  const clearError = (field: keyof FieldErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f2f0ec]">
      <div className="flex flex-col gap-5 w-80">

        <div className="flex flex-col gap-1 mb-2">
          <h1 className="text-[22px] font-medium text-[#2a2520] tracking-tight">
            Regisztráció
          </h1>
          <p className="text-[13px] text-[#8c8880]">Hozz létre egy fiókot</p>
        </div>

        <div className="flex flex-col gap-3">

          <div className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="Felhasználónév"
              className={inputClass("username")}
              value={username}
              onChange={(e) => { setUsername(e.target.value); clearError("username"); }}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            />
            {errors.username && (
              <p className="text-[11px] text-[#a0522d] px-1">{errors.username}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="email"
              placeholder="E-mail cím"
              className={inputClass("email")}
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            />
            {errors.email && (
              <p className="text-[11px] text-[#a0522d] px-1">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="Teljes név"
              className={inputClass("fullName")}
              value={fullName}
              onChange={(e) => { setFullname(e.target.value); clearError("fullName"); }}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            />
            {errors.fullName && (
              <p className="text-[11px] text-[#a0522d] px-1">{errors.fullName}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="password"
              placeholder="Jelszó"
              className={inputClass("password")}
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            />
            {errors.password && (
              <p className="text-[11px] text-[#a0522d] px-1">{errors.password}</p>
            )}
          </div>

        </div>

        <button
          onClick={handleRegister}
          className="w-full py-2.5 bg-[#2a2520] text-[#f2f0ec] text-[13px] font-medium rounded-lg border border-[#2a2520] transition-colors hover:bg-[#3d3730] active:scale-[0.98]"
        >
          Regisztráció
        </button>

        <p className="text-center text-[12px] text-[#8c8880]">
          Már van fiókod?{" "}
          <Link
            to="/login"
            className="text-[#8b6f47] font-medium hover:text-[#6b5230] transition-colors"
          >
            Bejelentkezés
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;