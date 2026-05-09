import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
  info: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  neutral: 'bg-slate-700/50 text-slate-400 border border-slate-600/30',
};

const dotClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-red-400',
  info: 'bg-indigo-400',
  neutral: 'bg-slate-400',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, dot, className = '' }) => (
  <span
    className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5
      text-xs font-medium rounded-full
      ${variantClasses[variant]}
      ${className}
    `}
  >
    {dot && (
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotClasses[variant]}`} aria-hidden="true" />
    )}
    {children}
  </span>
);
