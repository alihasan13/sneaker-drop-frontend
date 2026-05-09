import apiClient from './client';

export interface InventoryData {
  totalStock: number;
  reservedStock: number;
  soldStock: number;
  availableStock: number;
}

export interface Purchaser {
  userId: string;
  name: string;
  avatarUrl?: string | null;
  purchasedAt: string;
}

export interface Drop {
  id: string;
  name: string;
  brand: string;
  colorway: string;
  description?: string | null;
  imageUrl?: string | null;
  price: number;
  startsAt: string;
  endsAt?: string | null;
  isActive: boolean;
  inventory: InventoryData | null;
  recentPurchasers: Purchaser[];
}

export const dropsApi = {
  getActiveDrops: async (): Promise<Drop[]> => {
    const { data } = await apiClient.get('/drops');
    return data.data;
  },

  getDropById: async (id: string): Promise<Drop> => {
    const { data } = await apiClient.get(`/drops/${id}`);
    return data.data;
  },

  createDrop: async (payload: {
    name: string;
    brand: string;
    colorway: string;
    description?: string;
    imageUrl?: string;
    price: number;
    totalStock: number;
    startsAt: string;
  }): Promise<Drop> => {
    const { data } = await apiClient.post('/drops', payload);
    return data.data;
  },

  activateDrop: async (id: string): Promise<Drop> => {
    const { data } = await apiClient.patch(`/drops/${id}/activate`);
    return data.data;
  },

  getAllDropsAdmin: async (): Promise<Drop[]> => {
    const { data } = await apiClient.get('/drops/admin');
    return data.data;
  },
};
