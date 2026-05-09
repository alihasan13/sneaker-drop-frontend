import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDropDetail } from '../hooks/useDropDetail';
import { useSocket } from '../hooks/useSocket';
import { useDropStore } from '../stores/useDropStore';
import { StockIndicator } from '../components/drops/StockIndicator';
import { ReservationPanel } from '../components/reservation/ReservationPanel';
import { Badge } from '../components/ui/Badge';
import { DropDetailSkeleton } from '../components/ui/Skeleton';

export default function DropDetail() {
  const { id } = useParams<{ id: string }>();
  const dropId = id ?? null;

  // Fetch drop + active reservation in parallel
  const { isLoading, error } = useDropDetail(dropId!);

  // Wire WebSocket events to Zustand store for this drop
  useSocket(dropId);

  // Read from store (kept live by WebSocket)
  const drop = useDropStore((s) => s.activeDrop);

  //  Loading 
  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <DropDetailSkeleton />
      </main>
    );
  }

  //  Error 
  if (error || !drop) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <p className="text-red-400 text-lg">{error ?? 'Drop not found'}</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 underline text-sm">← Back to drops</Link>
      </main>
    );
  }

  const isSoldOut = (drop.inventory?.availableStock ?? 0) === 0;
  const isLowStock = !isSoldOut && (drop.inventory?.availableStock ?? 0) <= 2;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" aria-label={`Drop detail: ${drop.name}`}>
      {/* Breadcrumb */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <Link to="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
          ← All Drops
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left: Image */}
        <div className="relative">
          {drop.imageUrl ? (
            <img
              src={drop.imageUrl}
              alt={`${drop.name} ${drop.colorway}`}
              className={`w-full aspect-square object-cover rounded-2xl shadow-2xl ${isSoldOut ? 'opacity-50 grayscale' : ''}`}
            />
          ) : (
            <div className="w-full aspect-square bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              </svg>
            </div>
          )}

          {/* Status overlay badge */}
          <div className="absolute top-4 left-4">
            {isSoldOut ? (
              <Badge variant="danger">Sold Out</Badge>
            ) : isLowStock ? (
              <Badge variant="warning" dot>Only {drop.inventory?.availableStock} left</Badge>
            ) : (
              <Badge variant="success" dot>Available</Badge>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-8">
          {/* Header info */}
          <div className="space-y-2">
            <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest">{drop.brand}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {drop.name}
            </h1>
            <p className="text-slate-400 text-lg">{drop.colorway}</p>
          </div>

          {drop.description && (
            <p className="text-slate-400 leading-relaxed">{drop.description}</p>
          )}

          {/* Live stock */}
          {drop.inventory && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Inventory</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              </div>
              <StockIndicator inventory={drop.inventory} showBar={true} />
              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { label: 'Total', value: drop.inventory.totalStock },
                  { label: 'Reserved', value: drop.inventory.reservedStock },
                  { label: 'Sold', value: drop.inventory.soldStock },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="text-xl font-bold text-white">{value}</p>
                    <p className="text-xs text-slate-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reservation panel */}
          <ReservationPanel drop={drop} />

          {/* Recent purchasers */}
          {drop.recentPurchasers.length > 0 && (
            <div className="space-y-3" aria-label="Recent purchasers">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Purchasers</p>
              <div className="space-y-2">
                {drop.recentPurchasers.map((p, i) => (
                  <div key={`${p.userId}-${i}`} className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{p.name}</p>
                      <p className="text-xs text-slate-600">
                        {new Date(p.purchasedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="ml-auto text-xs text-slate-600">✓ Copped</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
