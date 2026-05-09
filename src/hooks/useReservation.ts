import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { reservationsApi } from '../api/reservations.api';
import { useReservationStore } from '../stores/useReservationStore';

export function useReservation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setReservation, clearReservation } = useReservationStore();

  const createReservation = useCallback(async (dropId: string) => {
    setIsSubmitting(true);
    try {
      const reservation = await reservationsApi.createReservation(dropId, 1);
      setReservation(reservation);
      toast.success('Reserved! You have 60 seconds to complete your purchase.', {
        duration: 5000,
        icon: '🔒',
      });
      return reservation;
    } catch (err: any) {
      const code = err?.code;
      const messages: Record<string, string> = {
        OUT_OF_STOCK: '😔 Sorry, this drop just sold out.',
        ALREADY_RESERVED: 'You already have an active reservation for this drop.',
        LOCK_UNAVAILABLE: '🔥 High demand! Please try again in a moment.',
        UNAUTHORIZED: 'Please select a user to continue.',
      };
      toast.error(messages[code] || err?.message || 'Reservation failed. Please try again.', {
        duration: 4000,
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const cancelReservation = useCallback(async (reservationId: string) => {
    setIsSubmitting(true);
    try {
      await reservationsApi.cancelReservation(reservationId);
      clearReservation();
      toast('Reservation cancelled.', { icon: '↩️' });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to cancel reservation.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, createReservation, cancelReservation };
}
