import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Drop } from '../../api/drops.api';
import { StockIndicator } from './StockIndicator';
import { Badge } from '../ui/Badge';

interface DropCardProps {
  drop: Drop;
}

export const DropCard: React.FC<DropCardProps> = memo(({ drop }) => {
  const availableStock = drop.inventory?.availableStock ?? 0;
  const isSoldOut = availableStock === 0;
  const isLowStock = availableStock > 0 && availableStock <= 2;

  return (
    <Link
      to={`/drops/${drop.id}`}
      className="group block bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5"
      aria-label={`View ${drop.name} ${drop.colorway} — $${drop.price}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-800 h-56">
        {drop.imageUrl ? (
          <img
            src={drop.imageUrl}
            alt={`${drop.name} ${drop.colorway}`}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isSoldOut ? 'opacity-40 grayscale' : ''}`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          {isSoldOut ? (
            <Badge variant="danger">Sold Out</Badge>
          ) : isLowStock ? (
            <Badge variant="warning" dot>Almost Gone</Badge>
          ) : (
            <Badge variant="success" dot>Live</Badge>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 space-y-3">
        <div>
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">{drop.brand}</p>
          <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-white transition-colors">
            {drop.name}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">{drop.colorway}</p>
        </div>

        {drop.inventory && (
          <StockIndicator inventory={drop.inventory} showBar={true} />
        )}

        {/* Recent purchasers */}
        {drop.recentPurchasers.length > 0 && (
          <div className="flex items-center gap-2 pt-1">
            <div className="flex -space-x-2">
              {drop.recentPurchasers.slice(0, 3).map((p, i) => (
                <div
                  key={`${p.userId}-${i}`}
                  className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white"
                  title={p.name}
                  aria-label={`Purchased by ${p.name}`}
                >
                  {p.name.charAt(0)}
                </div>
              ))}
            </div>
            <span className="text-xs text-slate-500">
              {drop.recentPurchasers[0].name}{drop.recentPurchasers.length > 1 ? ` +${drop.recentPurchasers.length - 1} more` : ''} copped
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-2xl font-extrabold text-white">${drop.price.toFixed(2)}</span>
          <span className={`text-sm font-semibold ${isSoldOut ? 'text-slate-600' : 'text-indigo-400 group-hover:text-indigo-300'} transition-colors`}>
            {isSoldOut ? 'View Details' : 'Reserve →'}
          </span>
        </div>
      </div>
    </Link>
  );
});

DropCard.displayName = 'DropCard';
