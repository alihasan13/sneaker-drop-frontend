import React, { memo } from 'react';
import { InventoryData } from '../../api/drops.api';

interface StockIndicatorProps {
  inventory: InventoryData | null;
  showBar?: boolean;
}

export const StockIndicator: React.FC<StockIndicatorProps> = memo(({ inventory, showBar = true }) => {
  if (!inventory) return null;

  const { availableStock, totalStock } = inventory;
  const pct = totalStock > 0 ? (availableStock / totalStock) * 100 : 0;

  const getStatus = () => {
    if (availableStock === 0) return { label: 'Sold Out', color: 'text-red-400', barColor: 'bg-red-500', badgeClass: 'text-red-400' };
    if (availableStock <= 2) return { label: `Only ${availableStock} left!`, color: 'text-amber-400', barColor: 'bg-amber-500', badgeClass: 'text-amber-400' };
    if (pct <= 30) return { label: `${availableStock} remaining`, color: 'text-amber-400', barColor: 'bg-amber-500', badgeClass: 'text-amber-400' };
    return { label: `${availableStock} available`, color: 'text-emerald-400', barColor: 'bg-emerald-500', badgeClass: 'text-emerald-400' };
  };

  const status = getStatus();

  return (
    <div className="space-y-1.5" aria-live="polite" aria-label={`Stock: ${status.label}`}>
      <div className="flex items-center justify-between text-sm">
        <span className={`font-semibold ${status.color}`}>{status.label}</span>
        {availableStock > 0 && (
          <span className="text-slate-500 text-xs">{totalStock - availableStock} sold</span>
        )}
      </div>
      {showBar && (
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={availableStock} aria-valuemax={totalStock}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${status.barColor}`}
            style={{ width: `${Math.max(pct, 2)}%` }}
          />
        </div>
      )}
    </div>
  );
});

StockIndicator.displayName = 'StockIndicator';
