import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { purchasesApi } from '../api/purchases.api';
import { useReservationStore } from '../stores/useReservationStore';

export function usePurchase() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { clearReservation } = useReservationStore();

  const confirmPurchase = useCallback(async (reservationId: string) => {
    setIsSubmitting(true);
    try {
      const purchase = await purchasesApi.confirmPurchase(reservationId);
      clearReservation();
      toast.success(`🎉 Purchase confirmed! Total: $${purchase.totalPrice.toFixed(2)}`, {
        duration: 6000,
      });
      return purchase;
    } catch (err: any) {
      const code = err?.code;
      const messages: Record<string, string> = {
        ALREADY_PURCHASED: 'This reservation was already used to purchase.',
        RESERVATION_INVALID: err?.message || 'Reservation is no longer valid.',
        LOCK_UNAVAILABLE: 'System is busy. Please try again.',
      };
      toast.error(messages[code] || err?.message || 'Purchase failed. Please try again.', {
        duration: 5000,
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, confirmPurchase };
}
