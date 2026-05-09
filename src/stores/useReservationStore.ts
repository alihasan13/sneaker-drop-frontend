import { create } from 'zustand';
import { Reservation } from '../api/reservations.api';

interface ReservationStore {
  reservation: Reservation | null;
  isLoading: boolean;
  error: string | null;

  setReservation: (r: Reservation | null) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  expireReservation: (reservationId: string) => void;
  clearReservation: () => void;
}

export const useReservationStore = create<ReservationStore>((set) => ({
  reservation: null,
  isLoading: false,
  error: null,

  setReservation: (reservation) => set({ reservation, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Called when 'reservation:expired' WS event arrives for this user
  expireReservation: (reservationId) =>
    set((state) => ({
      reservation:
        state.reservation?.id === reservationId
          ? { ...state.reservation, status: 'EXPIRED' as const }
          : state.reservation,
    })),

  clearReservation: () => set({ reservation: null, error: null }),
}));
