import React, { useCallback } from 'react';
import { useReservationStore } from '../../stores/useReservationStore';
import { useUserStore } from '../../stores/useUserStore';
import { useReservation } from '../../hooks/useReservation';
import { usePurchase } from '../../hooks/usePurchase';
import { Button } from '../ui/Button';
import { ReservationTimer } from './ReservationTimer';
import { Drop } from '../../api/drops.api';

interface ReservationPanelProps {
  drop: Drop;
}

export const ReservationPanel: React.FC<ReservationPanelProps> = ({ drop }) => {
  const { currentUser } = useUserStore();
  const { reservation, expireReservation } = useReservationStore();
  const { isSubmitting: isReserving, createReservation, cancelReservation } = useReservation();
  const { isSubmitting: isPurchasing, confirmPurchase } = usePurchase();

  const availableStock = drop.inventory?.availableStock ?? 0;
  const isSoldOut = availableStock === 0;
  const isPending = reservation?.status === 'PENDING';
  const isExpired = reservation?.status === 'EXPIRED';
  const isCompleted = reservation?.status === 'COMPLETED';

  const handleReserve = useCallback(async () => {
    await createReservation(drop.id);
  }, [drop.id, createReservation]);

  const handlePurchase = useCallback(async () => {
    if (!reservation) return;
    await confirmPurchase(reservation.id);
  }, [reservation, confirmPurchase]);

  const handleCancel = useCallback(async () => {
    if (!reservation) return;
    await cancelReservation(reservation.id);
  }, [reservation, cancelReservation]);

  const handleTimerExpire = useCallback(() => {
    if (reservation) expireReservation(reservation.id);
  }, [reservation, expireReservation]);

  if (!currentUser) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
        <p className="text-slate-400 font-medium">Select a user to reserve this drop</p>
        <p className="text-slate-600 text-sm">Use the user selector in the header</p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-2">
        <div className="text-3xl">🎉</div>
        <p className="text-emerald-400 font-bold text-lg">Purchase Complete!</p>
        <p className="text-slate-400 text-sm">You've successfully copped this drop.</p>
      </div>
    );
  }

  if (isPending && reservation) {
    return (
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400" aria-hidden="true">
            🔒
          </div>
          <div>
            <p className="font-bold text-white">Item Reserved</p>
            <p className="text-slate-400 text-sm">Complete your purchase before the timer runs out</p>
          </div>
        </div>

        <ReservationTimer expiresAt={reservation.expiresAt} onExpire={handleTimerExpire} />

        <div className="space-y-3 pt-1">
          <Button
            id="btn-confirm-purchase"
            onClick={handlePurchase}
            isLoading={isPurchasing}
            loadingText="Processing..."
            size="lg"
            className="w-full"
          >
            Confirm Purchase — ${drop.price.toFixed(2)}
          </Button>
          <Button
            id="btn-cancel-reservation"
            onClick={handleCancel}
            isLoading={isReserving}
            loadingText="Cancelling..."
            variant="ghost"
            size="md"
            className="w-full"
          >
            Cancel Reservation
          </Button>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400 font-medium text-sm">⏰ Your reservation expired</p>
          <p className="text-slate-500 text-xs mt-1">The item was returned to the pool</p>
        </div>
        {!isSoldOut && (
          <Button
            id="btn-re-reserve"
            onClick={handleReserve}
            isLoading={isReserving}
            loadingText="Reserving..."
            size="lg"
            className="w-full"
          >
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // Default: no active reservation
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="space-y-1">
        <p className="text-3xl font-extrabold text-white">${drop.price.toFixed(2)}</p>
        <p className="text-slate-500 text-sm">Reservation holds for 60 seconds</p>
      </div>

      <Button
        id="btn-reserve"
        onClick={handleReserve}
        isLoading={isReserving}
        loadingText="Reserving..."
        size="lg"
        disabled={isSoldOut}
        className="w-full"
      >
        {isSoldOut ? 'Sold Out' : 'Reserve Now'}
      </Button>

      {isSoldOut && (
        <p className="text-center text-slate-600 text-xs">
          Check back when reservations expire — stock may recover
        </p>
      )}
    </div>
  );
};
