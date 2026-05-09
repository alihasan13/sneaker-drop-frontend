import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div
    className={`animate-pulse rounded-lg bg-slate-800 ${className}`}
    aria-hidden="true"
    role="presentation"
  />
);

export const DropCardSkeleton: React.FC = () => (
  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
    <Skeleton className="w-full h-56 rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  </div>
);

export const DropDetailSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <Skeleton className="w-full aspect-square rounded-2xl" />
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-40 w-full rounded-2xl" />
    </div>
  </div>
);
