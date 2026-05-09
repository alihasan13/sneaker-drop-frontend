import React from 'react';
import { useDropStore } from '../stores/useDropStore';
import { DropGrid } from '../components/drops/DropGrid';

export default function Dashboard() {
  const { drops } = useDropStore();
  const liveCount = drops.filter((d) => (d.inventory?.availableStock ?? 0) > 0).length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="mb-10 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            Live Drops
          </span>
          {liveCount > 0 && (
            <span className="text-slate-600 text-sm">{liveCount} drop{liveCount !== 1 ? 's' : ''} available</span>
          )}
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Limited Edition<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Sneaker Drops
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl">
          Real-time inventory. Reserve your pair before they're gone — you have 60 seconds once you reserve.
        </p>
      </div>

      {/* Drop grid */}
      <DropGrid />

      {/* Info banner */}
      <div className="mt-12 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {[
          { icon: '⚡', title: 'Real-Time Stock', desc: 'Live inventory updates via WebSocket' },
          { icon: '🔒', title: '60s Hold', desc: 'Reservations hold stock for 60 seconds' },
          { icon: '🛡️', title: 'Fair Access', desc: 'One reservation per user per drop' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="space-y-1.5">
            <div className="text-2xl">{icon}</div>
            <p className="font-semibold text-slate-200 text-sm">{title}</p>
            <p className="text-slate-500 text-xs">{desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
