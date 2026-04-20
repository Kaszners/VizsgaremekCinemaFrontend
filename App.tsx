import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home          from './pages/Home';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Movies        from './pages/Movies';
import MovieDetail   from './pages/MovieDetail';
import Showtimes     from './pages/Showtimes';
import ShowtimeDetail from './pages/ShowtimeDetail';
import Bookings      from './pages/Bookings';
import Profile       from './pages/Profile';
import Admin         from './pages/Admin';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  if (loading) return null;
  if (!profile) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/movies"        element={<Movies />} />
          <Route path="/movies/:id"    element={<MovieDetail />} />
          <Route path="/showtimes"     element={<Showtimes />} />
          <Route path="/showtimes/:id" element={<ShowtimeDetail />} />
          <Route path="/bookings"      element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="/profile"       element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin"         element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
