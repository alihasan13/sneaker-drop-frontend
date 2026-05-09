import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useDropStore } from '../stores/useDropStore';
import { useReservationStore } from '../stores/useReservationStore';
import { useUserStore } from '../stores/useUserStore';

// Singleton socket connection
let socketInstance: Socket | null = null;

const API_URL = import.meta.env.VITE_API_URL || '';

export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(API_URL || '/', {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });
  }
  return socketInstance;
}

/**
 * Hook: manages Socket.io lifecycle for a specific drop page.
 * On reconnect → re-joins the drop room (server sends authoritative stock snapshot).
 *  prevents stale stock counts after a network interruption.
 */
export function useSocket(dropId: string | null) {
  const { updateStock, addRecentPurchaser } = useDropStore();
  const { expireReservation } = useReservationStore();
  const { currentUser } = useUserStore();
  const joinedRoomRef = useRef<string | null>(null);

  useEffect(() => {
    if (!dropId) return;

    const socket = getSocket();

    const joinRoom = () => {
      socket.emit('drop:join', { dropId });
      joinedRoomRef.current = dropId;

      // Subscribe to private user channel
      if (currentUser?.id) {
        socket.emit('user:subscribe', { userId: currentUser.id });
      }
    };

    // Join immediately if connected, or wait for connect
    if (socket.connected) {
      joinRoom();
    }

    const onConnect = () => joinRoom();

    const onStockUpdate = (data: {
      dropId: string;
      availableStock: number;
      reservedStock: number;
      soldStock: number;
      totalStock: number;
    }) => {
      updateStock(data);
    };

    const onPurchaseNew = (data: {
      userId: string;
      userName: string;
      dropId: string;
      dropName: string;
      purchasedAt: string;
    }) => {
      if (data.dropId === dropId) {
        addRecentPurchaser(data);
      }
    };

    const onReservationExpired = (data: { reservationId: string; dropId: string }) => {
      expireReservation(data.reservationId);
      toast.error('Your reservation has expired. The item is back in stock.', {
        duration: 6000,
        id: `expired-${data.reservationId}`,
      });
    };

    socket.on('connect', onConnect);
    socket.on('stock:update', onStockUpdate);
    socket.on('purchase:new', onPurchaseNew);
    socket.on('reservation:expired', onReservationExpired);

    return () => {
      socket.emit('drop:leave', { dropId });
      socket.off('connect', onConnect);
      socket.off('stock:update', onStockUpdate);
      socket.off('purchase:new', onPurchaseNew);
      socket.off('reservation:expired', onReservationExpired);
      joinedRoomRef.current = null;
    };
  }, [dropId, currentUser?.id]);
}

/**
 * Hook for global socket (Dashboard — no specific dropId).
 * Subscribes only to user private channel for cross-page notifications.
 */
export function useGlobalSocket() {
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (!currentUser?.id) return;

    const socket = getSocket();

    const subscribe = () => socket.emit('user:subscribe', { userId: currentUser.id });

    if (socket.connected) subscribe();
    socket.on('connect', subscribe);

    return () => {
      socket.off('connect', subscribe);
    };
  }, [currentUser?.id]);
}
