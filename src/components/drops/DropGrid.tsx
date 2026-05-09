import React, { useEffect, useState, useCallback } from 'react';
import { dropsApi } from '../../api/drops.api';
import { useDropStore } from '../../stores/useDropStore';
import { DropCard } from './DropCard';
import { DropCardSkeleton } from '../ui/Skeleton';

export const DropGrid: React.FC = () => {
  const { drops, setDrops, isLoading, setLoading, error, setError } = useDropStore();
  const [hasFetched, setHasFetched] = useState(false);

  const fetchDrops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dropsApi.getActiveDrops();
      setDrops(data);
      setHasFetched(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to load drops');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrops();
  }, [fetchDrops]);

  if (isLoading && !hasFetched) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="Loading drops">
        {Array.from({ length: 3 }).map((_, i) => (
          <DropCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-red-400 text-lg">{error}</p>
        <button
          onClick={fetchDrops}
          className="text-indigo-400 hover:text-indigo-300 underline text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!drops.length) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 text-lg">No active drops right now. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
      {drops.map((drop) => (
        <div key={drop.id} role="listitem" className="animate-slide-up">
          <DropCard drop={drop} />
        </div>
      ))}
    </div>
  );
};
