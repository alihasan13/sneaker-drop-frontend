import { useEffect, useCallback } from 'react';
import { dropsApi } from '../api/drops.api';
import { reservationsApi } from '../api/reservations.api';
import { useDropStore } from '../stores/useDropStore';
import { useReservationStore } from '../stores/useReservationStore';
import { useUserStore } from '../stores/useUserStore';

export function useDropDetail(dropId: string) {
  const { activeDrop, isLoading, error, setActiveDrop, setLoading, setError } = useDropStore();
  const { setReservation } = useReservationStore();
  const { currentUser } = useUserStore();

  const fetchDrop = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [drop, reservation] = await Promise.all([
        dropsApi.getDropById(dropId),
        currentUser ? reservationsApi.getActiveReservationForDrop(dropId) : Promise.resolve(null),
      ]);
      setActiveDrop(drop);
      setReservation(reservation);
    } catch (err: any) {
      setError(err?.message || 'Failed to load drop');
    } finally {
      setLoading(false);
    }
  }, [dropId, currentUser?.id]);

  useEffect(() => {
    fetchDrop();
    return () => {
      setActiveDrop(null);
    };
  }, [fetchDrop]);

  return { drop: activeDrop, isLoading, error, refetch: fetchDrop };
}
