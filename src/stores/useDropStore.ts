import { create } from 'zustand';
import { Drop, InventoryData, Purchaser } from '../api/drops.api';

interface StockUpdate {
  dropId: string;
  availableStock: number;
  reservedStock: number;
  soldStock: number;
  totalStock: number;
}

interface PurchaseEvent {
  userId: string;
  userName: string;
  dropId: string;
  dropName: string;
  purchasedAt: string;
}

interface DropStore {
  drops: Drop[];
  activeDrop: Drop | null;
  isLoading: boolean;
  error: string | null;

  setDrops: (drops: Drop[]) => void;
  setActiveDrop: (drop: Drop | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // WebSocket handlers — update store directly from socket events
  updateStock: (update: StockUpdate) => void;
  addRecentPurchaser: (event: PurchaseEvent) => void;
}

export const useDropStore = create<DropStore>((set) => ({
  drops: [],
  activeDrop: null,
  isLoading: false,
  error: null,

  setDrops: (drops) => set({ drops }),
  setActiveDrop: (drop) => set({ activeDrop: drop }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  /**
   * Merge WebSocket stock update into existing drop state.
   * Safe reconciliation: never replaces data, only merges the inventory fields.
   */
  updateStock: ({ dropId, availableStock, reservedStock, soldStock, totalStock }) => {
    set((state) => {
      const updatedInventory: InventoryData = { availableStock, reservedStock, soldStock, totalStock };

      return {
        drops: state.drops.map((d) =>
          d.id === dropId ? { ...d, inventory: updatedInventory } : d
        ),
        activeDrop:
          state.activeDrop?.id === dropId
            ? { ...state.activeDrop, inventory: updatedInventory }
            : state.activeDrop,
      };
    });
  },

  /**
   * Prepend new purchaser to the drop's recentPurchasers list (max 3).
   * Called on 'purchase:new' WebSocket event.
   */
  addRecentPurchaser: ({ dropId, userId, userName, purchasedAt }) => {
    const newPurchaser: Purchaser = {
      userId,
      name: userName,
      purchasedAt,
    };

    set((state) => {
      const updateDrop = (d: Drop): Drop => {
        if (d.id !== dropId) return d;
        const updated = [newPurchaser, ...d.recentPurchasers].slice(0, 3);
        return { ...d, recentPurchasers: updated };
      };

      return {
        drops: state.drops.map(updateDrop),
        activeDrop: state.activeDrop ? updateDrop(state.activeDrop) : null,
      };
    });
  },
}));
