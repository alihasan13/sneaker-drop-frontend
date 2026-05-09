import apiClient from './client';

export interface Reservation {
  id: string;
  dropId: string;
  userId: string;
  quantity: number;
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';
  expiresAt: string;
  drop?: {
    id: string;
    name: string;
    brand: string;
    colorway: string;
    price: number;
    imageUrl?: string | null;
  } | null;
}

export const reservationsApi = {
  createReservation: async (dropId: string, quantity = 1): Promise<Reservation> => {
    const { data } = await apiClient.post('/reservations', { dropId, quantity });
    return data.data;
  },

  cancelReservation: async (id: string): Promise<void> => {
    await apiClient.delete(`/reservations/${id}`);
  },

  getMyReservations: async (): Promise<Reservation[]> => {
    const { data } = await apiClient.get('/reservations/me');
    return data.data;
  },

  getActiveReservationForDrop: async (dropId: string): Promise<Reservation | null> => {
    const { data } = await apiClient.get(`/reservations/me/${dropId}`);
    return data.data;
  },
};
