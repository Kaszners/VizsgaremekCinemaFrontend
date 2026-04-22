import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import type { MovieResponse, TheaterResponse, ShowtimeResponse, SeatAvailabilityResponse, BookingResponse } from '@/types/api';

export function useMovies() {
  const { apiFetch } = useAuth();
  const [movies, setMovies] = useState<MovieResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/public/list/movies');
      if (res.ok) {
        const data = await res.json();
        setMovies(data);
      } else {
        setError('Failed to load movies');
      }
    } catch {
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return { movies, loading, error, refetch: fetchMovies };
}

export function useTheaters() {
  const { apiFetch } = useAuth();
  const [theaters, setTheaters] = useState<TheaterResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTheaters = useCallback(async () => {
    try {
      const res = await apiFetch('/public/list/theaters');
      if (res.ok) {
        const data = await res.json();
        setTheaters(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchTheaters();
  }, [fetchTheaters]);

  return { theaters, loading };
}

export function useShowtimes() {
  const { apiFetch } = useAuth();
  const [showtimes, setShowtimes] = useState<ShowtimeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShowtimes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/public/list/showtimes');
      if (res.ok) {
        const data = await res.json();
        setShowtimes(data);
      } else {
        setError('Failed to load showtimes');
      }
    } catch {
      setError('Failed to load showtimes');
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchShowtimes();
  }, [fetchShowtimes]);

  return { showtimes, loading, error, refetch: fetchShowtimes };
}

export function useSeatAvailability(showtimeId: number | null) {
  const { apiFetch } = useAuth();
  const [seats, setSeats] = useState<SeatAvailabilityResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSeats = useCallback(async () => {
    if (!showtimeId) return;
    try {
      setLoading(true);
      const res = await apiFetch(`/showtimes/${showtimeId}/seats`);
      if (res.ok) {
        const data = await res.json();
        setSeats(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [showtimeId, apiFetch]);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  return { seats, loading, refetch: fetchSeats };
}

export function useBookings() {
  const { apiFetch, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await apiFetch('/booking/me');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, apiFetch]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = useCallback(async (showtimeId: number, seatIds: number[]) => {
    const res = await apiFetch('/booking', {
      method: 'POST',
      body: JSON.stringify({ showtimeId, seatIds }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Booking failed');
    }
    await fetchBookings();
  }, [apiFetch, fetchBookings]);

  const cancelBooking = useCallback(async (bookingId: number) => {
    const res = await apiFetch(`/booking/${bookingId}/cancel`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Cancel failed');
    }
    await fetchBookings();
  }, [apiFetch, fetchBookings]);

  return { bookings, loading, refetch: fetchBookings, createBooking, cancelBooking };
}
