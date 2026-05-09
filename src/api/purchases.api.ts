import apiClient from './client';

export interface Purchase {
  id: string;
  dropId: string;
  reservationId: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  drop: {
    id: string;
    name: string;
    brand: string;
    colorway: string;
    imageUrl?: string | null;
    price: number;
  };
}

export const purchasesApi = {
  confirmPurchase: async (reservationId: string): Promise<Purchase> => {
    const { data } = await apiClient.post('/purchases', { reservationId });
    return data.data;
  },

  getMyPurchases: async (): Promise<Purchase[]> => {
    const { data } = await apiClient.get('/purchases/me');
    return data.data;
  },
};
