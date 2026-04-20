import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { changeUsername, changePassword, deleteMyAccount } from "../services/api";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import Modal from "../components/Modal";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-6 transition-colors">
      <h2 className="text-[16px] font-medium text-[#2a2520] mb-5">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[12px] font-medium text-[#8c8880] block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 bg-[#f2f0ec] border border-[#ccc7be] rounded-lg text-[13px] text-[#2a2520] placeholder:text-[#b0aa9f] outline-none transition-colors hover:border-[#b0aa9f] focus:border-[#8b6f47]";
const btnPrimary = "text-[13px] font-medium text-[#f2f0ec] px-5 py-2 rounded-lg bg-[#2a2520] border border-[#2a2520] transition-colors hover:bg-[#3d3730] active:scale-[0.98] disabled:opacity-50";

export default function Profile() {
  const { profile, refresh } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ msg: string; type: "success"|"error"|"info" } | null>(null);

  const [uForm, setUForm] = useState({ currentPassword: "", newUsername: "" });
  const [uLoading, setULoading] = useState(false);

  const [pForm, setPForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pLoading, setPLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChangeUsername = async () => {
    if (!uForm.currentPassword || !uForm.newUsername) { setToast({ msg: "Töltsd ki mindkét mezőt.", type: "info" }); return; }
    setULoading(true);
    try {
      await changeUsername(uForm.currentPassword, uForm.newUsername);
      setToast({ msg: "Felhasználónév sikeresen megváltoztatva!", type: "success" });
      setUForm({ currentPassword: "", newUsername: "" });
      await refresh();
    } catch (err: any) {
      const s = err.response?.status;
      setToast({ msg: s === 401 ? "Hibás jelszó." : s === 409 ? "Ez a felhasználónév már foglalt." : "Hiba történt.", type: "error" });
    } finally { setULoading(false); }
  };

  const handleChangePassword = async () => {
    if (!pForm.currentPassword || !pForm.newPassword) { setToast({ msg: "Töltsd ki az összes mezőt.", type: "info" }); return; }
    if (pForm.newPassword !== pForm.confirm) { setToast({ msg: "A két jelszó nem egyezik.", type: "error" }); return; }
    if (pForm.newPassword.length < 8) { setToast({ msg: "Az új jelszó legalább 8 karakter legyen.", type: "error" }); return; }
    setPLoading(true);
    try {
      await changePassword(pForm.currentPassword, pForm.newPassword);
      setToast({ msg: "Jelszó sikeresen megváltoztatva!", type: "success" });
      setPForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err: any) {
      setToast({ msg: err.response?.status === 401 ? "Hibás jelenlegi jelszó." : "Hiba történt.", type: "error" });
    } finally { setPLoading(false); }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try { await deleteMyAccount(); logout(); navigate("/"); }
    catch { setToast({ msg: "Hiba a fiók törlése során.", type: "error" }); setDeleteModal(false); }
    finally { setDeleteLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f2f0ec]">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-[#ede9e3] border-b border-[#ccc7be] px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] font-medium text-[#8b6f47] uppercase tracking-widest mb-2">Fiók</p>
          <h1 className="text-[32px] text-[#2a2520] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Profil</h1>
          <p className="text-[13px] text-[#8c8880]">{profile?.email}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-4">
        {/* Info */}
        <Section title="Fiók adatok">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Teljes név", value: profile?.fullName },
              { label: "E-mail", value: profile?.email },
              { label: "Szerepkör", value: profile?.role === "ADMIN" ? "Adminisztrátor" : profile?.role === "STAFF" ? "Személyzet" : "Felhasználó" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[11px] font-medium text-[#8c8880] uppercase tracking-wide mb-1">{label}</p>
                <p className="text-[14px] text-[#2a2520]">{value}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Username */}
        <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-6 fade-up delay-1">
          <h2 className="text-[16px] font-medium text-[#2a2520] mb-5">Felhasználónév módosítása</h2>
          <div className="flex flex-col gap-3">
            <Field label="Jelenlegi jelszó">
              <input className={inputCls} type="password" placeholder="••••••••" value={uForm.currentPassword} onChange={e => setUForm(f => ({ ...f, currentPassword: e.target.value }))} />
            </Field>
            <Field label="Új felhasználónév">
              <input className={inputCls} type="text" placeholder="pl. new_username" value={uForm.newUsername} onChange={e => setUForm(f => ({ ...f, newUsername: e.target.value }))} />
            </Field>
            <div className="flex justify-end">
              <button onClick={handleChangeUsername} disabled={uLoading} className={btnPrimary}>{uLoading ? "Mentés..." : "Mentés"}</button>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="bg-[#ede9e3] border border-[#ccc7be] rounded-xl p-6 fade-up delay-2">
          <h2 className="text-[16px] font-medium text-[#2a2520] mb-5">Jelszó módosítása</h2>
          <div className="flex flex-col gap-3">
            {[
              { key: "currentPassword", label: "Jelenlegi jelszó", placeholder: "••••••••" },
              { key: "newPassword",     label: "Új jelszó",         placeholder: "Minimum 8 karakter" },
              { key: "confirm",         label: "Megerősítés",       placeholder: "••••••••" },
            ].map(({ key, label, placeholder }) => (
              <Field key={key} label={label}>
                <input className={inputCls} type="password" placeholder={placeholder} value={(pForm as any)[key]} onChange={e => setPForm(f => ({ ...f, [key]: e.target.value }))} />
              </Field>
            ))}
            <div className="flex justify-end">
              <button onClick={handleChangePassword} disabled={pLoading} className={btnPrimary}>{pLoading ? "Mentés..." : "Jelszó mentése"}</button>
            </div>
          </div>
        </div>

        {/* Delete */}
        <div className="bg-[#fdf5f5] border border-[#f5d5d5] rounded-xl p-6 fade-up delay-3">
          <h2 className="text-[16px] font-medium text-[#2a2520] mb-2">Fiók törlése</h2>
          <p className="text-[13px] text-[#8c8880] mb-4 leading-relaxed">Ez a művelet visszafordíthatatlan. Minden adatod és foglalásod törlődik.</p>
          <button
            onClick={() => setDeleteModal(true)}
            className="text-[13px] font-medium text-[#c08080] px-4 py-2 rounded-lg border border-[#f5c5c5] bg-[#fdf5f5] hover:bg-[#fce8e8] hover:border-[#f0b0b0] transition-colors"
          >
            Fiók törlése
          </button>
        </div>
      </div>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Fiók törlése">
        <p className="text-[13px] text-[#8c8880] leading-relaxed mb-6">
          Biztosan törlöd a fiókodat? Ez visszafordíthatatlan, minden foglalásod elvész.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteModal(false)} className="text-[13px] font-medium text-[#8c8880] px-4 py-2 rounded-lg border border-[#ccc7be] hover:bg-[#e4e0da] hover:border-[#b0aa9f] transition-colors">Mégsem</button>
          <button onClick={handleDelete} disabled={deleteLoading} className="text-[13px] font-medium text-[#c08080] px-4 py-2 rounded-lg border border-[#f5c5c5] bg-[#fdf5f5] hover:bg-[#fce8e8] transition-colors disabled:opacity-50">
            {deleteLoading ? "Törlés..." : "Igen, törlöm"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
