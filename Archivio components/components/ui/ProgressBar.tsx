// ProgressBar.tsx - Reusable Progress Bar Component
import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  showTimeRemaining?: boolean;
  totalTime?: number; // in seconds
  className?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'indigo' | 'slate';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function ProgressBar({
  progress,
  label,
  showPercentage = true,
  showTimeRemaining = false,
  totalTime = 0,
  className = '',
  color = 'blue',
  size = 'md',
  animated = true
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const timeRemaining = showTimeRemaining && totalTime > 0 
    ? Math.round(totalTime * (100 - clampedProgress) / 100) 
    : 0;

  const colorClasses = {
    blue: {
      bg: 'bg-blue-200',
      fill: 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-200',
      fill: 'bg-gradient-to-r from-green-500 via-green-600 to-green-500',
      text: 'text-green-600'
    },
    orange: {
      bg: 'bg-orange-200',
      fill: 'bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500',
      text: 'text-orange-600'
    },
    red: {
      bg: 'bg-red-200',
      fill: 'bg-gradient-to-r from-red-500 via-red-600 to-red-500',
      text: 'text-red-600'
    },
    indigo: {
      bg: 'bg-indigo-200',
      fill: 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-500',
      text: 'text-indigo-600'
    },
    slate: {
      bg: 'bg-slate-200',
      fill: 'bg-gradient-to-r from-slate-500 via-slate-600 to-slate-500',
      text: 'text-slate-600'
    }
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  };

  const colors = colorClasses[color];
  const height = sizeClasses[size];

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${colors.text}`}>{label}</span>
          {showPercentage && (
            <span className={`text-sm ${colors.text}`}>{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className={`w-full ${colors.bg} rounded-full ${height} shadow-inner overflow-hidden`}>
        <div 
          className={`${colors.fill} ${height} rounded-full transition-all duration-${animated ? '300' : '0'} shadow-lg relative overflow-hidden`}
          style={{ width: `${clampedProgress}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse" />
          )}
        </div>
      </div>

      {/* Additional Info */}
      {(showPercentage || showTimeRemaining) && !label && (
        <div className="flex items-center justify-between text-xs">
          {showPercentage && (
            <span className={colors.text}>
              Progresso: {Math.round(clampedProgress)}%
            </span>
          )}
          {showTimeRemaining && timeRemaining > 0 && (
            <span className={colors.text}>
              Tempo rimanente: {timeRemaining}s
            </span>
          )}
        </div>
      )}
    </div>
  );
}
