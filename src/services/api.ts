import axios from "axios";
const BASE = "http://localhost:8080/cinema";
const auth = () => { const t = localStorage.getItem("token"); return t ? { Authorization: `Bearer ${t}` } : {}; };

export const getMovies    = () => axios.get(`${BASE}/public/list/movies`).then(r => r.data);
export const getShowtimes = () => axios.get(`${BASE}/public/list/showtimes`).then(r => r.data);
export const getTheaters  = () => axios.get(`${BASE}/public/list/theaters`).then(r => r.data);

export const getSeatAvailability = (id: number) => axios.get(`${BASE}/showtimes/${id}/seats`).then(r => r.data);

export const getMyProfile    = () => axios.get(`${BASE}/user/me`, { headers: auth() }).then(r => r.data);
export const changeUsername  = (currentPassword: string, newUsername: string) => axios.put(`${BASE}/user/change-username/me`, { currentPassword, newUsername }, { headers: auth() });
export const changePassword  = (currentPassword: string, newPassword: string) => axios.put(`${BASE}/user/change-password/me`, { currentPassword, newPassword }, { headers: auth() });
export const deleteMyAccount = () => axios.delete(`${BASE}/user/delete/me`, { headers: auth() });

export const getMyBookings = () => axios.get(`${BASE}/booking/me`, { headers: auth() }).then(r => r.data);
export const createBooking = (showtimeId: number, seatIds: number[]) => axios.post(`${BASE}/booking`, { showtimeId, seatIds }, { headers: auth() });
export const cancelBooking = (id: number) => axios.post(`${BASE}/booking/${id}/cancel`, {}, { headers: auth() });

export const adminCreateMovie    = (d: any) => axios.post(`${BASE}/admin/create/movie`, d, { headers: auth() });
export const adminDeleteMovie    = (id: number) => axios.delete(`${BASE}/admin/delete/movie/${id}`, { headers: auth() });
export const adminCreateTheater  = (d: any) => axios.post(`${BASE}/admin/create/theater`, d, { headers: auth() });
export const adminDeleteTheater  = (id: number) => axios.delete(`${BASE}/admin/delete/theater/${id}`, { headers: auth() });
export const adminCreateShowtime = (d: any) => axios.post(`${BASE}/admin/create/showtime`, d, { headers: auth() });
export const adminDeleteShowtime = (id: number) => axios.delete(`${BASE}/admin/delete/showtime/${id}`, { headers: auth() });
export const adminDeleteUser     = (id: number) => axios.delete(`${BASE}/admin/delete/${id}`, { headers: auth() });
